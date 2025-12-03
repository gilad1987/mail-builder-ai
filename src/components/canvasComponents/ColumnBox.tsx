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

    .column-actions,
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

export const ColumnBox = observer(({ column, sectionId, isLast }: ColumnBoxProps) => {
  const isSelected = editorStore.selectedElementId === column.id
  const isHovered = editorStore.hoveredElementId === column.id
  const { activeData } = useDndState()

  // Make this container directly droppable
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${column.id}`,
    data: { accepts: 'block', columnId: column.id, sectionId },
  })

  const showPlaceholder = isOver && activeData?.source === 'sidebar'

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
    isOver ? 'is-over' : '',
    isHovered ? 'is-hovered' : '',
  ]
    .filter(Boolean)
    .join(' ')

  // If width is defined, use it as flex-basis and max-width
  // If width is undefined, use flex: 1 to expand as much as possible
  const flexStyle =
    column.width !== undefined
      ? { flex: `0 0 ${column.width}%`, maxWidth: `${column.width}%` }
      : { flex: 1 }

  return (
    <Container
      ref={setNodeRef}
      className={classNames}
      style={{
        ...column.style,
        ...flexStyle,
        alignSelf: 'stretch',
      }}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <ElementLabel label="Column" color="#1e88e5" />
      <ColumnActions onCopy={handleCopy} onDelete={handleDelete} />
      {!isLast && <AddColumnButton onClick={handleAddColumn} />}

      {column.children.length === 0 ? (
        <div
          className="column-empty"
          style={{
            borderColor: isOver ? '#1e88e5' : 'transparent',
            background: isOver ? 'rgba(30, 136, 229, 0.1)' : 'transparent',
          }}
        >
          {isOver ? 'Drop here' : 'Drop elements here'}
        </div>
      ) : (
        <div
          className="column-blocks"
          style={{
            display: column.style.display || 'flex',
            flexDirection:
              (column.style.flexDirection as React.CSSProperties['flexDirection']) || 'column',
            justifyContent: column.style.justifyContent,
            alignItems: column.style.alignItems,
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
