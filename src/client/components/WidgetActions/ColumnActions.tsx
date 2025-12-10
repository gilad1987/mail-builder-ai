import { useDraggable } from '@dnd-kit/core'
import { Copy, GripVertical, LayoutGrid, Trash2 } from 'lucide-react'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import type { DragData } from '../dnd/types'

interface ColumnActionsProps {
  isVisible?: boolean
  columnId: string
  sectionId: string
  columnIndex: number
  onCopy: () => void
  onGrid?: () => void
  onDelete: () => void
}

const Container = styled.div`
  position: absolute;
  top: -33px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0;
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
  border-radius: ${tokens.borderRadius.sm};
  padding: 2px 5px;
  z-index: 60;
  box-shadow: 0 2px 8px rgba(30, 136, 229, 0.3);

  button,
  .drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: ${tokens.borderRadius.sm};
    transition: background ${tokens.transition.fast};
    pointer-events: auto;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .drag-handle {
    cursor: grab;
    touch-action: none;

    &:active {
      cursor: grabbing;
    }
  }

  button.delete:hover {
    background: rgba(244, 67, 54, 0.8);
  }
`

export const ColumnActions = ({
  isVisible = false,
  columnId,
  sectionId,
  columnIndex,
  onCopy,
  onGrid,
  onDelete,
}: ColumnActionsProps) => {
  const dragData: DragData = {
    source: 'canvas',
    type: 'column',
    columnId,
    parentId: sectionId,
    index: columnIndex,
  }

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `drag-column-${columnId}`,
    data: dragData,
  })

  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  // Prevent dnd-kit's Draggable from capturing pointer events
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
  }

  if (!isVisible) return null

  return (
    <Container
      className="column-actions"
      onPointerDown={handlePointerDown}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div
        ref={setNodeRef}
        className="drag-handle"
        title="Drag to reorder"
        {...listeners}
        {...attributes}
      >
        <GripVertical size={12} />
      </div>
      <button onClick={(e) => handleClick(e, onCopy)} title="Duplicate Column">
        <Copy size={12} />
      </button>
      {onGrid && (
        <button onClick={(e) => handleClick(e, onGrid)} title="Layout Options">
          <LayoutGrid size={12} />
        </button>
      )}
      <button className="delete" onClick={(e) => handleClick(e, onDelete)} title="Delete Column">
        <Trash2 size={12} />
      </button>
    </Container>
  )
}
