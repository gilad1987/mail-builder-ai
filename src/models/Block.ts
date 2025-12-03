import { Box, type WidgetType, type BoxJSON, type StyleRecord } from './Box'

export interface BlockJSON extends BoxJSON {
  type?: WidgetType
  data?: Record<string, unknown>
}

export class Block extends Box {
  constructor(json: BlockJSON = {}, parent: Box | null = null) {
    super(json, parent)
    this.name = 'Block'
    this.type = (json.type as WidgetType) || 'Paragraph'
    this.data = json.data || { content: 'Lorem ipsum...' }
    if (json._style) {
      this._style = json._style as StyleRecord
    }
  }

  fromJSON(json: BlockJSON): void {
    this.type = json.type || 'Paragraph'
    this.data = json.data || {}
    if (json._style) {
      this._style = json._style as StyleRecord
    }
  }

  clone(): Block {
    return new Block(this.toCloneJSON() as BlockJSON, this.parent)
  }

  renderHTML(): string {
    const style = this.styleToCSS(this._style.desktop)

    switch (this.type) {
      case 'Image':
        return `<img class="${this.id}" src="${(this.data.src as string) || ''}" alt="${(this.data.alt as string) || ''}" style="${style}" />`

      case 'Button':
        return `<a class="${this.id}" href="${(this.data.href as string) || '#'}" style="${style}">${(this.data.text as string) || 'Click'}</a>`

      case 'Headline':
        return `<h2 class="${this.id}" style="${style}">${(this.data.content as string) || ''}</h2>`

      case 'Spacer':
        return `<div class="${this.id}" style="height:${(this.data.height as string) || '20px'};${style}"></div>`

      case 'Divider':
        return `<hr class="${this.id}" style="${style}" />`

      default:
        // Paragraph
        return `<p class="${this.id}" style="${style}">${(this.data.content as string) || ''}</p>`
    }
  }

  // Helper to set block type
  setType(type: WidgetType): void {
    this.type = type
  }

  // Helper to set content
  setContent(content: string): void {
    this.data.content = content
  }
}
