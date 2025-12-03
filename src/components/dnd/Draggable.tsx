import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { DragData } from './types'

interface DraggableProps {
  id: string
  data: DragData
  children: React.ReactNode
  className?: string
}

export const Draggable = ({ id, data, children, className }: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
  })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    flex: 1,
    width: '100%',
    display: 'block',
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={className}>
      {children}
    </div>
  )
}
