import { makeAutoObservable } from 'mobx'

export type DeviceType = 'desktop' | 'tablet' | 'mobile'

export interface Block {
  id: string
  type: string
  content: string
  showImage: boolean
}

export interface Column {
  id: string
  width: number
  blocks: Block[]
}

export interface Row {
  id: string
  blocks: Block[]
  columns?: Column[]
}

export type TabType = 'Content' | 'Style' | 'Container'
export type ThemeType = 'light' | 'dark'

class EditorStore {
  selectedBlockId: string | null = 'row1-1'
  activeDevice: DeviceType = 'desktop'
  activeTab: TabType = 'Style'
  theme: ThemeType = 'dark'

  rows: Row[] = [
    {
      id: 'row1',
      blocks: [
        {
          id: 'row1-1',
          type: 'Paragraph',
          content:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. This content adapts to the selected device view.',
          showImage: true,
        },
        {
          id: 'row1-2',
          type: 'Headline',
          content: 'Welcome to the editor',
          showImage: false,
        },
      ],
    },
    {
      id: 'row2',
      blocks: [{ id: 'row2-1', type: 'Button', content: 'Click Me', showImage: false }],
    },
    { id: 'row3', blocks: [] },
  ]

  constructor() {
    makeAutoObservable(this)
  }

  setSelectedBlock(id: string | null) {
    this.selectedBlockId = id
  }

  setActiveDevice(device: DeviceType) {
    this.activeDevice = device
  }

  setActiveTab(tab: TabType) {
    this.activeTab = tab
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', this.theme)
  }

  setTheme(theme: ThemeType) {
    this.theme = theme
    document.documentElement.setAttribute('data-theme', this.theme)
  }

  addBlockToRow(targetRowId: string, targetIndex: number, blockType: string) {
    const newBlock: Block = {
      id: `${targetRowId}-${Date.now()}`,
      type: blockType,
      content: `New ${blockType} added via Drag & Drop`,
      showImage: blockType === 'Image',
    }

    const rowIndex = this.rows.findIndex(r => r.id === targetRowId)
    if (rowIndex !== -1) {
      this.rows[rowIndex].blocks.splice(targetIndex, 0, newBlock)
      this.selectedBlockId = newBlock.id
    }
  }

  moveBlock(fromRowId: string, fromIndex: number, targetRowId: string, targetIndex: number) {
    if (fromRowId === targetRowId && fromIndex === targetIndex) return

    const sourceRowIndex = this.rows.findIndex(r => r.id === fromRowId)
    const destRowIndex = this.rows.findIndex(r => r.id === targetRowId)

    if (sourceRowIndex === -1 || destRowIndex === -1) return

    const [movedBlock] = this.rows[sourceRowIndex].blocks.splice(fromIndex, 1)

    let finalIndex = targetIndex
    if (fromRowId === targetRowId && fromIndex < targetIndex) {
      finalIndex -= 1
    }

    this.rows[destRowIndex].blocks.splice(finalIndex, 0, movedBlock)
  }

  addRow() {
    const newRowId = `row${this.rows.length + 1}-${Date.now()}`
    this.rows.push({ id: newRowId, blocks: [] })
  }

  addColumnLayout(targetRowId: string, columnWidths: number[]) {
    const rowIndex = this.rows.findIndex(r => r.id === targetRowId)
    if (rowIndex === -1) return

    const columns: Column[] = columnWidths.map((width, i) => ({
      id: `${targetRowId}-col-${i}-${Date.now()}`,
      width,
      blocks: [],
    }))

    this.rows[rowIndex].columns = columns
    this.rows[rowIndex].blocks = []
  }

  addBlockToColumn(rowId: string, columnId: string, blockType: string) {
    const row = this.rows.find(r => r.id === rowId)
    if (!row?.columns) return

    const column = row.columns.find(c => c.id === columnId)
    if (!column) return

    const newBlock: Block = {
      id: `${columnId}-${Date.now()}`,
      type: blockType,
      content: `New ${blockType}`,
      showImage: blockType === 'Image',
    }
    column.blocks.push(newBlock)
    this.selectedBlockId = newBlock.id
  }

  get deviceLabels() {
    return {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobile: 'Mobile',
    }
  }

  get hasSelectedBlock() {
    return this.selectedBlockId !== null
  }
}

export const editorStore = new EditorStore()
