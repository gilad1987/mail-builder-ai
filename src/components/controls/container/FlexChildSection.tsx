import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import {
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalDistributeCenter,
  ArrowLeftToLine,
  ArrowRightToLine,
  MoreVertical,
  Ban,
  MoveHorizontal,
  Shrink,
} from 'lucide-react'
import { tokens } from '../../../styles/tokens'
import { editorStore } from '../../../stores/EditorStore'
import { ResponsiveIcon } from '../ResponsiveIcon'

const Container = styled.div`
  padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
  border-top: 1px solid var(--border-color);

  .field {
    margin-bottom: ${tokens.spacing[3]};
  }

  .field-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${tokens.spacing[2]};
  }

  .field-label {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[1]};
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    color: var(--text-primary);
  }

  .field-hint {
    font-size: ${tokens.fontSize.xs};
    font-style: italic;
    color: var(--text-secondary);
    margin-bottom: ${tokens.spacing[3]};
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
    padding: ${tokens.spacing[2]};
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
`

type AlignSelf = 'flex-start' | 'center' | 'flex-end' | 'stretch'
type FlexSize = 'auto' | 'grow' | 'shrink'

export const FlexChildSection = observer(() => {
  const element = editorStore.selectedElement
  if (!element) return null

  const style = element.style
  const alignSelf = (style.alignSelf as AlignSelf) || 'flex-start'
  const order = (style.order as number) || 0
  const flexGrow = (style.flexGrow as number) || 0
  const flexShrink = (style.flexShrink as number) || 1

  // Determine current size mode
  const getFlexSize = (): FlexSize => {
    if (flexGrow === 1) return 'grow'
    if (flexShrink === 1 && flexGrow === 0) return 'shrink'
    return 'auto'
  }

  const handleAlignSelfChange = (value: AlignSelf) => {
    editorStore.updateSelectedStyle('alignSelf', value)
  }

  const handleOrderChange = (direction: 'first' | 'last') => {
    // Simple implementation - set order to -1 for first, 999 for last
    const newOrder = direction === 'first' ? -1 : 999
    editorStore.updateSelectedStyle('order', newOrder)
  }

  const handleSizeChange = (size: FlexSize) => {
    switch (size) {
      case 'auto':
        editorStore.updateSelectedStyle('flexGrow', 0)
        editorStore.updateSelectedStyle('flexShrink', 0)
        break
      case 'grow':
        editorStore.updateSelectedStyle('flexGrow', 1)
        editorStore.updateSelectedStyle('flexShrink', 1)
        break
      case 'shrink':
        editorStore.updateSelectedStyle('flexGrow', 0)
        editorStore.updateSelectedStyle('flexShrink', 1)
        break
    }
  }

  const iconProps = { size: 16, strokeWidth: 0.75 }

  return (
    <Container>
      {/* Align Self */}
      <div className="field">
        <div className="field-header">
          <span className="field-label">
            Align Self <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
          </span>
          <div className="button-group">
            <button
              className={`group-btn ${alignSelf === 'flex-start' ? 'is-active' : ''}`}
              onClick={() => handleAlignSelfChange('flex-start')}
              title="Start"
            >
              <AlignVerticalJustifyStart {...iconProps} />
            </button>
            <button
              className={`group-btn ${alignSelf === 'center' ? 'is-active' : ''}`}
              onClick={() => handleAlignSelfChange('center')}
              title="Center"
            >
              <AlignVerticalJustifyCenter {...iconProps} />
            </button>
            <button
              className={`group-btn ${alignSelf === 'flex-end' ? 'is-active' : ''}`}
              onClick={() => handleAlignSelfChange('flex-end')}
              title="End"
            >
              <AlignVerticalJustifyEnd {...iconProps} />
            </button>
            <button
              className={`group-btn ${alignSelf === 'stretch' ? 'is-active' : ''}`}
              onClick={() => handleAlignSelfChange('stretch')}
              title="Stretch"
            >
              <AlignVerticalDistributeCenter {...iconProps} />
            </button>
          </div>
        </div>
        <p className="field-hint">This control will affect contained elements only.</p>
      </div>

      {/* Order */}
      <div className="field">
        <div className="field-header">
          <span className="field-label">
            Order <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
          </span>
          <div className="button-group">
            <button
              className={`group-btn ${order < 0 ? 'is-active' : ''}`}
              onClick={() => handleOrderChange('first')}
              title="Move to first"
            >
              <ArrowLeftToLine {...iconProps} />
            </button>
            <button
              className={`group-btn ${order > 0 ? 'is-active' : ''}`}
              onClick={() => handleOrderChange('last')}
              title="Move to last"
            >
              <ArrowRightToLine {...iconProps} />
            </button>
            <button className="group-btn" title="More options">
              <MoreVertical {...iconProps} />
            </button>
          </div>
        </div>
        <p className="field-hint">This control will affect contained elements only.</p>
      </div>

      {/* Size */}
      <div className="field">
        <div className="field-header">
          <span className="field-label">
            Size <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
          </span>
          <div className="button-group">
            <button
              className={`group-btn ${getFlexSize() === 'auto' ? 'is-active' : ''}`}
              onClick={() => handleSizeChange('auto')}
              title="None (auto)"
            >
              <Ban {...iconProps} />
            </button>
            <button
              className={`group-btn ${getFlexSize() === 'grow' ? 'is-active' : ''}`}
              onClick={() => handleSizeChange('grow')}
              title="Grow to fill"
            >
              <MoveHorizontal {...iconProps} />
            </button>
            <button
              className={`group-btn ${getFlexSize() === 'shrink' ? 'is-active' : ''}`}
              onClick={() => handleSizeChange('shrink')}
              title="Shrink to fit"
            >
              <Shrink {...iconProps} />
            </button>
            <button className="group-btn" title="More options">
              <MoreVertical {...iconProps} />
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
})
