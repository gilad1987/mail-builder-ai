import { useDraggable } from '@dnd-kit/core'
import { Copy, GripVertical, Save, Trash2 } from 'lucide-react'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import type { DragData } from '../dnd/types'

interface BlockActionsProps {
  isVisible?: boolean
  elementId: string
  columnId: string
  elementIndex: number
  blockType?: string
  onDelete: () => void
  onCopy: () => void
  onEdit: () => void
  onSave?: () => void
}

const Container = styled.div`
  position: absolute;
  top: -33px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0;
  background: linear-gradient(135deg, #546e7a 0%, #37474f 100%);
  border-radius: ${tokens.borderRadius.sm};
  padding: 2px 5px;
  z-index: 70;
  box-shadow: 0 2px 8px rgba(55, 71, 79, 0.3);

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

export const BlockActions = ({
  isVisible = false,
  elementId,
  columnId,
  elementIndex,
  blockType,
  onDelete,
  onCopy,
  // onEdit - commented out for now
  onSave,
}: BlockActionsProps) => {
  const dragData: DragData = {
    source: 'canvas',
    type: 'element',
    elementId,
    blockType,
    parentId: columnId,
    index: elementIndex,
  }

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `drag-element-${elementId}`,
    data: dragData,
  })

  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  // Prevent dnd-kit from capturing pointer events on non-drag elements
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
  }

  if (!isVisible) return null

  return (
    <Container
      className="block-actions"
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
      <button onClick={(e) => handleClick(e, onCopy)} title="Duplicate Block">
        <Copy size={12} />
      </button>
      {/*<button onClick={(e) => handleClick(e, onEdit)} title="Edit Block">*/}
      {/*  <ExternalLink size={12} />*/}
      {/*</button>*/}
      {onSave && (
        <button onClick={(e) => handleClick(e, onSave)} title="Save as Widget">
          <Save size={12} />
        </button>
      )}
      <button className="delete" onClick={(e) => handleClick(e, onDelete)} title="Delete Block">
        <Trash2 size={12} />
      </button>
    </Container>
  )
}
