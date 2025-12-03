import { observer } from 'mobx-react-lite'
import {
  ChevronLeft,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Download,
  Save,
  Sun,
  Moon,
} from 'lucide-react'
import { editorStore } from '../stores/EditorStore'

type DeviceType = 'desktop' | 'tablet' | 'mobile'

interface DeviceButtonProps {
  device: DeviceType
  icon: typeof Monitor
  label: string
}

const DeviceButton = observer(({ device, icon: Icon, label }: DeviceButtonProps) => (
  <button
    onClick={() => editorStore.setActiveDevice(device)}
    className={`btn-device ${editorStore.activeDevice === device ? 'btn-device--active' : ''}`}
    title={label}
  >
    <Icon size={18} />
  </button>
))

export const TopBar = observer(() => {
  return (
    <header className="header-bar">
      <div className="header-bar__left">
        <ChevronLeft size={20} className="btn-ghost" />
        <span className="header-bar__title">Design Editor</span>
      </div>

      <div className="header-bar__center">
        <DeviceButton device="desktop" icon={Monitor} label="Desktop View" />
        <DeviceButton device="tablet" icon={Tablet} label="Tablet View" />
        <DeviceButton device="mobile" icon={Smartphone} label="Mobile View" />
      </div>

      <div className="header-bar__right">
        <button
          className="btn-ghost"
          title={editorStore.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={() => editorStore.toggleTheme()}
        >
          {editorStore.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="btn-ghost" title="Undo">
          <RotateCcw size={18} />
        </button>
        <button className="btn-secondary" title="Export">
          <Download size={16} />
          <span>Export</span>
        </button>
        <button className="btn-primary" title="Save">
          <Save size={16} />
          <span>Save</span>
        </button>
      </div>
    </header>
  )
})
