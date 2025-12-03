import { observer } from 'mobx-react-lite'
import { editorStore } from './stores/EditorStore'
import { TopBar } from './components/TopBar'
import { BlockSelectPanel } from './components/BlockSelectPanel'
import { Sidebar } from './components/Sidebar'
import { Canvas } from './components/Canvas'
import './styles/main.scss'

const App = observer(() => {
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
