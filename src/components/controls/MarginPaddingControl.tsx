import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Plus, Minus } from 'lucide-react'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'
import { SideValueControl } from './SideValueControl'

interface MarginPaddingControlProps {
  label: string
  unit?: string
  isExpanded?: boolean
}

export const MarginPaddingControl = observer(
  ({ label, unit = 'px', isExpanded = true }: MarginPaddingControlProps) => {
    const [expanded, setExpanded] = useState(isExpanded)

    return (
      <div className="style-field">
        <div className="style-field__header">
          <div className="style-field__label">
            {label}
            <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
          </div>
          <div className="style-field__actions">
            <span className="style-field__link">More options</span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="btn-toggle"
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <Minus size={14} /> : <Plus size={14} />}
            </button>
          </div>
        </div>
        {expanded && (
          <div style={{ marginTop: '0.25rem' }}>
            <SideValueControl side="top" unit={unit} value={10} />
            <SideValueControl side="right" unit={unit} value={20} />
            <SideValueControl side="bottom" unit={unit} value={10} />
            <SideValueControl side="left" unit={unit} value={20} />
          </div>
        )}
      </div>
    )
  }
)
