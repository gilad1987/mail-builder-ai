// Design tokens for styled-components (mirrors _variables.scss)

// Color shade types
type GrayShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
type BlueShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800
type PurpleShade = 500 | 600 | 700
type RedShade = 50 | 300 | 500
type SingleShade = 500

// Color palette interface
interface ColorPalette {
  gray: Record<GrayShade, string>
  blue: Record<BlueShade, string>
  green: Record<SingleShade, string>
  red: Record<RedShade, string>
  orange: Record<SingleShade, string>
  indigo: Record<SingleShade, string>
  teal: Record<SingleShade, string>
  yellow: Record<SingleShade, string>
  purple: Record<PurpleShade, string>
}

// Token interfaces
interface FontSize {
  xs: string
  sm: string
  base: string
  lg: string
}

interface FontWeight {
  normal: number
  medium: number
  semibold: number
  bold: number
}

interface Spacing {
  1: string
  2: string
  3: string
  4: string
  5: string
  6: string
  8: string
}

interface BorderRadius {
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

interface Shadow {
  sm: string
  md: string
  lg: string
  xl: string
}

interface Transition {
  fast: string
  normal: string
  slow: string
}

interface ZIndex {
  dropdown: number
  floating: number
  header: number
}

// Main tokens interface
export interface DesignTokens {
  colors: ColorPalette
  fontSize: FontSize
  fontWeight: FontWeight
  spacing: Spacing
  borderRadius: BorderRadius
  shadow: Shadow
  transition: Transition
  zIndex: ZIndex
}

export const tokens: DesignTokens = {
  colors: {
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
    },
    green: { 500: '#10b981' },
    red: { 50: '#fef2f2', 300: '#fca5a5', 500: '#ef4444' },
    orange: { 500: '#f97316' },
    indigo: { 500: '#6366f1' },
    teal: { 500: '#14b8a6' },
    yellow: { 500: '#f59e0b' },
    purple: { 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  transition: {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  zIndex: {
    dropdown: 10,
    floating: 20,
    header: 30,
  },
}
