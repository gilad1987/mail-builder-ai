import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { editorStore } from './stores/EditorStore'
import { TopBar } from './components/TopBar'
import { BlockSelectPanel } from './components/BlockSelectPanel'
import { Sidebar } from './components/Sidebar'
import { Canvas } from './components/Canvas'
import './styles/main.scss'

const App = observer(() => {
  useEffect(() => {
    // Initialize theme on app load
    document.documentElement.setAttribute('data-theme', editorStore.theme)
  }, [])

  return (
    <div className="app-layout">
      <TopBar />

      <div className="main-content">
        {editorStore.hasSelectedBlock ? <Sidebar /> : <BlockSelectPanel />}
        <Canvas />
      </div>
    </div>
  )
})

export default App
