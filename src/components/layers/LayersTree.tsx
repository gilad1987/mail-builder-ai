import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { ChevronDown, ChevronRight, LayoutGrid, Rows3, Square } from 'lucide-react'
import { tokens } from '../../styles/tokens'
import { editorStore } from '../../stores/EditorStore'
import { TreeItem } from './TreeItem'

const Container = styled.div`
  .tree-item {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[1]};
    padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
    margin: 1px ${tokens.spacing[2]};
    cursor: pointer;
    font-size: ${tokens.fontSize.sm};
    color: var(--text-primary);
    border-radius: ${tokens.borderRadius.sm};
    &:hover {
      background: var(--bg-elevated);
    }
    &.is-selected {
      background: ${tokens.colors.purple[600]};
      color: white;
    }
    &.is-selected .tree-icon {
      color: white;
    }
  }

  .tree-icon {
    color: var(--text-secondary);
    flex-shrink: 0;
  }
  .tree-label {
    flex: 1;
  }
  .tree-toggle {
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
  }
`

export const LayersTree = observer(() => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['body']))

  const toggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(prev => {
      const next = new Set(prev)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <Container>
      <div
        className={`tree-item ${!editorStore.selectedBlockId ? 'is-selected' : ''}`}
        style={{ paddingLeft: '8px' }}
        onClick={() => editorStore.setSelectedBlock(null)}
      >
        <span className="tree-toggle" onClick={e => toggle('body', e)}>
          {expanded.has('body') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <Square size={16} className="tree-icon" />
        <span className="tree-label">Body</span>
      </div>

      {expanded.has('body') &&
        editorStore.rows.map(row => {
          const hasColumns = row.columns && row.columns.length > 0
          const hasChildren = hasColumns || row.blocks.length > 0
          const isRowExpanded = expanded.has(row.id)

          return (
            <div key={row.id}>
              <div
                className="tree-item"
                style={{ paddingLeft: '24px' }}
                onClick={() => editorStore.setSelectedBlock(row.id)}
              >
                <span className="tree-toggle" onClick={e => toggle(row.id, e)}>
                  {hasChildren &&
                    (isRowExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                </span>
                {hasColumns ? (
                  <LayoutGrid size={16} className="tree-icon" />
                ) : (
                  <Rows3 size={16} className="tree-icon" />
                )}
                <span className="tree-label">{hasColumns ? 'Row (Columns)' : 'Row'}</span>
              </div>

              {isRowExpanded &&
                hasColumns &&
                row.columns!.map(col => (
                  <TreeItem key={col.id} column={col} expanded={expanded} onToggle={toggle} />
                ))}

              {isRowExpanded &&
                !hasColumns &&
                row.blocks.map(block => <TreeItem key={block.id} block={block} depth={2} />)}
            </div>
          )
        })}
    </Container>
  )
})
