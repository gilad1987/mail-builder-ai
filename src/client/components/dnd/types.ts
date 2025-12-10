export type DragSource = 'sidebar' | 'canvas'
export type DragItemType =
  | 'layout'
  | 'block'
  | 'column'
  | 'section'
  | 'element'
  | 'inner-section'
  | 'saved-widget'

export interface DragData {
  source: DragSource
  type?: DragItemType
  blockType?: string
  columns?: number[]
  name?: string
  // Canvas drag identifiers
  blockId?: string
  elementId?: string
  sectionId?: string
  columnId?: string
  innerSectionId?: string
  parentId?: string
  index?: number
  // Widget
  widgetId?: string
  widgetType?: 'Section' | 'InnerSection'
}

export type DropAccepts = 'layout' | 'block' | 'section' | 'column' | 'element'

export interface DropData {
  accepts?: DropAccepts | DropAccepts[]
  type?: 'section' | 'column' | 'element' | 'inner-section'
  sectionId?: string
  columnId?: string
  elementId?: string
  innerSectionId?: string
  index?: number
  // For sortable containers
  sortableId?: string
  containerId?: string
}
