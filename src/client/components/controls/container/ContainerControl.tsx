import { ChevronDown, ChevronRight } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import styled from 'styled-components'
import {
  ControlType,
  hasControl,
  isBlockElement,
  isContainerElement,
  WidgetType,
} from '../../../config/elementControls'
import { editorStore } from '../../../stores/EditorStore'
import { tokens } from '../../../styles/tokens'
import { ColorControl } from '../ColorControl'
import { SpacingControl } from '../SpacingControl'
import { ContainerItemsSection } from './ContainerItemsSection'
import { ContainerLayoutSection } from './ContainerLayoutSection'

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
  const isContainer = isContainerElement(elementType)
  const showContainerBg = hasControl(elementType, ControlType.ContainerBackgroundColor)
  const showContainerPadding = hasControl(elementType, ControlType.ContainerPadding)
  const showContainerMargin = hasControl(elementType, ControlType.ContainerMargin)
  // For container elements (Section, Column, InnerSection), show regular padding/margin
  const showPadding = hasControl(elementType, ControlType.Padding)
  const showMargin = hasControl(elementType, ControlType.Margin)

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
          {/* Margin - for container elements (Section, Column, InnerSection) */}
          {isContainer && showMargin && (
            <SpacingControl label="Margin" propertyPrefix="margin" defaultValue={0} />
          )}
          {/* Padding - for container elements (Section, Column, InnerSection) */}
          {isContainer && showPadding && (
            <SpacingControl label="Padding" propertyPrefix="padding" defaultValue={0} />
          )}
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
          {/* Layout and Items sections - only for container elements */}
          {isContainer && (
            <>
              <ContainerLayoutSection />
              <ContainerItemsSection />
            </>
          )}
        </div>
      )}
    </Container>
  )
})
