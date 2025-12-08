import { ChevronLeft, X } from 'lucide-react'
import { useState } from 'react'
import styled from 'styled-components'
import type { ColumnJSON } from '../../models'
import { editorStore } from '../../stores/EditorStore'
import { tokens } from '../../styles/tokens'

type LayoutType = 'flexbox' | 'grid' | null
type Step = 'layout' | 'structure'

interface StructureOption {
  name: string
  columns: number[]
  // Grid template for preview: [columns, rows] e.g., "1fr 1fr" for 2 equal columns
  gridTemplate: { cols: string; rows: string }
  // Each cell can span multiple grid cells: [colStart, colEnd, rowStart, rowEnd]
  cells: { col: string; row: string }[]
}

const flexboxStructures: StructureOption[] = [
  {
    name: '1 Column',
    columns: [100],
    gridTemplate: { cols: '1fr', rows: '1fr' },
    cells: [{ col: '1', row: '1' }],
  },
  {
    name: '2 Equal',
    columns: [50, 50],
    gridTemplate: { cols: '1fr 1fr', rows: '1fr' },
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
    ],
  },
  {
    name: '3 Equal',
    columns: [33.33, 33.33, 33.33],
    gridTemplate: { cols: '1fr 1fr 1fr', rows: '1fr' },
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
      { col: '3', row: '1' },
    ],
  },
  {
    name: '1/3 + 2/3',
    columns: [33, 67],
    gridTemplate: { cols: '1fr 2fr', rows: '1fr' },
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
    ],
  },
  {
    name: '2/3 + 1/3',
    columns: [67, 33],
    gridTemplate: { cols: '2fr 1fr', rows: '1fr' },
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
    ],
  },
  {
    name: '1/4 + 3/4',
    columns: [25, 75],
    gridTemplate: { cols: '1fr 3fr', rows: '1fr' },
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
    ],
  },
]

const gridStructures: StructureOption[] = [
  {
    name: 'Stack',
    columns: [100],
    gridTemplate: { cols: '1fr', rows: '1fr 1fr' },
    cells: [
      { col: '1', row: '1' },
      { col: '1', row: '2' },
    ],
  },
  {
    name: '2 Cols',
    columns: [50, 50],
    gridTemplate: { cols: '1fr 1fr', rows: '1fr' },
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
    ],
  },
  {
    name: '2x2 Grid',
    columns: [50, 50],
    gridTemplate: { cols: '1fr 1fr', rows: '1fr 1fr' },
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
      { col: '1', row: '2' },
      { col: '2', row: '2' },
    ],
  },
  {
    name: '3 Cols',
    columns: [33.33, 33.33, 33.33],
    gridTemplate: { cols: '1fr 1fr 1fr', rows: '1fr' },
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
      { col: '3', row: '1' },
    ],
  },
  {
    name: 'Sidebar L',
    columns: [30, 70],
    gridTemplate: { cols: '1fr 2fr', rows: '1fr 1fr' },
    cells: [
      { col: '1', row: '1 / 3' },
      { col: '2', row: '1' },
      { col: '2', row: '2' },
    ],
  },
  {
    name: 'Sidebar R',
    columns: [70, 30],
    gridTemplate: { cols: '2fr 1fr', rows: '1fr 1fr' },
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1 / 3' },
      { col: '1', row: '2' },
    ],
  },
]

