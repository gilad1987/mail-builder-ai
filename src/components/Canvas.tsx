import { observer } from 'mobx-react-lite'
import { Plus } from 'lucide-react'
import { editorStore } from '../stores/EditorStore'
import { SectionRow } from './canvasComponents'

export const Canvas = observer(() => {
  const viewportClassName = `viewport viewport--${editorStore.activeDevice}`
  const isMobileOrTablet = editorStore.activeDevice !== 'desktop'

  const content = (
    <>
      <div className="viewport__content">
        {editorStore.sections.map(section => (
          <SectionRow key={section.key} section={section} />
        ))}
      </div>

      <button className="add-row-btn" onClick={() => editorStore.addSection()}>
        <span>
          <Plus size={16} /> Add new Section
        </span>
      </button>
    </>
  )

  const canvasClassName = `canvas ${editorStore.activeDevice === 'desktop' ? 'canvas--desktop' : ''}`

  return (
    <div className={canvasClassName}>
      <div className={viewportClassName}>
        {isMobileOrTablet ? <div className="viewport__screen">{content}</div> : content}
      </div>

      <p className="canvas__footer">
        Current Viewport: <span>{editorStore.activeDevice}</span>
      </p>
    </div>
  )
})
