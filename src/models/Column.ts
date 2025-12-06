import { action, makeObservable, observable } from 'mobx'
import { Box, type BoxJSON, type StyleRecord, WidgetType } from './Box'
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
    this.type = WidgetType.Column
    this.width = json.width // undefined means auto-expand

    // Set default styles, but preserve any styles from JSON
    if (json._style) {
      this._style = json._style as StyleRecord
    } else {
      this._style.desktop = {
        flex: 1,
        'padding-size': 5,
        'padding-unit': 'px',
        'margin-size': 5,
        'margin-unit': 'px',
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

    // If width is set, also set it in _style so controllers can see it
    if (this.width !== undefined) {
      this._style.desktop['width-size'] = this.width
      this._style.desktop['width-unit'] = '%'
    }

    makeObservable(this, {
      width: observable,
      fromJSON: action,
      setWidth: action,
    })

    if (json.children) {
      this.fromJSON(json)
    }
  }

  fromJSON(json: ColumnJSON): void {
    // Clear existing children in place (don't reassign the array)
    this.children.splice(0, this.children.length)
    // Add each child using proper method to ensure reactivity
    ;(json.children || []).forEach(c => {
      if (c.name === 'InnerSection') {
        this.addChild(new InnerSection(c, this))
      } else {
        this.addChild(new Block(c, this))
      }
    })
    if (json.width !== undefined) {
      this.width = json.width
      // Also set in _style so controllers can see it
      this._style.desktop['width-size'] = json.width
      this._style.desktop['width-unit'] = '%'
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

  // Set width and sync to _style
  setWidth(value: number | undefined): void {
    this.width = value
    if (value !== undefined) {
      this._style.desktop['width-size'] = value
      this._style.desktop['width-unit'] = '%'
    } else {
      delete this._style.desktop['width-size']
      delete this._style.desktop['width-unit']
    }
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
