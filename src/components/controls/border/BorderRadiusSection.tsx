import { useState } from 'react'
import {
  RadiusSingleIcon,
  RadiusMultipleIcon,
  CornerTopLeftIcon,
  CornerTopRightIcon,
  CornerBottomLeftIcon,
  CornerBottomRightIcon,
} from './BorderIcons'

export const BorderRadiusSection = () => {
  const [individualMode, setIndividualMode] = useState(false)
  const [radiusValue, setRadiusValue] = useState(0)

  return (
    <div className="border-controller__section">
      <div className="border-controller__row">
        <span className="border-controller__label">Radius</span>
        <button
          className={`border-controller__icon-btn ${!individualMode ? 'is-active' : ''}`}
          onClick={() => setIndividualMode(false)}
          title="All corners"
        >
          <RadiusSingleIcon />
        </button>
        <button
          className={`border-controller__icon-btn ${individualMode ? 'is-active' : ''}`}
          onClick={() => setIndividualMode(true)}
          title="Individual corners"
        >
          <RadiusMultipleIcon />
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={radiusValue}
          disabled={individualMode}
          onChange={e => setRadiusValue(Number(e.target.value))}
          className="border-controller__slider"
        />
        <input
          type="number"
          min={0}
          value={radiusValue}
          disabled={individualMode}
          onChange={e => setRadiusValue(Number(e.target.value))}
          className="border-controller__input"
        />
      </div>

      {individualMode && (
        <>
          <div className="border-controller__row border-controller__row--corners">
            <CornerTopLeftIcon />
            <input type="number" min={0} defaultValue={0} className="border-controller__input" />
            <CornerTopRightIcon />
            <input type="number" min={0} defaultValue={0} className="border-controller__input" />
          </div>
          <div className="border-controller__row border-controller__row--corners">
            <CornerBottomLeftIcon />
            <input type="number" min={0} defaultValue={0} className="border-controller__input" />
            <CornerBottomRightIcon />
            <input type="number" min={0} defaultValue={0} className="border-controller__input" />
          </div>
        </>
      )}
    </div>
  )
}
