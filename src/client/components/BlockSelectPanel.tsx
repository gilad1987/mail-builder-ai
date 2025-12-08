import {
  AlignLeft,
  Anchor,
  Image,
  Layout,
  List,
  Menu,
  MessageSquare,
  Minus,
  Package,
  Share2,
  Square,
  Trash2,
  Youtube,
} from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { WidgetType } from '../config/elementControls'
import { savedWidgetsStore } from '../stores/SavedWidgetsStore'
import { Draggable } from './dnd'
import { LayoutSection } from './LayoutSection'

const blocks = [
  { name: 'Image', icon: Image, colorClass: 'block-card__icon--blue', type: WidgetType.Image },
  { name: 'Spacer', icon: Minus, colorClass: 'block-card__icon--gray', type: WidgetType.Spacer },
  {
    name: 'Headline',
    icon: Menu,
    colorClass: 'block-card__icon--orange',
    type: WidgetType.Headline,
  },
  {
    name: 'Paragraph',
    icon: AlignLeft,
    colorClass: 'block-card__icon--green',
    type: WidgetType.Paragraph,
  },
  { name: 'List', icon: List, colorClass: 'block-card__icon--cyan', type: WidgetType.List },
  { name: 'Button', icon: Anchor, colorClass: 'block-card__icon--indigo', type: WidgetType.Button },
  { name: 'Column', icon: Layout, colorClass: 'block-card__icon--teal', type: WidgetType.Column },
  { name: 'Blog Post', icon: MessageSquare, colorClass: 'block-card__icon--red', type: 'BlogPost' },
  {
    name: 'Inner section',
    icon: Square,
    colorClass: 'block-card__icon--yellow',
    type: WidgetType.InnerSection,
  },
  {
    name: 'Social Links',
    icon: Share2,
    colorClass: 'block-card__icon--pink',
    type: WidgetType.SocialLinks,
  },
  {
    name: 'Video',
    icon: Youtube,
    colorClass: 'block-card__icon--red',
    type: WidgetType.Video,
  },
]

export const BlockSelectPanel = observer(() => {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Add Elements</h2>
      </div>

      <div className="block-grid">
        {blocks.map((block, index) => {
          // Column is a special type - it's a layout element, not a block
          const isColumn = block.type === WidgetType.Column
          const dragData = isColumn
            ? { source: 'sidebar' as const, type: 'column' as const, name: block.name }
            : {
                source: 'sidebar' as const,
                type: 'block' as const,
                blockType: block.type,
                name: block.name,
              }

          return (
            <Draggable key={index} id={`sidebar-block-${block.type}`} data={dragData}>
              <div className="block-card" title={`Drag ${block.name} to canvas`}>
                <block.icon
                  size={24}
                  className={`block-card__icon ${block.colorClass}`}
                  strokeWidth={1.5}
                />
                <span className="block-card__name">{block.name}</span>
              </div>
            </Draggable>
          )
        })}
      </div>

      {savedWidgetsStore.widgets.length > 0 && (
        <>
          <div className="sidebar__section-header">
            <h3 className="sidebar__subtitle">Saved Widgets</h3>
          </div>
          <div className="block-grid">
            {savedWidgetsStore.widgets.map((widget) => (
              <Draggable
                key={widget.id}
                id={`saved-widget-${widget.id}`}
                data={{
                  source: 'sidebar',
                  type: 'saved-widget',
                  widgetId: widget.id,
                  widgetType: widget.type,
                  name: widget.name,
                }}
              >
                <div
                  className="block-card block-card--saved"
                  title={`Drag ${widget.name} to canvas`}
                >
                  <Package
                    size={24}
                    className="block-card__icon block-card__icon--purple"
                    strokeWidth={1.5}
                  />
                  <span className="block-card__name">{widget.name}</span>
                  <button
                    className="block-card__delete"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      savedWidgetsStore.deleteWidget(widget.id)
                    }}
                    title="Delete widget"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </Draggable>
            ))}
          </div>
        </>
      )}

      <LayoutSection />

      <div className="sidebar__footer">
        <p>Drag blocks onto the canvas to add them.</p>
      </div>
    </div>
  )
})
