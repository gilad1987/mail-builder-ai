import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { type Column, editorStore } from '../../stores/EditorStore'
import { tokens } from '../../styles/tokens'

interface ColumnContainerProps {
  rowId: string
  columns: Column[]
}

const Container = styled.div`
  display: flex;
  gap: ${tokens.spacing[3]};
  width: 100%;

  .column {
    min-height: 100px;
    background: #ffffff;
    border: 2px dashed ${tokens.colors.gray[300]};
    border-radius: ${tokens.borderRadius.md};
    padding: ${tokens.spacing[3]};
    transition: all ${tokens.transition.fast};

    &:hover {
      border-color: ${tokens.colors.blue[400]};
      background: ${tokens.colors.gray[50]};
    }

    &.is-dragover {
      border-color: ${tokens.colors.blue[500]};
      background: ${tokens.colors.blue[50]};
    }
  }

  .column-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 80px;
    color: ${tokens.colors.gray[400]};
    font-size: ${tokens.fontSize.xs};
  }

  .column-blocks {
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing[2]};
  }

  .column-block {
    padding: ${tokens.spacing[2]};
    background: #ffffff;
    border: 1px solid ${tokens.colors.gray[200]};
    border-radius: ${tokens.borderRadius.sm};
    font-size: ${tokens.fontSize.sm};
    color: ${tokens.colors.gray[800]};
    cursor: pointer;

    &:hover {
      border-color: ${tokens.colors.blue[400]};
    }

    &.is-selected {
      border-color: ${tokens.colors.blue[500]};
      box-shadow: 0 0 0 2px ${tokens.colors.blue[500]};
    }
  }
`

export const ColumnContainer = observer(({ rowId, columns }: ColumnContainerProps) => {
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const handleColumnDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverColumn(null)

    const type = e.dataTransfer.getData('application/react-dnd-type')
    if (type === 'SIDEBAR_ITEM') {
      const blockType = e.dataTransfer.getData('blockType')
      editorStore.addBlockToColumn(rowId, columnId, blockType)
    }
  }

  const handleColumnDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  return (
    <Container>
      {columns.map(column => (
        <div
          key={column.id}
          className={`column ${dragOverColumn === column.id ? 'is-dragover' : ''}`}
          style={{ flex: column.width }}
          onDragOver={e => handleColumnDragOver(e, column.id)}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={e => handleColumnDrop(e, column.id)}
        >
          {column.blocks.length === 0 ? (
            <div className="column-empty">Drop elements here</div>
          ) : (
            <div className="column-blocks">
              {column.blocks.map(block => (
                <div
                  key={block.id}
                  className={`column-block ${editorStore.selectedBlockId === block.id ? 'is-selected' : ''}`}
                  onClick={e => {
                    e.stopPropagation()
                    editorStore.setSelectedBlock(block.id)
                  }}
                >
                  <strong>{block.type}</strong>
                  <p>{block.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </Container>
  )
})
