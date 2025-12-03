import { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Sparkles, X } from 'lucide-react'
import { tokens } from '../../styles/tokens'
import { ChatMessage, type Message } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { editorStore } from '../../stores/EditorStore'

interface AIAssistantPanelProps {
  onClose: () => void
}

const Container = styled.div`
  width: 320px;
  height: 100%;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
    border-bottom: 1px solid var(--border-color);
  }

  .title {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    color: var(--text-primary);
  }

  .title-icon {
    color: ${tokens.colors.purple[500]};
  }

  .close-btn {
    color: var(--text-secondary);
    padding: ${tokens.spacing[1]};
    border-radius: ${tokens.borderRadius.sm};
    transition: all ${tokens.transition.fast};
    &:hover {
      background: var(--bg-elevated);
      color: var(--text-primary);
    }
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: ${tokens.spacing[4]};
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing[4]};
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: ${tokens.spacing[6]};
    color: var(--text-muted);
  }

  .empty-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-elevated);
    border-radius: ${tokens.borderRadius.lg};
    margin-bottom: ${tokens.spacing[3]};
    color: ${tokens.colors.purple[500]};
  }

  .empty-title {
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    color: var(--text-primary);
    margin-bottom: ${tokens.spacing[1]};
  }

  .empty-description {
    font-size: ${tokens.fontSize.xs};
    line-height: 1.5;
  }
`

export const AIAssistantPanel = observer(({ onClose }: AIAssistantPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (content: string, context?: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(content, context)
      setMessages(prev => [...prev, response])
    }, 800)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateResponse = (input: string, _context?: string): Message => {
    const lowerInput = input.toLowerCase()
    let action: Message['action'] | undefined
    let content = ''

    if (lowerInput.includes('page') || lowerInput.includes('create')) {
      const pageName = extractPageName(input) || 'New Page'
      action = { type: 'create_page', description: `Create new "${pageName}" project page` }
      content = `Your page named "${pageName}" has been created with a clean layout, including a header, centered welcome message, and footer. Let me know if you want to add or modify anything on this page.`
      editorStore.addRow()
    } else if (lowerInput.includes('button')) {
      action = { type: 'add_block', description: 'Add Button block to canvas' }
      content =
        "I've added a button to your canvas. You can customize its text, color, and link in the style panel."
    } else if (lowerInput.includes('image')) {
      action = { type: 'add_block', description: 'Add Image block to canvas' }
      content =
        "I've added an image placeholder. Click on it to upload or select an image from your assets."
    } else if (lowerInput.includes('text') || lowerInput.includes('paragraph')) {
      action = { type: 'add_block', description: 'Add Text block to canvas' }
      content = "I've added a text block. Click on it to edit the content directly."
    } else {
      content =
        'I can help you create pages, add blocks (buttons, images, text), and modify your email template. What would you like to do?'
    }

    return {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      content,
      timestamp: new Date(),
      action,
    }
  }

  const extractPageName = (input: string): string | null => {
    const patterns = [/["']([^"']+)["']/, /called\s+(\w+)/i, /named\s+(\w+)/i]
    for (const pattern of patterns) {
      const match = input.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  return (
    <Container>
      <div className="header">
        <span className="title">
          <Sparkles size={16} className="title-icon" />
          AI Assistant
        </span>
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Sparkles size={24} />
          </div>
          <div className="empty-title">How can I help?</div>
          <div className="empty-description">
            Ask me to create pages, add elements, or modify your email template.
          </div>
        </div>
      ) : (
        <div className="messages">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <ChatInput onSend={handleSend} />
    </Container>
  )
})
