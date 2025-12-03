import { makeObservable, observable } from 'mobx'
import { Box, type BoxJSON, type StyleRecord, type WidgetType } from './Box'
import { Block } from './Block'
import { InnerSection } from './InnerSection'

export interface ColumnJSON extends BoxJSON {
  width?: number
  children?: BoxJSON[]
}

export class Column extends Box {
  declare children: (Block | InnerSection)[]
  width?: number // percentage, undefined means auto (flex: 1)

  constructor(json: ColumnJSON = {}, parent: Box | null = null) {
    super(json, parent)
    this.name = 'Column'
    this.type = 'Column' as WidgetType
    this.width = json.width // undefined means auto-expand

    // Set default styles, but preserve any styles from JSON
    if (json._style) {
      this._style = json._style as StyleRecord
    } else {
      this._style.desktop = {
        flex: 1,
        'padding-size': 10,
        'padding-unit': 'px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        'columnGap-size': 8,
        'columnGap-unit': 'px',
        'rowGap-size': 8,
        'rowGap-unit': 'px',
      }
    }

    makeObservable(this, {
      width: observable,
    })

    if (json.children) {
      this.fromJSON(json)
    }
  }

  fromJSON(json: ColumnJSON): void {
    this.children = (json.children || []).map(c => {
      if (c.name === 'InnerSection') {
        return new InnerSection(c, this)
      }
      return new Block(c, this)
    })
    if (json.width !== undefined) {
      this.width = json.width
    }
  }

  clone(): Column {
    return new Column({ ...(this.toCloneJSON() as ColumnJSON), width: this.width }, this.parent)
  }

  toCloneJSON(): ColumnJSON {
    return {
      ...super.toCloneJSON(),
      width: this.width,
    }
  }

  toJSON(): ColumnJSON {
    return {
      ...super.toJSON(),
      width: this.width,
    }
  }

  renderHTML(): string {
    const widthStyle = this.width !== undefined ? `width:${this.width}%;` : 'flex:1;'
    return `<div class="${this.id}" style="${widthStyle}${this.styleToCSS(this._style.desktop)}">
      ${this.children.map(c => c.renderHTML()).join('')}
    </div>`
  }

  // Add a block
  addBlock(json: BoxJSON = {}): Block {
    const block = new Block(json, this)
    this.addChild(block)
    return block
  }

  // Add an inner section
  addInnerSection(json: BoxJSON = {}): InnerSection {
    const innerSection = new InnerSection(json, this)
    this.addChild(innerSection)
    return innerSection
  }
}
