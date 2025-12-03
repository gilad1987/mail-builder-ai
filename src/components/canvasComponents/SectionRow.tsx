import { useDroppable } from '@dnd-kit/core'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Section } from '../../models'
import { editorStore } from '../../stores/EditorStore'
import { tokens } from '../../styles/tokens'
import { ElementLabel, SectionActions } from '../WidgetActions'
import { ColumnBox } from './ColumnBox'

interface SectionRowProps {
  section: Section
}

const Container = styled.div`
  position: relative;
  overflow: visible;
  margin-top: 36px; /* Space for floating actions */
  border: 2px solid transparent;
  border-radius: ${tokens.borderRadius.md};
  transition: all ${tokens.transition.fast};
  margin-bottom: ${tokens.spacing[4]};

  &.is-hovered {
    border-color: #26c6da;

    > .element-label {
      opacity: 1;
    }
  }

  &.is-selected {
    border-color: #26c6da;
    box-shadow: 0 0 0 2px rgba(38, 198, 218, 0.2);

    .section-actions {
      opacity: 1;
    }
  }

  .section-content {
    flex: 1;
    padding: ${tokens.spacing[4]};
    min-height: 100px;

    /* Ensure columns stretch to fill height */
    > * {
      align-self: stretch;
    }
  }

  .section-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    color: ${tokens.colors.gray[400]};
    font-size: ${tokens.fontSize.sm};
    border: 2px dashed ${tokens.colors.gray[300]};
    border-radius: ${tokens.borderRadius.md};
    margin: ${tokens.spacing[4]};
    transition: all ${tokens.transition.fast};
  }
`

export const SectionRow = observer(({ section }: SectionRowProps) => {
  const isSelected = editorStore.selectedElementId === section.id
  const isHovered = editorStore.hoveredElementId === section.id

  // Make empty section directly droppable
  const { isOver, setNodeRef } = useDroppable({
    id: `section-${section.id}`,
    data: { accepts: 'layout', sectionId: section.id },
  })

  const handleMouseOver = (e: React.MouseEvent) => {
    // Only set hover if the mouse is directly over this element (not a child)
    if (
      e.currentTarget === e.target ||
      e.target === e.currentTarget.querySelector('.section-content')
    ) {
      editorStore.setHoveredElement(section.id)
    }
  }

  const handleMouseLeave = () => {
    if (editorStore.hoveredElementId === section.id) {
      editorStore.setHoveredElement(null)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    editorStore.setSelectedElement(section.id)
  }

  const handleCopy = () => {
    editorStore.copyElement(section.id)
  }

  const handleDelete = () => {
    editorStore.removeElement(section.id)
  }

  const classNames = [isSelected ? 'is-selected' : '', isHovered ? 'is-hovered' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <Container
      className={classNames}
      style={section.style}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <ElementLabel label="Section" color="#26c6da" />
      <SectionActions onCopy={handleCopy} onDelete={handleDelete} />
      {section.children.length === 0 ? (
        <div
          ref={setNodeRef}
          className="section-empty"
          style={{
            background: isOver ? 'rgba(38, 198, 218, 0.1)' : undefined,
            borderColor: isOver ? '#26c6da' : undefined,
          }}
        >
          Drop columns or layout here
        </div>
      ) : (
        <div
          className="section-content"
          style={{
            display: (section.style.display as React.CSSProperties['display']) || 'flex',
            flexDirection: section.style.flexDirection as React.CSSProperties['flexDirection'],
            justifyContent: section.style.justifyContent as React.CSSProperties['justifyContent'],
            alignItems: section.style.alignItems as React.CSSProperties['alignItems'],
            flexWrap: section.style.flexWrap as React.CSSProperties['flexWrap'],
            gap:
              section.style.columnGap || section.style.rowGap
                ? `${section.style.rowGap || 0} ${section.style.columnGap || 0}`
                : tokens.spacing[2],
          }}
        >
          {section.children.map((column, index) => (
            <ColumnBox
              key={column.key}
              column={column}
              sectionId={section.id}
              isLast={index === section.children.length - 1}
              isOnlyColumn={section.children.length === 1}
            />
          ))}
        </div>
      )}
    </Container>
  )
})
