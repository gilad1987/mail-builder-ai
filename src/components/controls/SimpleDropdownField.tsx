import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'
import { tokens } from '../../styles/tokens'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'

const Container = styled.div`
  padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
  border-bottom: 1px solid ${tokens.colors.gray[100]};

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .label {
    display: flex;
    align-items: center;
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    color: ${tokens.colors.gray[700]};
  }

  .select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .select {
    appearance: none;
    background-color: ${tokens.colors.gray[50]};
    border: 1px solid ${tokens.colors.gray[300]};
    border-radius: ${tokens.borderRadius.md};
    padding: ${tokens.spacing[1]} ${tokens.spacing[6]} ${tokens.spacing[1]} ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.xs};
    color: ${tokens.colors.gray[700]};
    cursor: pointer;
    min-width: 100px;

    &:hover {
      border-color: ${tokens.colors.gray[400]};
    }

    &:focus {
      outline: none;
      border-color: ${tokens.colors.blue[500]};
    }
  }

  .chevron {
    position: absolute;
    right: ${tokens.spacing[1]};
    pointer-events: none;
    color: ${tokens.colors.gray[400]};
  }
`

interface SimpleDropdownFieldProps {
  label: string
  value: string
  options?: string[]
  responsive?: boolean
  onChange?: (value: string) => void
}

export const SimpleDropdownField = observer(
  ({
    label,
    value,
    options = ['Default'],
    responsive = true,
    onChange,
  }: SimpleDropdownFieldProps) => {
    const [selected, setSelected] = useState(value)

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelected(e.target.value)
      onChange?.(e.target.value)
    }

    return (
      <Container>
        <div className="header">
          <div className="label">
            {label}
            <ResponsiveIcon device={editorStore.activeDevice} responsive={responsive} />
          </div>
          <div className="select-wrapper">
            <select className="select" value={selected} onChange={handleChange}>
              {options.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="chevron" />
          </div>
        </div>
      </Container>
    )
  }
)
