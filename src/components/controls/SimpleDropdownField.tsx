import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'
import { tokens } from '../../styles/tokens'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'

const Container = styled.div`
  padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
  border-bottom: 1px solid var(--border-color);

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
    color: var(--text-primary);
  }

  .select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .select {
    appearance: none;
    background-color: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    padding: ${tokens.spacing[1]} ${tokens.spacing[6]} ${tokens.spacing[1]} ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.xs};
    color: var(--input-text);
    cursor: pointer;
    min-width: 100px;

    &:hover {
      border-color: var(--text-secondary);
    }

    &:focus {
      outline: none;
      border-color: var(--accent);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .chevron {
    position: absolute;
    right: ${tokens.spacing[1]};
    pointer-events: none;
    color: var(--text-secondary);
  }
`

interface SimpleDropdownFieldProps {
  label: string
  styleProperty: string
  options?: string[]
  defaultValue?: string
  responsive?: boolean
}

export const SimpleDropdownField = observer(
  ({
    label,
    styleProperty,
    options = ['Default'],
    defaultValue = 'Default',
    responsive = true,
  }: SimpleDropdownFieldProps) => {
    const element = editorStore.selectedElement
    const device = editorStore.activeDevice

    // Get value from model
    const getValue = (): string => {
      if (!element) return defaultValue
      const style = element._style[device]
      const value = style[styleProperty] ?? element._style.desktop[styleProperty] ?? defaultValue
      return typeof value === 'string' ? value : defaultValue
    }

    // Update value in model
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!element) return
      const value = e.target.value
      // If 'Default' or 'None', remove the property
      if (value === 'Default' || value === 'None') {
        element.update(styleProperty, undefined)
      } else {
        element.update(styleProperty, value.toLowerCase())
      }
    }

    const currentValue = getValue()

    return (
      <Container>
        <div className="header">
          <div className="label">
            {label}
            <ResponsiveIcon device={device} responsive={responsive} />
          </div>
          <div className="select-wrapper">
            <select
              className="select"
              value={currentValue}
              onChange={handleChange}
              disabled={!element}
            >
              {options.map(opt => (
                <option key={opt} value={opt.toLowerCase()}>
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
