import styled from 'styled-components'
import {
  Columns,
  Image,
  LayoutGrid,
  Minus,
  MousePointer,
  SeparatorHorizontal,
  Square,
  Type,
} from 'lucide-react'
import { tokens } from '../../styles/tokens'

interface ElementLabelProps {
  label: string
  color?: string
}

const Label = styled.span<{ $color: string }>`
  position: absolute;
  top: -23px;
  left: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: ${tokens.fontWeight.medium};
  color: white;
  background: ${({ $color }) => $color};
  padding: 2px 6px;
  border-radius: ${tokens.borderRadius.sm};
  opacity: 0;
  transition: opacity ${tokens.transition.fast};
  white-space: nowrap;
  z-index: 40;
  pointer-events: none;

  svg {
    flex-shrink: 0;
  }
`

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Section: LayoutGrid,
  Column: Columns,
  Image: Image,
  Paragraph: Type,
  Headline: Type,
  Button: MousePointer,
  Spacer: Minus,
  Divider: SeparatorHorizontal,
  'Inner Section': LayoutGrid,
}

export const ElementLabel = ({ label, color = '#37474f' }: ElementLabelProps) => {
  const Icon = iconMap[label] || Square

  return (
    <Label $color={color} className="element-label">
      <Icon size={10} />
      {label}
    </Label>
  )
}
