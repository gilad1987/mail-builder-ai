import {
  closestCenter,
  DndContext as DndKitContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'
import { Column, InnerSection, Section } from '../../models'
import { editorStore } from '../../stores/EditorStore'
import { savedWidgetsStore } from '../../stores/SavedWidgetsStore'
import { DragPreview } from './DragPreview'
import type { DragData, DropData } from './types'
import { type DndState, DndStateContext } from './useDndState'

interface DndProviderProps {
  children: React.ReactNode
}

export const DndProvider = ({ children }: DndProviderProps) => {
  const [state, setState] = useState<DndState>({
    activeId: null,
    activeType: null,
    activeData: null,
    overId: null,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const data = active.data.current as DragData | undefined

    setState({
      activeId: active.id as string,
      activeType: data?.source || null,
      activeData: data || null,
      overId: null,
    })
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    setState((prev) => ({
      ...prev,
      overId: (over?.id as string) || null,
    }))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const data = active.data.current as DragData | undefined

    // Handle canvas section reordering
    if (data?.source === 'canvas' && data?.type === 'section' && data?.sectionId) {
      if (over) {
        const overData = over.data.current as DropData | undefined

        // Dropped on another section - reorder
        if (overData?.type === 'section' && overData?.sectionId) {
          const sections = editorStore.template.children
          const oldIndex = sections.findIndex((s) => s.id === data.sectionId)
          const newIndex = sections.findIndex((s) => s.id === overData.sectionId)

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const reordered = arrayMove(sections, oldIndex, newIndex)
            editorStore.reorderSections(reordered as Section[])
          }
        }
        // Dropped on section drop zone (between sections)
        else if (overData?.type === 'section' && overData?.index !== undefined) {
          editorStore.moveSectionToIndex(data.sectionId, overData.index)
        }
      }
      resetState()
      return
    }

    // Handle canvas column reordering
    if (data?.source === 'canvas' && data?.type === 'column' && data?.columnId) {
      if (over) {
        const overData = over.data.current as DropData | undefined

        // Dropped on another column in same/different section
        if (overData?.type === 'column' && overData?.columnId && overData?.sectionId) {
          const sourceColumn = editorStore.findElementById(data.columnId) as Column | null
          const targetSection = editorStore.findElementById(overData.sectionId) as Section | null

          if (sourceColumn && targetSection) {
            const sourceSection = sourceColumn.parent as Section | null

            if (sourceSection?.id === targetSection.id) {
              // Same section - reorder
              const columns = targetSection.children
              const oldIndex = columns.findIndex((c) => c.id === data.columnId)
              const newIndex = columns.findIndex((c) => c.id === overData.columnId)

              if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const reordered = arrayMove(columns, oldIndex, newIndex)
                editorStore.reorderColumns(targetSection.id, reordered as Column[])
              }
            } else {
              // Different section - move
              const targetIndex = targetSection.children.findIndex(
                (c) => c.id === overData.columnId
              )
              editorStore.moveColumnToSection(
                data.columnId,
                overData.sectionId,
                targetIndex >= 0 ? targetIndex : undefined
              )
            }
          }
        }
        // Dropped on section (add column at end)
        else if (
          (overData?.accepts === 'layout' || overData?.accepts?.includes?.('column')) &&
          overData?.sectionId
        ) {
          editorStore.moveColumnToSection(data.columnId, overData.sectionId)
        }
      }
      resetState()
      return
    }

    // Handle canvas element reordering
    if (data?.source === 'canvas' && data?.type === 'element' && data?.elementId) {
      if (over) {
        const overData = over.data.current as DropData | undefined

        // Dropped on another element
        if (overData?.type === 'element' && overData?.elementId && overData?.columnId) {
          const sourceElement = editorStore.findElementById(data.elementId)
          const targetColumn = editorStore.findElementById(overData.columnId) as Column | null

          if (sourceElement && targetColumn) {
            const sourceColumn = sourceElement.parent as Column | null

            if (sourceColumn?.id === targetColumn.id) {
              // Same column - reorder
              const elements = targetColumn.children
              const oldIndex = elements.findIndex((e) => e.id === data.elementId)
              const newIndex = elements.findIndex((e) => e.id === overData.elementId)

              if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const reordered = arrayMove(elements, oldIndex, newIndex)
                editorStore.reorderElements(targetColumn.id, reordered)
              }
            } else {
              // Different column - move
              const targetIndex = targetColumn.children.findIndex(
                (e) => e.id === overData.elementId
              )
              editorStore.moveBlockToColumn(
                data.elementId,
                overData.columnId,
                targetIndex >= 0 ? targetIndex : undefined
              )
            }
          }
        }
        // Dropped on trailing element drop zone (move to end of column)
        else if (
          overData?.type === 'element' &&
          !overData?.elementId &&
          overData?.columnId &&
          overData?.index !== undefined
        ) {
          const sourceElement = editorStore.findElementById(data.elementId)
          const targetColumn = editorStore.findElementById(overData.columnId) as Column | null

          if (sourceElement && targetColumn) {
            const sourceColumn = sourceElement.parent as Column | null

            if (sourceColumn?.id === targetColumn.id) {
              // Same column - move to end
              const elements = targetColumn.children
              const oldIndex = elements.findIndex((e) => e.id === data.elementId)
              const newIndex = overData.index

              if (oldIndex !== -1 && oldIndex !== newIndex && oldIndex !== newIndex - 1) {
                // Remove from old position and add at end
                const reordered = [...elements]
                const [removed] = reordered.splice(oldIndex, 1)
                // Adjust index since we removed an element
                const adjustedIndex = oldIndex < newIndex ? newIndex - 1 : newIndex
                reordered.splice(adjustedIndex, 0, removed)
                editorStore.reorderElements(targetColumn.id, reordered)
              }
            } else {
              // Different column - move to specified index (end)
              editorStore.moveBlockToColumn(data.elementId, overData.columnId, overData.index)
            }
          }
        }
        // Dropped on column (add at end)
        else if (overData?.accepts === 'block' && overData?.columnId) {
          if (overData.columnId !== data.parentId) {
            editorStore.moveBlockToColumn(data.elementId, overData.columnId)
          }
        }
      }
      resetState()
      return
    }

    // Handle saved Section widget - can drop anywhere (even empty canvas)
    if (data?.source === 'sidebar' && data?.type === 'saved-widget' && data?.widgetId) {
      const widget = savedWidgetsStore.getWidget(data.widgetId)
      if (widget?.type === 'Section') {
        const section = new Section(widget.json, editorStore.template)
        editorStore.template.addChild(section)
        editorStore.setSelectedElement(section.id)
        resetState()
        return
      }
    }

    if (over && data) {
      const overData = over.data.current as DropData | undefined

      // Handle sidebar item drop
      if (data.source === 'sidebar') {
        if (data.type === 'layout') {
          // Layout dropped on empty canvas or section
          if (overData?.accepts === 'layout' && data.columns) {
            if (overData.sectionId === 'new') {
              // Create new section with layout
              const section = editorStore.addSection()
              data.columns.forEach((width) => editorStore.addColumnToSection(section.id, width))
            } else if (overData.sectionId) {
              editorStore.addColumnLayout(overData.sectionId, data.columns)
            }
          }
        } else if (data.type === 'column') {
          // Column dropped on section or column - add a new column to the section
          if (overData?.accepts === 'layout' && overData?.sectionId) {
            if (overData.sectionId === 'new') {
              // Create new section with one column
              const section = editorStore.addSection()
              editorStore.addColumnToSection(section.id, 100)
            } else {
              // Add column to existing section
              editorStore.addColumnToSection(overData.sectionId)
            }
          } else if (overData?.accepts === 'block' && overData?.sectionId) {
            // Dropped on a column - add to the column's parent section
            editorStore.addColumnToSection(overData.sectionId)
          }
        } else if (data.type === 'block') {
          // Block dropped on column or section
          if (overData?.accepts === 'block' && overData?.columnId && data.blockType) {
            editorStore.addBlockToColumn(overData.columnId, data.blockType, {})
          } else if (overData?.accepts === 'layout' && overData?.sectionId && data.blockType) {
            // Create column and add block
            const section = editorStore.findElementById(overData.sectionId)
            if (section && section.children.length === 0) {
              const col = editorStore.addColumnToSection(overData.sectionId)
              if (col) {
                editorStore.addBlockToColumn(col.id, data.blockType, {})
              }
            } else if (section && section.children.length > 0) {
              editorStore.addBlockToColumn(section.children[0].id, data.blockType, {})
            }
          }
        } else if (data.type === 'saved-widget' && data.widgetId) {
          // Saved InnerSection widget dropped on a column
          const widget = savedWidgetsStore.getWidget(data.widgetId)
          if (
            widget?.type === 'InnerSection' &&
            overData?.accepts === 'block' &&
            overData?.columnId
          ) {
            const column = editorStore.findElementById(overData.columnId) as Column | null
            if (column && column instanceof Column) {
              const innerSection = new InnerSection(widget.json, column)
              column.addChild(innerSection)
              editorStore.setSelectedElement(innerSection.id)
            }
          }
        }
      }

      // Handle canvas item reorder (legacy - for blocks)
      if (data.source === 'canvas' && data.blockId) {
        if (overData?.columnId && overData.columnId !== data.parentId) {
          editorStore.moveBlockToColumn(data.blockId, overData.columnId)
        }
      }
    }

    resetState()
  }

  const resetState = () => {
    setState({
      activeId: null,
      activeType: null,
      activeData: null,
      overId: null,
    })
  }

  const handleDragCancel = () => {
    resetState()
  }

  // Use closestCenter for sortable containers, pointerWithin for everything else
  const collisionDetection = state.activeData?.source === 'canvas' ? closestCenter : pointerWithin

  return (
    <DndKitContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <DndStateContext.Provider value={state}>
        {children}
        <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
          {state.activeId && state.activeData && (
            <DragPreview type={state.activeType} data={state.activeData} />
          )}
        </DragOverlay>
      </DndStateContext.Provider>
    </DndKitContext>
  )
}
