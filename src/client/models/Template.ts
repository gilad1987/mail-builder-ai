import { Box, type BoxJSON, type StyleRecord, WidgetType } from './Box'
import { Section } from './Section'

export interface TemplateJSON extends BoxJSON {
  children?: BoxJSON[]
}

export class Template extends Box {
  override children: Section[] = []

  constructor(json: TemplateJSON = {}) {
    super(json, null)
    this.name = 'Template'
    this.type = WidgetType.Template
    this._style.desktop = {
      margin: '0 auto',
      backgroundColor: '#ffffff',
    }
    if (json.children) {
      this.fromJSON(json)
    }
  }

  fromJSON(json: TemplateJSON): void {
    // Clear existing children in place (don't reassign the array)
    this.children.splice(0, this.children.length)
    // Add each child using proper method to ensure reactivity
    ;(json.children || []).forEach((s) => {
      this.addChild(new Section(s, this))
    })
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
    el.children.forEach((c) => this.collectStyles(c, desktop, tablet, mobile))
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
    return this.children.map((s) => s.renderHTML()).join('')
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

  // MJML Export
  toMJML(): string {
    const bgColor = this._style.desktop.backgroundColor as string | undefined
    const bodyAttrs = bgColor && bgColor !== 'transparent' ? ` background-color="${bgColor}"` : ''

    return `<mjml lang="en">
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="14px" line-height="1.5" />
      <mj-section padding="0" />
    </mj-attributes>
    <mj-style>
      [owa] .mj-column-per-100 { width: 100% !important; max-width: 100%; }
      [owa] .mj-column-per-50 { width: 50% !important; max-width: 50%; }
      [owa] .mj-column-per-33 { width: 33% !important; max-width: 33%; }
    </mj-style>
    <mj-style>
      @media only screen and (max-width:479px) {
        table.mj-full-width-mobile { width: 100% !important; }
        td.mj-full-width-mobile { width: auto !important; }
      }
    </mj-style>
    <mj-style>
      a { color: inherit; }
    </mj-style>
  </mj-head>
  <mj-body${bodyAttrs}>
    ${this.children.map((section) => section.toMJML()).join('\n    ')}
  </mj-body>
</mjml>`
  }
}
