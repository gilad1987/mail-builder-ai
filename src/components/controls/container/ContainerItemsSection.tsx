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
`

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch'
type FlexWrap = 'nowrap' | 'wrap'

export const ContainerItemsSection = observer(() => {
  const element = editorStore.selectedElement
  if (!element) return null

  const style = element.style
  const deviceStyle = element._style[editorStore.activeDevice]

  // Get current values from model
  const direction = (style.flexDirection as FlexDirection) || 'row'
  const justifyContent = (style.justifyContent as JustifyContent) || 'flex-start'
  const alignItems = (style.alignItems as AlignItems) || 'flex-start'
  const flexWrap = (style.flexWrap as FlexWrap) || 'nowrap'

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
      <div className="field">
        <span className="field-label">
          Direction <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
        </span>
        <div className="button-group">
          {(['row', 'column', 'row-reverse', 'column-reverse'] as FlexDirection[]).map((d, i) => (
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
          ))}
        </div>
      </div>
      <div className="field">
        <span className="field-label">
          Justify Content <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
        </span>
      </div>
      <div className="button-group" style={{ marginBottom: tokens.spacing[3] }}>
        {(
          [
            ['flex-start', AlignHorizontalJustifyStart],
            ['flex-end', AlignHorizontalJustifyEnd],
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
              ['flex-start', AlignStartVertical],
              ['center', AlignCenterVertical],
              ['flex-end', AlignEndVertical],
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
        Items within the container can stay in a single line (No wrap), or break into multiple lines
        (Wrap).
      </p>
    </Container>
  )
})
