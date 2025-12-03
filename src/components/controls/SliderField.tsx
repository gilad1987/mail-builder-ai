import { observer } from 'mobx-react-lite'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'

interface SliderFieldProps {
  label: string
  value: string
  unit?: string
  responsive?: boolean
}

export const SliderField = observer(
  ({ label, value, unit = 'px', responsive = true }: SliderFieldProps) => (
    <div className="style-field">
      <div className="style-field__header">
        <div className="style-field__label">
          {label}
          <ResponsiveIcon device={editorStore.activeDevice} responsive={responsive} />
        </div>
        <span className="side-control__unit">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="64"
        defaultValue={value}
        className="side-control__slider"
        style={{ width: '100%' }}
      />
    </div>
  )
)
