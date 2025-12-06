import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Minus, MoveDown, MoveLeft, MoveRight, MoveUp, Plus } from 'lucide-react'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'

interface SpacingControlProps {
  label: 'Margin' | 'Padding'
  unit?: string
  defaultValue?: number
  /** Optional custom property prefix (e.g., 'containerPadding' instead of 'padding') */
  propertyPrefix?: string
}

type Side = 'top' | 'right' | 'bottom' | 'left'

const sideMap: Record<Side, { icon: React.FC<{ size?: number }>; capitalize: string }> = {
  top: { icon: MoveUp, capitalize: 'Top' },
  right: { icon: MoveRight, capitalize: 'Right' },
  bottom: { icon: MoveDown, capitalize: 'Bottom' },
  left: { icon: MoveLeft, capitalize: 'Left' },
}

export const SpacingControl = observer(
  ({ label, unit = 'px', defaultValue = 20, propertyPrefix }: SpacingControlProps) => {
    const [mergedMode, setMergedMode] = useState(true)
    const element = editorStore.selectedElement
    const device = editorStore.activeDevice
    const property = propertyPrefix || label.toLowerCase() // 'margin' or 'padding' or custom

    // Get value for a specific side from the model
    const getSideValue = (side: Side): number | undefined => {
      if (!element) return undefined
      const sideKey = `${property}${sideMap[side].capitalize}-size`
      const shorthandKey = `${property}-size`
      const style = element._style[device]
      const desktopStyle = element._style.desktop
      // Check side-specific first, then shorthand
      const value =
        style[sideKey] ?? style[shorthandKey] ?? desktopStyle[sideKey] ?? desktopStyle[shorthandKey]
      return typeof value === 'number' ? value : undefined
    }

    // Get computed "all" value (average or common value)
    const getAllValue = (): number | undefined => {
      if (!element) return undefined
      const values = (['top', 'right', 'bottom', 'left'] as Side[]).map(getSideValue)
      // If all values are undefined, return undefined
      if (values.every(v => v === undefined)) return undefined
      // Replace undefined with 0 for calculation
      const numValues = values.map(v => v ?? 0)
      // If all values are the same, return that value
      if (numValues.every(v => v === numValues[0])) return numValues[0]
      // Otherwise return the average
      return Math.round(numValues.reduce((a, b) => a + b, 0) / 4)
    }

    // Update all sides at once
    const handleAllChange = (value: number) => {
      if (!element) return
      const sides: Side[] = ['top', 'right', 'bottom', 'left']
      sides.forEach(side => {
        element.update(`${property}${sideMap[side].capitalize}-size`, value)
        element.update(`${property}${sideMap[side].capitalize}-unit`, unit)
      })
    }

    // Update a specific side
    const handleSideChange = (side: Side, value: number) => {
      if (!element) return
      element.update(`${property}${sideMap[side].capitalize}-size`, value)
      element.update(`${property}${sideMap[side].capitalize}-unit`, unit)
    }

    const allValue = getAllValue()

    return (
      <div className="style-field spacing-control">
        <div className="style-field__header">
          <div className="style-field__label">
            {label}
            <ResponsiveIcon device={device} responsive={true} />
          </div>
          <div className="style-field__actions">
            <span className="style-field__link" onClick={() => setMergedMode(!mergedMode)}>
              More options
            </span>
            <button
              onClick={() => setMergedMode(!mergedMode)}
              className="btn-toggle"
              title={mergedMode ? 'Expand' : 'Collapse'}
            >
              {mergedMode ? <Plus size={14} /> : <Minus size={14} />}
            </button>
          </div>
        </div>

        {mergedMode ? (
          <div className="spacing-control__merged">
            <input
              type="range"
              min={0}
              max={100}
              value={allValue ?? defaultValue}
              onChange={e => handleAllChange(Number(e.target.value))}
              className="spacing-control__slider"
              disabled={!element}
            />
            <div className="spacing-control__input-group">
              <input
                type="number"
                min={0}
                value={allValue ?? ''}
                placeholder={String(defaultValue)}
                onChange={e => handleAllChange(Number(e.target.value))}
                className="spacing-control__input"
                disabled={!element}
              />
              <span className="spacing-control__unit">{unit}</span>
            </div>
          </div>
        ) : (
          <div className="spacing-control__sides">
            {(['top', 'right', 'bottom', 'left'] as Side[]).map(side => (
              <SideRow
                key={side}
                side={side}
                icon={sideMap[side].icon}
                value={getSideValue(side)}
                defaultValue={defaultValue}
                unit={unit}
                onChange={handleSideChange}
                disabled={!element}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)

interface SideRowProps {
  side: Side
  icon: React.FC<{ size?: number }>
  value: number | undefined
  defaultValue: number
  unit: string
  onChange: (side: Side, value: number) => void
  disabled?: boolean
}

const SideRow = ({
  side,
  icon: Icon,
  value,
  defaultValue,
  unit,
  onChange,
  disabled,
}: SideRowProps) => (
  <div className="spacing-control__side-row">
    <span className="spacing-control__side-icon">
      <Icon size={14} />
    </span>
    <input
      type="range"
      min={0}
      max={100}
      value={value ?? defaultValue}
      onChange={e => onChange(side, Number(e.target.value))}
      className="spacing-control__slider"
      disabled={disabled}
    />
    <div className="spacing-control__input-group">
      <input
        type="number"
        min={0}
        value={value ?? ''}
        placeholder={String(defaultValue)}
        onChange={e => onChange(side, Number(e.target.value))}
        className="spacing-control__input"
        disabled={disabled}
      />
      <span className="spacing-control__unit">{unit}</span>
    </div>
  </div>
)
