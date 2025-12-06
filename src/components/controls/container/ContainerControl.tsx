import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { tokens } from '../../../styles/tokens'
import { ContainerLayoutSection } from './ContainerLayoutSection'
import { ContainerItemsSection } from './ContainerItemsSection'
import { ColorControl } from '../ColorControl'
import { SpacingControl } from '../SpacingControl'
import { editorStore } from '../../../stores/EditorStore'
import {
  ControlType,
  hasControl,
  isBlockElement,
  WidgetType,
} from '../../../config/elementControls'

const Container = styled.div`
  background: var(--bg-primary);

  .section-header {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};
    padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
    cursor: pointer;
    user-select: none;
    &:hover {
      background: var(--bg-secondary);
    }
  }

  .section-title {
    font-size: ${tokens.fontSize.sm};
    font-weight: ${tokens.fontWeight.semibold};
    color: var(--text-primary);
  }

  .section-content {
    // padding: 0 ${tokens.spacing[4]} ${tokens.spacing[3]};
  }
`

export const ContainerControl = observer(() => {
  const [isExpanded, setIsExpanded] = useState(true)
  const element = editorStore.selectedElement
  const elementType = (element?.type as WidgetType) || WidgetType.Paragraph

  // Check if this is a block element (has container wrapper)
  const isBlock = isBlockElement(elementType)
  const showContainerBg = hasControl(elementType, ControlType.ContainerBackgroundColor)
  const showContainerPadding = hasControl(elementType, ControlType.ContainerPadding)
  const showContainerMargin = hasControl(elementType, ControlType.ContainerMargin)

  return (
    <Container>
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? (
          <ChevronDown size={16} color={tokens.colors.gray[400]} />
        ) : (
          <ChevronRight size={16} color={tokens.colors.gray[400]} />
        )}
        <span className="section-title">Container</span>
      </div>
      {isExpanded && (
        <div className="section-content">
          {/* Container Margin - for block elements */}
          {isBlock && showContainerMargin && (
            <SpacingControl label="Margin" propertyPrefix="containerMargin" defaultValue={0} />
          )}
          {/* Container Padding - for block elements */}
          {isBlock && showContainerPadding && (
            <SpacingControl label="Padding" propertyPrefix="containerPadding" defaultValue={12} />
          )}
          {/* Container Background Color - for block elements */}
          {isBlock && showContainerBg && (
            <ColorControl
              label="Background color"
              styleProperty="containerBackgroundColor"
              defaultValue="transparent"
              responsive={true}
            />
          )}
          <ContainerLayoutSection />
          <ContainerItemsSection />
        </div>
      )}
    </Container>
  )
})
