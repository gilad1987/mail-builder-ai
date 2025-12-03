import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'
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

  .button-group {
    display: flex;
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    overflow: hidden;
  }

  .align-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
    color: var(--text-secondary);
    background: var(--input-bg);
    border: none;
    border-right: 1px solid var(--input-border);
    border-radius: 0;
    cursor: pointer;
    transition: all ${tokens.transition.fast};

    &:last-child {
      border-right: none;
    }

    &:hover {
      background: var(--bg-elevated);
      color: var(--accent);
    }

    &.is-active {
      background: var(--bg-elevated);
      color: var(--accent);
    }
  }
`

type AlignValue = 'left' | 'center' | 'right'

interface HorizontalAlignControlProps {
  selectedAlign?: AlignValue
  onChange?: (value: AlignValue) => void
}

export const HorizontalAlignControl = observer(
  ({ selectedAlign = 'left', onChange }: HorizontalAlignControlProps) => {
    const [align, setAlign] = useState<AlignValue>(selectedAlign)

    const handleClick = (value: AlignValue) => {
      setAlign(value)
      onChange?.(value)
    }

    return (
      <Container>
        <div className="header">
          <div className="label">
            Horizontal align
            <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
          </div>
          <div className="button-group">
            <button
              className={`align-btn ${align === 'left' ? 'is-active' : ''}`}
              onClick={() => handleClick('left')}
              aria-label="Align left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              className={`align-btn ${align === 'center' ? 'is-active' : ''}`}
              onClick={() => handleClick('center')}
              aria-label="Align center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              className={`align-btn ${align === 'right' ? 'is-active' : ''}`}
              onClick={() => handleClick('right')}
              aria-label="Align right"
            >
              <AlignRight size={16} />
            </button>
          </div>
        </div>
      </Container>
    )
  }
)
