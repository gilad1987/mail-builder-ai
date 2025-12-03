import { makeAutoObservable } from 'mobx'

export type DeviceType = 'desktop' | 'tablet' | 'mobile'

export interface Block {
  id: string
  type: string
  content: string
  showImage: boolean
}

export interface Row {
  id: string
  blocks: Block[]
}

export type TabType = 'Content' | 'Style' | 'Container'

class EditorStore {
  selectedBlockId: string | null = 'row1-1'
  activeDevice: DeviceType = 'desktop'
  activeTab: TabType = 'Style'

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
