import { useRef, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Brush, Square, Globe, Monitor, ChevronDown, RotateCcw } from 'lucide-react'
import { tokens } from '../../../styles/tokens'
import { editorStore } from '../../../stores/EditorStore'
import { ResponsiveIcon } from '../ResponsiveIcon'
import type { GlobalColors } from '../../../models'

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

  .type-toggle {
    display: flex;
    gap: 2px;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    padding: 2px;
  }

  .type-btn {
    padding: 4px 6px;
    border-radius: ${tokens.borderRadius.sm};
    color: var(--text-secondary);
    transition: all ${tokens.transition.fast};

    &:hover {
      color: var(--text-primary);
    }

    &.active {
      background: var(--bg-elevated);
      color: var(--text-primary);
    }
  }

  .hint-box {
    background: rgba(139, 92, 246, 0.1);
    border-left: 3px solid ${tokens.colors.purple[500]};
    padding: ${tokens.spacing[3]};
    margin-bottom: ${tokens.spacing[4]};
    border-radius: 0 ${tokens.borderRadius.md} ${tokens.borderRadius.md} 0;

    p {
      font-size: ${tokens.fontSize.xs};
      color: var(--text-secondary);
      font-style: italic;
      margin: 0;
      line-height: 1.5;
    }
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing[4]};
  }

  .color-stop {
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing[2]};
  }

  .color-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .color-label {
    font-size: ${tokens.fontSize.sm};
    color: var(--text-primary);
  }

  .color-actions {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
  }

  .icon-btn {
    padding: 3px;
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

  .global-colors-wrapper {
    position: relative;
  }

  .global-colors-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    background: var(--bg-elevated);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    box-shadow: ${tokens.shadow.lg};
    z-index: 100;
    min-width: 140px;
    padding: ${tokens.spacing[2]};
  }

  .global-color-item {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
    padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
    border-radius: ${tokens.borderRadius.sm};
    cursor: pointer;
    transition: background ${tokens.transition.fast};

    &:hover {
      background: var(--bg-secondary);
    }
  }

  .global-color-swatch {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid var(--input-border);
  }

  .global-color-label {
    font-size: ${tokens.fontSize.xs};
    color: var(--text-primary);
    text-transform: capitalize;
  }

  .color-swatch {
    width: 24px;
    height: 24px;
    border-radius: ${tokens.borderRadius.sm};
    border: 1px solid var(--input-border);
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .color-input {
    position: absolute;
    width: 24px;
    height: 24px;
    opacity: 0;
    cursor: pointer;
  }

  .location-row {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
  }

  .location-label {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[1]};
    font-size: ${tokens.fontSize.sm};
    color: var(--text-primary);
    min-width: 80px;
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

  .field-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

type BackgroundType = 'gradient' | 'solid'
type GradientType = 'linear' | 'radial'

interface GradientValues {
  type: BackgroundType
  gradientType: GradientType
  color1: string
  location1: number
  color2: string
  location2: number
  angle: number
}

const defaultValues: GradientValues = {
  type: 'gradient',
  gradientType: 'linear',
  color1: 'transparent',
  location1: 0,
  color2: '#ec4899',
  location2: 100,
  angle: 180,
}

const globalColorLabels: Record<keyof GlobalColors, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
}

