import { useState } from 'react'
import styled from 'styled-components'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { tokens } from '../../styles/tokens'

interface ColorsSectionProps {
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
    cursor: pointer;
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
`

const defaultColors = [
  { name: 'Primary', color: '#cf549e' },
  { name: 'Secondary', color: '#b9227d' },
  { name: 'Accent', color: '#ffb347' },
  { name: 'Success', color: '#28a745' },
  { name: 'Warning', color: '#ffc107' },
  { name: 'Error', color: '#dc3545' },
]

export const ColorsSection = ({ expanded, onToggle }: ColorsSectionProps) => {
  const [colors] = useState(defaultColors)

  return (
    <Container>
      <div className="section-header" onClick={onToggle}>
        <span className="section-title">Colors</span>
        {expanded ? (
          <ChevronUp size={16} className="section-icon" />
        ) : (
          <ChevronDown size={16} className="section-icon" />
        )}
      </div>
      {expanded && (
        <div className="section-content">
          {colors.map(({ name, color }) => (
            <div key={name} className="field">
              <span className="field-label">{name}</span>
              <div className="color-input">
                <div className="color-swatch" style={{ background: color }} />
                <span className="color-value">{color}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
