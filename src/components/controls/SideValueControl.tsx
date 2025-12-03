interface SideValueControlProps {
  side: 'top' | 'right' | 'bottom' | 'left'
  value?: number
  unit?: string
}

export const SideValueControl = ({ side, value = 0, unit = 'px' }: SideValueControlProps) => {
  const indicators: Record<string, { symbol: string; className: string }> = {
    top: { symbol: '↧', className: 'side-control__indicator--top' },
    right: { symbol: '↦', className: '' },
    bottom: { symbol: '↥', className: 'side-control__indicator--bottom' },
    left: { symbol: '↤', className: '' },
  }

  const { symbol, className } = indicators[side]

  return (
    <div className="side-control">
      <span className={`side-control__indicator ${className}`}>{symbol}</span>
      <input type="range" min="0" max="64" defaultValue={value} className="side-control__slider" />
      <input type="number" defaultValue={value} className="side-control__input" />
      <span className="side-control__unit">{unit}</span>
    </div>
  )
}
