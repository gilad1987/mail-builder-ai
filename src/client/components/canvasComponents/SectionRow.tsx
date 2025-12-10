import { useDroppable } from '@dnd-kit/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import styled from 'styled-components'
import { Section } from '../../models'
import { editorStore } from '../../stores/EditorStore'
import { savedWidgetsStore } from '../../stores/SavedWidgetsStore'
import { tokens } from '../../styles/tokens'
import { useDndState } from '../dnd'
import { SaveWidgetModal } from '../SaveWidgetModal'
import { ElementLabel, SectionActions } from '../WidgetActions'
import { ColumnBox } from './ColumnBox'

interface SectionRowProps {
  section: Section
  index: number
}

const Container = styled.div`
  position: relative;
  overflow: visible;
  margin-top: 36px; /* Space for floating actions */
  border: 2px solid transparent;
  border-radius: ${tokens.borderRadius.md};
  transition: all ${tokens.transition.fast};
  margin-bottom: ${tokens.spacing[4]};

  &.is-hovered {
    border-color: #26c6da;

    > .element-label {
      opacity: 1;
    }
  }

  &.is-selected {
    border-color: #26c6da;
    box-shadow: 0 0 0 2px rgba(38, 198, 218, 0.2);
  }

  &.is-dragging {
    opacity: 0.4;
    border-style: dashed;
  }

  .section-content {
    flex: 1;
    min-height: 100px;

    /* Ensure columns stretch to fill height */
    > * {
      align-self: stretch;
    }
  }

  .section-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    color: ${tokens.colors.gray[400]};
    font-size: ${tokens.fontSize.sm};
    border: 2px dashed ${tokens.colors.gray[300]};
    border-radius: ${tokens.borderRadius.md};
    margin: ${tokens.spacing[4]};
    transition: all ${tokens.transition.fast};
  }
`

const SectionDropZone = styled.div<{ $isOver: boolean; $isDraggingSection: boolean }>`
  height: ${({ $isDraggingSection }) => ($isDraggingSection ? '8px' : '0')};
  margin: ${({ $isDraggingSection }) => ($isDraggingSection ? '-4px 0' : '0')};
  transition: all ${tokens.transition.fast};
  position: relative;
  z-index: 5;

  ${({ $isOver }) =>
    $isOver &&
    `
    height: 40px !important;
    margin: 8px 0 !important;
    background: rgba(38, 198, 218, 0.15);
    border: 2px dashed #26c6da;
    border-radius: ${tokens.borderRadius.md};
  `}
`

const TrailingColumnDropZone = styled.div<{ $isOver: boolean; $isDraggingColumn: boolean }>`
  width: ${({ $isDraggingColumn }) => ($isDraggingColumn ? '8px' : '0')};
  margin: ${({ $isDraggingColumn }) => ($isDraggingColumn ? '0 -4px' : '0')};
  transition: all ${tokens.transition.fast};
  align-self: stretch;
  min-height: 80px;
  position: relative;
  z-index: 5;

  ${({ $isOver }) =>
    $isOver &&
    `
    width: 40px !important;
    margin: 0 8px !important;
    background: rgba(30, 136, 229, 0.15);
    border: 2px dashed #1e88e5;
    border-radius: ${tokens.borderRadius.md};
  `}
`

