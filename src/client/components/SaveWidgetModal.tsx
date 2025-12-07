import { useState } from 'react'
import styled from 'styled-components'
import { X } from 'lucide-react'
import { tokens } from '../styles/tokens'

interface SaveWidgetModalProps {
  onSave: (name: string) => void
  onClose: () => void
  defaultName?: string
}

const Container = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal {
    background: var(--bg-secondary);
    border-radius: ${tokens.borderRadius.lg};
    padding: ${tokens.spacing[6]};
    width: 380px;
    max-width: 90vw;
    box-shadow: ${tokens.shadow.xl};
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${tokens.spacing[4]};

    h3 {
      margin: 0;
      color: var(--text-primary);
      font-size: ${tokens.fontSize.lg};
      font-weight: ${tokens.fontWeight.semibold};
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 4px;
      border-radius: ${tokens.borderRadius.sm};
      transition: ${tokens.transition.fast};

      &:hover {
        color: var(--text-primary);
        background: var(--hover-bg);
      }
    }
  }

  .input-group {
    margin-bottom: ${tokens.spacing[5]};

    label {
      display: block;
      margin-bottom: ${tokens.spacing[2]};
      color: var(--text-secondary);
      font-size: ${tokens.fontSize.sm};
    }

    input {
      width: 100%;
      padding: ${tokens.spacing[2]} ${tokens.spacing[3]};
      border: 1px solid var(--border-color);
      border-radius: ${tokens.borderRadius.md};
      background: var(--input-bg);
      color: var(--text-primary);
      font-size: ${tokens.fontSize.base};
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: var(--accent);
      }
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: ${tokens.spacing[2]};

    button {
      padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
      border-radius: ${tokens.borderRadius.md};
      font-size: ${tokens.fontSize.sm};
      font-weight: ${tokens.fontWeight.medium};
      cursor: pointer;
      transition: ${tokens.transition.fast};
    }

    .cancel-btn {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);

      &:hover {
        background: var(--hover-bg);
      }
    }

    .save-btn {
      background: var(--accent);
      border: none;
      color: white;

      &:hover {
        opacity: 0.9;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
`

export const SaveWidgetModal = ({ onSave, onClose, defaultName = '' }: SaveWidgetModalProps) => {
  const [name, setName] = useState(defaultName)

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim())
      onClose()
    }
  }

  return (
    <Container onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="header">
          <h3>Save as Widget</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="input-group">
          <label>Widget Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Hero Section, Newsletter Block"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
        </div>
        <div className="actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave} disabled={!name.trim()}>
            Save Widget
          </button>
        </div>
      </div>
    </Container>
  )
}
