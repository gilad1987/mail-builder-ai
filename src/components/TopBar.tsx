import { observer } from 'mobx-react-lite'
import { useState, useRef, useEffect } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  Code,
  Download,
  FileJson,
  Monitor,
  Moon,
  RotateCcw,
  Save,
  Smartphone,
  Sun,
  Tablet,
} from 'lucide-react'
import { editorStore } from '../stores/EditorStore'
import { ExportModal } from './ExportModal'

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
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExportJSON = () => {
    editorStore.downloadJSON()
    setShowExportMenu(false)
  }

  const handleExportHTML = () => {
    setShowExportModal(true)
    setShowExportMenu(false)
  }

  return (
    <>
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
          <div className="export-dropdown" ref={exportMenuRef}>
            <button
              className="btn-secondary"
              title="Export"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={16} />
              <span>Export</span>
              <ChevronDown size={14} />
            </button>
            {showExportMenu && (
              <div className="export-dropdown__menu">
                <button className="export-dropdown__item" onClick={handleExportJSON}>
                  <FileJson size={16} />
                  <span>Export JSON</span>
                </button>
                <button className="export-dropdown__item" onClick={handleExportHTML}>
                  <Code size={16} />
                  <span>Export HTML</span>
                </button>
              </div>
            )}
          </div>
          <button className="btn-primary" title="Save">
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      </header>
      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
    </>
  )
})
