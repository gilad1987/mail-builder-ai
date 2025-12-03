import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import { editorStore } from '../../stores/EditorStore'
import { ResponsiveIcon } from './ResponsiveIcon'

const Container = styled.div`
  padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
  border-bottom: 1px solid ${tokens.colors.gray[100]};

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${tokens.spacing[2]};
  }

  .label {
    display: flex;
    align-items: center;
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    color: ${tokens.colors.gray[700]};
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
  }

  .slider {
    flex: 1;
    height: 4px;
    background: ${tokens.colors.gray[200]};
    border-radius: 4px;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    border: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      background: ${tokens.colors.blue[500]};
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .input-group {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[1]};
  }

  .input {
    width: 50px;
    padding: ${tokens.spacing[1]};
    text-align: center;
    font-size: ${tokens.fontSize.xs};
    background-color: ${tokens.colors.gray[50]};
    border: 1px solid ${tokens.colors.gray[300]};
    border-radius: ${tokens.borderRadius.md};
  }

  .unit {
    font-size: ${tokens.fontSize.xs};
    color: ${tokens.colors.gray[500]};
    min-width: 20px;
  }
`

interface SliderFieldProps {
  label: string
  defaultValue?: number
  min?: number
  max?: number
  unit?: string
  responsive?: boolean
}

export const SliderField = observer(
  ({
    label,
    defaultValue = 0,
    min = 0,
    max = 64,
    unit = 'px',
    responsive = true,
  }: SliderFieldProps) => {
    const [value, setValue] = useState(defaultValue)

    return (
      <Container>
        <div className="header">
          <div className="label">
            {label}
            <ResponsiveIcon device={editorStore.activeDevice} responsive={responsive} />
          </div>
        </div>
        <div className="slider-row">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={e => setValue(Number(e.target.value))}
            className="slider"
          />
          <div className="input-group">
            <input
              type="number"
              min={min}
              max={max}
              value={value}
              onChange={e => setValue(Number(e.target.value))}
              className="input"
            />
            <span className="unit">{unit}</span>
          </div>
        </div>
      </Container>
    )
  }
)
