import { observer } from 'mobx-react-lite'
import { Square, Maximize2 } from 'lucide-react'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'

interface BorderRadiusControlProps {
  value?: number
}

export const BorderRadiusControl = observer(({ value = 0 }: BorderRadiusControlProps) => (
  <div className="style-field">
    <div className="style-field__label">
      Border
      <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
    </div>
    <div className="border-inputs__label">Radius</div>
    <div className="radius-controls">
      <button className="btn-border-style" title="Sharp Corners">
        <Square size={16} strokeWidth={1.5} />
      </button>
      <button className="btn-border-style" title="Pill Shape">
        <Maximize2 size={16} strokeWidth={1.5} />
      </button>
      <input
        type="range"
        min="0"
        max="30"
        defaultValue={value}
        className="side-control__slider"
        style={{ flexGrow: 1 }}
      />
      <input
        type="number"
        defaultValue={value}
        className="side-control__input"
        style={{ textAlign: 'center', backgroundColor: '#f9fafb' }}
      />
    </div>
  </div>
))
