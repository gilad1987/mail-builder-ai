import { observer } from 'mobx-react-lite'
import {
  AlignLeft,
  Anchor,
  Globe,
  Image,
  Layout,
  List,
  Menu,
  MessageSquare,
  Minus,
  Package,
  Square,
  Trash2,
} from 'lucide-react'
import { Draggable } from './dnd'
import { LayoutSection } from './LayoutSection'
import { WidgetType } from '../config/elementControls'
import { savedWidgetsStore } from '../stores/SavedWidgetsStore'

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
  { name: 'Form', icon: Globe, colorClass: 'block-card__icon--purple', type: 'Form' },
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
            ? { source: 'sidebar', type: 'column', name: block.name }
            : { source: 'sidebar', type: 'block', blockType: block.type, name: block.name }

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
            {savedWidgetsStore.widgets.map(widget => (
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
                    onClick={e => {
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
