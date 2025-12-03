import { observer } from 'mobx-react-lite'
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'

interface HorizontalAlignControlProps {
  selectedAlign: 'left' | 'center' | 'right'
}

export const HorizontalAlignControl = observer(({ selectedAlign }: HorizontalAlignControlProps) => (
  <div className="style-field">
    <p className="style-field__label">
      Horizontal align
      <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
    </p>
    <div className="align-group">
      <button
        className={`align-btn ${selectedAlign === 'left' ? 'align-btn--active' : ''}`}
        aria-label="Align left"
      >
        <AlignLeft size={16} />
      </button>
      <button
        className={`align-btn ${selectedAlign === 'center' ? 'align-btn--active' : ''}`}
        aria-label="Align center"
      >
        <AlignCenter size={16} />
      </button>
      <button
        className={`align-btn ${selectedAlign === 'right' ? 'align-btn--active' : ''}`}
        aria-label="Align right"
      >
        <AlignRight size={16} />
      </button>
    </div>
  </div>
))
