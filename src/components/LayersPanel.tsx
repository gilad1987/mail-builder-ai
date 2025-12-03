import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { ChevronDown, ChevronUp, FileText, MoreVertical, Plus, Rows3, Settings } from 'lucide-react'
import { tokens } from '../styles/tokens'
import { LayersTree } from './layers/LayersTree'

const Container = styled.div`
  width: 280px;
  height: 100%;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;

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
  }
`

export const LayersPanel = observer(() => {
  const [pagesExpanded, setPagesExpanded] = useState(true)

  return (
    <Container>
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
    </Container>
  )
})
