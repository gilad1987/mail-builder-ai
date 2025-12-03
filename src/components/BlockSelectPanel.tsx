import { observer } from 'mobx-react-lite'
import {
  AlignLeft,
  Anchor,
  Globe,
  Image,
  Layout,
  Menu,
  MessageSquare,
  Minus,
  Square,
} from 'lucide-react'
import { Draggable } from './dnd'
import { LayoutSection } from './LayoutSection'

const blocks = [
  { name: 'Image', icon: Image, colorClass: 'block-card__icon--blue', type: 'Image' },
  { name: 'Spacer', icon: Minus, colorClass: 'block-card__icon--gray', type: 'Spacer' },
  { name: 'Headline', icon: Menu, colorClass: 'block-card__icon--orange', type: 'Headline' },
  { name: 'Paragraph', icon: AlignLeft, colorClass: 'block-card__icon--green', type: 'Paragraph' },
  { name: 'Button', icon: Anchor, colorClass: 'block-card__icon--indigo', type: 'Button' },
  { name: 'Column', icon: Layout, colorClass: 'block-card__icon--teal', type: 'Column' },
  { name: 'Blog Post', icon: MessageSquare, colorClass: 'block-card__icon--red', type: 'BlogPost' },
  {
    name: 'Inner section',
    icon: Square,
    colorClass: 'block-card__icon--yellow',
    type: 'InnerSection',
  },
  { name: 'Form', icon: Globe, colorClass: 'block-card__icon--purple', type: 'Form' },
]

export const BlockSelectPanel = observer(() => {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Add Elements</h2>
      </div>

      <div className="block-grid">
        {blocks.map((block, index) => (
          <Draggable
            key={index}
            id={`sidebar-block-${block.type}`}
            data={{ source: 'sidebar', type: 'block', blockType: block.type, name: block.name }}
          >
            <div className="block-card" title={`Drag ${block.name} to canvas`}>
              <block.icon
                size={24}
                className={`block-card__icon ${block.colorClass}`}
                strokeWidth={1.5}
              />
              <span className="block-card__name">{block.name}</span>
            </div>
          </Draggable>
        ))}
      </div>

      <LayoutSection />

      <div className="sidebar__footer">
        <p>Drag blocks onto the canvas to add them.</p>
      </div>
    </div>
  )
})
