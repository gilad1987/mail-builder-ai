import { useDroppable } from '@dnd-kit/core'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import type { DropData } from './types'

interface DroppableProps {
  id: string
  data: DropData
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent) => void
}

const DropZone = styled.div<{ $isOver: boolean }>`
  transition: all ${tokens.transition.fast};

  ${({ $isOver }) =>
    $isOver &&
    `
    background: ${tokens.colors.blue[50]} !important;
    border-color: ${tokens.colors.blue[500]} !important;
    box-shadow: inset 0 0 0 2px ${tokens.colors.blue[500]};
  `}
`

export const Droppable = ({ id, data, children, className, style, onClick }: DroppableProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data,
  })

  return (
    <DropZone
      ref={setNodeRef}
      $isOver={isOver}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </DropZone>
  )
}
