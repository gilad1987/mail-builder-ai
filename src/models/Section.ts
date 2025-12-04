import { Box, type BoxJSON, type StyleRecord, WidgetType } from './Box'
import { Column } from './Column'

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
    this.children = (json.children || []).map(c => new Column(c, this))
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
  addColumn(json: BoxJSON = {}): Column {
    const column = new Column(json, this)
    this.addChild(column)
    return column
  }
}
