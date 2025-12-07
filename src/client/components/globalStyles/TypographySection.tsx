import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { tokens } from '../../styles/tokens'
import type { TypographyStyle } from '../../models'

interface TypographySectionProps {
  title: string
  expanded: boolean
  onToggle: () => void
  style: TypographyStyle
  onStyleChange: (field: keyof TypographyStyle, value: string) => void
}

const Container = styled.div`
  border-bottom: 1px solid var(--border-color);

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
    cursor: pointer;
    &:hover {
      background: var(--bg-elevated);
    }
  }

  .section-title {
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    color: var(--text-primary);
  }

  .section-icon {
    color: var(--text-secondary);
  }

  .section-content {
    padding: 0 ${tokens.spacing[4]} ${tokens.spacing[3]};
  }

  .field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${tokens.spacing[2]} 0;
  }

  .field-label {
    font-size: ${tokens.fontSize.xs};
    color: var(--text-secondary);
  }

  .color-input {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
    min-width: 120px;
  }

  .color-picker {
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: 1px solid var(--input-border);
      border-radius: 4px;
    }
  }

  .color-value {
    font-size: ${tokens.fontSize.xs};
    color: var(--input-text);
  }

  .number-input {
    display: flex;
    align-items: center;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    min-width: 120px;

    input {
      width: 60px;
      padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
      background: transparent;
      border: none;
      color: var(--input-text);
      font-size: ${tokens.fontSize.xs};
      text-align: right;
    }

    .unit {
      padding-right: ${tokens.spacing[2]};
      font-size: ${tokens.fontSize.xs};
      color: var(--text-secondary);
    }
  }

  .select-input {
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
    min-width: 120px;
    font-size: ${tokens.fontSize.xs};
    color: var(--input-text);
  }
`

// Parse numeric value from px string (e.g., "14px" -> "14")
const parsePxValue = (value: string): string => {
  const match = value.match(/^([\d.]+)/)
  return match ? match[1] : '14'
}

export const TypographySection = observer(
  ({ title, expanded, onToggle, style, onStyleChange }: TypographySectionProps) => {
    const isInherit = style.color === 'inherit'
    const displayColor = isInherit ? '#888888' : style.color

    const handleFontSizeChange = (value: string) => {
      onStyleChange('fontSize', `${value}px`)
    }

    const handleLineHeightChange = (value: string) => {
      onStyleChange('lineHeight', `${value}px`)
    }

    const handleColorChange = (value: string) => {
      onStyleChange('color', value)
    }

    return (
      <Container>
        <div className="section-header" onClick={onToggle}>
          <span className="section-title">{title}</span>
          {expanded ? (
            <ChevronUp size={16} className="section-icon" />
          ) : (
            <ChevronDown size={16} className="section-icon" />
          )}
        </div>
        {expanded && (
          <div className="section-content">
            <div className="field">
              <span className="field-label">Color</span>
              <div className="color-input">
                <input
                  type="color"
                  className="color-picker"
                  value={displayColor}
                  onChange={e => handleColorChange(e.target.value)}
                />
                <span className="color-value">{style.color}</span>
              </div>
            </div>
            <div className="field">
              <span className="field-label">Font Size</span>
              <div className="number-input">
                <input
                  type="number"
                  value={parsePxValue(style.fontSize)}
                  onChange={e => handleFontSizeChange(e.target.value)}
                  step="1"
                  min="8"
                />
                <span className="unit">px</span>
              </div>
            </div>
            <div className="field">
              <span className="field-label">Line Height</span>
              <div className="number-input">
                <input
                  type="number"
                  value={parsePxValue(style.lineHeight)}
                  onChange={e => handleLineHeightChange(e.target.value)}
                  step="1"
                  min="8"
                />
                <span className="unit">px</span>
              </div>
            </div>
            <div className="field">
              <span className="field-label">Font Family</span>
              <select
                className="select-input"
                value={style.fontFamily}
                onChange={e => onStyleChange('fontFamily', e.target.value)}
              >
                <option value="default">Default</option>
                <option value="sans-serif">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>
          </div>
        )}
      </Container>
    )
  }
)
