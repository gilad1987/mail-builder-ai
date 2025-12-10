import { useDraggable } from '@dnd-kit/core'
import { Copy, GripVertical, LayoutGrid, Save, Trash2 } from 'lucide-react'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import type { DragData } from '../dnd/types'

interface SectionActionsProps {
  isVisible?: boolean
  sectionId: string
  sectionIndex: number
  onCopy: () => void
  onGrid?: () => void
  onSave?: () => void
  onDelete: () => void
}

const Container = styled.div`
  position: absolute;
  top: -33px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0;
  background: linear-gradient(135deg, #26c6da 0%, #00acc1 100%);
  border-radius: ${tokens.borderRadius.sm};
  padding: 2px 5px;
  z-index: 50;
  box-shadow: 0 2px 8px rgba(0, 172, 193, 0.3);

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

export const SectionActions = ({
  isVisible = false,
  sectionId,
  sectionIndex,
  onCopy,
  onGrid,
  onSave,
  onDelete,
}: SectionActionsProps) => {
  const dragData: DragData = {
    source: 'canvas',
    type: 'section',
    sectionId,
    index: sectionIndex,
  }

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `drag-section-${sectionId}`,
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
      className="section-actions"
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
      <button onClick={(e) => handleClick(e, onCopy)} title="Duplicate Section">
        <Copy size={12} />
      </button>
      {onGrid && (
        <button onClick={(e) => handleClick(e, onGrid)} title="Layout Options">
          <LayoutGrid size={12} />
        </button>
      )}
      {onSave && (
        <button onClick={(e) => handleClick(e, onSave)} title="Save as Widget">
          <Save size={12} />
        </button>
      )}
      <button className="delete" onClick={(e) => handleClick(e, onDelete)} title="Delete Section">
        <Trash2 size={12} />
      </button>
    </Container>
  )
}
