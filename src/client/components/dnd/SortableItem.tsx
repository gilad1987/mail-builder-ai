import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { DragData } from './types'

interface SortableItemProps {
  id: string
  data: DragData
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
}

export const SortableItem = ({
  id,
  data,
  children,
  className,
  style,
  disabled = false,
}: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data,
    disabled,
  })

  const combinedStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
  }

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      className={className}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}
