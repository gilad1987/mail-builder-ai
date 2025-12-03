import { Box, type WidgetType, type BoxJSON, type StyleRecord } from './Box'
import { Column } from './Column'

export interface SectionJSON extends BoxJSON {
  children?: BoxJSON[]
}

export class Section extends Box {
  declare children: Column[]

  constructor(json: SectionJSON = {}, parent: Box | null = null) {
    super(json, parent)
    this.name = 'Section'
    this.type = 'Section' as WidgetType
    this._style.desktop = {
      width: '100%',
      'maxWidth-size': 650,
      'maxWidth-unit': 'px',
      margin: '0 auto',
    }
    if (json.children) {
      this.fromJSON(json)
    }
  }

  fromJSON(json: SectionJSON): void {
    this.children = (json.children || []).map(c => new Column(c, this))
    if (json._style) {
      this._style = json._style as StyleRecord
    }
  }

  clone(): Section {
    return new Section(this.toJSON() as SectionJSON, this.parent)
  }

  renderHTML(): string {
    return `<div class="${this.id}" style="${this.styleToCSS(this._style.desktop)}">
      ${this.children.map(c => c.renderHTML()).join('')}
    </div>`
  }

  // Add a new column
  addColumn(json: BoxJSON = {}): Column {
    const column = new Column(json, this)
    this.addChild(column)
    return column
  }
}
