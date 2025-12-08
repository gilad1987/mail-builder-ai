import { Zap } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'

export interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: { type: string; description: string }
}

interface ChatMessageProps {
  message: Message
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing[2]};

  &.user-message {
    align-items: flex-end;
  }

  .message-bubble {
    max-width: 85%;
    padding: ${tokens.spacing[3]};
    border-radius: ${tokens.borderRadius.lg};
    font-size: ${tokens.fontSize.sm};
    line-height: 1.5;
  }

  &.user-message .message-bubble {
    background: ${tokens.colors.purple[600]};
    color: white;
    border-bottom-right-radius: ${tokens.borderRadius.sm};
  }

  &.assistant-message .message-bubble {
    background: var(--bg-elevated);
    color: var(--text-primary);
    border-bottom-left-radius: ${tokens.borderRadius.sm};
  }

  .timestamp {
    font-size: 11px;
    color: var(--text-muted);
    padding: 0 ${tokens.spacing[2]};
  }

  .action-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-color);
    border-radius: ${tokens.borderRadius.md};
    padding: ${tokens.spacing[3]};
    max-width: 85%;
  }

  .action-header {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
    color: ${tokens.colors.purple[500]};
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    margin-bottom: ${tokens.spacing[1]};
  }

  .action-description {
    color: var(--text-primary);
    font-size: ${tokens.fontSize.sm};
  }
`

export const ChatMessage = observer(({ message }: ChatMessageProps) => {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000)
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff} minutes ago`
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Container className={`${message.type}-message`}>
      {message.action && (
        <div className="action-card">
          <div className="action-header">
            <Zap size={14} />
            <span>Action</span>
          </div>
          <div className="action-description">{message.action.description}</div>
        </div>
      )}
      <div className="message-bubble">{message.content}</div>
      <span className="timestamp">{formatTime(message.timestamp)}</span>
    </Container>
  )
})
