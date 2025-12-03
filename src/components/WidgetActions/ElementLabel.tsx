import styled from 'styled-components'
import { tokens } from '../../styles/tokens'

interface ElementLabelProps {
  label: string
  color?: string
}

const Label = styled.span<{ $color: string }>`
  position: absolute;
  top: -23px;
  left: 0;
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
`

export const ElementLabel = ({ label, color = '#37474f' }: ElementLabelProps) => {
  return (
    <Label $color={color} className="element-label">
      {label}
    </Label>
  )
}
