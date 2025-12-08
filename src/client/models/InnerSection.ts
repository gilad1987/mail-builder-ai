import { Box, type BoxJSON, type StyleRecord, WidgetType } from './Box'
import { Column, type ColumnJSON } from './Column'

export interface InnerSectionJSON extends BoxJSON {
  children?: BoxJSON[]
}

export class InnerSection extends Box {
  override children: Column[] = []

  constructor(json: InnerSectionJSON = {}, parent: Box | null = null) {
    super(json, parent)
    this.name = 'InnerSection'
    this.type = WidgetType.InnerSection

    // Set default styles, but preserve any styles from JSON
    if (json._style) {
      this._style = json._style as StyleRecord
    } else {
      this._style.desktop = {
        flex: 1,
        width: '100%',
        'padding-size': 20,
        'padding-unit': 'px',
        'margin-size': 20,
        'margin-unit': 'px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        'columnGap-size': 8,
        'columnGap-unit': 'px',
        'rowGap-size': 8,
        'rowGap-unit': 'px',
      }
    }

    if (json.children) {
      this.fromJSON(json)
    }
  }

  fromJSON(json: InnerSectionJSON): void {
    // Clear existing children in place (don't reassign the array)
    this.children.splice(0, this.children.length)
    // Add each child using proper method to ensure reactivity
    ;(json.children || []).forEach((c) => {
      this.addChild(new Column(c, this))
    })
  }

  clone(): InnerSection {
    return new InnerSection(this.toCloneJSON() as InnerSectionJSON, this.parent)
  }

  renderHTML(): string {
    return `<div class="${this.id}" style="${this.styleToCSS(this._style.desktop)}">
      ${this.children.map((c) => c.renderHTML()).join('')}
    </div>`
  }

  // Add a column
  addColumn(json: ColumnJSON = {}): Column {
    const column = new Column(json, this)
    this.addChild(column)
    return column
  }

  // MJML Export - Inner sections become a group in MJML
  toMJML(): string {
    const attrs = this.getMJMLAttributes()
    return `<mj-group${attrs}>
        ${this.children.map((col) => col.toMJML()).join('\n        ')}
      </mj-group>`
  }

  private getMJMLAttributes(): string {
    const attrs: string[] = []
    const style = this._style.desktop

    // Background color
    const bgColor = style.backgroundColor as string | undefined
    if (bgColor && bgColor !== 'transparent') {
      attrs.push(`background-color="${bgColor}"`)
    }

    return attrs.length ? ' ' + attrs.join(' ') : ''
  }
}
