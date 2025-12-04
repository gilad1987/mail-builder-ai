import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import { AlignLeft, Anchor, Image, Layout, Menu, Minus } from 'lucide-react'
import type { DragData } from './types'

interface DragPreviewProps {
  type: 'sidebar' | 'canvas' | null
  data: DragData
}

const PreviewContainer = styled.div`
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
  opacity: 0.9;

  svg {
    flex-shrink: 0;
  }
`

const LayoutPreview = styled.div`
  padding: ${tokens.spacing[2]} ${tokens.spacing[3]};
  background: ${tokens.colors.blue[500]};
  color: white;
  border-radius: ${tokens.borderRadius.md};
  box-shadow: ${tokens.shadow.lg};
  pointer-events: none;

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
  if (type === 'sidebar' && data.type === 'layout' && data.columns) {
    return (
      <LayoutPreview>
        <div className="preview-columns">
          {data.columns.map((width: number, i: number) => (
            <div key={i} className="preview-col" style={{ flex: width }} />
          ))}
        </div>
        <div className="preview-label">{data.name}</div>
      </LayoutPreview>
    )
  }

  if (type === 'sidebar' && data.type === 'column') {
    return (
      <LayoutPreview>
        <div className="preview-columns">
          <div className="preview-col" style={{ flex: 1, minWidth: 60 }} />
        </div>
        <div className="preview-label">{data.name || 'Column'}</div>
      </LayoutPreview>
    )
  }

  if (type === 'sidebar' && data.type === 'block' && data.blockType) {
    const Icon = blockIcons[data.blockType] || AlignLeft
    return (
      <PreviewContainer>
        <Icon size={18} />
        <span>{data.blockType}</span>
      </PreviewContainer>
    )
  }

  if (type === 'canvas') {
    return (
      <PreviewContainer>
        <span>Moving {data.blockType || 'element'}</span>
      </PreviewContainer>
    )
  }

  return null
}
