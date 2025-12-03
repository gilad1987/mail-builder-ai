import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Section } from '../../models'
import { editorStore } from '../../stores/EditorStore'
import { tokens } from '../../styles/tokens'
import { Droppable, useDndState } from '../dnd'
import { SectionActions } from '../WidgetActions'
import { ColumnBox } from './ColumnBox'

interface SectionRowProps {
  section: Section
}

const Container = styled.div`
  position: relative;
  border: 2px solid transparent;
  border-radius: ${tokens.borderRadius.md};
  transition: all ${tokens.transition.fast};
  margin-bottom: ${tokens.spacing[4]};

  &:hover {
    border-color: #26c6da;

    .section-actions {
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
    display: flex;
    gap: ${tokens.spacing[2]};
    padding: ${tokens.spacing[4]};
    min-height: 100px;
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

  .section-label {
    position: absolute;
    top: -10px;
    left: 10px;
    background: var(--bg-primary);
    padding: 0 ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.xs};
    color: #26c6da;
    font-weight: ${tokens.fontWeight.medium};
  }
`

export const SectionRow = observer(({ section }: SectionRowProps) => {
  const isSelected = editorStore.selectedElementId === section.id
  const { overId } = useDndState()
  const isOver = overId === `section-${section.id}`

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

  return (
    <Container
      className={isSelected ? 'is-selected' : ''}
      style={section.style}
      onClick={handleClick}
    >
      <SectionActions onCopy={handleCopy} onDelete={handleDelete} />
      <span className="section-label">Section</span>
      {section.children.length === 0 ? (
        <Droppable id={`section-${section.id}`} data={{ accepts: 'layout', sectionId: section.id }}>
          <div
            className="section-empty"
            style={{
              background: isOver ? 'rgba(38, 198, 218, 0.1)' : undefined,
              borderColor: isOver ? '#26c6da' : undefined,
            }}
          >
            Drop columns or layout here
          </div>
        </Droppable>
      ) : (
        <div className="section-content">
          {section.children.map((column, index) => (
            <ColumnBox
              key={column.key}
              column={column}
              sectionId={section.id}
              isLast={index === section.children.length - 1}
            />
          ))}
        </div>
      )}
    </Container>
  )
})
