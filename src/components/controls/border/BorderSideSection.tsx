import { useState } from 'react'
import {
  BorderTopIcon,
  BorderRightIcon,
  BorderBottomIcon,
  BorderLeftIcon,
  BorderAllIcon,
  StyleNoneIcon,
  StyleSolidIcon,
  StyleDashedIcon,
} from './BorderIcons'

type BorderSide = 'all' | 'top' | 'right' | 'bottom' | 'left'
type BorderStyle = 'none' | 'solid' | 'dashed'

export const BorderSideSection = () => {
  const [activeSide, setActiveSide] = useState<BorderSide>('all')
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('none')
  const [borderWidth, setBorderWidth] = useState(0)

  const sides: { side: BorderSide; Icon: React.FC }[] = [
    { side: 'top', Icon: BorderTopIcon },
    { side: 'right', Icon: BorderRightIcon },
    { side: 'bottom', Icon: BorderBottomIcon },
    { side: 'left', Icon: BorderLeftIcon },
    { side: 'all', Icon: BorderAllIcon },
  ]

  const styles: { style: BorderStyle; Icon: React.FC }[] = [
    { style: 'none', Icon: StyleNoneIcon },
    { style: 'solid', Icon: StyleSolidIcon },
    { style: 'dashed', Icon: StyleDashedIcon },
  ]

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
            {styles.map(({ style, Icon }) => (
              <button
                key={style}
                className={`border-controller__style-btn ${borderStyle === style ? 'is-active' : ''}`}
                onClick={() => setBorderStyle(style)}
                title={style}
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
              value={borderWidth}
              onChange={e => setBorderWidth(Number(e.target.value))}
              className="border-controller__input"
            />
            <span className="border-controller__unit">px</span>
          </div>

          <label className="border-controller__prop-label">Color</label>
          <div className="border-controller__color-picker" />
        </div>
      </div>
    </div>
  )
}
