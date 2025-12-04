import { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { editorStore } from '../../../stores/EditorStore'
import {
  BorderAllIcon,
  BorderBottomIcon,
  BorderLeftIcon,
  BorderRightIcon,
  BorderTopIcon,
  StyleDashedIcon,
  StyleNoneIcon,
  StyleSolidIcon,
} from './BorderIcons'

type BorderSide = 'all' | 'top' | 'right' | 'bottom' | 'left'
type BorderStyle = 'none' | 'solid' | 'dashed'

const sides: { side: BorderSide; Icon: React.FC; capitalize: string }[] = [
  { side: 'top', Icon: BorderTopIcon, capitalize: 'Top' },
  { side: 'right', Icon: BorderRightIcon, capitalize: 'Right' },
  { side: 'bottom', Icon: BorderBottomIcon, capitalize: 'Bottom' },
  { side: 'left', Icon: BorderLeftIcon, capitalize: 'Left' },
  { side: 'all', Icon: BorderAllIcon, capitalize: '' },
]

const styleOptions: { style: BorderStyle; Icon: React.FC }[] = [
  { style: 'none', Icon: StyleNoneIcon },
  { style: 'solid', Icon: StyleSolidIcon },
  { style: 'dashed', Icon: StyleDashedIcon },
]

export const BorderSideSection = observer(() => {
  const [activeSide, setActiveSide] = useState<BorderSide>('all')
  const colorInputRef = useRef<HTMLInputElement>(null)
  const element = editorStore.selectedElement
  const device = editorStore.activeDevice

  // Get the property key based on active side
  const getPropertyKey = (prop: string, side: BorderSide): string => {
    if (side === 'all') return `border${prop}`
    const sideData = sides.find(s => s.side === side)
    return `border${sideData?.capitalize}${prop}`
  }

  // Get border style value
  const getBorderStyle = (): BorderStyle => {
    if (!element) return 'none'
    const key = getPropertyKey('Style', activeSide)
    const style = element._style[device]
    const value = style[key] ?? element._style.desktop[key] ?? 'none'
    return (value as BorderStyle) || 'none'
  }

  // Get border width value
  const getBorderWidth = (): number => {
    if (!element) return 0
    const key = `${getPropertyKey('Width', activeSide)}-size`
    const style = element._style[device]
    const value = style[key] ?? element._style.desktop[key] ?? 0
    return typeof value === 'number' ? value : 0
  }

  // Get border color value
  const getBorderColor = (): string => {
    if (!element) return '#000000'
    const key = getPropertyKey('Color', activeSide)
    const style = element._style[device]
    const value = style[key] ?? element._style.desktop[key] ?? '#000000'
    return typeof value === 'string' ? value : '#000000'
  }

  // Update border style
  const handleStyleChange = (style: BorderStyle) => {
    if (!element) return
    if (activeSide === 'all') {
      element.update('borderStyle', style)
      // Clear individual sides
      sides
        .filter(s => s.side !== 'all')
        .forEach(s => {
          element.update(`border${s.capitalize}Style`, undefined)
        })
    } else {
      const key = getPropertyKey('Style', activeSide)
      element.update(key, style)
    }
  }

  // Update border width
  const handleWidthChange = (value: number) => {
    if (!element) return
    if (activeSide === 'all') {
      element.update('borderWidth-size', value)
      element.update('borderWidth-unit', 'px')
      // Clear individual sides
      sides
        .filter(s => s.side !== 'all')
        .forEach(s => {
          element.update(`border${s.capitalize}Width-size`, undefined)
          element.update(`border${s.capitalize}Width-unit`, undefined)
        })
    } else {
      const key = getPropertyKey('Width', activeSide)
      element.update(`${key}-size`, value)
      element.update(`${key}-unit`, 'px')
    }
  }

  // Update border color
  const handleColorChange = (value: string) => {
    if (!element) return
    if (activeSide === 'all') {
      element.update('borderColor', value)
      // Clear individual sides
      sides
        .filter(s => s.side !== 'all')
        .forEach(s => {
          element.update(`border${s.capitalize}Color`, undefined)
        })
    } else {
      const key = getPropertyKey('Color', activeSide)
      element.update(key, value)
    }
  }

  const currentStyle = getBorderStyle()
  const currentWidth = getBorderWidth()
  const currentColor = getBorderColor()

  return (
    <div className="border-controller__section">
      <div className="border-controller__row">
        <span className="border-controller__label">Borders</span>
      </div>

      <div className="border-controller__borders-grid">
        <div className="border-controller__sides">
          {sides.map(({ side, Icon }) => (
            <button
              key={side}
              className={`border-controller__icon-btn ${activeSide === side ? 'is-active' : ''}`}
              onClick={() => setActiveSide(side)}
              title={`Border ${side}`}
            >
              <Icon />
            </button>
          ))}
        </div>

        <div className="border-controller__props">
          <label className="border-controller__prop-label">Style</label>
          <div className="border-controller__style-toggle">
            {styleOptions.map(({ style, Icon }) => (
              <button
                key={style}
                className={`border-controller__style-btn ${currentStyle === style ? 'is-active' : ''}`}
                onClick={() => handleStyleChange(style)}
                title={style}
                disabled={!element}
              >
                <Icon />
              </button>
            ))}
          </div>

          <label className="border-controller__prop-label">Width</label>
          <div className="border-controller__width-input">
            <input
              type="number"
              min={0}
              value={currentWidth}
              onChange={e => handleWidthChange(Number(e.target.value))}
              className="border-controller__input"
              disabled={!element}
            />
            <span className="border-controller__unit">px</span>
          </div>

          <label className="border-controller__prop-label">Color</label>
          <div
            className="border-controller__color-picker"
            style={{ backgroundColor: currentColor, cursor: element ? 'pointer' : 'default' }}
            onClick={() => element && colorInputRef.current?.click()}
          >
            <input
              ref={colorInputRef}
              type="color"
              value={currentColor}
              onChange={e => handleColorChange(e.target.value)}
              style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%' }}
              disabled={!element}
            />
          </div>
        </div>
      </div>
    </div>
  )
})
