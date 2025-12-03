import styled from 'styled-components'
import { LayoutGrid, Columns, Type, Image, Square } from 'lucide-react'
import { tokens } from '../../styles/tokens'

type BadgeType = 'section' | 'column' | 'block' | 'image' | 'text'

interface TypeBadgeProps {
  type: BadgeType
}

const Badge = styled.div<{ $type: BadgeType }>`
  position: absolute;
  top: 4px;
  left: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: ${({ $type }) => {
    switch ($type) {
      case 'section':
        return '#37474f'
      case 'column':
        return '#37474f'
      case 'image':
        return '#37474f'
      case 'text':
        return '#37474f'
      default:
        return '#37474f'
    }
  }};
  border-radius: ${tokens.borderRadius.sm};
  color: white;
  z-index: 40;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

const iconMap = {
  section: LayoutGrid,
  column: Columns,
  block: Square,
  image: Image,
  text: Type,
}

export const TypeBadge = ({ type }: TypeBadgeProps) => {
  const Icon = iconMap[type] || Square

  return (
    <Badge $type={type} className="type-badge">
      <Icon size={14} />
    </Badge>
  )
}
