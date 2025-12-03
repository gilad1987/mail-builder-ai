import { useDraggable } from '@dnd-kit/core'
import type { DragData } from './types'

interface DraggableProps {
  id: string
  data: DragData
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const Draggable = ({ id, data, children, className, style }: DraggableProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
  })

  // IMPORTANT: Don't apply any transform here!
  // The DragOverlay component handles the visual drag preview.
  // We only reduce opacity to indicate the element is being dragged.
  const combinedStyle: React.CSSProperties = {
    ...style,
    opacity: isDragging ? 0.3 : 1,
    cursor: 'grab',
    touchAction: 'none',
    // Prevent any layout shift during drag
    position: 'relative' as const,
  }

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      {...listeners}
      {...attributes}
      className={className}
    >
      {children}
    </div>
  )
}
