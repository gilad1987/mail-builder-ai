import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useId, useState } from 'react'
import styled from 'styled-components'
import { editorStore } from '../../stores/EditorStore'
import { tokens } from '../../styles/tokens'
import { SectionRow } from '../canvasComponents'
import { useDndState } from '../dnd'
import { EmptyCanvas } from './EmptyCanvas'
import { StructureSelector } from './StructureSelector'

const BottomDropZone = styled.div<{ $isOver: boolean; $isDraggingSection: boolean }>`
  height: ${({ $isDraggingSection }) => ($isDraggingSection ? '40px' : '0')};
  margin: ${({ $isDraggingSection }) => ($isDraggingSection ? '8px 0' : '0')};
  transition: all ${tokens.transition.fast};
  position: relative;

  ${({ $isOver }) =>
    $isOver &&
    `
    height: 60px !important;
    margin: 16px 0 !important;
    background: rgba(38, 198, 218, 0.15);
    border: 2px dashed #26c6da;
    border-radius: ${tokens.borderRadius.md};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #26c6da;
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
  `}
`

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
  const { activeData } = useDndState()

  // Check if dragging a section
  const isDraggingSection = activeData?.source === 'canvas' && activeData?.type === 'section'

  // Bottom drop zone for sections
  const { isOver: isOverBottom, setNodeRef: setBottomRef } = useDroppable({
    id: 'section-drop-bottom',
    data: { type: 'section', index: editorStore.sections.length },
  })

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
        {editorStore.sections.map((section, index) => (
          <SectionRow key={section.key} section={section} index={index} />
        ))}
        {/* Bottom drop zone for section reordering */}
        <BottomDropZone
          ref={setBottomRef}
          $isOver={isOverBottom}
          $isDraggingSection={isDraggingSection}
        >
          {isOverBottom && 'Drop section here'}
        </BottomDropZone>
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
