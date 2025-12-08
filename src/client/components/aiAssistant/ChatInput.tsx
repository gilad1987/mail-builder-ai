import { ArrowUp, Plus, Settings, Type, X } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'

interface ChatInputProps {
  onSend: (message: string, context?: string) => void
}

const Container = styled.div`
  padding: ${tokens.spacing[3]};
  border-top: 1px solid var(--border-color);
  background: var(--bg-primary);

  .context-tags {
    display: flex;
    gap: ${tokens.spacing[2]};
    margin-bottom: ${tokens.spacing[2]};
    flex-wrap: wrap;
  }

  .context-tag {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[1]};
    padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
    background: ${tokens.colors.purple[600]};
    color: white;
    border-radius: ${tokens.borderRadius.full};
    font-size: 12px;

    .remove-tag {
      display: flex;
      cursor: pointer;
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }
  }

  .input-wrapper {
    display: flex;
    align-items: flex-end;
    gap: ${tokens.spacing[2]};
    background: var(--bg-elevated);
    border: 1px solid var(--border-color);
    border-radius: ${tokens.borderRadius.lg};
    padding: ${tokens.spacing[2]};
  }

  .text-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: ${tokens.fontSize.sm};
    resize: none;
    min-height: 20px;
    max-height: 120px;
    line-height: 1.4;

    &::placeholder {
      color: var(--text-muted);
    }
    &:focus {
      outline: none;
    }
  }

  .input-actions {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[1]};
  }

  .action-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${tokens.borderRadius.md};
    color: var(--text-secondary);
    transition: all ${tokens.transition.fast};

    &:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    &.send-btn {
      background: ${tokens.colors.purple[600]};
      color: white;
      &:hover {
        background: ${tokens.colors.purple[700]};
      }
      &:disabled {
        background: var(--bg-secondary);
        color: var(--text-muted);
        cursor: not-allowed;
      }
    }
  }
`

export const ChatInput = observer(({ onSend }: ChatInputProps) => {
  const [input, setInput] = useState('')
  const [context, setContext] = useState<string | null>('Text')

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input.trim(), context || undefined)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Container>
      {context && (
        <div className="context-tags">
          <div className="context-tag">
            <Settings size={12} />
            <Type size={12} />
            <span>{context}</span>
            <span className="remove-tag" onClick={() => setContext(null)}>
              <X size={12} />
            </span>
          </div>
        </div>
      )}
      <div className="input-wrapper">
        <textarea
          className="text-input"
          placeholder="Ask me to create..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <div className="input-actions">
          <button className="action-btn" title="Add context">
            <Plus size={16} />
          </button>
          <button
            className="action-btn send-btn"
            onClick={handleSend}
            disabled={!input.trim()}
            title="Send"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </Container>
  )
})
