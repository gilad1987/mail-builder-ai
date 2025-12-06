import { Box, type BoxJSON, type StyleRecord, WidgetType } from './Box'
import { Column, type ColumnJSON } from './Column'

export interface SectionJSON extends BoxJSON {
  children?: BoxJSON[]
}

export class Section extends Box {
  declare children: Column[]

  constructor(json: SectionJSON = {}, parent: Box | null = null) {
    super(json, parent)
    this.name = 'Section'
    this.type = WidgetType.Section

    // Set default styles, but preserve any styles from JSON
    if (json._style) {
      this._style = json._style as StyleRecord
    } else {
      this._style.desktop = {
        flex: 1,
        width: '100%',
        'maxWidth-size': 650,
        'maxWidth-unit': 'px',
        margin: '0 auto',
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

  fromJSON(json: SectionJSON): void {
    // Clear existing children in place (don't reassign the array)
    this.children.splice(0, this.children.length)
    // Add each child using proper method to ensure reactivity
    ;(json.children || []).forEach(c => {
      this.addChild(new Column(c, this))
    })
  }

  clone(): Section {
    return new Section(this.toCloneJSON() as SectionJSON, this.parent)
  }

  renderHTML(): string {
    return `<div class="${this.id}" style="${this.styleToCSS(this._style.desktop)}">
      ${this.children.map(c => c.renderHTML()).join('')}
    </div>`
  }

  // Add a new column
  addColumn(json: ColumnJSON = {}): Column {
    const column = new Column(json, this)
    this.addChild(column)
    return column
  }

  // MJML Export
  toMJML(): string {
    const attrs = this.getMJMLAttributes()
    return `<mj-section${attrs}>
      ${this.children.map(col => col.toMJML()).join('\n      ')}
    </mj-section>`
  }

  private getMJMLAttributes(): string {
    const attrs: string[] = []
    const style = this._style.desktop

    // Background color
    const bgColor = style.backgroundColor as string | undefined
    if (bgColor && bgColor !== 'transparent') {
      attrs.push(`background-color="${bgColor}"`)
    }

    // Padding
    const paddingTop = (style['paddingTop-size'] || style['padding-size'] || 0) as number
    const paddingRight = (style['paddingRight-size'] || style['padding-size'] || 0) as number
    const paddingBottom = (style['paddingBottom-size'] || style['padding-size'] || 0) as number
    const paddingLeft = (style['paddingLeft-size'] || style['padding-size'] || 0) as number

    if (paddingTop || paddingRight || paddingBottom || paddingLeft) {
      attrs.push(`padding="${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px"`)
    }

    // Full width
    attrs.push('full-width="false"')

    return attrs.length ? ' ' + attrs.join(' ') : ''
  }
}
