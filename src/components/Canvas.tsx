import { observer } from 'mobx-react-lite'
import { Plus } from 'lucide-react'
import { editorStore } from '../stores/EditorStore'
import { ContentRow } from './canvasComponents'

export const Canvas = observer(() => {
  const viewportClassName = `viewport viewport--${editorStore.activeDevice}`

  return (
    <div className="canvas">
      <div className={viewportClassName}>
        <div className="viewport__content">
          {editorStore.rows.map(row => (
            <ContentRow key={row.id} row={row} />
          ))}
        </div>

        <button className="add-row-btn" onClick={() => editorStore.addRow()}>
          <span>
            <Plus size={16} /> Add new Row
          </span>
        </button>
      </div>

      <p className="canvas__footer">
        Current Viewport: <span>{editorStore.activeDevice}</span>
      </p>
    </div>
  )
})
