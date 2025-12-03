import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Layout } from 'lucide-react'
import { tokens } from '../../styles/tokens'

const Container = styled.div`
  padding: ${tokens.spacing[4]};

  .section-title {
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.semibold};
    color: var(--text-primary);
    margin-bottom: ${tokens.spacing[3]};
  }

  .wrapper-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${tokens.spacing[3]};
    background: var(--bg-elevated);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    margin-bottom: ${tokens.spacing[4]};
  }

  .wrapper-label {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.sm};
    color: var(--text-primary);
  }

  .field {
    margin-bottom: ${tokens.spacing[3]};
  }

  .field-label {
    display: block;
    font-size: ${tokens.fontSize.xs};
    font-weight: ${tokens.fontWeight.medium};
    color: var(--text-secondary);
    margin-bottom: ${tokens.spacing[1]};
  }

  .text-input {
    width: 100%;
    padding: ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.sm};
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    color: var(--input-text);
    transition: border-color ${tokens.transition.fast};

    &:hover {
      border-color: var(--text-secondary);
    }

    &:focus {
      outline: none;
      border-color: var(--accent);
    }

    &::placeholder {
      color: var(--text-muted);
    }
  }
`

export const ContentTab = observer(() => {
  const [textContent, setTextContent] = useState('')

  return (
    <Container>
      <h3 className="section-title">Block Wrapper</h3>
      <div className="wrapper-header">
        <span className="wrapper-label">
          <Layout size={16} />
          Block Wrapper
        </span>
      </div>

      <div className="field">
        <label className="field-label">Text Content</label>
        <input
          type="text"
          className="text-input"
          placeholder="Enter text..."
          value={textContent}
          onChange={e => setTextContent(e.target.value)}
        />
      </div>
    </Container>
  )
})
