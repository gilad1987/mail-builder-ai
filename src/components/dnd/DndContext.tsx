import { useState } from 'react'
import {
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
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { editorStore } from '../../stores/EditorStore'
import { savedWidgetsStore } from '../../stores/SavedWidgetsStore'
import { Section, InnerSection, Column } from '../../models'
import { DragPreview } from './DragPreview'
import { type DndState, DndStateContext } from './useDndState'
import type { DragData, DropData } from './types'

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
    setState(prev => ({
      ...prev,
      overId: (over?.id as string) || null,
    }))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const data = active.data.current as DragData | undefined

    // Handle saved Section widget - can drop anywhere (even empty canvas)
    if (data?.source === 'sidebar' && data?.type === 'saved-widget' && data?.widgetId) {
      const widget = savedWidgetsStore.getWidget(data.widgetId)
      if (widget?.type === 'Section') {
        const section = new Section(widget.json, editorStore.template)
        editorStore.template.addChild(section)
        editorStore.setSelectedElement(section.id)
        setState({ activeId: null, activeType: null, activeData: null, overId: null })
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
              data.columns.forEach(width => editorStore.addColumnToSection(section.id, width))
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

      // Handle canvas item reorder
      if (data.source === 'canvas' && data.blockId) {
        if (overData?.columnId && overData.columnId !== data.parentId) {
          editorStore.moveBlockToColumn(data.blockId, overData.columnId)
        }
      }
    }

    setState({
      activeId: null,
      activeType: null,
      activeData: null,
      overId: null,
    })
  }

  const handleDragCancel = () => {
    setState({
      activeId: null,
      activeType: null,
      activeData: null,
      overId: null,
    })
  }

  return (
    <DndKitContext
      sensors={sensors}
      collisionDetection={pointerWithin}
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
