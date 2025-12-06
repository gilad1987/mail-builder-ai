import { makeAutoObservable } from 'mobx'
import mjml2html from 'mjml-browser'
import {
  Block,
  Box,
  type BoxJSON,
  Column,
  type ColumnJSON,
  defaultGlobalStyles,
  type DeviceType,
  type GlobalColors,
  type GlobalStyles,
  InnerSection,
  Section,
  setActiveDeviceGetter,
  type StyleValue,
  Template,
  type TypographyStyle,
  WidgetType,
} from '../models'

export type { DeviceType }
export { WidgetType }
export { Box, Section, Column, Block, Template }

export type TabType = 'Content' | 'Style' | 'Container'
export type ThemeType = 'light' | 'dark'

class EditorStore {
  template: Template
  globalStyles: GlobalStyles = JSON.parse(JSON.stringify(defaultGlobalStyles))
  selectedElementId: string | null = null
  hoveredElementId: string | null = null
  activeDevice: DeviceType = 'desktop'
  activeTab: TabType = 'Style'
  theme: ThemeType = 'dark'
  templateVersion: number = 0 // Used to trigger re-renders when template is replaced

  constructor() {
    this.template = new Template()
    // Start with empty canvas for best UX

    makeAutoObservable(this, {
      template: true,
      globalStyles: true,
    })

    setActiveDeviceGetter(() => this.activeDevice)
  }

  // Check if canvas is empty
  get isEmpty(): boolean {
    return this.template.children.length === 0
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

  setHoveredElement(id: string | null) {
    this.hoveredElementId = id
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

  // Global Styles
  updateGlobalColor(name: keyof GlobalColors, value: string) {
    this.globalStyles.colors[name] = value
  }

  updateTypography(
    category: keyof GlobalStyles['typography'],
    field: keyof TypographyStyle,
    value: string
  ) {
    this.globalStyles.typography[category][field] = value
  }

  private applyGlobalStylesToBlock(block: Block) {
    const { typography, colors } = this.globalStyles

    switch (block.type) {
      case WidgetType.Headline:
        if (typography.heading.color !== 'inherit') {
          block._style.desktop.color = typography.heading.color
        }
        block._style.desktop.fontSize = typography.heading.fontSize
        block._style.desktop.lineHeight = typography.heading.lineHeight
        break
      case WidgetType.Paragraph:
        if (typography.body.color !== 'inherit') {
          block._style.desktop.color = typography.body.color
        }
        block._style.desktop.fontSize = typography.body.fontSize
        block._style.desktop.lineHeight = typography.body.lineHeight
        break
      case WidgetType.Button:
        block._style.desktop.color = typography.buttons.color
        block._style.desktop.fontSize = typography.buttons.fontSize
        block._style.desktop.backgroundColor = colors.primary
        break
    }
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
      const column = section.addColumn({ width } as ColumnJSON)
      return column
    }
    return null
  }

  addBlockToColumn(
    columnId: string,
    blockType: string,
    data: Record<string, unknown> = {}
  ): Block | InnerSection | null {
    const column = this.template.findById(columnId) as Column | null
    if (column && column instanceof Column) {
      // Handle InnerSection separately
      if (blockType === 'InnerSection') {
        const innerSection = column.addInnerSection({})
        // Add two default columns to the inner section
        innerSection.addColumn({ width: 50 })
        innerSection.addColumn({ width: 50 })
        this.selectedElementId = innerSection.id
        return innerSection
      }

      // Map block type names to WidgetType and default data
      const typeMap: Record<string, { type: WidgetType; defaultData: Record<string, unknown> }> = {
        Image: { type: WidgetType.Image, defaultData: { src: '', alt: 'Image' } },
        Spacer: { type: WidgetType.Spacer, defaultData: { height: '20px' } },
        Headline: { type: WidgetType.Headline, defaultData: { content: 'Headline' } },
        Paragraph: {
          type: WidgetType.Paragraph,
          defaultData: { content: 'Enter your text here...' },
        },
        Button: { type: WidgetType.Button, defaultData: { text: 'Click Me', href: '#' } },
        Divider: { type: WidgetType.Divider, defaultData: {} },
        List: {
          type: WidgetType.List,
          defaultData: { items: ['Item 1', 'Item 2', 'Item 3'], listType: 'bullet' },
        },
      }

      const mapping = typeMap[blockType] || {
        type: WidgetType.Paragraph,
        defaultData: { content: blockType },
      }
      const block = column.addBlock({
        type: mapping.type,
        data: { ...mapping.defaultData, ...data },
      })
      this.applyGlobalStylesToBlock(block)
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

  // Export as email-compatible HTML using MJML
  exportAsEmailHTML(): string {
    const mjmlMarkup = this.template.toMJML()
    const { html, errors } = mjml2html(mjmlMarkup, {
      validationLevel: 'soft',
      minify: false,
    })

    if (errors.length > 0) {
      console.warn('MJML compilation warnings:', errors)
    }

    return html
  }

  // Export raw MJML markup (for debugging or external processing)
  exportAsMJML(): string {
    return this.template.toMJML()
  }

  exportAsJSON(): BoxJSON & { globalStyles: GlobalStyles } {
    return {
      ...this.template.toJSON(),
      globalStyles: this.globalStyles,
    }
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

  // Download email-compatible HTML
  downloadEmailHTML() {
    const html = this.exportAsEmailHTML()
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

  downloadJSON() {
    const json = this.exportAsJSON()
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'email-template.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import
  importFromJSON(json: BoxJSON & { globalStyles?: GlobalStyles }) {
    this.selectedElementId = null
    this.hoveredElementId = null
    this.template = new Template(json)
    if (json.globalStyles) {
      this.globalStyles = json.globalStyles
    }
    this.templateVersion++ // Trigger re-render
  }

  importFromJSONString(jsonString: string): boolean {
    try {
      const json = JSON.parse(jsonString) as BoxJSON & { globalStyles?: GlobalStyles }
      this.importFromJSON(json)
      return true
    } catch (error) {
      console.error('Failed to parse JSON:', error)
      return false
    }
  }

  // Open file dialog and import JSON
  openImportDialog() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = event => {
          const content = event.target?.result as string
          if (content) {
            this.importFromJSONString(content)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  // Clear template
  clearTemplate() {
    this.selectedElementId = null
    this.hoveredElementId = null
    this.template = new Template()
    this.templateVersion++ // Trigger re-render
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
