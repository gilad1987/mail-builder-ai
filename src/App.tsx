import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { editorStore } from './stores/EditorStore'
import { TopBar } from './components/TopBar'
import { BlockSelectPanel } from './components/BlockSelectPanel'
import { Sidebar } from './components/Sidebar'
import { Canvas } from './components/Canvas'
import { IconSidebar } from './components/IconSidebar'
import { GlobalStylesPanel } from './components/GlobalStylesPanel'
import { LayersPanel } from './components/LayersPanel'
import { AssetsPanel } from './components/AssetsPanel'
import { AIAssistantPanel } from './components/aiAssistant'
import { DndProvider } from './components/dnd'
import './styles/main.scss'

const App = observer(() => {
  const [activePanel, setActivePanel] = useState<string | null>('elements')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', editorStore.theme)
  }, [])

  const renderPanel = () => {
    if (activePanel === 'styles') {
      return <GlobalStylesPanel onClose={() => setActivePanel(null)} />
    }
    if (activePanel === 'layers') {
      return <LayersPanel />
    }
    if (activePanel === 'assets') {
      return <AssetsPanel onClose={() => setActivePanel(null)} />
    }
    if (activePanel === 'ai') {
      return <AIAssistantPanel onClose={() => setActivePanel(null)} />
    }
    if (activePanel === 'elements') {
      return editorStore.hasSelectedBlock ? <Sidebar /> : <BlockSelectPanel />
    }
    return null
  }

  return (
    <DndProvider>
      <div className="app-layout">
        <TopBar />
        <div className="main-content">
          <IconSidebar activePanel={activePanel} onPanelChange={setActivePanel} />
          {renderPanel()}
          <Canvas />
        </div>
      </div>
    </DndProvider>
  )
})

export default App
