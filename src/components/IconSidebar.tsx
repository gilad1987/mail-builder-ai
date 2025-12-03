import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Image, Layers, Palette, Plus } from 'lucide-react'
import { tokens } from '../styles/tokens'

interface IconSidebarProps {
  activePanel: string | null
  onPanelChange: (panel: string | null) => void
}

const Container = styled.div`
  width: 48px;
  height: 100%;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${tokens.spacing[2]} 0;
  gap: ${tokens.spacing[1]};

  .icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${tokens.borderRadius.md};
    color: var(--text-secondary);
    transition: all ${tokens.transition.fast};

    &:hover {
      background: var(--bg-elevated);
      color: var(--text-primary);
    }

    &.is-active {
      background: var(--accent);
      color: white;
    }
  }
`

export const IconSidebar = observer(({ activePanel, onPanelChange }: IconSidebarProps) => {
  const icons = [
    { id: 'elements', icon: Plus, label: 'Elements' },
    { id: 'layers', icon: Layers, label: 'Layers' },
    { id: 'styles', icon: Palette, label: 'Global Styles' },
    { id: 'assets', icon: Image, label: 'Assets' },
  ]

  return (
    <Container>
      {icons.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          className={`icon-btn ${activePanel === id ? 'is-active' : ''}`}
          onClick={() => onPanelChange(activePanel === id ? null : id)}
          title={label}
        >
          <Icon size={20} />
        </button>
      ))}
    </Container>
  )
})
