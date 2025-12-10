import {
  AlignLeft,
  Anchor,
  Columns,
  GripVertical,
  Image,
  Layout,
  Menu,
  Minus,
  Package,
  Rows,
} from 'lucide-react'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import type { DragData } from './types'

interface DragPreviewProps {
  type: 'sidebar' | 'canvas' | null
  data: DragData
}

const Container = styled.div`
  .preview {
    padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
    background: ${tokens.colors.blue[500]};
    color: white;
    border-radius: ${tokens.borderRadius.md};
    box-shadow: ${tokens.shadow.lg};
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    pointer-events: none;
    opacity: 0.95;

    svg {
      flex-shrink: 0;
    }
  }

  .preview--section {
    background: #26c6da;
    min-width: 120px;
  }

  .preview--column {
    background: #1e88e5;
    min-width: 100px;
  }

  .preview--element {
    background: #37474f;
    min-width: 100px;
  }

  .layout-preview {
    padding: ${tokens.spacing[2]} ${tokens.spacing[3]};
    background: ${tokens.colors.blue[500]};
    color: white;
    border-radius: ${tokens.borderRadius.md};
    box-shadow: ${tokens.shadow.lg};
    pointer-events: none;
  }

  .preview-columns {
    display: flex;
    gap: 4px;
    margin-bottom: ${tokens.spacing[1]};
  }

  .preview-col {
    height: 24px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  .preview-label {
    font-size: ${tokens.fontSize.xs};
    text-align: center;
  }
`

const blockIcons: Record<string, React.FC<{ size?: number }>> = {
  Image: Image,
  Spacer: Minus,
  Headline: Menu,
  Paragraph: AlignLeft,
  Button: Anchor,
  Column: Layout,
}

export const DragPreview = ({ type, data }: DragPreviewProps) => {
  // Sidebar - Layout preview
  if (type === 'sidebar' && data.type === 'layout' && data.columns) {
    return (
      <Container>
        <div className="layout-preview">
          <div className="preview-columns">
            {data.columns.map((width: number, i: number) => (
              <div key={i} className="preview-col" style={{ flex: width }} />
            ))}
          </div>
          <div className="preview-label">{data.name}</div>
        </div>
      </Container>
    )
  }

  // Sidebar - Column preview
  if (type === 'sidebar' && data.type === 'column') {
    return (
      <Container>
        <div className="layout-preview">
          <div className="preview-columns">
            <div className="preview-col" style={{ flex: 1, minWidth: 60 }} />
          </div>
          <div className="preview-label">{data.name || 'Column'}</div>
        </div>
      </Container>
    )
  }

  // Sidebar - Block preview
  if (type === 'sidebar' && data.type === 'block' && data.blockType) {
    const Icon = blockIcons[data.blockType] || AlignLeft
    return (
      <Container>
        <div className="preview">
          <Icon size={18} />
          <span>{data.blockType}</span>
        </div>
      </Container>
    )
  }

  // Sidebar - Saved widget preview
  if (type === 'sidebar' && data.type === 'saved-widget') {
    return (
      <Container>
        <div className="preview" style={{ background: tokens.colors.purple[600] }}>
          <Package size={18} />
          <span>{data.name || 'Saved Widget'}</span>
        </div>
      </Container>
    )
  }

  // Canvas - Section drag preview
  if (type === 'canvas' && data.type === 'section') {
    return (
      <Container>
        <div className="preview preview--section">
          <Rows size={18} />
          <span>Section</span>
          <GripVertical size={14} style={{ opacity: 0.7 }} />
        </div>
      </Container>
    )
  }

  // Canvas - Column drag preview
  if (type === 'canvas' && data.type === 'column') {
    return (
      <Container>
        <div className="preview preview--column">
          <Columns size={18} />
          <span>Column</span>
          <GripVertical size={14} style={{ opacity: 0.7 }} />
        </div>
      </Container>
    )
  }

  // Canvas - Element drag preview
  if (type === 'canvas' && data.type === 'element') {
    const Icon = blockIcons[data.blockType || ''] || AlignLeft
    return (
      <Container>
        <div className="preview preview--element">
          <Icon size={18} />
          <span>{data.blockType || 'Element'}</span>
          <GripVertical size={14} style={{ opacity: 0.7 }} />
        </div>
      </Container>
    )
  }

  // Canvas - Generic (legacy)
  if (type === 'canvas') {
    return (
      <Container>
        <div className="preview">
          <GripVertical size={16} />
          <span>Moving {data.blockType || 'element'}</span>
        </div>
      </Container>
    )
  }

  return null
}
