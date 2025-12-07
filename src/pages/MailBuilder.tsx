import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { editorStore } from '../stores/EditorStore'
import { TopBar } from '../components/TopBar'
import { BlockSelectPanel } from '../components/BlockSelectPanel'
import { Sidebar } from '../components/Sidebar'
import { Canvas } from '../components/canvas'
import { IconSidebar } from '../components/IconSidebar'
import { GlobalStylesPanel } from '../components/GlobalStylesPanel'
import { HistoryPanel } from '../components/HistoryPanel'
import { LayersPanel } from '../components/LayersPanel'
import { AssetsPanel } from '../components/AssetsPanel'
import { AIAssistantPanel } from '../components/aiAssistant'
import { DndProvider } from '../components/dnd'
import type { BoxJSON, GlobalStyles } from '../models'

export const MailBuilder = observer(() => {
  const { templateId } = useParams<{ templateId: string }>()
  const [activePanel, setActivePanel] = useState<string | null>('elements')
  const [layersPanelOpen, setLayersPanelOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', editorStore.theme)
  }, [])

  // Load template from URL param
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) return

      try {
        let templateData
        switch (templateId) {
          case 'welcome-onboarding':
            templateData = (await import('../assets/email-templates/welcome-onboarding.json'))
              .default
            break
          case 'product-newsletter':
            templateData = (await import('../assets/email-templates/product-newsletter.json'))
              .default
            break
          case 'promotional-sale':
            templateData = (await import('../assets/email-templates/promotional-sale.json')).default
            break
        }
        if (templateData) {
          editorStore.importFromJSON(templateData as BoxJSON & { globalStyles?: GlobalStyles })
        }
      } catch (error) {
        console.error('Failed to load template:', error)
      }
    }

    loadTemplate()
  }, [templateId])

  const renderPanel = () => {
    if (activePanel === 'styles') {
      return <GlobalStylesPanel onClose={() => setActivePanel(null)} />
    }
    if (activePanel === 'history') {
      return <HistoryPanel onClose={() => setActivePanel(null)} />
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
          <LayersPanel
            isOpen={layersPanelOpen}
            onToggle={() => setLayersPanelOpen(!layersPanelOpen)}
          />
        </div>
      </div>
    </DndProvider>
  )
})
