import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'

const Container = styled.div`
  padding: ${tokens.spacing[4]};

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
