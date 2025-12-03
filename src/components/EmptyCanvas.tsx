import { useDroppable } from '@dnd-kit/core'
import styled from 'styled-components'
import { Layout, MousePointerClick, Sparkles } from 'lucide-react'
import { tokens } from '../styles/tokens'
import { editorStore } from '../stores/EditorStore'
import type { ColumnJSON } from '../models'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  height: 100%;
  padding: ${tokens.spacing[6]};
  text-align: center;

  .empty-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${tokens.spacing[5]};
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: ${tokens.fontWeight.semibold};
    color: ${tokens.colors.gray[800]};
    margin-bottom: ${tokens.spacing[2]};
  }

  .empty-subtitle {
    font-size: ${tokens.fontSize.base};
    color: ${tokens.colors.gray[500]};
    margin-bottom: ${tokens.spacing[5]};
    max-width: 400px;
    line-height: 1.6;
  }

  .empty-actions {
    display: flex;
    gap: ${tokens.spacing[3]};
    margin-bottom: ${tokens.spacing[6]};
  }

  .empty-btn {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
    padding: ${tokens.spacing[3]} ${tokens.spacing[5]};
    border-radius: ${tokens.borderRadius.lg};
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    transition: all ${tokens.transition.fast};
    cursor: pointer;

    &--primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
      }
    }

    &--secondary {
      background: white;
      color: ${tokens.colors.gray[700]};
      border: 1px solid ${tokens.colors.gray[200]};

      &:hover {
        border-color: ${tokens.colors.gray[300]};
        background: ${tokens.colors.gray[50]};
      }
    }
  }

  .empty-drop-zone {
    width: 100%;
    max-width: 600px;
    padding: ${tokens.spacing[6]};
    border: 2px dashed ${tokens.colors.gray[300]};
    border-radius: ${tokens.borderRadius.xl};
    background: ${tokens.colors.gray[50]};
    transition: all ${tokens.transition.fast};

    &:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }
  }

  .drop-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${tokens.spacing[2]};
    color: ${tokens.colors.gray[400]};
    font-size: ${tokens.fontSize.sm};

    svg {
      animation: bounce 2s ease-in-out infinite;
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .quick-start {
    margin-top: ${tokens.spacing[6]};
    padding-top: ${tokens.spacing[5]};
    border-top: 1px solid ${tokens.colors.gray[200]};
    width: 100%;
    max-width: 500px;
  }

  .quick-start-title {
    font-size: ${tokens.fontSize.xs};
    font-weight: ${tokens.fontWeight.medium};
    color: ${tokens.colors.gray[400]};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: ${tokens.spacing[3]};
  }

  .quick-layouts {
    display: flex;
    gap: ${tokens.spacing[3]};
    justify-content: center;
  }

  .quick-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${tokens.spacing[2]};
    padding: ${tokens.spacing[3]};
    border-radius: ${tokens.borderRadius.md};
    cursor: pointer;
    transition: all ${tokens.transition.fast};

    &:hover {
      background: ${tokens.colors.gray[100]};
    }
  }

  .layout-preview {
    display: flex;
    gap: 4px;
    padding: ${tokens.spacing[2]};
    background: white;
    border: 1px solid ${tokens.colors.gray[200]};
    border-radius: ${tokens.borderRadius.sm};
  }

  .layout-col {
    height: 24px;
    background: ${tokens.colors.gray[200]};
    border-radius: 2px;
  }

  .layout-name {
    font-size: ${tokens.fontSize.xs};
    color: ${tokens.colors.gray[500]};
  }
`

const quickLayouts = [
  { name: '1 Column', columns: [100], widths: [60] },
  { name: '2 Columns', columns: [50, 50], widths: [30, 30] },
  { name: '3 Columns', columns: [33.33, 33.33, 33.33], widths: [20, 20, 20] },
]

export const EmptyCanvas = () => {
  // Make the drop zone directly droppable
  const { setNodeRef } = useDroppable({
    id: 'empty-canvas',
    data: { accepts: 'layout', sectionId: 'new' },
  })

  const handleAddSection = () => {
    const section = editorStore.addSection()
    section.addColumn({}) // No width = auto-expand
  }

  const handleQuickLayout = (columns: number[]) => {
    const section = editorStore.addSection()
    columns.forEach(width => section.addColumn({ width } as ColumnJSON))
  }

  return (
    <Container>
      <div className="empty-icon">
        <Sparkles size={36} color="white" />
      </div>

      <h2 className="empty-title">Start Building Your Email</h2>
      <p className="empty-subtitle">
        Create beautiful, responsive email templates by dragging elements from the sidebar or click
        below to add your first section.
      </p>

      <div className="empty-actions">
        <button className="empty-btn empty-btn--primary" onClick={handleAddSection}>
          <Layout size={18} />
          Add First Section
        </button>
      </div>

      <div ref={setNodeRef} className="empty-drop-zone">
        <div className="drop-hint">
          <MousePointerClick size={20} />
          <span>Drag a layout from the sidebar to get started</span>
        </div>
      </div>

      <div className="quick-start">
        <div className="quick-start-title">Quick Start Layouts</div>
        <div className="quick-layouts">
          {quickLayouts.map((layout, i) => (
            <div key={i} className="quick-layout" onClick={() => handleQuickLayout(layout.columns)}>
              <div className="layout-preview">
                {layout.widths.map((w, j) => (
                  <div key={j} className="layout-col" style={{ width: w }} />
                ))}
              </div>
              <span className="layout-name">{layout.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
