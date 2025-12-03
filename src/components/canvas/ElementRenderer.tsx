import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Box, Section, Column, Block, InnerSection } from '../../models'
import { editorStore } from '../../stores/EditorStore'
import { tokens } from '../../styles/tokens'

const ElementWrapper = styled.div<{ $isSelected: boolean }>`
  position: relative;
  cursor: pointer;
  transition: all ${tokens.transition.fast};

  &:hover {
    outline: 2px dashed ${tokens.colors.blue[300]};
    outline-offset: 2px;
  }

  ${({ $isSelected }) =>
    $isSelected &&
    `
    outline: 2px solid ${tokens.colors.blue[500]};
    outline-offset: 2px;
  `}
`

interface ElementRendererProps {
  element: Box
}

export const ElementRenderer = observer(({ element }: ElementRendererProps) => {
  const isSelected = editorStore.selectedElementId === element.id

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    editorStore.setSelectedElement(element.id)
  }

  // Render based on element type
  if (element instanceof Section) {
    return <SectionRenderer section={element} isSelected={isSelected} onClick={handleClick} />
  }

  if (element instanceof Column) {
    return <ColumnRenderer column={element} isSelected={isSelected} onClick={handleClick} />
  }

  if (element instanceof InnerSection) {
    return <InnerSectionRenderer inner={element} isSelected={isSelected} onClick={handleClick} />
  }

  if (element instanceof Block) {
    return <BlockRenderer block={element} isSelected={isSelected} onClick={handleClick} />
  }

  return null
})

// Section Renderer
interface SectionRendererProps {
  section: Section
  isSelected: boolean
  onClick: (e: React.MouseEvent) => void
}

const SectionRenderer = observer(({ section, isSelected, onClick }: SectionRendererProps) => (
  <ElementWrapper
    className={section.id}
    style={section.style}
    $isSelected={isSelected}
    onClick={onClick}
    data-element-type="section"
  >
    <div style={{ display: 'flex', gap: '8px' }}>
      {section.children.map(column => (
        <ElementRenderer key={column.key} element={column} />
      ))}
    </div>
  </ElementWrapper>
))

// Column Renderer
interface ColumnRendererProps {
  column: Column
  isSelected: boolean
  onClick: (e: React.MouseEvent) => void
}

const ColumnRenderer = observer(({ column, isSelected, onClick }: ColumnRendererProps) => (
  <ElementWrapper
    className={column.id}
    style={{ ...column.style, width: `${column.width}%`, flex: `0 0 ${column.width}%` }}
    $isSelected={isSelected}
    onClick={onClick}
    data-element-type="column"
  >
    {column.children.map(child => (
      <ElementRenderer key={child.key} element={child} />
    ))}
  </ElementWrapper>
))

// InnerSection Renderer
interface InnerSectionRendererProps {
  inner: InnerSection
  isSelected: boolean
  onClick: (e: React.MouseEvent) => void
}

const InnerSectionRenderer = observer(
  ({ inner, isSelected, onClick }: InnerSectionRendererProps) => (
    <ElementWrapper
      className={inner.id}
      style={inner.style}
      $isSelected={isSelected}
      onClick={onClick}
      data-element-type="inner-section"
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        {inner.children.map(column => (
          <ElementRenderer key={column.key} element={column} />
        ))}
      </div>
    </ElementWrapper>
  )
)

// Block Renderer
interface BlockRendererProps {
  block: Block
  isSelected: boolean
  onClick: (e: React.MouseEvent) => void
}

const BlockRenderer = observer(({ block, isSelected, onClick }: BlockRendererProps) => {
  const renderContent = () => {
    switch (block.type) {
      case 'Image':
        return (
          <img
            src={block.data.src || 'https://via.placeholder.com/600x200'}
            alt={block.data.alt || ''}
            style={{ maxWidth: '100%', display: 'block' }}
          />
        )

      case 'Button':
        return (
          <a
            href={block.data.href || '#'}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: tokens.colors.blue[500],
              color: '#fff',
              textDecoration: 'none',
              borderRadius: tokens.borderRadius.md,
            }}
          >
            {block.data.text || 'Click Me'}
          </a>
        )

      case 'Headline':
        return <h2 style={{ margin: 0 }}>{block.data.content || 'Headline'}</h2>

      case 'Spacer':
        return <div style={{ height: block.data.height || '20px' }} />

      case 'Divider':
        return <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '16px 0' }} />

      default:
        // Paragraph
        return <p style={{ margin: 0 }}>{block.data.content || 'Lorem ipsum...'}</p>
    }
  }

  return (
    <ElementWrapper
      className={block.id}
      style={block.style}
      $isSelected={isSelected}
      onClick={onClick}
      data-element-type="block"
      data-block-type={block.type}
    >
      {renderContent()}
    </ElementWrapper>
  )
})