const Container = styled.div`
  width: 80%;
  max-width: 900px;
  margin: ${tokens.spacing[4]} auto;
  padding: ${tokens.spacing[6]};
  border: 2px dashed ${tokens.colors.gray[300]};
  border-radius: ${tokens.borderRadius.xl};
  background: white;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${tokens.spacing[6]};
  }

  .nav-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: ${tokens.colors.gray[500]};
    cursor: pointer;
    border-radius: ${tokens.borderRadius.md};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all ${tokens.transition.fast};

    &:hover {
      background: ${tokens.colors.gray[100]};
      color: ${tokens.colors.gray[700]};
    }

    &.invisible {
      visibility: hidden;
    }
  }

  .title {
    font-size: ${tokens.fontSize.base};
    font-weight: ${tokens.fontWeight.medium};
    color: ${tokens.colors.gray[700]};
  }

  .layout-options {
    display: flex;
    justify-content: center;
    gap: ${tokens.spacing[8]};
    padding: ${tokens.spacing[6]} 0;
  }

  .layout-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${tokens.spacing[3]};
    padding: ${tokens.spacing[4]};
    border-radius: ${tokens.borderRadius.lg};
    cursor: pointer;
    transition: all ${tokens.transition.fast};
    border: 2px solid transparent;

    &:hover {
      background: ${tokens.colors.gray[50]};
    }
  }

  .layout-icon {
    width: 80px;
    height: 60px;
    border-radius: ${tokens.borderRadius.md};
    overflow: hidden;

    &--flexbox {
      background: ${tokens.colors.gray[200]};
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 3px;
      padding: 6px;

      .cell {
        background: ${tokens.colors.gray[400]};
        border-radius: 2px;

        &:first-child {
          grid-row: 1 / 3;
        }
      }
    }

    &--grid {
      background: white;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 4px;
      padding: 6px;

      .cell {
        border: 1.5px dashed ${tokens.colors.gray[300]};
        border-radius: 2px;
        background: transparent;
      }
    }
  }

  .layout-label {
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    color: ${tokens.colors.gray[600]};
  }

  .structures-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: ${tokens.spacing[4]};
    padding: ${tokens.spacing[4]} 0;
  }

  .structure-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${tokens.spacing[3]};
    border: 1px dashed ${tokens.colors.gray[300]};
    border-radius: ${tokens.borderRadius.md};
    cursor: pointer;
    min-width: 100px;
    transition: all ${tokens.transition.fast};

    &:hover {
      border-color: ${tokens.colors.blue[400]};
      background: ${tokens.colors.blue[50]};
      border-style: solid;
    }
  }

  .structure-preview {
    width: 80px;
    height: 50px;
    display: grid;
    gap: 3px;
    background: ${tokens.colors.gray[100]};
    border-radius: ${tokens.borderRadius.sm};
    padding: 4px;

    .cell {
      background: ${tokens.colors.gray[300]};
      border-radius: 2px;
      min-height: 0;
      min-width: 0;
    }
  }
`

interface Props {
  onClose?: () => void
}

export const StructureSelector = ({ onClose }: Props) => {
  const [step, setStep] = useState<Step>('layout')
  const [layout, setLayout] = useState<LayoutType>(null)

  const handleLayoutSelect = (type: LayoutType) => {
    setLayout(type)
    setStep('structure')
  }

  const handleStructureSelect = (structure: StructureOption) => {
    const section = editorStore.addSection()

    // Set display type based on layout selection
    if (layout === 'grid') {
      section.update('display', 'grid')
      // Set grid template columns based on structure
      const gridCols = structure.columns.map((w) => `${w}fr`).join(' ')
      section.update('gridTemplateColumns', gridCols)
      section.update('flexDirection', undefined)
      section.update('flexWrap', undefined)
    } else {
      section.update('display', 'flex')
      section.update('flexDirection', 'row')
    }

    structure.columns.forEach((w) => section.addColumn({ width: w } as ColumnJSON))
    editorStore.setSelectedElement(section.id)
    onClose?.()
  }

  const handleBack = () => {
    setStep('layout')
    setLayout(null)
  }

  const structures = layout === 'flexbox' ? flexboxStructures : gridStructures

  return (
    <Container>
      <div className="header">
        <button className={`nav-btn ${step === 'layout' ? 'invisible' : ''}`} onClick={handleBack}>
          <ChevronLeft size={20} />
        </button>
        <span className="title">
          {step === 'layout' ? 'Which layout would you like to use?' : 'Select your structure'}
        </span>
        {onClose ? (
          <button className="nav-btn" onClick={onClose}>
            <X size={20} />
          </button>
        ) : (
          <div style={{ width: 32 }} />
        )}
      </div>

      {step === 'layout' ? (
        <div className="layout-options">
          <div className="layout-option" onClick={() => handleLayoutSelect('flexbox')}>
            <div className="layout-icon layout-icon--flexbox">
              <div className="cell" />
              <div className="cell" />
              <div className="cell" />
            </div>
            <span className="layout-label">Flexbox</span>
          </div>

          <div className="layout-option" onClick={() => handleLayoutSelect('grid')}>
            <div className="layout-icon layout-icon--grid">
              <div className="cell" />
              <div className="cell" />
              <div className="cell" />
              <div className="cell" />
            </div>
            <span className="layout-label">Grid</span>
          </div>
        </div>
      ) : (
        <div className="structures-grid">
          {structures.map((structure, i) => (
            <div
              key={i}
              className="structure-option"
              onClick={() => handleStructureSelect(structure)}
            >
              <div
                className="structure-preview"
                style={{
                  gridTemplateColumns: structure.gridTemplate.cols,
                  gridTemplateRows: structure.gridTemplate.rows,
                }}
              >
                {structure.cells.map((cell, j) => (
                  <div
                    key={j}
                    className="cell"
                    style={{
                      gridColumn: cell.col,
                      gridRow: cell.row,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
