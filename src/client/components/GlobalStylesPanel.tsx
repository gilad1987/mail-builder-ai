import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import styled from 'styled-components'
import { editorStore } from '../stores/EditorStore'
import { tokens } from '../styles/tokens'
import { ColorsSection } from './globalStyles/ColorsSection'
import { TypographySection } from './globalStyles/TypographySection'

interface GlobalStylesPanelProps {
  onClose: () => void
}

const Container = styled.div`
  width: 280px;
  height: 100%;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;

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

  .content {
    flex: 1;
    overflow-y: auto;
  }
`

export const GlobalStylesPanel = observer(({ onClose }: GlobalStylesPanelProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    colors: true,
    body: true,
    heading: false,
    subheading: false,
    buttons: false,
    links: false,
  })

  const toggle = (s: string) => setExpanded((p) => ({ ...p, [s]: !p[s] }))

  return (
    <Container>
      <div className="header">
        <span className="title">Global Styles</span>
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="content">
        <ColorsSection
          expanded={expanded.colors}
          onToggle={() => toggle('colors')}
          colors={editorStore.globalStyles.colors}
          onColorChange={(name, value) => editorStore.updateGlobalColor(name, value)}
        />
        <TypographySection
          title="Body"
          expanded={expanded.body}
          onToggle={() => toggle('body')}
          style={editorStore.globalStyles.typography.body}
          onStyleChange={(field, value) => editorStore.updateTypography('body', field, value)}
        />
        <TypographySection
          title="Heading"
          expanded={expanded.heading}
          onToggle={() => toggle('heading')}
          style={editorStore.globalStyles.typography.heading}
          onStyleChange={(field, value) => editorStore.updateTypography('heading', field, value)}
        />
        <TypographySection
          title="Subheading"
          expanded={expanded.subheading}
          onToggle={() => toggle('subheading')}
          style={editorStore.globalStyles.typography.subheading}
          onStyleChange={(field, value) => editorStore.updateTypography('subheading', field, value)}
        />
        <TypographySection
          title="Buttons"
          expanded={expanded.buttons}
          onToggle={() => toggle('buttons')}
          style={editorStore.globalStyles.typography.buttons}
          onStyleChange={(field, value) => editorStore.updateTypography('buttons', field, value)}
        />
        <TypographySection
          title="Links"
          expanded={expanded.links}
          onToggle={() => toggle('links')}
          style={editorStore.globalStyles.typography.links}
          onStyleChange={(field, value) => editorStore.updateTypography('links', field, value)}
        />
      </div>
    </Container>
  )
})

interface SectionWrapperProps {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

export const SectionWrapper = ({ title, expanded, onToggle, children }: SectionWrapperProps) => (
  <div className="section">
    <div className="section-header" onClick={onToggle}>
      <span className="section-title">{title}</span>
      {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </div>
    {expanded && <div className="section-content">{children}</div>}
  </div>
)
