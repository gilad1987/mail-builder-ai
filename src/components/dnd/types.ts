export interface DragData {
  source: 'sidebar' | 'canvas'
  type?: 'layout' | 'block' | 'column' | 'saved-widget'
  blockType?: string
  columns?: number[]
  name?: string
  blockId?: string
  parentId?: string
  widgetId?: string
  widgetType?: 'Section' | 'InnerSection'
}

export interface DropData {
  accepts?: 'layout' | 'block'
  sectionId?: string
  columnId?: string
}
