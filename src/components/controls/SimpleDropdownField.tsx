import { observer } from 'mobx-react-lite'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'

interface SimpleDropdownFieldProps {
  label: string
  value: string
  responsive?: boolean
}

export const SimpleDropdownField = observer(
  ({ label, value, responsive = true }: SimpleDropdownFieldProps) => (
    <div className="style-field">
      <div className="style-field__label">
        {label}
        <ResponsiveIcon device={editorStore.activeDevice} responsive={responsive} />
      </div>
      <div className="dimension-input__group">
        <input type="text" defaultValue={value} />
      </div>
    </div>
  )
)
