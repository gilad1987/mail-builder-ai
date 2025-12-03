import { Box, type WidgetType, type BoxJSON, type StyleRecord } from './Box'
import { Column } from './Column'

export interface InnerSectionJSON extends BoxJSON {
  children?: BoxJSON[]
}

export class InnerSection extends Box {
  declare children: Column[]

  constructor(json: InnerSectionJSON = {}, parent: Box | null = null) {
    super(json, parent)
    this.name = 'InnerSection'
    this.type = 'InnerSection' as WidgetType
    this._style.desktop = {
      flex: 1,
      width: '100%',
      'padding-size': 0,
      'padding-unit': 'px',
    }
    if (json.children) {
      this.fromJSON(json)
    }
  }

  fromJSON(json: InnerSectionJSON): void {
    this.children = (json.children || []).map(c => new Column(c, this))
    if (json._style) {
      this._style = json._style as StyleRecord
    }
  }

  clone(): InnerSection {
    return new InnerSection(this.toCloneJSON() as InnerSectionJSON, this.parent)
  }

  renderHTML(): string {
    return `<div class="${this.id}" style="${this.styleToCSS(this._style.desktop)}">
      ${this.children.map(c => c.renderHTML()).join('')}
    </div>`
  }

  // Add a column
  addColumn(json: BoxJSON = {}): Column {
    const column = new Column(json, this)
    this.addChild(column)
    return column
  }
}
