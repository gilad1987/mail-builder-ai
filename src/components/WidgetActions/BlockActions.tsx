import styled from 'styled-components'
import { Copy, ExternalLink, Trash2 } from 'lucide-react'
import { tokens } from '../../styles/tokens'

interface BlockActionsProps {
  onDelete: () => void
  onCopy: () => void
  onEdit: () => void
}

const Container = styled.div`
  position: absolute;
  top: -37px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 50;
  opacity: 0;
  transition: opacity ${tokens.transition.fast};

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    background: #37474f;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: ${tokens.borderRadius.sm};
    transition: all ${tokens.transition.fast};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    &:hover {
      background: #455a64;
      transform: scale(1.05);
    }

    &.delete:hover {
      background: #f44336;
    }
  }
`

export const BlockActions = ({ onDelete, onCopy, onEdit }: BlockActionsProps) => {
  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  return (
    <Container className="block-actions">
      <button className="delete" onClick={e => handleClick(e, onDelete)} title="Delete Block">
        <Trash2 size={14} />
      </button>
      <button onClick={e => handleClick(e, onCopy)} title="Duplicate Block">
        <Copy size={14} />
      </button>
      <button onClick={e => handleClick(e, onEdit)} title="Edit Block">
        <ExternalLink size={14} />
      </button>
    </Container>
  )
}
