import { observer } from 'mobx-react-lite'
import { Plus } from 'lucide-react'
import { editorStore } from '../stores/EditorStore'
import { SectionRow } from './canvasComponents'
import { EmptyCanvas } from './EmptyCanvas'

export const Canvas = observer(() => {
  const viewportClassName = `viewport viewport--${editorStore.activeDevice}`
  const isMobileOrTablet = editorStore.activeDevice !== 'desktop'

  // Show empty state when no sections exist
  if (editorStore.isEmpty) {
    return (
      <div className={`canvas ${editorStore.activeDevice === 'desktop' ? 'canvas--desktop' : ''}`}>
        <div className={viewportClassName}>
          {isMobileOrTablet ? (
            <div className="viewport__screen">
              <EmptyCanvas />
            </div>
          ) : (
            <EmptyCanvas />
          )}
        </div>
      </div>
    )
  }

  const content = (
    <>
      <div className="viewport__content">
        {editorStore.sections.map(section => (
          <SectionRow key={section.key} section={section} />
        ))}
      </div>

      <button className="add-row-btn" onClick={() => editorStore.addSection()}>
        <span>
          <Plus size={16} /> Add Section
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
    </div>
  )
})
