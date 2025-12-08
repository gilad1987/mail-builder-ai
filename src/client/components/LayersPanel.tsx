import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  Layers,
  MoreVertical,
  Plus,
  Rows3,
  Settings,
} from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import styled from 'styled-components'
import { tokens } from '../styles/tokens'
import { LayersTree } from './layers/LayersTree'

interface LayersPanelProps {
  isOpen: boolean
  onToggle: () => void
}

const Container = styled.div<{ $isOpen: boolean }>`
  width: ${(props) => (props.$isOpen ? '280px' : '40px')};
  min-width: ${(props) => (props.$isOpen ? '280px' : '40px')};
  height: 100%;
  background: var(--bg-primary);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: row;
  position: relative;
  flex-shrink: 0;
  transition:
    width ${tokens.transition.normal},
    min-width ${tokens.transition.normal};

  .toggle-btn {
    position: absolute;
    left: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 48px;
    background: var(--accent);
    border: 1px solid var(--accent);
    border-left: none;
    border-radius: 0 ${tokens.borderRadius.md} ${tokens.borderRadius.md} 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all ${tokens.transition.fast};
    z-index: 10;

    &:hover {
      background: var(--accent-hover);
      border-color: var(--accent-hover);
    }
  }

  .panel-content {
    width: ${(props) => (props.$isOpen ? '280px' : '0')};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: width ${tokens.transition.normal};
  }

  .collapsed-bar {
    width: 40px;
    display: ${(props) => (props.$isOpen ? 'none' : 'flex')};
    flex-direction: column;
    align-items: center;
    padding: ${tokens.spacing[2]} 0;
    gap: ${tokens.spacing[2]};

    .collapsed-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: ${tokens.borderRadius.md};
      transition: all ${tokens.transition.fast};

      &:hover {
        background: var(--bg-elevated);
        color: var(--text-primary);
      }
    }
  }

  .pages-section {
    border-bottom: 1px solid var(--border-color);
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
    cursor: pointer;
    &:hover {
      background: var(--bg-elevated);
    }
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    color: var(--text-primary);
    white-space: nowrap;
  }

  .section-actions {
    display: flex;
    gap: ${tokens.spacing[1]};
    color: var(--text-secondary);
  }

  .page-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
    padding-left: ${tokens.spacing[6]};
    background: var(--bg-elevated);
    color: var(--text-primary);
    font-size: ${tokens.fontSize.sm};
    white-space: nowrap;
  }

  .layers-section {
    flex: 1;
    overflow-y: auto;
    padding: ${tokens.spacing[2]} 0;
  }

  .layers-header {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
    padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
    font-size: ${tokens.fontSize.sm};
    color: var(--text-secondary);
    white-space: nowrap;
  }
`

export const LayersPanel = observer(({ isOpen, onToggle }: LayersPanelProps) => {
  const [pagesExpanded, setPagesExpanded] = useState(true)

  return (
    <Container $isOpen={isOpen}>
      <button className="toggle-btn" onClick={onToggle} title={isOpen ? 'Collapse' : 'Expand'}>
        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="collapsed-bar" onClick={onToggle}>
        <div className="collapsed-icon">
          <Layers size={18} />
        </div>
      </div>

      <div className="panel-content">
        <div className="pages-section">
          <div className="section-header" onClick={() => setPagesExpanded(!pagesExpanded)}>
            <span className="section-title">
              <FileText size={16} /> Pages
            </span>
            <span className="section-actions">
              <Plus size={16} />
              {pagesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
          {pagesExpanded && (
            <div className="page-item">
              Home
              <span className="section-actions">
                <Settings size={14} />
                <MoreVertical size={14} />
              </span>
            </div>
          )}
        </div>

        <div className="layers-section">
          <div className="layers-header">
            <Rows3 size={16} /> Layers
          </div>
          <LayersTree />
        </div>
      </div>
    </Container>
  )
})
