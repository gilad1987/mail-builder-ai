import { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { RotateCcw, Pencil } from 'lucide-react'
import { tokens } from '../../../styles/tokens'
import { editorStore } from '../../../stores/EditorStore'
import { ResponsiveIcon } from '../ResponsiveIcon'

const Container = styled.div`
  padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
  border-bottom: 1px solid var(--border-color);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${tokens.spacing[3]};
  }

  .label {
    display: flex;
    align-items: center;
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    color: var(--text-primary);
  }

  .actions {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
  }

  .btn-action {
    padding: 4px;
    color: var(--text-secondary);
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.sm};
    cursor: pointer;
    transition: all ${tokens.transition.fast};

    &:hover {
      color: var(--accent);
      border-color: var(--accent);
    }
  }

  .panel {
    background: var(--bg-secondary);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.lg};
    padding: ${tokens.spacing[4]};
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing[4]};
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing[2]};
  }

  .field-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .field-label {
    font-size: ${tokens.fontSize.sm};
    color: var(--text-primary);
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
  }

  .slider {
    flex: 1;
    height: 4px;
    background: var(--input-border);
    border-radius: 4px;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    border: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      background: var(--accent);
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .input {
    width: 50px;
    padding: ${tokens.spacing[1]};
    text-align: center;
    font-size: ${tokens.fontSize.xs};
    background-color: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    color: var(--input-text);
  }

  .input-group {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[1]};
  }

  .unit {
    font-size: ${tokens.fontSize.xs};
    color: var(--text-secondary);
    min-width: 20px;
  }

  .color-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .color-swatch {
    width: 24px;
    height: 24px;
    border-radius: ${tokens.borderRadius.sm};
    border: 1px solid var(--input-border);
    cursor: pointer;
    background-image:
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 6px 6px;
    background-position:
      0 0,
      0 3px,
      3px -3px,
      -3px 0px;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--swatch-color, transparent);
    }
  }

  .color-input {
    position: absolute;
    width: 24px;
    height: 24px;
    opacity: 0;
    cursor: pointer;
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
    padding: ${tokens.spacing[1]} ${tokens.spacing[5]} ${tokens.spacing[1]} ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.xs};
    color: var(--input-text);
    cursor: pointer;
    min-width: 80px;

    &:focus {
      outline: none;
      border-color: var(--accent);
    }
  }

  .chevron {
    position: absolute;
    right: ${tokens.spacing[2]};
    pointer-events: none;
    color: var(--text-secondary);
  }
`

interface BoxShadowValues {
  color: string
  horizontal: number
  vertical: number
  blur: number
  spread: number
  position: 'outline' | 'inset'
}

const defaultValues: BoxShadowValues = {
  color: 'rgba(0,0,0,0.25)',
  horizontal: 0,
  vertical: 0,
  blur: 10,
  spread: 0,
  position: 'outline',
}

export const BoxShadowController = observer(() => {
  const [isExpanded, setIsExpanded] = useState(false)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const element = editorStore.selectedElement
  const device = editorStore.activeDevice

  const getValue = (key: keyof BoxShadowValues): BoxShadowValues[keyof BoxShadowValues] => {
    if (!element) return defaultValues[key]
    const styleKey = `boxShadow-${key}`
    const style = element._style[device]
    return style[styleKey] ?? element._style.desktop[styleKey] ?? defaultValues[key]
  }

  const handleChange = (key: keyof BoxShadowValues, value: string | number) => {
    if (!element) return
    element.update(`boxShadow-${key}`, value)
  }

  const handleReset = () => {
    if (!element) return
    Object.keys(defaultValues).forEach(key => {
      element.update(`boxShadow-${key}`, undefined)
    })
  }

  const color = getValue('color') as string
  const horizontal = getValue('horizontal') as number
  const vertical = getValue('vertical') as number
  const blur = getValue('blur') as number
  const spread = getValue('spread') as number
  const position = getValue('position') as string

  return (
    <Container>
      <div className="header">
        <div className="label">
          Box Shadow
          <ResponsiveIcon device={device} responsive={true} />
        </div>
        <div className="actions">
          <button className="btn-action" title="Reset" onClick={handleReset}>
            <RotateCcw size={12} />
          </button>
          <button
            className="btn-action"
            title={isExpanded ? 'Collapse' : 'Expand'}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Pencil size={12} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="field">
            <div className="color-row">
              <span className="field-label">Color</span>
              <div style={{ position: 'relative' }}>
                <div
                  className="color-swatch"
                  style={{ '--swatch-color': color } as React.CSSProperties}
                  onClick={() => colorInputRef.current?.click()}
                />
                <input
                  ref={colorInputRef}
                  type="color"
                  className="color-input"
                  value={color.startsWith('#') ? color : '#000000'}
                  onChange={e => handleChange('color', e.target.value)}
                  disabled={!element}
                />
              </div>
            </div>
          </div>

          <div className="field">
            <span className="field-label">Horizontal</span>
            <div className="slider-row">
              <input
                type="range"
                className="slider"
                min={-50}
                max={50}
                value={horizontal}
                onChange={e => handleChange('horizontal', Number(e.target.value))}
                disabled={!element}
              />
              <div className="input-group">
                <input
                  type="number"
                  className="input"
                  value={horizontal}
                  onChange={e => handleChange('horizontal', Number(e.target.value))}
                  disabled={!element}
                />
                <span className="unit">px</span>
              </div>
            </div>
          </div>

          <div className="field">
            <span className="field-label">Vertical</span>
            <div className="slider-row">
              <input
                type="range"
                className="slider"
                min={-50}
                max={50}
                value={vertical}
                onChange={e => handleChange('vertical', Number(e.target.value))}
                disabled={!element}
              />
              <div className="input-group">
                <input
                  type="number"
                  className="input"
                  value={vertical}
                  onChange={e => handleChange('vertical', Number(e.target.value))}
                  disabled={!element}
                />
                <span className="unit">px</span>
              </div>
            </div>
          </div>

          <div className="field">
            <span className="field-label">Blur</span>
            <div className="slider-row">
              <input
                type="range"
                className="slider"
                min={0}
                max={100}
                value={blur}
                onChange={e => handleChange('blur', Number(e.target.value))}
                disabled={!element}
              />
              <div className="input-group">
                <input
                  type="number"
                  className="input"
                  value={blur}
                  onChange={e => handleChange('blur', Number(e.target.value))}
                  disabled={!element}
                />
                <span className="unit">px</span>
              </div>
            </div>
          </div>

          <div className="field">
            <span className="field-label">Spread</span>
            <div className="slider-row">
              <input
                type="range"
                className="slider"
                min={-50}
                max={50}
                value={spread}
                onChange={e => handleChange('spread', Number(e.target.value))}
                disabled={!element}
              />
              <div className="input-group">
                <input
                  type="number"
                  className="input"
                  value={spread}
                  onChange={e => handleChange('spread', Number(e.target.value))}
                  disabled={!element}
                />
                <span className="unit">px</span>
              </div>
            </div>
          </div>

          <div className="field">
            <div className="color-row">
              <span className="field-label">Position</span>
              <div className="select-wrapper">
                <select
                  className="select"
                  value={position}
                  onChange={e => handleChange('position', e.target.value)}
                  disabled={!element}
                >
                  <option value="outline">Outline</option>
                  <option value="inset">Inset</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  )
})
