import type { DeviceType, StyleRecord, StyleProperties, StyleValue } from '../models'

/**
 * Utility functions for working with responsive styles
 */

// Convert camelCase to kebab-case for CSS properties
export function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// Convert kebab-case to camelCase for React style objects
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

// Merge styles for a specific device (cascading from desktop -> tablet -> mobile)
export function mergeStylesForDevice(
  styleRecord: StyleRecord,
  device: DeviceType
): StyleProperties {
  const { desktop, tablet, mobile } = styleRecord

  switch (device) {
    case 'mobile':
      return { ...desktop, ...tablet, ...mobile }
    case 'tablet':
      return { ...desktop, ...tablet }
    default:
      return { ...desktop }
  }
}

// Process size/unit pairs into CSS values
export function processStyleUnits(style: StyleProperties): StyleProperties {
  const result: StyleProperties = { ...style }

  // Find all -size properties and convert them
  Object.keys(style)
    .filter(k => k.includes('-size'))
    .forEach(key => {
      const prop = key.replace('-size', '')
      const unit = style[`${prop}-unit`] || 'px'
      const size = style[key]
      result[prop] = unit === 'auto' ? 'auto' : `${size}${unit}`
    })

  // Remove internal properties (those with dashes)
  Object.keys(result)
    .filter(k => k.includes('-'))
    .forEach(k => delete result[k])

  return result
}

// Convert style object to CSS string
export function styleToCSS(style: StyleProperties): string {
  const processed = processStyleUnits(style)
  return Object.entries(processed)
    .map(([prop, value]) => `${camelToKebab(prop)}:${value}`)
    .join(';')
}

// Convert style object to React inline style
export function styleToReact(style: StyleProperties): React.CSSProperties {
  return processStyleUnits(style) as React.CSSProperties
}

// Generate CSS class with styles
export function generateCSSClass(className: string, style: StyleProperties): string {
  const css = styleToCSS(style)
  return css ? `.${className}{${css}}` : ''
}

// Generate media query block
export function generateMediaQuery(breakpoint: string, rules: string[]): string {
  if (rules.length === 0) return ''
  return `@media(max-width:${breakpoint}){${rules.join('')}}`
}

// Common breakpoints
export const breakpoints = {
  tablet: '768px',
  mobile: '480px',
}

// Generate full CSS with media queries from style records
export function generateResponsiveCSS(
  elements: Array<{ id: string; _style: StyleRecord }>
): string {
  const desktop: string[] = []
  const tablet: string[] = []
  const mobile: string[] = []

  elements.forEach(el => {
    if (Object.keys(el._style.desktop).length) {
      desktop.push(generateCSSClass(el.id, el._style.desktop))
    }
    if (Object.keys(el._style.tablet).length) {
      tablet.push(generateCSSClass(el.id, el._style.tablet))
    }
    if (Object.keys(el._style.mobile).length) {
      mobile.push(generateCSSClass(el.id, el._style.mobile))
    }
  })

  let css = desktop.join('\n')
  if (tablet.length) {
    css += '\n' + generateMediaQuery(breakpoints.tablet, tablet)
  }
  if (mobile.length) {
    css += '\n' + generateMediaQuery(breakpoints.mobile, mobile)
  }

  return css
}

// Parse CSS value into size and unit
export function parseCSSValue(value: string): { size: number; unit: string } {
  const match = value.match(/^(-?\d*\.?\d+)(px|%|em|rem|vh|vw|auto)?$/)
  if (!match) {
    return { size: 0, unit: 'px' }
  }
  return {
    size: parseFloat(match[1]),
    unit: match[2] || 'px',
  }
}

// Create size/unit style entries from a CSS value
export function createSizeUnitStyle(property: string, value: string): Record<string, StyleValue> {
  const { size, unit } = parseCSSValue(value)
  return {
    [`${property}-size`]: size,
    [`${property}-unit`]: unit,
  }
}
