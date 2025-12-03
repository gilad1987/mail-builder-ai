export interface DragData {
  source: 'sidebar' | 'canvas'
  type?: 'layout' | 'block'
  blockType?: string
  columns?: number[]
  name?: string
  blockId?: string
  parentId?: string
}

export interface DropData {
  accepts?: 'layout' | 'block'
  sectionId?: string
  columnId?: string
}
