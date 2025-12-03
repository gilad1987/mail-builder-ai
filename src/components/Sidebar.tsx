import { observer } from 'mobx-react-lite'
import { ChevronLeft, Settings } from 'lucide-react'
import { editorStore } from '../stores/EditorStore'
import { ResponsiveIcon } from './controls'
import { ContainerTab, ContentTab, StyleTab } from './sidebarTabs'

export const Sidebar = observer(() => {
  const blockType = editorStore.selectedBlockId ? 'ParagraphBlock' : 'Add Elements'

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__back" onClick={() => editorStore.setSelectedBlock(null)}>
          <ChevronLeft size={20} />
          <h2 className="sidebar__title">{blockType}</h2>
        </div>
        <Settings size={20} style={{ color: '#6b7280', cursor: 'pointer' }} />
      </div>

      <div className="device-indicator">
        <span className="device-indicator__text">
          Editing styles for <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
          <span className="device-indicator__device">
            {editorStore.deviceLabels[editorStore.activeDevice]}
          </span>
        </span>
      </div>

      <div className="tabs">
        <button
          className={`tabs__btn ${editorStore.activeTab === 'Content' ? 'tabs__btn--active' : ''}`}
          onClick={() => editorStore.setActiveTab('Content')}
        >
          Content
        </button>
        <button
          className={`tabs__btn ${editorStore.activeTab === 'Style' ? 'tabs__btn--active' : ''}`}
          onClick={() => editorStore.setActiveTab('Style')}
        >
          Style
        </button>
        <button
          className={`tabs__btn ${editorStore.activeTab === 'Container' ? 'tabs__btn--active' : ''}`}
          onClick={() => editorStore.setActiveTab('Container')}
        >
          Container
        </button>
      </div>

      <div className="tab-content">
        {editorStore.activeTab === 'Content' && <ContentTab />}
        {editorStore.activeTab === 'Style' && <StyleTab />}
        {editorStore.activeTab === 'Container' && <ContainerTab />}
      </div>
    </div>
  )
})