export const BackgroundGradientController = observer(() => {
  const color1Ref = useRef<HTMLInputElement>(null)
  const color2Ref = useRef<HTMLInputElement>(null)
  const globalColors1Ref = useRef<HTMLDivElement>(null)
  const globalColors2Ref = useRef<HTMLDivElement>(null)
  const [showGlobalColors1, setShowGlobalColors1] = useState(false)
  const [showGlobalColors2, setShowGlobalColors2] = useState(false)
  const element = editorStore.selectedElement
  const device = editorStore.activeDevice
  const globalColors = editorStore.globalStyles.colors

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (globalColors1Ref.current && !globalColors1Ref.current.contains(e.target as Node)) {
        setShowGlobalColors1(false)
      }
      if (globalColors2Ref.current && !globalColors2Ref.current.contains(e.target as Node)) {
        setShowGlobalColors2(false)
      }
    }

    if (showGlobalColors1 || showGlobalColors2) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showGlobalColors1, showGlobalColors2])

  const getValue = <K extends keyof GradientValues>(key: K): GradientValues[K] => {
    if (!element) return defaultValues[key]
    const styleKey = `bgGradient-${key}`
    const style = element._style[device]
    return (style[styleKey] ??
      element._style.desktop[styleKey] ??
      defaultValues[key]) as GradientValues[K]
  }

  const handleChange = <K extends keyof GradientValues>(key: K, value: GradientValues[K]) => {
    if (!element) return
    element.update(`bgGradient-${key}`, value)
  }

  const handleReset = () => {
    if (!element) return
    // Clear all gradient-related styles
    Object.keys(defaultValues).forEach(key => {
      element.update(`bgGradient-${key}`, undefined)
    })
  }

  const bgType = getValue('type')
  const gradientType = getValue('gradientType')
  const color1 = getValue('color1')
  const location1 = getValue('location1')
  const color2 = getValue('color2')
  const location2 = getValue('location2')
  const angle = getValue('angle')

  return (
    <Container>
      <div className="header">
        <div className="label">
          Background Type
          <ResponsiveIcon device={device} responsive={true} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="type-btn"
            onClick={handleReset}
            title="Reset to transparent"
            style={{
              padding: '4px',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: '4px',
            }}
          >
            <RotateCcw size={12} />
          </button>
          <div className="type-toggle">
            <button
              className={`type-btn ${bgType === 'gradient' ? 'active' : ''}`}
              onClick={() => handleChange('type', 'gradient')}
              title="Gradient"
            >
              <Brush size={14} />
            </button>
            <button
              className={`type-btn ${bgType === 'solid' ? 'active' : ''}`}
              onClick={() => handleChange('type', 'solid')}
              title="Solid Color"
            >
              <Square size={14} />
            </button>
          </div>
        </div>
      </div>

      {bgType === 'gradient' && (
        <>
          <div className="hint-box">
            <p>
              Set locations and angle for each breakpoint to ensure the gradient adapts to different
              screen sizes.
            </p>
          </div>

          <div className="panel">
            {/* First Color Stop */}
            <div className="color-stop">
              <div className="color-header">
                <span className="color-label">Color</span>
                <div className="color-actions">
                  <div className="global-colors-wrapper" ref={globalColors1Ref}>
                    <button
                      className="icon-btn"
                      title="Global color"
                      onClick={() => setShowGlobalColors1(!showGlobalColors1)}
                    >
                      <Globe size={12} />
                    </button>
                    {showGlobalColors1 && (
                      <div className="global-colors-dropdown">
                        {(Object.entries(globalColors) as [keyof GlobalColors, string][]).map(
                          ([name, color]) => (
                            <div
                              key={name}
                              className="global-color-item"
                              onClick={() => {
                                handleChange('color1', color)
                                setShowGlobalColors1(false)
                              }}
                            >
                              <div
                                className="global-color-swatch"
                                style={{ backgroundColor: color }}
                              />
                              <span className="global-color-label">{globalColorLabels[name]}</span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: color1 }}
                      onClick={() => color1Ref.current?.click()}
                    />
                    <input
                      ref={color1Ref}
                      type="color"
                      className="color-input"
                      value={color1.startsWith('#') ? color1 : '#ffffff'}
                      onChange={e => handleChange('color1', e.target.value)}
                      disabled={!element}
                    />
                  </div>
                </div>
              </div>
              <div className="location-row">
                <span className="location-label">
                  Location <Monitor size={10} />
                </span>
              </div>
              <div className="slider-row">
                <input
                  type="range"
                  className="slider"
                  min={0}
                  max={100}
                  value={location1}
                  onChange={e => handleChange('location1', Number(e.target.value))}
                  disabled={!element}
                />
                <div className="input-group">
                  <input
                    type="number"
                    className="input"
                    min={0}
                    max={100}
                    value={location1}
                    onChange={e => handleChange('location1', Number(e.target.value))}
                    disabled={!element}
                  />
                  <span className="unit">%</span>
                </div>
              </div>
            </div>

            {/* Second Color Stop */}
            <div className="color-stop">
              <div className="color-header">
                <span className="color-label">Second Color</span>
                <div className="color-actions">
                  <div className="global-colors-wrapper" ref={globalColors2Ref}>
                    <button
                      className="icon-btn"
                      title="Global color"
                      onClick={() => setShowGlobalColors2(!showGlobalColors2)}
                    >
                      <Globe size={12} />
                    </button>
                    {showGlobalColors2 && (
                      <div className="global-colors-dropdown">
                        {(Object.entries(globalColors) as [keyof GlobalColors, string][]).map(
                          ([name, color]) => (
                            <div
                              key={name}
                              className="global-color-item"
                              onClick={() => {
                                handleChange('color2', color)
                                setShowGlobalColors2(false)
                              }}
                            >
                              <div
                                className="global-color-swatch"
                                style={{ backgroundColor: color }}
                              />
                              <span className="global-color-label">{globalColorLabels[name]}</span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: color2 }}
                      onClick={() => color2Ref.current?.click()}
                    />
                    <input
                      ref={color2Ref}
                      type="color"
                      className="color-input"
                      value={color2.startsWith('#') ? color2 : '#ec4899'}
                      onChange={e => handleChange('color2', e.target.value)}
                      disabled={!element}
                    />
                  </div>
                </div>
              </div>
              <div className="location-row">
                <span className="location-label">
                  Location <Monitor size={10} />
                </span>
              </div>
              <div className="slider-row">
                <input
                  type="range"
                  className="slider"
                  min={0}
                  max={100}
                  value={location2}
                  onChange={e => handleChange('location2', Number(e.target.value))}
                  disabled={!element}
                />
                <div className="input-group">
                  <input
                    type="number"
                    className="input"
                    min={0}
                    max={100}
                    value={location2}
                    onChange={e => handleChange('location2', Number(e.target.value))}
                    disabled={!element}
                  />
                  <span className="unit">%</span>
                </div>
              </div>
            </div>

            {/* Gradient Type */}
            <div className="field-row">
              <span className="color-label">Type</span>
              <div className="select-wrapper">
                <select
                  className="select"
                  value={gradientType}
                  onChange={e => handleChange('gradientType', e.target.value as GradientType)}
                  disabled={!element}
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
                <ChevronDown size={12} className="chevron" />
              </div>
            </div>

            {/* Angle (only for linear) */}
            {gradientType === 'linear' && (
              <div className="color-stop">
                <div className="location-row">
                  <span className="location-label">
                    Angle <Monitor size={10} />
                  </span>
                </div>
                <div className="slider-row">
                  <input
                    type="range"
                    className="slider"
                    min={0}
                    max={360}
                    value={angle}
                    onChange={e => handleChange('angle', Number(e.target.value))}
                    disabled={!element}
                  />
                  <div className="input-group">
                    <input
                      type="number"
                      className="input"
                      min={0}
                      max={360}
                      value={angle}
                      onChange={e => handleChange('angle', Number(e.target.value))}
                      disabled={!element}
                    />
                    <span className="unit">deg</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {bgType === 'solid' && (
        <div className="panel">
          <div className="color-stop">
            <div className="color-header">
              <span className="color-label">Background Color</span>
              <div className="color-actions">
                <div className="global-colors-wrapper" ref={globalColors1Ref}>
                  <button
                    className="icon-btn"
                    title="Global color"
                    onClick={() => setShowGlobalColors1(!showGlobalColors1)}
                  >
                    <Globe size={14} />
                  </button>
                  {showGlobalColors1 && (
                    <div className="global-colors-dropdown">
                      {(Object.entries(globalColors) as [keyof GlobalColors, string][]).map(
                        ([name, color]) => (
                          <div
                            key={name}
                            className="global-color-item"
                            onClick={() => {
                              handleChange('color1', color)
                              setShowGlobalColors1(false)
                            }}
                          >
                            <div
                              className="global-color-swatch"
                              style={{ backgroundColor: color }}
                            />
                            <span className="global-color-label">{globalColorLabels[name]}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: color1 }}
                    onClick={() => color1Ref.current?.click()}
                  />
                  <input
                    ref={color1Ref}
                    type="color"
                    className="color-input"
                    value={color1.startsWith('#') ? color1 : '#ffffff'}
                    onChange={e => handleChange('color1', e.target.value)}
                    disabled={!element}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
})
