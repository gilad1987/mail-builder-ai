import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { editorStore } from '../../stores/EditorStore'
import { BlockCard } from './BlockCard'

interface Block {
  id: string
  type: string
  content: string
  showImage: boolean
}

interface Row {
  id: string
  blocks: Block[]
}

interface ContentRowProps {
  row: Row
}

export const ContentRow = observer(({ row }: ContentRowProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const isSelectedRow =
    editorStore.selectedBlockId && editorStore.selectedBlockId.startsWith(row.id)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const type = e.dataTransfer.getData('application/react-dnd-type')
    if (type === 'SIDEBAR_ITEM') {
      editorStore.addBlockToRow(row.id, row.blocks.length, e.dataTransfer.getData('blockType'))
    } else if (type === 'CANVAS_ITEM') {
      const fromRowId = e.dataTransfer.getData('fromRowId')
      const fromIndex = parseInt(e.dataTransfer.getData('fromIndex'), 10)
      editorStore.moveBlock(fromRowId, fromIndex, row.id, row.blocks.length)
    }
  }

  const handleBlockDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const type = e.dataTransfer.getData('application/react-dnd-type')
    if (type === 'SIDEBAR_ITEM') {
      editorStore.addBlockToRow(row.id, targetIndex, e.dataTransfer.getData('blockType'))
    } else if (type === 'CANVAS_ITEM') {
      const fromRowId = e.dataTransfer.getData('fromRowId')
      const fromIndex = parseInt(e.dataTransfer.getData('fromIndex'), 10)
      editorStore.moveBlock(fromRowId, fromIndex, row.id, targetIndex)
    }
  }

  const handleBlockDragStart = (e: React.DragEvent, blockIndex: number) => {
    e.dataTransfer.setData('application/react-dnd-type', 'CANVAS_ITEM')
    e.dataTransfer.setData('fromRowId', row.id)
    e.dataTransfer.setData('fromIndex', blockIndex.toString())
    e.dataTransfer.effectAllowed = 'move'
  }

  const rowClassName = `row ${isSelectedRow ? 'row--selected' : ''} ${isDragOver ? 'row--dragover' : ''}`

  return (
    <div
      className={rowClassName}
      onDragOver={e => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => editorStore.setSelectedBlock(null)}
    >
      <div className="row__actions">
        <span>{row.id}</span>
      </div>

      {row.blocks.length === 0 ? (
        <div className="row__empty">
          <p>Drop elements here</p>
        </div>
      ) : (
        <div className="row__blocks">
          {row.blocks.map((block, index) => (
            <BlockCard
              key={block.id}
              block={block}
              onDragStart={e => handleBlockDragStart(e, index)}
              onDrop={e => handleBlockDrop(e, index)}
            />
          ))}
        </div>
      )}
    </div>
  )
})
