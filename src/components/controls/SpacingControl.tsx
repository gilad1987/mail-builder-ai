import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Plus, Minus, MoveUp, MoveDown, MoveLeft, MoveRight } from 'lucide-react'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'

interface SpacingControlProps {
  label: 'Margin' | 'Padding'
  unit?: string
}

export const SpacingControl = observer(({ label, unit = 'px' }: SpacingControlProps) => {
  const [mergedMode, setMergedMode] = useState(true)
  const [allValue, setAllValue] = useState(0)
  const [values, setValues] = useState({ top: 0, right: 0, bottom: 0, left: 0 })

  const handleAllChange = (value: number) => {
    setAllValue(value)
    setValues({ top: value, right: value, bottom: value, left: value })
  }

  const handleSideChange = (side: keyof typeof values, value: number) => {
    setValues(prev => ({ ...prev, [side]: value }))
  }

  return (
    <div className="style-field spacing-control">
      <div className="style-field__header">
        <div className="style-field__label">
          {label}
          <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
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
          />
          <div className="spacing-control__input-group">
            <input
              type="number"
              min={0}
              value={allValue}
              onChange={e => handleAllChange(Number(e.target.value))}
              className="spacing-control__input"
            />
            <span className="spacing-control__unit">{unit}</span>
          </div>
        </div>
      ) : (
        <div className="spacing-control__sides">
          <SideRow
            side="top"
            icon={MoveUp}
            value={values.top}
            unit={unit}
            onChange={handleSideChange}
          />
          <SideRow
            side="right"
            icon={MoveRight}
            value={values.right}
            unit={unit}
            onChange={handleSideChange}
          />
          <SideRow
            side="bottom"
            icon={MoveDown}
            value={values.bottom}
            unit={unit}
            onChange={handleSideChange}
          />
          <SideRow
            side="left"
            icon={MoveLeft}
            value={values.left}
            unit={unit}
            onChange={handleSideChange}
          />
        </div>
      )}
    </div>
  )
})

interface SideRowProps {
  side: 'top' | 'right' | 'bottom' | 'left'
  icon: React.FC<{ size?: number }>
  value: number
  unit: string
  onChange: (side: 'top' | 'right' | 'bottom' | 'left', value: number) => void
}

const SideRow = ({ side, icon: Icon, value, unit, onChange }: SideRowProps) => (
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
    />
    <div className="spacing-control__input-group">
      <input
        type="number"
        min={0}
        value={value}
        onChange={e => onChange(side, Number(e.target.value))}
        className="spacing-control__input"
      />
      <span className="spacing-control__unit">{unit}</span>
    </div>
  </div>
)
