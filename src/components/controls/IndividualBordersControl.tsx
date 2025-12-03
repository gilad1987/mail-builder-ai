import { observer } from 'mobx-react-lite'
import { X, Minus, MoreHorizontal } from 'lucide-react'

interface BorderSideButtonProps {
  side: string
  isSelected: boolean
}

const BorderSideButton = ({ side, isSelected }: BorderSideButtonProps) => (
  <button
    className={`border-side-btn ${isSelected ? 'border-side-btn--active' : ''}`}
    title={`Border ${side}`}
  >
    <div className="border-side-btn__box">
      <div
        className={`border-side-btn__inner ${isSelected ? 'border-side-btn__inner--active' : ''}`}
      />
    </div>
  </button>
)

interface IndividualBordersControlProps {
  selectedSide?: 'all' | 'top' | 'right' | 'bottom' | 'left'
}

export const IndividualBordersControl = observer(
  ({ selectedSide = 'all' }: IndividualBordersControlProps) => (
    <div className="style-field">
      <h4 className="style-field__label" style={{ marginBottom: '0.5rem' }}>
        Borders
      </h4>
      <div className="borders-group">
        <div className="borders-grid">
          <div className="borders-grid__cell--top">
            <BorderSideButton side="top" isSelected={selectedSide === 'top'} />
          </div>
          <BorderSideButton side="left" isSelected={selectedSide === 'left'} />
          <BorderSideButton side="all" isSelected={selectedSide === 'all'} />
          <BorderSideButton side="right" isSelected={selectedSide === 'right'} />
          <div className="borders-grid__cell--bottom">
            <BorderSideButton side="bottom" isSelected={selectedSide === 'bottom'} />
          </div>
        </div>
        <div className="border-inputs">
          <div>
            <label className="border-inputs__label">Style</label>
            <div className="style-toggle">
              <button className="style-toggle__btn style-toggle__btn--active" title="None">
                <X size={16} />
              </button>
              <button className="style-toggle__btn" title="Solid">
                <Minus size={16} />
              </button>
              <button className="style-toggle__btn" title="Dashed/Dotted">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <div>
            <label className="border-inputs__label">Width</label>
            <div className="input-with-unit">
              <input
                type="number"
                defaultValue="0"
                style={{ textAlign: 'center', width: '4rem' }}
              />
              <span className="side-control__unit">px</span>
            </div>
          </div>
          <div>
            <label className="border-inputs__label">Color</label>
            <div className="color-picker-placeholder" />
          </div>
        </div>
      </div>
    </div>
  )
)
