import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { X } from 'lucide-react'
import { tokens } from '../styles/tokens'
import { AssetsGrid } from './assets/AssetsGrid'

interface AssetsPanelProps {
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
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.semibold};
    color: var(--text-primary);
  }

  .close-btn {
    color: var(--text-secondary);
    &:hover {
      color: var(--text-primary);
    }
  }

  .controls {
    padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing[3]};
  }

  .search-input {
    width: 100%;
    padding: ${tokens.spacing[2]};
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    color: var(--input-text);
    font-size: ${tokens.fontSize.sm};
    &::placeholder {
      color: var(--text-muted);
    }
  }

  .upload-btn {
    padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
    background: ${tokens.colors.purple[600]};
    color: white;
    border-radius: ${tokens.borderRadius.md};
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.medium};
    cursor: pointer;
    width: fit-content;
    &:hover {
      background: ${tokens.colors.purple[700]};
    }
  }
`

export const AssetsPanel = observer(({ onClose }: AssetsPanelProps) => {
  const [search, setSearch] = useState('')

  return (
    <Container>
      <div className="header">
        <span className="title">Assets</span>
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="upload-btn">Upload</button>
      </div>

      <AssetsGrid search={search} />
    </Container>
  )
})
