import { useState } from 'react'
import styled from 'styled-components'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { tokens } from '../../styles/tokens'

interface TypographySectionProps {
  title: string
  expanded: boolean
  onToggle: () => void
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

  .color-swatch {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid var(--input-border);
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

export const TypographySection = ({ title, expanded, onToggle }: TypographySectionProps) => {
  const [color] = useState('inherit')
  const [fontSize, setFontSize] = useState('1')
  const [lineHeight, setLineHeight] = useState('1.75')

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
              <div
                className="color-swatch"
                style={{ background: color === 'inherit' ? '#888' : color }}
              />
              <span className="color-value">{color}</span>
            </div>
          </div>
          <div className="field">
            <span className="field-label">Font Size</span>
            <div className="number-input">
              <input
                type="number"
                value={fontSize}
                onChange={e => setFontSize(e.target.value)}
                step="0.1"
              />
              <span className="unit">rem</span>
            </div>
          </div>
          <div className="field">
            <span className="field-label">Line Height</span>
            <div className="number-input">
              <input
                type="number"
                value={lineHeight}
                onChange={e => setLineHeight(e.target.value)}
                step="0.25"
              />
              <span className="unit">rem</span>
            </div>
          </div>
          <div className="field">
            <span className="field-label">Font Family</span>
            <select className="select-input">
              <option value="default">Default</option>
              <option value="sans">Sans-serif</option>
              <option value="serif">Serif</option>
              <option value="mono">Monospace</option>
            </select>
          </div>
        </div>
      )}
    </Container>
  )
}
