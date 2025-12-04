import { Box, type BoxJSON, type StyleRecord, WidgetType } from './Box'

export interface BlockJSON extends BoxJSON {
  type?: WidgetType
  data?: Record<string, unknown>
}

export class Block extends Box {
  constructor(json: BlockJSON = {}, parent: Box | null = null) {
    super(json, parent)
    this.name = 'Block'
    this.type = (json.type as WidgetType) || WidgetType.Paragraph
    this.data = json.data || { content: 'Lorem ipsum...' }
    if (json._style) {
      this._style = json._style as StyleRecord
    }
  }

  fromJSON(json: BlockJSON): void {
    this.type = json.type || WidgetType.Paragraph
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
      case WidgetType.Image:
        return `<img class="${this.id}" src="${(this.data.src as string) || ''}" alt="${(this.data.alt as string) || ''}" style="${style}" />`

      case WidgetType.Button:
        return `<a class="${this.id}" href="${(this.data.href as string) || '#'}" style="${style}">${(this.data.text as string) || 'Click'}</a>`

      case WidgetType.Headline:
        return `<h2 class="${this.id}" style="${style}">${(this.data.content as string) || ''}</h2>`

      case WidgetType.Spacer:
        return `<div class="${this.id}" style="height:${(this.data.height as string) || '20px'};${style}"></div>`

      case WidgetType.Divider:
        return `<hr class="${this.id}" style="${style}" />`

      case WidgetType.List: {
        const items = (this.data.items as string[]) || ['Item 1', 'Item 2', 'Item 3']
        const listType = (this.data.listType as string) || 'bullet'
        const tag = listType === 'numbered' ? 'ol' : 'ul'
        const itemsHtml = items.map(item => `<li>${item}</li>`).join('')
        return `<${tag} class="${this.id}" style="${style}">${itemsHtml}</${tag}>`
      }

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
