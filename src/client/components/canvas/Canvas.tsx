import { Plus } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useId, useState } from 'react'
import { editorStore } from '../../stores/EditorStore'
import { SectionRow } from '../canvasComponents'
import { EmptyCanvas } from './EmptyCanvas'
import { StructureSelector } from './StructureSelector'

const DotPattern = () => {
  const patternId = useId()
  return (
    <svg className="canvas__background" data-testid="canvas-background">
      <pattern
        id={patternId}
        x="23"
        y="23"
        width="24"
        height="24"
        patternUnits="userSpaceOnUse"
        patternTransform="translate(-0.5,-0.5)"
      >
        <circle cx="0.5" cy="0.5" r="0.5" fill="var(--text-muted)" />
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}

export const Canvas = observer(() => {
  const [showStructureSelector, setShowStructureSelector] = useState(false)
  const viewportClassName = `viewport viewport--${editorStore.activeDevice}`
  const isMobileOrTablet = editorStore.activeDevice !== 'desktop'

  // Show empty state when no sections exist
  if (editorStore.isEmpty) {
    return (
      <div className={`canvas ${editorStore.activeDevice === 'desktop' ? 'canvas--desktop' : ''}`}>
        <DotPattern />
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

  const handleAddSectionClick = () => {
    setShowStructureSelector(true)
  }

  const handleStructureSelectorClose = () => {
    setShowStructureSelector(false)
  }

  const content = (
    <>
      <div className="viewport__content">
        {editorStore.sections.map((section) => (
          <SectionRow key={section.key} section={section} />
        ))}
      </div>

      {showStructureSelector ? (
        <StructureSelector onClose={handleStructureSelectorClose} />
      ) : (
        <button className="add-row-btn" onClick={handleAddSectionClick}>
          <Plus size={16} /> Add Section
        </button>
      )}
    </>
  )

  const canvasClassName = `canvas ${editorStore.activeDevice === 'desktop' ? 'canvas--desktop' : ''}`

  return (
    <div className={canvasClassName}>
      {/*<DotPattern />*/}
      <div className={viewportClassName}>
        {isMobileOrTablet ? <div className="viewport__screen">{content}</div> : content}
      </div>
    </div>
  )
})
