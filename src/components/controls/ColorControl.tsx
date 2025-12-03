import { observer } from 'mobx-react-lite'
import { RotateCcw } from 'lucide-react'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'

interface ColorControlProps {
  label: string
  colorValue?: string
  hasColorPicker?: boolean
  responsive?: boolean
}

export const ColorControl = observer(
  ({
    label,
    colorValue = '#000000',
    hasColorPicker = true,
    responsive = true,
  }: ColorControlProps) => (
    <div className="style-field">
      <div className="style-field__header">
        <div className="style-field__label">
          {label}
          <ResponsiveIcon device={editorStore.activeDevice} responsive={responsive} />
        </div>
        <div className="style-field__actions">
          <button className="btn-ghost" title="Reset to default" style={{ padding: '0.125rem' }}>
            <RotateCcw size={14} />
          </button>
          {hasColorPicker && (
            <div className="color-swatch" style={{ backgroundColor: colorValue }} />
          )}
        </div>
      </div>
    </div>
  )
)
