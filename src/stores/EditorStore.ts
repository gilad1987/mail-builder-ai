import { makeAutoObservable } from 'mobx'
import {
  Template,
  Section,
  Column,
  Block,
  Box,
  setActiveDeviceGetter,
  type DeviceType,
  type WidgetType,
  type StyleValue,
  type BoxJSON,
  type ColumnJSON,
} from '../models'

export type { DeviceType, WidgetType }
export { Box, Section, Column, Block, Template }

export type TabType = 'Content' | 'Style' | 'Container'
export type ThemeType = 'light' | 'dark'

class EditorStore {
  template: Template
  selectedElementId: string | null = null
  activeDevice: DeviceType = 'desktop'
  activeTab: TabType = 'Style'
  theme: ThemeType = 'dark'

  constructor() {
    this.template = new Template()
    this.initializeTemplate()

    makeAutoObservable(this, {
      template: false,
    })

    setActiveDeviceGetter(() => this.activeDevice)
  }

  private initializeTemplate() {
    // Section 1: Two columns
    const section1 = this.template.addSection()
    const col1 = section1.addColumn({ width: 60 } as ColumnJSON)
    const col2 = section1.addColumn({ width: 40 } as ColumnJSON)

    col1.addBlock({
      type: 'Paragraph',
      data: {
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      },
    })
    col1.addBlock({ type: 'Image', data: { src: '', alt: 'Placeholder' } })
    col2.addBlock({ type: 'Headline', data: { content: 'Welcome to the editor' } })

    // Section 2: Single column with button
    const section2 = this.template.addSection()
    const col3 = section2.addColumn({ width: 100 } as ColumnJSON)
    col3.addBlock({ type: 'Button', data: { text: 'Click Me', href: '#' } })

    // Section 3: Empty
    this.template.addSection()
  }

  // Selection
  get selectedBlockId(): string | null {
    return this.selectedElementId
  }

  setSelectedBlock(id: string | null) {
    this.selectedElementId = id
  }

  setSelectedElement(id: string | null) {
    this.selectedElementId = id
  }

  get selectedElement(): Box | null {
    if (!this.selectedElementId) return null
    return this.template.findById(this.selectedElementId)
  }

  get hasSelectedBlock() {
    return this.selectedElementId !== null
  }

  // Device & Theme
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

  // Template Operations
  get sections(): Section[] {
    return this.template.children
  }

  addSection(): Section {
    return this.template.addSection()
  }

  addColumnToSection(sectionId: string, width: number = 100): Column | null {
    const section = this.template.findById(sectionId) as Section | null
    if (section && section instanceof Section) {
      return section.addColumn({ width } as ColumnJSON)
    }
    return null
  }

  addBlockToColumn(
    columnId: string,
    blockType: string,
    data: Record<string, unknown> = {}
  ): Block | null {
    const column = this.template.findById(columnId) as Column | null
    if (column && column instanceof Column) {
      // Map block type names to WidgetType and default data
      const typeMap: Record<string, { type: WidgetType; defaultData: Record<string, unknown> }> = {
        Image: { type: 'Image', defaultData: { src: '', alt: 'Image' } },
        Spacer: { type: 'Spacer', defaultData: { height: '20px' } },
        Headline: { type: 'Headline', defaultData: { content: 'Headline' } },
        Paragraph: { type: 'Paragraph', defaultData: { content: 'Enter your text here...' } },
        Button: { type: 'Button', defaultData: { text: 'Click Me', href: '#' } },
        Divider: { type: 'Divider', defaultData: {} },
      }

      const mapping = typeMap[blockType] || {
        type: 'Paragraph' as WidgetType,
        defaultData: { content: blockType },
      }
      const block = column.addBlock({
        type: mapping.type,
        data: { ...mapping.defaultData, ...data },
      })
      this.selectedElementId = block.id
      return block
    }
    return null
  }

  addColumnLayout(sectionId: string, columnWidths: number[]) {
    const section = this.template.findById(sectionId) as Section | null
    if (section && section instanceof Section) {
      // Clear existing columns
      section.children = []
      // Add new columns
      columnWidths.forEach(width => section.addColumn({ width } as ColumnJSON))
    }
  }

  findElementById(id: string): Box | null {
    return this.template.findById(id)
  }

  removeElement(id: string) {
    const element = this.template.findById(id)
    if (element) {
      element.remove()
      if (this.selectedElementId === id) {
        this.selectedElementId = null
      }
    }
  }

  moveBlockToColumn(blockId: string, targetColumnId: string) {
    const block = this.template.findById(blockId)
    const targetColumn = this.template.findById(targetColumnId) as Column | null

    if (block && targetColumn && targetColumn instanceof Column) {
      // Remove from current parent
      block.remove()
      // Add to new column
      targetColumn.addChild(block)
      this.selectedElementId = block.id
    }
  }

  copyElement(elementId: string) {
    const element = this.template.findById(elementId)
    if (!element || !element.parent) return

    const parent = element.parent
    const clone = element.clone()

    // Find the index of the original element
    const index = parent.children.findIndex(c => c.id === elementId)

    // Add clone after the original
    parent.addChild(clone, index + 1)
    this.selectedElementId = clone.id
  }

  // Style Operations
  updateSelectedStyle(field: string, value: StyleValue) {
    const element = this.selectedElement
    if (element) {
      element.update(field, value)
    }
  }

  updateSelectedData(key: string, value: unknown) {
    const element = this.selectedElement
    if (element) {
      element.updateData(key, value)
    }
  }

  // Export
  exportAsHTML(): string {
    return this.template.toHTML()
  }

  exportAsJSON(): BoxJSON {
    return this.template.toJSON()
  }

  downloadHTML() {
    const html = this.exportAsHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'email-template.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Computed
  get deviceLabels() {
    return {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobile: 'Mobile',
    }
  }
}

export const editorStore = new EditorStore()
