import { observer } from 'mobx-react-lite'
import { editorStore } from '../../stores/EditorStore'

interface DimensionInputProps {
  label: string
  styleProperty: string
  defaultValue?: number
  defaultUnit?: string
}

const units = ['px', '%', 'vw', 'em', 'auto']

export const DimensionInput = observer(
  ({ label, styleProperty, defaultValue = 0, defaultUnit = 'px' }: DimensionInputProps) => {
    const element = editorStore.selectedElement
    const device = editorStore.activeDevice

    // Get size value from model
    const getSizeValue = (): string => {
      if (!element) return ''
      const sizeKey = `${styleProperty}-size`
      const style = element._style[device]
      const value = style[sizeKey] ?? element._style.desktop[sizeKey]
      if (value === undefined || value === null) return ''
      return String(value)
    }

    // Get unit value from model
    const getUnitValue = (): string => {
      if (!element) return defaultUnit
      const unitKey = `${styleProperty}-unit`
      const style = element._style[device]
      const value = style[unitKey] ?? element._style.desktop[unitKey] ?? defaultUnit
      return typeof value === 'string' ? value : defaultUnit
    }

    // Update size in model
    const handleSizeChange = (value: string) => {
      if (!element) return
      const numValue = value === '' ? undefined : Number(value)
      element.update(`${styleProperty}-size`, numValue)
      // Ensure unit is set when size is set
      if (numValue !== undefined) {
        const currentUnit = getUnitValue()
        element.update(`${styleProperty}-unit`, currentUnit)
      }
    }

    // Update unit in model
    const handleUnitChange = (unit: string) => {
      if (!element) return
      element.update(`${styleProperty}-unit`, unit)
    }

    const sizeValue = getSizeValue()
    const unitValue = getUnitValue()

    return (
      <div className="dimension-input">
        <div className="dimension-input__label">{label}</div>
        <div className="dimension-input__group">
          <input
            type="number"
            value={sizeValue}
            onChange={(e) => handleSizeChange(e.target.value)}
            placeholder={String(defaultValue)}
            disabled={!element || unitValue === 'auto'}
          />
          <div className="unit-dropdown">
            <select
              value={unitValue}
              onChange={(e) => handleUnitChange(e.target.value)}
              disabled={!element}
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <div className="unit-dropdown__icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
