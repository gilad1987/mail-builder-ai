import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import {
  AlignCenterVertical,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignStartVertical,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Link2,
  Link2Off,
  MoveHorizontal,
  StretchHorizontal,
  WrapText,
} from 'lucide-react'
import { tokens } from '../../../styles/tokens'
import { editorStore } from '../../../stores/EditorStore'
import { ResponsiveIcon } from '../ResponsiveIcon'

const Container = styled.div`
  padding-top: ${tokens.spacing[3]};
  border-top: 1px solid var(--border-color);
  margin-top: ${tokens.spacing[2]};

  .items-title {
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.semibold};
    color: var(--text-primary);
    margin-bottom: ${tokens.spacing[3]};
  }
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
  .button-group {
    display: flex;
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    overflow: hidden;
  }
  .group-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${tokens.spacing[1]};
    background: var(--input-bg);
    border: none;
    border-right: 1px solid var(--input-border);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all ${tokens.transition.fast};
    &:last-child {
      border-right: none;
    }
    &:hover {
      background: var(--bg-elevated);
      color: var(--text-primary);
    }
    &.is-active {
      background: var(--bg-elevated);
      color: var(--accent);
    }
  }
  .gaps-field {
    flex-direction: column;
    align-items: flex-start;
  }
  .gaps-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: ${tokens.spacing[2]};
  }
  .gaps-row {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
    width: 100%;
  }
  .gap-input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing[1]};
  }
  .gap-input {
    width: 100%;
    padding: ${tokens.spacing[1]};
    text-align: center;
    font-size: ${tokens.fontSize.xs};
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.sm};
    color: var(--input-text);
  }
  .gap-label {
    font-size: ${tokens.fontSize.xs};
    color: var(--text-secondary);
    text-align: center;
  }
  .link-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${tokens.spacing[1]};
    background: var(--bg-elevated);
    border: none;
    border-radius: ${tokens.borderRadius.sm};
    color: var(--text-secondary);
    cursor: pointer;
    &:hover {
      color: var(--text-primary);
    }
    &.is-linked {
      color: var(--accent);
    }
  }
  .unit-selector {
    font-size: ${tokens.fontSize.xs};
    color: var(--text-secondary);
  }
  .wrap-hint {
    font-size: ${tokens.fontSize.xs};
    font-style: italic;
    color: var(--text-secondary);
    padding-top: ${tokens.spacing[2]};
  }

  /* Grid-specific styles */
  .toggle-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${tokens.spacing[2]} 0;
    border-bottom: 1px solid var(--border-color);
  }

  .toggle {
    position: relative;
    width: 56px;
    height: 26px;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 13px;
    cursor: pointer;
    transition: all ${tokens.transition.fast};
    overflow: hidden;

    &.is-active {
      background: var(--accent);
      border-color: var(--accent);
    }

    .toggle-knob {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      background: white;
      border-radius: 50%;
      transition: all ${tokens.transition.fast};
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    &.is-active .toggle-knob {
      left: 33px;
    }

    .toggle-label {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 10px;
      font-weight: 600;
      transition: opacity ${tokens.transition.fast};

      &--on {
        left: 8px;
        color: white;
        opacity: 0;
      }
      &--off {
        right: 8px;
        color: var(--text-secondary);
        opacity: 1;
      }
    }

    &.is-active .toggle-label--on {
      opacity: 1;
    }
    &.is-active .toggle-label--off {
      opacity: 0;
    }
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

    &::-webkit-slider-track {
      height: 4px;
      background: var(--input-border);
      border-radius: 4px;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: white;
      border: 2px solid var(--input-border);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      margin-top: -6px;
    }

    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: white;
      border: 2px solid var(--input-border);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
  }

  .slider-input {
    width: 60px;
    padding: ${tokens.spacing[2]};
    text-align: center;
    font-size: ${tokens.fontSize.sm};
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.sm};
    color: var(--input-text);
  }

  .unit-dropdown {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: ${tokens.fontSize.xs};
    color: var(--text-secondary);
    cursor: pointer;

    &:hover {
      color: var(--text-primary);
    }
  }

  .dropdown-wrapper {
    position: relative;
    flex: 1;
    max-width: 200px;
  }

  .dropdown {
    width: 100%;
    appearance: none;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.sm};
    padding: ${tokens.spacing[2]};
    padding-right: ${tokens.spacing[6]};
    font-size: ${tokens.fontSize.sm};
    color: var(--input-text);
    cursor: pointer;

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
`

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'start'
  | 'end'
