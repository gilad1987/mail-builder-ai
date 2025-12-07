import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  ChevronLeft,
  Code,
  Download,
  FileJson,
  Monitor,
  Moon,
  Redo2,
  Save,
  Send,
  Smartphone,
  Sun,
  Tablet,
  Undo2,
  Upload,
} from 'lucide-react'
import { editorStore } from '../stores/EditorStore'
import { ExportModal } from './ExportModal'
import { SendTestModal } from './SendTestModal'

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
  const navigate = useNavigate()
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSendTestModal, setShowSendTestModal] = useState(false)
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

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          editorStore.redo()
        } else {
          editorStore.undo()
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault()
        editorStore.redo()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleExportJSON = () => {
    editorStore.downloadJSON()
    setShowExportMenu(false)
  }

  const handleExportHTML = () => {
    setShowExportModal(true)
    setShowExportMenu(false)
  }

  const handleImportJSON = () => {
    editorStore.openImportDialog()
  }

  return (
    <>
      <header className="header-bar">
        <div className="header-bar__left">
          <button
            className="btn-ghost"
            onClick={() => navigate('/templates')}
            title="Back to Templates"
          >
            <ChevronLeft size={20} />
          </button>
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
          <button
            className="btn-ghost"
            title="Undo (Ctrl+Z)"
            onClick={() => editorStore.undo()}
            disabled={!editorStore.canUndo}
          >
            <Undo2 size={18} />
          </button>
          <button
            className="btn-ghost"
            title="Redo (Ctrl+Shift+Z)"
            onClick={() => editorStore.redo()}
            disabled={!editorStore.canRedo}
          >
            <Redo2 size={18} />
          </button>
          <button
            className="btn-secondary"
            title="Send Test Email"
            onClick={() => setShowSendTestModal(true)}
          >
            <Send size={16} />
            <span>Send Test</span>
          </button>
          <button className="btn-ghost" title="Import JSON" onClick={handleImportJSON}>
            <Upload size={18} />
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
      <SendTestModal isOpen={showSendTestModal} onClose={() => setShowSendTestModal(false)} />
    </>
  )
})
