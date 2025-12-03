import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'
import { tokens } from '../../../styles/tokens'
import { editorStore } from '../../../stores/EditorStore'
import { ResponsiveIcon } from '../ResponsiveIcon'

const Container = styled.div`
  .field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${tokens.spacing[2]} 0;
    border-bottom: 1px solid var(--border-color);
  }
  .field-label {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[1]};
    font-size: ${tokens.fontSize.sm};
    color: var(--text-primary);
  }
  .dropdown-wrapper {
    position: relative;
    min-width: 120px;
  }
  .dropdown {
    width: 100%;
    appearance: none;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.sm};
    padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
    padding-right: ${tokens.spacing[5]};
    font-size: ${tokens.fontSize.xs};
    color: var(--input-text);
    cursor: pointer;
    &:hover {
      border-color: var(--text-secondary);
    }
    &:focus {
      outline: none;
      border-color: var(--accent);
    }
  }
  .dropdown-icon {
    position: absolute;
    right: ${tokens.spacing[2]};
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--text-secondary);
  }
  .slider-field {
    padding: ${tokens.spacing[3]} 0;
    border-bottom: 1px solid var(--border-color);
  }
  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${tokens.spacing[2]};
  }
  .slider-row {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[3]};
  }
  .slider {
    flex: 1;
    height: 4px;
    background: var(--input-border);
    border-radius: 4px;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      background: var(--accent);
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .slider-input {
    width: 60px;
    padding: ${tokens.spacing[1]};
    text-align: center;
    font-size: ${tokens.fontSize.xs};
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.sm};
    color: var(--input-text);
  }
  .unit-selector {
    font-size: ${tokens.fontSize.xs};
    color: var(--text-secondary);
    cursor: pointer;
    &:hover {
      color: var(--text-primary);
    }
  }
  .hint-text {
    font-size: ${tokens.fontSize.xs};
    font-style: italic;
    color: var(--text-secondary);
    padding: ${tokens.spacing[2]} 0;
  }
`

type LayoutType = 'flexbox' | 'grid'
type ContentWidth = 'boxed' | 'full'

export const ContainerLayoutSection = observer(() => {
  const [layout, setLayout] = useState<LayoutType>('flexbox')
  const [contentWidth, setContentWidth] = useState<ContentWidth>('boxed')
  const [width, setWidth] = useState(760)
  const [minHeight, setMinHeight] = useState(0)

  return (
    <Container>
      <div className="field">
        <span className="field-label">Container Layout</span>
        <div className="dropdown-wrapper">
          <select
            className="dropdown"
            value={layout}
            onChange={e => setLayout(e.target.value as LayoutType)}
          >
            <option value="flexbox">Flexbox</option>
            <option value="grid">Grid</option>
          </select>
          <ChevronDown size={14} className="dropdown-icon" />
        </div>
      </div>
      <div className="field">
        <span className="field-label">Content Width</span>
        <div className="dropdown-wrapper">
          <select
            className="dropdown"
            value={contentWidth}
            onChange={e => setContentWidth(e.target.value as ContentWidth)}
          >
            <option value="boxed">Boxed</option>
            <option value="full">Full Width</option>
          </select>
          <ChevronDown size={14} className="dropdown-icon" />
        </div>
      </div>
      <div className="slider-field">
        <div className="slider-header">
          <span className="field-label">
            Width <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
          </span>
          <span className="unit-selector">px ▾</span>
        </div>
        <div className="slider-row">
          <input
            type="range"
            className="slider"
            min={100}
            max={1200}
            value={width}
            onChange={e => setWidth(Number(e.target.value))}
          />
          <input
            type="number"
            className="slider-input"
            value={width}
            onChange={e => setWidth(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="slider-field">
        <div className="slider-header">
          <span className="field-label">
            Min Height <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
          </span>
          <span className="unit-selector">px ▾</span>
        </div>
        <div className="slider-row">
          <input
            type="range"
            className="slider"
            min={0}
            max={1000}
            value={minHeight}
            onChange={e => setMinHeight(Number(e.target.value))}
          />
          <input
            type="number"
            className="slider-input"
            value={minHeight || ''}
            onChange={e => setMinHeight(Number(e.target.value))}
          />
        </div>
        <p className="hint-text">To achieve full height Container use 100vh.</p>
      </div>
    </Container>
  )
})
