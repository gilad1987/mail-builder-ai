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
    // Separate container styles from element styles
    const desktopStyle = { ...this._style.desktop }

    // Extract container-specific styles
    const containerBgColor = desktopStyle.containerBackgroundColor as string | undefined
    const containerPaddingTop = desktopStyle['containerPaddingTop-size'] as number | undefined
    const containerPaddingRight = desktopStyle['containerPaddingRight-size'] as number | undefined
    const containerPaddingBottom = desktopStyle['containerPaddingBottom-size'] as number | undefined
    const containerPaddingLeft = desktopStyle['containerPaddingLeft-size'] as number | undefined
    const containerMarginTop = desktopStyle['containerMarginTop-size'] as number | undefined
    const containerMarginRight = desktopStyle['containerMarginRight-size'] as number | undefined
    const containerMarginBottom = desktopStyle['containerMarginBottom-size'] as number | undefined
    const containerMarginLeft = desktopStyle['containerMarginLeft-size'] as number | undefined

    // Remove container-specific styles from element styles
    delete desktopStyle.containerBackgroundColor
    delete desktopStyle['containerPaddingTop-size']
    delete desktopStyle['containerPaddingTop-unit']
    delete desktopStyle['containerPaddingRight-size']
    delete desktopStyle['containerPaddingRight-unit']
    delete desktopStyle['containerPaddingBottom-size']
    delete desktopStyle['containerPaddingBottom-unit']
    delete desktopStyle['containerPaddingLeft-size']
    delete desktopStyle['containerPaddingLeft-unit']
    delete desktopStyle['containerMarginTop-size']
    delete desktopStyle['containerMarginTop-unit']
    delete desktopStyle['containerMarginRight-size']
    delete desktopStyle['containerMarginRight-unit']
    delete desktopStyle['containerMarginBottom-size']
    delete desktopStyle['containerMarginBottom-unit']
    delete desktopStyle['containerMarginLeft-size']
    delete desktopStyle['containerMarginLeft-unit']

    const style = this.styleToCSS(desktopStyle)

    let elementHtml: string
    switch (this.type) {
      case WidgetType.Image:
        elementHtml = `<img class="${this.id}" src="${(this.data.src as string) || ''}" alt="${(this.data.alt as string) || ''}" style="${style}" />`
        break

      case WidgetType.Button:
        elementHtml = `<a class="${this.id}" href="${(this.data.href as string) || '#'}" style="${style}">${(this.data.text as string) || 'Click'}</a>`
        break

      case WidgetType.Headline:
        elementHtml = `<h2 class="${this.id}" style="${style}">${(this.data.content as string) || ''}</h2>`
        break

      case WidgetType.Spacer:
        elementHtml = `<div class="${this.id}" style="height:${(this.data.height as string) || '20px'};${style}"></div>`
        break

      case WidgetType.Divider:
        elementHtml = `<hr class="${this.id}" style="${style}" />`
        break

      case WidgetType.List: {
        const items = (this.data.items as string[]) || ['Item 1', 'Item 2', 'Item 3']
        const listType = (this.data.listType as string) || 'bullet'
        const tag = listType === 'numbered' ? 'ol' : 'ul'
        const itemsHtml = items.map(item => `<li>${item}</li>`).join('')
        elementHtml = `<${tag} class="${this.id}" style="${style}">${itemsHtml}</${tag}>`
        break
      }

      default:
        // Paragraph
        elementHtml = `<p class="${this.id}" style="${style}">${(this.data.content as string) || ''}</p>`
    }

    // Check if we need a container wrapper
    const hasContainerBg = containerBgColor && containerBgColor !== 'transparent'
    const hasContainerPadding =
      containerPaddingTop || containerPaddingRight || containerPaddingBottom || containerPaddingLeft
    const hasContainerMargin =
      containerMarginTop || containerMarginRight || containerMarginBottom || containerMarginLeft

    if (hasContainerBg || hasContainerPadding || hasContainerMargin) {
      const containerStyles: string[] = []
      if (hasContainerBg) {
        containerStyles.push(`background-color:${containerBgColor}`)
      }
      if (hasContainerPadding) {
        const padding = `${containerPaddingTop || 0}px ${containerPaddingRight || 0}px ${containerPaddingBottom || 0}px ${containerPaddingLeft || 0}px`
        containerStyles.push(`padding:${padding}`)
      }
      if (hasContainerMargin) {
        const margin = `${containerMarginTop || 0}px ${containerMarginRight || 0}px ${containerMarginBottom || 0}px ${containerMarginLeft || 0}px`
        containerStyles.push(`margin:${margin}`)
      }
      return `<div class="${this.id}-container" style="${containerStyles.join(';')}">${elementHtml}</div>`
    }

    return elementHtml
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