export const SectionRow = observer(({ section, index }: SectionRowProps) => {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const isSelected = editorStore.selectedElementId === section.id
  const isHovered = editorStore.hoveredElementId === section.id
  const { activeData } = useDndState()

  // Check if dragging a section or column
  const isDraggingSection = activeData?.source === 'canvas' && activeData?.type === 'section'
  const isDraggingColumn =
    (activeData?.source === 'sidebar' && activeData?.type === 'column') ||
    (activeData?.source === 'canvas' && activeData?.type === 'column')

  // Drop zone above this section for section reordering
  const { isOver: isOverDropZone, setNodeRef: setDropZoneRef } = useDroppable({
    id: `section-drop-${section.id}`,
    data: { type: 'section', sectionId: section.id, index },
  })

  // Trailing drop zone for columns (at end of section)
  const { isOver: isOverTrailingColumn, setNodeRef: setTrailingColumnRef } = useDroppable({
    id: `column-drop-trailing-${section.id}`,
    data: { type: 'column', sectionId: section.id, index: section.children.length },
  })

  // Make section droppable for layouts and columns
  const { isOver, setNodeRef } = useDroppable({
    id: `section-${section.id}`,
    data: { accepts: 'layout', sectionId: section.id },
  })

  // Separate droppable for section content (when section has children)
  const { isOver: isOverContent, setNodeRef: setContentRef } = useDroppable({
    id: `section-content-${section.id}`,
    data: { accepts: 'layout', sectionId: section.id },
  })

  const handleMouseOver = (e: React.MouseEvent) => {
    // Only set hover if the mouse is directly over this element (not a child)
    if (
      e.currentTarget === e.target ||
      e.target === e.currentTarget.querySelector('.section-content')
    ) {
      editorStore.setHoveredElement(section.id)
    }
  }

  const handleMouseLeave = () => {
    if (editorStore.hoveredElementId === section.id) {
      editorStore.setHoveredElement(null)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    editorStore.setSelectedElement(section.id)
  }

  const handleCopy = () => {
    editorStore.copyElement(section.id)
  }

  const handleDelete = () => {
    editorStore.removeElement(section.id)
  }

  const handleSave = (name: string) => {
    savedWidgetsStore.saveWidget(name, 'Section', section.toCloneJSON())
  }

  const classNames = [isSelected ? 'is-selected' : '', isHovered ? 'is-hovered' : '']
    .filter(Boolean)
    .join(' ')

  // Filter out layout-related properties that should only apply to .section-content
  const layoutProps = [
    'display',
    'flexDirection',
    'flexWrap',
    'justifyContent',
    'alignItems',
    'gridTemplateColumns',
    'gridTemplateRows',
    'gridAutoFlow',
    'justifyItems',
    'gap',
    'columnGap',
    'rowGap',
  ]
  const containerStyle = Object.fromEntries(
    Object.entries(section.style).filter(([key]) => !layoutProps.includes(key))
  )

  return (
    <>
      {/* Drop zone above section for reordering */}
      <SectionDropZone
        ref={setDropZoneRef}
        $isOver={isOverDropZone}
        $isDraggingSection={isDraggingSection}
      />
      <Container
        className={classNames}
        style={containerStyle}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        data-section-id={section.id}
      >
        <ElementLabel label="Section" color="#26c6da" />
        <SectionActions
          isVisible={isSelected}
          sectionId={section.id}
          sectionIndex={index}
          onCopy={handleCopy}
          onSave={() => setShowSaveModal(true)}
          onDelete={handleDelete}
        />
        {showSaveModal && (
          <SaveWidgetModal
            defaultName="My Section"
            onSave={handleSave}
            onClose={() => setShowSaveModal(false)}
          />
        )}
        {section.children.length === 0 ? (
          <div
            ref={setNodeRef}
            className="section-empty"
            style={{
              background: isOver ? 'rgba(38, 198, 218, 0.1)' : undefined,
              borderColor: isOver ? '#26c6da' : undefined,
            }}
          >
            Drop columns or layout here
          </div>
        ) : (
          <div
            ref={setContentRef}
            className="section-content"
            style={{
              display: (section.style.display as React.CSSProperties['display']) || 'flex',
              // Flex properties
              ...(section.style.display !== 'grid' && {
                flexDirection: section.style.flexDirection as React.CSSProperties['flexDirection'],
                flexWrap: section.style.flexWrap as React.CSSProperties['flexWrap'],
              }),
              // Grid properties
              ...(section.style.display === 'grid' && {
                gridTemplateColumns: section.style.gridTemplateColumns as string,
                gridTemplateRows: section.style.gridTemplateRows as string,
                gridAutoFlow: section.style.gridAutoFlow as React.CSSProperties['gridAutoFlow'],
                justifyItems: section.style.justifyItems as React.CSSProperties['justifyItems'],
              }),
              // Common properties
              justifyContent: section.style.justifyContent as React.CSSProperties['justifyContent'],
              alignItems: section.style.alignItems as React.CSSProperties['alignItems'],
              gap:
                section.style.columnGap || section.style.rowGap
                  ? `${section.style.rowGap || '0px'} ${section.style.columnGap || '0px'}`
                  : tokens.spacing[2],
              // Visual feedback when dragging over
              ...(isOverContent && {
                outline: '2px dashed #26c6da',
                outlineOffset: '-2px',
              }),
            }}
          >
            {section.children.map((column, colIndex) => (
              <ColumnBox
                key={column.key}
                column={column}
                sectionId={section.id}
                index={colIndex}
                isLast={colIndex === section.children.length - 1}
                isOnlyColumn={section.children.length === 1}
              />
            ))}
            {/* Trailing drop zone for columns */}
            <TrailingColumnDropZone
              ref={setTrailingColumnRef}
              $isOver={isOverTrailingColumn}
              $isDraggingColumn={isDraggingColumn}
            />
          </div>
        )}
      </Container>
    </>
  )
})
