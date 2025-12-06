import { useDroppable } from '@dnd-kit/core'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Column } from '../../models'
import { editorStore } from '../../stores/EditorStore'
import { tokens } from '../../styles/tokens'
import { useDndState } from '../dnd'
import { AddColumnButton, ColumnActions, ElementLabel } from '../WidgetActions'
import { BlockElement } from './BlockElement'

interface ColumnBoxProps {
  column: Column
  sectionId: string
  isLast?: boolean
  isOnlyColumn?: boolean
}

const Container = styled.div`
  position: relative;
  min-height: 80px;
  min-width: 0; /* Allow flex shrinking */
  overflow: visible;
  background: #ffffff;
  border: 2px dashed ${tokens.colors.gray[300]};
  border-radius: ${tokens.borderRadius.md};
  padding: ${tokens.spacing[3]};
  transition: all ${tokens.transition.fast};

  &.is-hovered {
    border-color: #1e88e5;
    border-style: solid;

    > .element-label {
      opacity: 1;
    }
  }

  &.is-selected {
    border-color: #1e88e5;
    border-style: solid;
    box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.2);

    .add-column-btn {
      opacity: 1;
    }
  }

  &.is-over {
    background: rgba(30, 136, 229, 0.05);
    border-color: #1e88e5;
  }

  .column-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 60px;
    color: ${tokens.colors.gray[400]};
    font-size: ${tokens.fontSize.xs};
    border: 2px dashed transparent;
    border-radius: ${tokens.borderRadius.sm};
    transition: all ${tokens.transition.fast};
  }

  .column-blocks {
    min-height: 40px;
  }

  .drop-placeholder {
    height: 40px;
    border: 2px dashed #1e88e5;
    border-radius: ${tokens.borderRadius.sm};
    background: rgba(30, 136, 229, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e88e5;
    font-size: ${tokens.fontSize.xs};
    margin: ${tokens.spacing[1]} 0;
  }
`

export const ColumnBox = observer(({ column, sectionId, isLast, isOnlyColumn }: ColumnBoxProps) => {
  const isSelected = editorStore.selectedElementId === column.id
  const isHovered = editorStore.hoveredElementId === column.id
  const { activeData } = useDndState()

  // Check if parent section is using Grid layout
  const section = editorStore.findElementById(sectionId)
  const isGridLayout = section?.style?.display === 'grid'

  // Make this container directly droppable
  // Also include sectionId so column drops can be handled at section level
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${column.id}`,
    data: { accepts: 'block', columnId: column.id, sectionId },
  })

  // Only show placeholder for block drops, not column drops
  const showPlaceholder = isOver && activeData?.source === 'sidebar' && activeData?.type === 'block'
  // Check if dragging a column (to show different visual feedback)
  const isDraggingColumn = activeData?.source === 'sidebar' && activeData?.type === 'column'

  const handleMouseOver = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Only set hover if mouse is directly over this element or empty area
    const target = e.target as HTMLElement
    if (
      e.currentTarget === e.target ||
      target.classList.contains('column-empty') ||
      target.classList.contains('column-blocks')
    ) {
      editorStore.setHoveredElement(column.id)
    }
  }

  const handleMouseLeave = () => {
    if (editorStore.hoveredElementId === column.id) {
      editorStore.setHoveredElement(null)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    editorStore.setSelectedElement(column.id)
  }

  const handleCopy = () => {
    editorStore.copyElement(column.id)
  }

  const handleDelete = () => {
    editorStore.removeElement(column.id)
  }

  const handleAddColumn = () => {
    // Add a new column after this one (no fixed width = auto-expand with flex: 1)
    const section = editorStore.findElementById(sectionId)
    if (section) {
      editorStore.addColumnToSection(sectionId)
    }
  }

  const classNames = [
    isSelected ? 'is-selected' : '',
    isOver && !isDraggingColumn ? 'is-over' : '',
    isHovered ? 'is-hovered' : '',
  ]
    .filter(Boolean)
    .join(' ')

  // For Grid layout: columns are grid items, no flex properties needed
  // For Flex layout: use flex-basis and flex-grow
  // But if user has set a custom width in styles, respect that instead
  const hasCustomWidth = column.style.width !== undefined
  const layoutStyle: React.CSSProperties = isGridLayout
    ? {} // Grid items don't need special sizing - they follow grid template
    : hasCustomWidth
      ? {} // User has set custom width, don't override with flex
      : isOnlyColumn
        ? { flex: 1 }
        : column.width !== undefined
          ? { flex: `0 0 ${column.width}%`, maxWidth: `${column.width}%` }
          : { flex: 1 }

  return (
    <Container
      ref={setNodeRef}
      className={classNames}
      style={{
        ...layoutStyle,
        ...column.style,
        alignSelf: 'stretch',
      }}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <ElementLabel label="Column" color="#1e88e5" />
      <ColumnActions isVisible={isSelected} onCopy={handleCopy} onDelete={handleDelete} />
      {!isLast && <AddColumnButton onClick={handleAddColumn} />}

      {column.children.length === 0 ? (
        <div
          className="column-empty"
          style={{
            borderColor: isOver && !isDraggingColumn ? '#1e88e5' : 'transparent',
            background: isOver && !isDraggingColumn ? 'rgba(30, 136, 229, 0.1)' : 'transparent',
          }}
        >
          {isOver && !isDraggingColumn ? 'Drop here' : 'Drop elements here'}
        </div>
      ) : (
        <div
          className="column-blocks"
          style={{
            display: (column.style.display as React.CSSProperties['display']) || 'flex',
            flexDirection:
              (column.style.flexDirection as React.CSSProperties['flexDirection']) || 'column',
            justifyContent: column.style.justifyContent as React.CSSProperties['justifyContent'],
            alignItems: column.style.alignItems as React.CSSProperties['alignItems'],
            flexWrap: column.style.flexWrap as React.CSSProperties['flexWrap'],
            gap:
              column.style.columnGap || column.style.rowGap
                ? `${column.style.rowGap || 0} ${column.style.columnGap || 0}`
                : tokens.spacing[2],
          }}
        >
          {showPlaceholder && <div className="drop-placeholder">Drop here</div>}
          {column.children.map(child => (
            <BlockElement key={child.key} block={child} columnId={column.id} />
          ))}
        </div>
      )}
    </Container>
  )
})
