import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Image } from 'lucide-react'
import { Block, Box, InnerSection } from '../../models'
import { editorStore } from '../../stores/EditorStore'
import { tokens } from '../../styles/tokens'
import { Draggable } from '../dnd'
import { BlockActions, ElementLabel } from '../WidgetActions'
import { ColumnBox } from './ColumnBox'

interface BlockElementProps {
  block: Box
  columnId: string
}

const Container = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  display: block;
  overflow: visible;
  padding: ${tokens.spacing[3]};
  background: #ffffff;
  border: 1px solid ${tokens.colors.gray[200]};
  border-radius: ${tokens.borderRadius.sm};
  cursor: pointer;
  transition: all ${tokens.transition.fast};

  &.is-hovered {
    border-color: #1e88e5;

    > .element-label {
      opacity: 1;
    }
  }

  &.is-selected {
    border-color: #1e88e5;
    box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.2);

    .block-actions {
      opacity: 1;
    }
  }

  .block-content {
    font-size: ${tokens.fontSize.sm};
    color: ${tokens.colors.gray[800]};
  }

  .block-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background: ${tokens.colors.gray[100]};
    border-radius: ${tokens.borderRadius.sm};
    color: ${tokens.colors.gray[400]};
  }

  .block-button {
    display: inline-block;
    padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
    background: ${tokens.colors.blue[500]};
    color: #fff;
    border-radius: ${tokens.borderRadius.md};
    font-size: ${tokens.fontSize.sm};
  }
`

export const BlockElement = observer(({ block, columnId }: BlockElementProps) => {
  const isSelected = editorStore.selectedElementId === block.id
  const isHovered = editorStore.hoveredElementId === block.id

  const handleMouseOver = (e: React.MouseEvent) => {
    e.stopPropagation()
    editorStore.setHoveredElement(block.id)
  }

  const handleMouseLeave = () => {
    if (editorStore.hoveredElementId === block.id) {
      editorStore.setHoveredElement(null)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    editorStore.setSelectedElement(block.id)
  }

  const handleEdit = () => {
    editorStore.setSelectedElement(block.id)
  }

  const handleCopy = () => {
    editorStore.copyElement(block.id)
  }

  const handleDelete = () => {
    editorStore.removeElement(block.id)
  }

  // const getBlockBadgeType = (blockType: string) => {
  //   if (blockType === 'Image') return 'image'
  //   if (blockType === 'Paragraph' || blockType === 'Headline') return 'text'
  //   return 'block'
  // }

  // Handle InnerSection (nested columns)
  if (block instanceof InnerSection) {
    const classNames = [isSelected ? 'is-selected' : '', isHovered ? 'is-hovered' : '']
      .filter(Boolean)
      .join(' ')

    return (
      <Container
        className={classNames}
        style={{ ...block.style, flex: 1, width: '100%' }}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <ElementLabel label="Inner Section" color="#607d8b" />
        <BlockActions onEdit={handleEdit} onCopy={handleCopy} onDelete={handleDelete} />
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          {block.children.length === 0 ? (
            <div
              style={{
                flex: 1,
                padding: '16px',
                background: '#f5f5f5',
                textAlign: 'center',
                color: '#999',
              }}
            >
              Empty Inner Section
            </div>
          ) : (
            block.children.map((col, index) => (
              <ColumnBox
                key={col.key}
                column={col}
                sectionId={block.id}
                isLast={index === block.children.length - 1}
              />
            ))
          )}
        </div>
      </Container>
    )
  }

  // Handle Block
  if (block instanceof Block) {
    const classNames = [isSelected ? 'is-selected' : '', isHovered ? 'is-hovered' : '']
      .filter(Boolean)
      .join(' ')

    return (
      <Draggable
        id={`canvas-block-${block.id}`}
        data={{
          source: 'canvas',
          blockId: block.id,
          blockType: block.type,
          parentId: columnId,
        }}
        style={{ flex: 1, width: '100%', display: 'block' }}
      >
        <Container
          className={classNames}
          style={block.style}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        >
          <ElementLabel label={block.type} color="#37474f" />
          <BlockActions onEdit={handleEdit} onCopy={handleCopy} onDelete={handleDelete} />
          {renderBlockContent(block)}
        </Container>
      </Draggable>
    )
  }

  return null
})

function renderBlockContent(block: Block) {
  switch (block.type) {
    case 'Image':
      return (
        <div className="block-image">
          {block.data.src ? (
            <img
              src={block.data.src as string}
              alt={(block.data.alt as string) || ''}
              style={{ maxWidth: '100%' }}
            />
          ) : (
            <Image size={32} />
          )}
        </div>
      )

    case 'Button':
      return <div className="block-button">{(block.data.text as string) || 'Click Me'}</div>

    case 'Headline':
      return <h3 style={{ margin: 0 }}>{(block.data.content as string) || 'Headline'}</h3>

    case 'Spacer':
      return (
        <div
          style={{
            height: (block.data.height as string) || '20px',
            background: '#f0f0f0',
          }}
        />
      )

    case 'Divider':
      return <hr style={{ border: 'none', borderTop: '1px solid #ddd' }} />

    default:
      return <p className="block-content">{(block.data.content as string) || 'Lorem ipsum...'}</p>
  }
}
