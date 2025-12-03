import styled from 'styled-components'
import { Copy, LayoutGrid, Move, Trash2 } from 'lucide-react'
import { tokens } from '../../styles/tokens'

interface SectionActionsProps {
  onCopy: () => void
  onMove?: () => void
  onGrid?: () => void
  onDelete: () => void
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0;
  background: linear-gradient(135deg, #26c6da 0%, #00acc1 100%);
  border-radius: 0 0 ${tokens.borderRadius.md} ${tokens.borderRadius.md};
  padding: 4px 8px;
  z-index: 50;
  opacity: 0;
  transition: opacity ${tokens.transition.fast};
  box-shadow: 0 2px 8px rgba(0, 172, 193, 0.3);

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: ${tokens.borderRadius.sm};
    transition: background ${tokens.transition.fast};

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    &.delete:hover {
      background: rgba(244, 67, 54, 0.8);
    }
  }
`

export const SectionActions = ({ onCopy, onMove, onGrid, onDelete }: SectionActionsProps) => {
  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  return (
    <Container className="section-actions">
      <button onClick={e => handleClick(e, onCopy)} title="Duplicate Section">
        <Copy size={16} />
      </button>
      {onMove && (
        <button onClick={e => handleClick(e, onMove)} title="Move Section">
          <Move size={16} />
        </button>
      )}
      {onGrid && (
        <button onClick={e => handleClick(e, onGrid)} title="Layout Options">
          <LayoutGrid size={16} />
        </button>
      )}
      <button className="delete" onClick={e => handleClick(e, onDelete)} title="Delete Section">
        <Trash2 size={16} />
      </button>
    </Container>
  )
}
