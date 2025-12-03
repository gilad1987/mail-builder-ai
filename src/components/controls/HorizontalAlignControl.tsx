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

    &.is-disabled {
      opacity: 0.5;
      pointer-events: none;
    }
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
  styleProperty?: string
  defaultValue?: AlignValue
  responsive?: boolean
}

export const HorizontalAlignControl = observer(
  ({
    styleProperty = 'textAlign',
    defaultValue = 'left',
    responsive = true,
  }: HorizontalAlignControlProps) => {
    const element = editorStore.selectedElement
    const device = editorStore.activeDevice

    // Get value from model
    const getValue = (): AlignValue => {
      if (!element) return defaultValue
      const style = element._style[device]
      const value = style[styleProperty] ?? element._style.desktop[styleProperty] ?? defaultValue
      return (value as AlignValue) || defaultValue
    }

    // Update value in model
    const handleClick = (value: AlignValue) => {
      if (!element) return
      element.update(styleProperty, value)
    }

    const currentAlign = getValue()

    return (
      <Container>
        <div className="header">
          <div className="label">
            Horizontal align
            <ResponsiveIcon device={device} responsive={responsive} />
          </div>
          <div className={`button-group ${!element ? 'is-disabled' : ''}`}>
            <button
              className={`align-btn ${currentAlign === 'left' ? 'is-active' : ''}`}
              onClick={() => handleClick('left')}
              aria-label="Align left"
              disabled={!element}
            >
              <AlignLeft size={16} />
            </button>
            <button
              className={`align-btn ${currentAlign === 'center' ? 'is-active' : ''}`}
              onClick={() => handleClick('center')}
              aria-label="Align center"
              disabled={!element}
            >
              <AlignCenter size={16} />
            </button>
            <button
              className={`align-btn ${currentAlign === 'right' ? 'is-active' : ''}`}
              onClick={() => handleClick('right')}
              aria-label="Align right"
              disabled={!element}
            >
              <AlignRight size={16} />
            </button>
          </div>
        </div>
      </Container>
    )
  }
)
