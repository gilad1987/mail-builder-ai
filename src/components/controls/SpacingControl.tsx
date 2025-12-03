import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Minus, MoveDown, MoveLeft, MoveRight, MoveUp, Plus } from 'lucide-react'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'

interface SpacingControlProps {
  label: 'Margin' | 'Padding'
  unit?: string
}

type Side = 'top' | 'right' | 'bottom' | 'left'

const sideMap: Record<Side, { icon: React.FC<{ size?: number }>; capitalize: string }> = {
  top: { icon: MoveUp, capitalize: 'Top' },
  right: { icon: MoveRight, capitalize: 'Right' },
  bottom: { icon: MoveDown, capitalize: 'Bottom' },
  left: { icon: MoveLeft, capitalize: 'Left' },
}

export const SpacingControl = observer(({ label, unit = 'px' }: SpacingControlProps) => {
  const [mergedMode, setMergedMode] = useState(true)
  const element = editorStore.selectedElement
  const device = editorStore.activeDevice
  const property = label.toLowerCase() // 'margin' or 'padding'

  // Get value for a specific side from the model
  const getSideValue = (side: Side): number => {
    if (!element) return 0
    const sizeKey = `${property}${sideMap[side].capitalize}-size`
    const style = element._style[device]
    const value = style[sizeKey] ?? element._style.desktop[sizeKey] ?? 0
    return typeof value === 'number' ? value : 0
  }

  // Get computed "all" value (average or common value)
  const getAllValue = (): number => {
    const values = (['top', 'right', 'bottom', 'left'] as Side[]).map(getSideValue)
    // If all values are the same, return that value
    if (values.every(v => v === values[0])) return values[0]
    // Otherwise return the average
    return Math.round(values.reduce((a, b) => a + b, 0) / 4)
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
            value={allValue}
            onChange={e => handleAllChange(Number(e.target.value))}
            className="spacing-control__slider"
            disabled={!element}
          />
          <div className="spacing-control__input-group">
            <input
              type="number"
              min={0}
              value={allValue}
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
              unit={unit}
              onChange={handleSideChange}
              disabled={!element}
            />
          ))}
        </div>
      )}
    </div>
  )
})

interface SideRowProps {
  side: Side
  icon: React.FC<{ size?: number }>
  value: number
  unit: string
  onChange: (side: Side, value: number) => void
  disabled?: boolean
}

const SideRow = ({ side, icon: Icon, value, unit, onChange, disabled }: SideRowProps) => (
  <div className="spacing-control__side-row">
    <span className="spacing-control__side-icon">
      <Icon size={14} />
    </span>
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={e => onChange(side, Number(e.target.value))}
      className="spacing-control__slider"
      disabled={disabled}
    />
    <div className="spacing-control__input-group">
      <input
        type="number"
        min={0}
        value={value}
        onChange={e => onChange(side, Number(e.target.value))}
        className="spacing-control__input"
        disabled={disabled}
      />
      <span className="spacing-control__unit">{unit}</span>
    </div>
  </div>
)
