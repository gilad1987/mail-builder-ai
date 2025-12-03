import { UnitDropdown } from './UnitDropdown'

interface DimensionInputProps {
  label: string
  value: string
  unit?: string
}

export const DimensionInput = ({ label, value, unit = 'px' }: DimensionInputProps) => (
  <div className="dimension-input">
    <div className="dimension-input__label">{label}</div>
    <div className="dimension-input__group">
      <input type="text" defaultValue={value} style={{ textAlign: 'right' }} />
      {label === 'Width' || label === 'Height' ? (
        <UnitDropdown unit={unit} />
      ) : (
        <span className="dimension-input__unit">px</span>
      )}
    </div>
  </div>
)
