import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import {
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalSpaceBetween,
  AlignHorizontalSpaceAround,
  AlignHorizontalDistributeCenter,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  StretchHorizontal,
  Link2,
  Link2Off,
  WrapText,
  MoveHorizontal,
} from 'lucide-react'
import { tokens } from '../../../styles/tokens'
import { editorStore } from '../../../stores/EditorStore'
import { ResponsiveIcon } from '../ResponsiveIcon'

const Container = styled.div`
  padding-top: ${tokens.spacing[3]};
  border-top: 1px solid ${tokens.colors.gray[200]};
  margin-top: ${tokens.spacing[2]};

  .items-title {
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.semibold};
    color: ${tokens.colors.gray[800]};
    margin-bottom: ${tokens.spacing[3]};
  }
  .field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${tokens.spacing[2]} 0;
    border-bottom: 1px solid ${tokens.colors.gray[100]};
  }
  .field-label {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[1]};
    font-size: ${tokens.fontSize.sm};
    color: ${tokens.colors.gray[700]};
  }
  .button-group {
    display: flex;
    border: 1px solid ${tokens.colors.gray[300]};
    border-radius: ${tokens.borderRadius.md};
    overflow: hidden;
  }
  .group-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${tokens.spacing[1]};
    background: white;
    border: none;
    border-right: 1px solid ${tokens.colors.gray[300]};
    color: ${tokens.colors.gray[500]};
    cursor: pointer;
    transition: all ${tokens.transition.fast};
    &:last-child {
      border-right: none;
    }
    &:hover {
      background: ${tokens.colors.gray[100]};
      color: ${tokens.colors.blue[500]};
    }
    &.is-active {
      background: ${tokens.colors.gray[100]};
      color: ${tokens.colors.blue[500]};
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
    background: ${tokens.colors.gray[50]};
    border: 1px solid ${tokens.colors.gray[300]};
    border-radius: ${tokens.borderRadius.sm};
    color: ${tokens.colors.gray[700]};
  }
  .gap-label {
    font-size: ${tokens.fontSize.xs};
    color: ${tokens.colors.gray[500]};
    text-align: center;
  }
  .link-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${tokens.spacing[1]};
    background: ${tokens.colors.gray[100]};
    border: none;
    border-radius: ${tokens.borderRadius.sm};
    color: ${tokens.colors.gray[500]};
    cursor: pointer;
    &:hover {
      color: ${tokens.colors.gray[700]};
    }
    &.is-linked {
      color: ${tokens.colors.blue[500]};
    }
  }
  .unit-selector {
    font-size: ${tokens.fontSize.xs};
    color: ${tokens.colors.gray[500]};
  }
  .wrap-hint {
    font-size: ${tokens.fontSize.xs};
    font-style: italic;
    color: ${tokens.colors.gray[500]};
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

export const ContainerItemsSection = observer(() => {
  const [direction, setDirection] = useState<FlexDirection>('row')
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('flex-start')
  const [alignItems, setAlignItems] = useState<AlignItems>('flex-start')
  const [columnGap, setColumnGap] = useState(20)
  const [rowGap, setRowGap] = useState(20)
  const [gapsLinked, setGapsLinked] = useState(true)
  const [flexWrap, setFlexWrap] = useState<'nowrap' | 'wrap'>('nowrap')

  const handleColumnGap = (v: number) => {
    setColumnGap(v)
    if (gapsLinked) setRowGap(v)
  }
  const handleRowGap = (v: number) => {
    setRowGap(v)
    if (gapsLinked) setColumnGap(v)
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
              onClick={() => setDirection(d)}
            >
              {
                [
                  <ArrowRight size={16} />,
                  <ArrowDown size={16} />,
                  <ArrowLeft size={16} />,
                  <ArrowUp size={16} />,
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
            onClick={() => setJustifyContent(v)}
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
              onClick={() => setAlignItems(v)}
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
          <span className="unit-selector">px ▾</span>
        </div>
        <div className="gaps-row">
          <div className="gap-input-group">
            <input
              type="number"
              className="gap-input"
              value={columnGap}
              onChange={e => handleColumnGap(Number(e.target.value))}
            />
            <span className="gap-label">Column</span>
          </div>
          <div className="gap-input-group">
            <input
              type="number"
              className="gap-input"
              value={rowGap}
              onChange={e => handleRowGap(Number(e.target.value))}
            />
            <span className="gap-label">Row</span>
          </div>
          <button
            className={`link-btn ${gapsLinked ? 'is-linked' : ''}`}
            onClick={() => setGapsLinked(!gapsLinked)}
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
            onClick={() => setFlexWrap('nowrap')}
          >
            <MoveHorizontal size={16} />
          </button>
          <button
            className={`group-btn ${flexWrap === 'wrap' ? 'is-active' : ''}`}
            onClick={() => setFlexWrap('wrap')}
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
