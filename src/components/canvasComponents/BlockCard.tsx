import { observer } from 'mobx-react-lite'
import { Edit, Move, Image } from 'lucide-react'
import { editorStore } from '../../stores/EditorStore'

interface Block {
  id: string
  type: string
  content: string
  showImage: boolean
}

interface BlockCardProps {
  block: Block
  onDragStart: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

export const BlockCard = observer(({ block, onDragStart, onDrop }: BlockCardProps) => {
  const isSelected = editorStore.selectedBlockId === block.id

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    editorStore.setSelectedBlock(block.id)
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={e => e.preventDefault()}
      className={`block-item ${isSelected ? 'block-item--selected' : ''}`}
      onClick={handleClick}
    >
      <div className="block-item__tools">
        <button className="block-item__tool-btn block-item__tool-btn--edit">
          <Edit size={12} />
        </button>
        <button className="block-item__tool-btn block-item__tool-btn--move" title="Drag to move">
          <Move size={12} />
        </button>
      </div>

      <div className="block-item__content">
        <h4 className="block-item__type">{block.type}</h4>
        <p>{block.content}</p>

        {block.showImage && (
          <div className="block-item__image">
            <Image size={24} />
          </div>
        )}
      </div>
    </div>
  )
})
