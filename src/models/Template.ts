import { Box, type WidgetType, type BoxJSON, type StyleRecord } from './Box'
import { Section } from './Section'

export interface TemplateJSON extends BoxJSON {
  children?: BoxJSON[]
}

export class Template extends Box {
  declare children: Section[]

  constructor(json: TemplateJSON = {}) {
    super(json, null)
    this.name = 'Template'
    this.type = 'Template' as WidgetType
    this._style.desktop = {
      margin: '0 auto',
      backgroundColor: '#ffffff',
    }
    if (json.children) {
      this.fromJSON(json)
    }
  }

  fromJSON(json: TemplateJSON): void {
    this.children = (json.children || []).map(s => new Section(s, this))
    if (json._style) {
      this._style = json._style as StyleRecord
    }
  }

  clone(): Template {
    return new Template(this.toCloneJSON() as TemplateJSON)
  }

  // CSS Export - collects all styles with media queries
  generateCSS(): string {
    const desktop: string[] = []
    const tablet: string[] = []
    const mobile: string[] = []

    this.collectStyles(this, desktop, tablet, mobile)

    let css = desktop.join('\n')
    if (tablet.length) {
      css += `\n@media(max-width:768px){\n${tablet.join('\n')}\n}`
    }
    if (mobile.length) {
      css += `\n@media(max-width:480px){\n${mobile.join('\n')}\n}`
    }
    return css
  }

  collectStyles(el: Box, desktop: string[], tablet: string[], mobile: string[]): void {
    if (Object.keys(el._style.desktop).length) {
      desktop.push(`.${el.id}{${el.styleToCSS(el._style.desktop)}}`)
    }
    if (Object.keys(el._style.tablet).length) {
      tablet.push(`.${el.id}{${el.styleToCSS(el._style.tablet)}}`)
    }
    if (Object.keys(el._style.mobile).length) {
      mobile.push(`.${el.id}{${el.styleToCSS(el._style.mobile)}}`)
    }
    el.children.forEach(c => this.collectStyles(c, desktop, tablet, mobile))
  }

  // HTML Export
  toHTML(): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
${this.generateCSS()}
</style>
</head>
<body>
${this.renderChildrenHTML()}
</body>
</html>`
  }

  renderChildrenHTML(): string {
    return this.children.map(s => s.renderHTML()).join('')
  }

  renderHTML(): string {
    return `<div class="${this.id}">${this.renderChildrenHTML()}</div>`
  }

  // Add a new section
  addSection(json: BoxJSON = {}): Section {
    const section = new Section(json, this)
    this.addChild(section)
    return section
  }
}