type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'start' | 'end'
type JustifyItems = 'start' | 'center' | 'end' | 'stretch'
type FlexWrap = 'nowrap' | 'wrap'
type GridAutoFlow = 'row' | 'column' | 'dense' | 'row dense' | 'column dense'

export const ContainerItemsSection = observer(() => {
  const element = editorStore.selectedElement
  const [showGridOutline, setShowGridOutline] = useState(false)

  if (!element) return null

  const style = element.style
  const deviceStyle = element._style[editorStore.activeDevice]

  // Get display type
  const displayType = (style.display as string) || 'flex'
  const isGrid = displayType === 'grid'

  // Get current values from model
  const direction = (style.flexDirection as FlexDirection) || 'row'
  const justifyContent = (style.justifyContent as JustifyContent) || 'flex-start'
  const alignItems = (style.alignItems as AlignItems) || 'flex-start'
  const flexWrap = (style.flexWrap as FlexWrap) || 'nowrap'

  // Grid-specific values
  const gridTemplateColumns = (style.gridTemplateColumns as string) || ''
  const gridTemplateRows = (style.gridTemplateRows as string) || ''
  const gridAutoFlow = (style.gridAutoFlow as GridAutoFlow) || 'row'
  const justifyItems = (style.justifyItems as JustifyItems) || 'stretch'

  // Parse grid columns/rows count from template (e.g., "1fr 1fr 1fr" -> 3)
  const parseGridCount = (template: string): number => {
    if (!template) return 1
    return template.split(/\s+/).filter(Boolean).length
  }

  // Read column/row count from CSS gridTemplateColumns/gridTemplateRows
  const gridColumns = parseGridCount(gridTemplateColumns)
  const gridRows = parseGridCount(gridTemplateRows)

  // Parse gap values - gap can be "20px" or "20px 10px" (row column)
  const columnGap = (deviceStyle['columnGap-size'] as number) ?? 20
  const rowGap = (deviceStyle['rowGap-size'] as number) ?? 20

  // Check if gaps are linked (same value)
  const gapsLinked = columnGap === rowGap

  const handleDirectionChange = (value: FlexDirection) => {
    editorStore.updateSelectedStyle('flexDirection', value)
  }

  const handleJustifyContentChange = (value: JustifyContent) => {
    editorStore.updateSelectedStyle('justifyContent', value)
  }

  const handleAlignItemsChange = (value: AlignItems) => {
    editorStore.updateSelectedStyle('alignItems', value)
  }

  const handleFlexWrapChange = (value: FlexWrap) => {
    editorStore.updateSelectedStyle('flexWrap', value)
  }

  const handleGridColumnsChange = (count: number) => {
    const newCount = Math.max(1, count)
    const template = Array(newCount).fill('1fr').join(' ')
    editorStore.updateSelectedStyle('gridTemplateColumns', template)
  }

  const handleGridRowsChange = (count: number) => {
    const template = Array(Math.max(1, count)).fill('1fr').join(' ')
    editorStore.updateSelectedStyle('gridTemplateRows', template)
  }

  const handleGridAutoFlowChange = (value: string) => {
    editorStore.updateSelectedStyle('gridAutoFlow', value)
  }

  const handleJustifyItemsChange = (value: JustifyItems) => {
    editorStore.updateSelectedStyle('justifyItems', value)
  }

  const handleColumnGapChange = (value: number, linked: boolean) => {
    editorStore.updateSelectedStyle('columnGap-size', value)
    editorStore.updateSelectedStyle('columnGap-unit', 'px')
    if (linked) {
      editorStore.updateSelectedStyle('rowGap-size', value)
      editorStore.updateSelectedStyle('rowGap-unit', 'px')
    }
  }

  const handleRowGapChange = (value: number, linked: boolean) => {
    editorStore.updateSelectedStyle('rowGap-size', value)
    editorStore.updateSelectedStyle('rowGap-unit', 'px')
    if (linked) {
      editorStore.updateSelectedStyle('columnGap-size', value)
      editorStore.updateSelectedStyle('columnGap-unit', 'px')
    }
  }

  const handleToggleLink = () => {
    if (!gapsLinked) {
      // Link them - set both to columnGap value
      editorStore.updateSelectedStyle('rowGap-size', columnGap)
      editorStore.updateSelectedStyle('rowGap-unit', 'px')
    }
    // When unlinking, no action needed - they just become independent
  }

  return (
    <Container>
      <h4 className="items-title">Items</h4>

      {/* Flex-specific controls */}
      {!isGrid && (
        <>
          <div className="field">
            <span className="field-label">
              Direction <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
            </span>
            <div className="button-group">
              {(['row', 'column', 'row-reverse', 'column-reverse'] as FlexDirection[]).map(
                (d, i) => (
                  <button
                    key={d}
                    className={`group-btn ${direction === d ? 'is-active' : ''}`}
                    onClick={() => handleDirectionChange(d)}
                  >
                    {
                      [
                        <ArrowRight size={16} key="right" />,
                        <ArrowDown size={16} key="down" />,
                        <ArrowLeft size={16} key="left" />,
                        <ArrowUp size={16} key="up" />,
                      ][i]
                    }
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}

      {/* Grid-specific controls */}
      {isGrid && (
        <>
          {/* Grid Outline Toggle */}
          <div className="toggle-field">
            <span className="field-label">Grid Outline</span>
            <div
              className={`toggle ${showGridOutline ? 'is-active' : ''}`}
              onClick={() => setShowGridOutline(!showGridOutline)}
            >
              <span className="toggle-label toggle-label--on">Show</span>
              <span className="toggle-label toggle-label--off">Hide</span>
              <div className="toggle-knob" />
            </div>
          </div>

          {/* Columns Slider */}
          <div className="slider-field">
            <div className="slider-header">
              <span className="field-label">
                Columns <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
              </span>
              <span className="unit-dropdown">
                fr <ChevronDown size={12} />
              </span>
            </div>
            <div className="slider-row">
              <input
                type="range"
                className="slider"
                min={1}
                max={12}
                value={gridColumns}
                onChange={e => handleGridColumnsChange(Number(e.target.value))}
              />
              <input
                type="number"
                className="slider-input"
                min={1}
                max={12}
                value={gridColumns}
                onChange={e => handleGridColumnsChange(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Rows Slider */}
          <div className="slider-field">
            <div className="slider-header">
              <span className="field-label">
                Rows <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
              </span>
              <span className="unit-dropdown">
                fr <ChevronDown size={12} />
              </span>
            </div>
            <div className="slider-row">
              <input
                type="range"
                className="slider"
                min={1}
                max={12}
                value={gridRows}
                onChange={e => handleGridRowsChange(Number(e.target.value))}
              />
              <input
                type="number"
                className="slider-input"
                min={1}
                max={12}
                value={gridRows}
                onChange={e => handleGridRowsChange(Number(e.target.value))}
              />
            </div>
          </div>
        </>
      )}

      {/* Common controls */}
      <div className="field">
        <span className="field-label">
          Justify Content <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
        </span>
      </div>
      <div className="button-group" style={{ marginBottom: tokens.spacing[3] }}>
        {(
          [
            [isGrid ? 'start' : 'flex-start', AlignHorizontalJustifyStart],
            [isGrid ? 'end' : 'flex-end', AlignHorizontalJustifyEnd],
            ['center', AlignHorizontalJustifyCenter],
            ['space-between', AlignHorizontalSpaceBetween],
            ['space-around', AlignHorizontalSpaceAround],
            ['space-evenly', AlignHorizontalDistributeCenter],
          ] as [JustifyContent, typeof AlignHorizontalJustifyStart][]
        ).map(([v, Icon]) => (
          <button
            key={v}
            className={`group-btn ${justifyContent === v ? 'is-active' : ''}`}
            onClick={() => handleJustifyContentChange(v)}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      <div className="field">
        <span className="field-label">
          Align Items <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
        </span>
        <div className="button-group">
          {(
            [
              [isGrid ? 'start' : 'flex-start', AlignStartVertical],
              ['center', AlignCenterVertical],
              [isGrid ? 'end' : 'flex-end', AlignEndVertical],
              ['stretch', StretchHorizontal],
            ] as [AlignItems, typeof AlignStartVertical][]
          ).map(([v, Icon]) => (
            <button
              key={v}
              className={`group-btn ${alignItems === v ? 'is-active' : ''}`}
              onClick={() => handleAlignItemsChange(v)}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>
      <div className="field gaps-field">
        <div className="gaps-header">
          <span className="field-label">
            Gaps <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
          </span>
          <span className="unit-selector">px</span>
        </div>
        <div className="gaps-row">
          <div className="gap-input-group">
            <input
              type="number"
              className="gap-input"
              value={columnGap}
              onChange={e => handleColumnGapChange(Number(e.target.value), gapsLinked)}
            />
            <span className="gap-label">Column</span>
          </div>
          <div className="gap-input-group">
            <input
              type="number"
              className="gap-input"
              value={rowGap}
              onChange={e => handleRowGapChange(Number(e.target.value), gapsLinked)}
            />
            <span className="gap-label">Row</span>
          </div>
          <button
            className={`link-btn ${gapsLinked ? 'is-linked' : ''}`}
            onClick={handleToggleLink}
          >
            {gapsLinked ? <Link2 size={16} /> : <Link2Off size={16} />}
          </button>
        </div>
      </div>

      {/* Grid-only: Auto Flow and Justify Items */}
      {isGrid && (
        <>
          {/* Auto Flow Dropdown */}
          <div className="field">
            <span className="field-label">
              Auto Flow <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
            </span>
            <div className="dropdown-wrapper">
              <select
                className="dropdown"
                value={gridAutoFlow}
                onChange={e => handleGridAutoFlowChange(e.target.value)}
              >
                <option value="row">Row</option>
                <option value="column">Column</option>
                <option value="dense">Dense</option>
                <option value="row dense">Row Dense</option>
                <option value="column dense">Column Dense</option>
              </select>
              <ChevronDown size={14} className="dropdown-icon" />
            </div>
          </div>

          {/* Justify Items (Grid-specific) */}
          <div className="field">
            <span className="field-label">
              Justify Items <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
            </span>
            <div className="button-group">
              {(
                [
                  ['start', AlignHorizontalJustifyStart],
                  ['center', AlignHorizontalJustifyCenter],
                  ['end', AlignHorizontalJustifyEnd],
                  ['stretch', StretchHorizontal],
                ] as [JustifyItems, typeof AlignHorizontalJustifyStart][]
              ).map(([v, Icon]) => (
                <button
                  key={v}
                  className={`group-btn ${justifyItems === v ? 'is-active' : ''}`}
                  onClick={() => handleJustifyItemsChange(v)}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Flex-only wrap control */}
      {!isGrid && (
        <>
          <div className="field">
            <span className="field-label">
              Wrap <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
            </span>
            <div className="button-group">
              <button
                className={`group-btn ${flexWrap === 'nowrap' ? 'is-active' : ''}`}
                onClick={() => handleFlexWrapChange('nowrap')}
              >
                <MoveHorizontal size={16} />
              </button>
              <button
                className={`group-btn ${flexWrap === 'wrap' ? 'is-active' : ''}`}
                onClick={() => handleFlexWrapChange('wrap')}
              >
                <WrapText size={16} />
              </button>
            </div>
          </div>
          <p className="wrap-hint">
            Items within the container can stay in a single line (No wrap), or break into multiple
            lines (Wrap).
          </p>
        </>
      )}
    </Container>
  )
})
