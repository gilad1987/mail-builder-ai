import { observer } from 'mobx-react-lite'
import {
  Image,
  Minus,
  Menu,
  AlignLeft,
  Anchor,
  Layout,
  MessageSquare,
  Square,
  Globe,
} from 'lucide-react'
import { editorStore } from '../stores/EditorStore'

const blocks = [
  { name: 'Image', icon: Image, colorClass: 'block-card__icon--blue', type: 'image' },
  { name: 'Spacer', icon: Minus, colorClass: 'block-card__icon--gray', type: 'spacer' },
  { name: 'Headline', icon: Menu, colorClass: 'block-card__icon--orange', type: 'headline' },
  { name: 'Paragraph', icon: AlignLeft, colorClass: 'block-card__icon--green', type: 'paragraph' },
  { name: 'Button', icon: Anchor, colorClass: 'block-card__icon--indigo', type: 'button' },
  { name: 'Column', icon: Layout, colorClass: 'block-card__icon--teal', type: 'column' },
  { name: 'Blog Post', icon: MessageSquare, colorClass: 'block-card__icon--red', type: 'blog' },
  { name: 'Inner section', icon: Square, colorClass: 'block-card__icon--yellow', type: 'section' },
  { name: 'Form', icon: Globe, colorClass: 'block-card__icon--purple', type: 'form' },
]

export const BlockSelectPanel = observer(() => {
  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('application/react-dnd-type', 'SIDEBAR_ITEM')
    e.dataTransfer.setData('blockType', blockType)
    e.dataTransfer.effectAllowed = 'copy'
    editorStore.setSelectedBlock(null)
  }

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Add Elements</h2>
      </div>

      <div className="block-grid">
        {blocks.map((block, index) => (
          <div
            key={index}
            draggable
            onDragStart={e => handleDragStart(e, block.name)}
            className="block-card"
            title={`Drag ${block.name} to canvas`}
          >
            <block.icon
              size={24}
              className={`block-card__icon ${block.colorClass}`}
              strokeWidth={1.5}
            />
            <span className="block-card__name">{block.name}</span>
          </div>
        ))}
      </div>

      <div className="sidebar__footer">
        <p>Drag blocks onto the canvas rows to add them.</p>
      </div>
    </div>
  )
})
