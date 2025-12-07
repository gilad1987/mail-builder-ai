import { action, computed, makeObservable, observable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import { WidgetType } from '../config/elementControls'

// Re-export WidgetType from config for backward compatibility
export { WidgetType } from '../config/elementControls'

export type DeviceType = 'desktop' | 'tablet' | 'mobile'

export type StyleValue = string | number | undefined

export interface StyleProperties {
  [key: string]: StyleValue
}

export interface StyleRecord {
  desktop: StyleProperties
  tablet: StyleProperties
  mobile: StyleProperties
}

// Base JSON interface for all elements
export interface BoxJSON {
  id?: string
  name?: string
  type?: WidgetType
  _style?: StyleRecord
  data?: Record<string, unknown>
  children?: BoxJSON[]
}

/**
 * Element defaults - single source of truth for all default values
 * Used by: Canvas rendering, Web HTML export, Email/MJML export, Controllers
 */
export interface ElementDefaults {
  fontSize?: number
  fontWeight?: string
  lineHeight?: number
  color?: string
  backgroundColor?: string
  fontFamily?: string
  textAlign?: string
  textDecoration?: string
  letterSpacing?: number
  padding?: string
  borderRadius?: number
  defaultText?: string
  defaultContent?: string
}

// Default values for each widget type
export const WIDGET_DEFAULTS: Record<WidgetType, ElementDefaults> = {
  [WidgetType.Headline]: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    color: '#000000',
    fontFamily: 'Arial',
    textDecoration: 'none',
    letterSpacing: 0,
    defaultContent: 'Headline',
  },
  [WidgetType.Paragraph]: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
    color: '#000000',
    fontFamily: 'Arial',
    textDecoration: 'none',
    letterSpacing: 0,
    defaultContent: 'Lorem ipsum dolor sit amet...',
  },
  [WidgetType.List]: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
    color: '#000000',
    fontFamily: 'Arial',
    textDecoration: 'none',
    letterSpacing: 0,
  },
  [WidgetType.Button]: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    fontFamily: 'Arial',
    padding: '10px 25px',
    borderRadius: 6,
    defaultText: 'Click Me',
  },
  [WidgetType.Image]: {},
  [WidgetType.Spacer]: {},
  [WidgetType.Divider]: {
    backgroundColor: '#e5e7eb',
  },
  [WidgetType.Section]: {
    backgroundColor: 'transparent',
  },
  [WidgetType.Column]: {
    backgroundColor: 'transparent',
  },
  [WidgetType.InnerSection]: {
    backgroundColor: 'transparent',
  },
  [WidgetType.Template]: {
    backgroundColor: 'transparent',
  },
  [WidgetType.SocialLinks]: {
    color: '#333333',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  [WidgetType.Video]: {
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
}

/**
 * Get defaults for a widget type
 */
export function getWidgetDefaults(type: WidgetType): ElementDefaults {
  return WIDGET_DEFAULTS[type] || {}
}

// Will be set by EditorStore
let activeDeviceGetter: () => DeviceType = () => 'desktop'

export function setActiveDeviceGetter(getter: () => DeviceType) {
  activeDeviceGetter = getter
}

export abstract class Box {
  id: string
  key: string
  name: string = 'Box'
  type: WidgetType = WidgetType.Section
  parent: Box | null = null

  _style: StyleRecord
  data: Record<string, unknown> = {}
  children: Box[] = []

  constructor(json: BoxJSON = {}, parent: Box | null = null) {
    this.key = uuidv4()
    this.id = json.id || uuidv4()
    this.parent = parent
    this._style = this.factoryDefaultStyle()

    makeObservable(this, {
      _style: observable,
      data: observable,
      children: observable,
      name: observable,
      type: observable,
      style: computed,
      update: action,
      updateData: action,
      addChild: action,
      removeChild: action,
    })
  }

  getActiveDevice(): DeviceType {
    return activeDeviceGetter()
  }

  // Computed: merged style for current device
  get style(): StyleProperties {
    const { desktop, tablet, mobile } = this._style
    const device = this.getActiveDevice()
    let merged: StyleProperties
    switch (device) {
      case 'mobile':
        merged = { ...desktop, ...tablet, ...mobile }
        break
      case 'tablet':
        merged = { ...desktop, ...tablet }
        break
      default:
        merged = { ...desktop }
    }
    return this.factoryStyle(merged)
  }

  // Action: update style field for current device
  update(field: string, value: StyleValue): void {
    const device = this.getActiveDevice()
    if (value === undefined) {
      delete this._style[device][field]
    } else {
      this._style[device][field] = value
    }
  }

  // Action: update data field
  updateData(key: string, value: unknown): void {
    this.data[key] = value
  }

  // Action: add child element
  addChild(child: Box, index?: number): void {
    child.parent = this
    if (index !== undefined) {
      this.children.splice(index, 0, child)
    } else {
      this.children.push(child)
    }
  }

  // Action: remove child by id
  removeChild(id: string): void {
    const index = this.children.findIndex(c => c.id === id)
    if (index !== -1) {
      this.children.splice(index, 1)
    }
  }

  // Action: remove self from parent
  remove(): void {
    this.parent?.removeChild(this.id)
  }

  // Find element by ID recursively
  findById(id: string): Box | null {
    if (this.id === id) return this
    for (const child of this.children) {
      const found = child.findById(id)
      if (found) return found
    }
    return null
  }

  // Abstract methods to be implemented by subclasses
  abstract clone(): Box
  abstract fromJSON(json: BoxJSON): void

  // Render to HTML string (for export only, not for canvas)
  abstract renderHTML(): string

  // Serialize to JSON
  toJSON(): BoxJSON {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      _style: this._style,
      data: this.data,
      children: this.children.map(c => c.toJSON()),
    }
  }

  // Serialize to JSON for cloning (without id to force new id/key generation)
  toCloneJSON(): BoxJSON {
    return {
      name: this.name,
      type: this.type,
      _style: JSON.parse(JSON.stringify(this._style)), // Deep clone styles
      data: JSON.parse(JSON.stringify(this.data)), // Deep clone data
      children: this.children.map(c => c.toCloneJSON()),
    }
  }

  // Default style structure
  factoryDefaultStyle(): StyleRecord {
    return { desktop: {}, tablet: {}, mobile: {} }
  }

  // Convert stored style to CSS-ready format (handles size/unit)
  factoryStyle(style: StyleProperties): StyleProperties {
    const result: StyleProperties = { ...style }

    // Convert size/unit pairs to CSS values
    Object.keys(style)
      .filter(k => k.includes('-size'))
      .forEach(key => {
        const prop = key.replace('-size', '')
        const unit = style[`${prop}-unit`] || 'px'
        const size = style[key]
        result[prop] = unit === 'auto' ? 'auto' : `${size}${unit}`
      })

    // Process background gradient
    if (style['bgGradient-type']) {
      const bgType = style['bgGradient-type']
      if (bgType === 'gradient') {
        const gradientType = style['bgGradient-gradientType'] || 'linear'
        const color1 = style['bgGradient-color1'] || '#6366f1'
        const location1 = style['bgGradient-location1'] ?? 0
        const color2 = style['bgGradient-color2'] || '#ec4899'
        const location2 = style['bgGradient-location2'] ?? 100
        const angle = style['bgGradient-angle'] ?? 180

        if (gradientType === 'linear') {
          result.background = `linear-gradient(${angle}deg, ${color1} ${location1}%, ${color2} ${location2}%)`
        } else {
          result.background = `radial-gradient(circle, ${color1} ${location1}%, ${color2} ${location2}%)`
        }
      } else if (bgType === 'solid') {
        const color1 = style['bgGradient-color1'] || '#6366f1'
        result.backgroundColor = color1
      }
    }

    // Process box shadow
    if (style['boxShadow-color'] || style['boxShadow-blur'] !== undefined) {
      const color = style['boxShadow-color'] || 'rgba(0,0,0,0.25)'
      const horizontal = style['boxShadow-horizontal'] ?? 0
      const vertical = style['boxShadow-vertical'] ?? 0
      const blur = style['boxShadow-blur'] ?? 10
      const spread = style['boxShadow-spread'] ?? 0
      const position = style['boxShadow-position'] || 'outline'
      const inset = position === 'inset' ? 'inset ' : ''
      result.boxShadow = `${inset}${horizontal}px ${vertical}px ${blur}px ${spread}px ${color}`
    }

    // Clean up internal properties (those with dashes)
    Object.keys(result)
      .filter(k => k.includes('-'))
      .forEach(k => delete result[k])

    return result
  }

  // Convert style object to CSS string
  styleToCSS(style: StyleProperties): string {
    return Object.entries(this.factoryStyle(style))
      .map(([prop, value]) => {
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase()
        return `${cssProp}:${value}`
      })
      .join(';')
  }

  // Get defaults for this element type
  get defaults(): ElementDefaults {
    return getWidgetDefaults(this.type)
  }

  // Get a style value with fallback to default
  getStyleWithDefault<K extends keyof ElementDefaults>(
    property: string,
    defaultKey: K
  ): ElementDefaults[K] | StyleValue {
    const value = this.style[property]
    if (value !== undefined) return value
    return this.defaults[defaultKey]
  }
}
