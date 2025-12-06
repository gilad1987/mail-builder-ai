import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import styled from 'styled-components'
import { Image, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Globe } from 'lucide-react'
import { Block, Box, InnerSection, getWidgetDefaults } from '../../models'
import { editorStore } from '../../stores/EditorStore'
import { savedWidgetsStore } from '../../stores/SavedWidgetsStore'
import { tokens } from '../../styles/tokens'
import { Draggable } from '../dnd'
import { BlockActions, ElementLabel } from '../WidgetActions'
import { SaveWidgetModal } from '../SaveWidgetModal'
import { ColumnBox } from './ColumnBox'
import { WidgetType } from '../../config/elementControls'

interface BlockElementProps {
  block: Box
  columnId: string
}

const Container = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  display: block;
  overflow: visible;
  padding: ${tokens.spacing[3]};
  background: transparent;
  border: 1px solid transparent;
  border-radius: ${tokens.borderRadius.sm};
  cursor: pointer;
  transition: all ${tokens.transition.fast};

  &.is-hovered {
    border-color: #1e88e5;

    > .element-label {
      opacity: 1;
    }
  }

  &.is-selected {
    border-color: #1e88e5;
    box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.2);
  }

  .block-content {
    font-size: ${tokens.fontSize.sm};
    color: ${tokens.colors.gray[800]};
  }

  .block-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background: ${tokens.colors.gray[100]};
    border-radius: ${tokens.borderRadius.sm};
    color: ${tokens.colors.gray[400]};
  }

  .block-button {
    display: inline-block;
    padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
    background: ${tokens.colors.blue[500]};
    color: #fff;
    border-radius: ${tokens.borderRadius.md};
    font-size: ${tokens.fontSize.sm};
  }
`

export const BlockElement = observer(({ block, columnId }: BlockElementProps) => {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const isSelected = editorStore.selectedElementId === block.id
  const isHovered = editorStore.hoveredElementId === block.id

  const handleMouseOver = (e: React.MouseEvent) => {
    e.stopPropagation()
    editorStore.setHoveredElement(block.id)
  }

  const handleMouseLeave = () => {
    if (editorStore.hoveredElementId === block.id) {
      editorStore.setHoveredElement(null)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    editorStore.setSelectedElement(block.id)
  }

  const handleEdit = () => {
    editorStore.setSelectedElement(block.id)
  }

  const handleCopy = () => {
    editorStore.copyElement(block.id)
  }

  const handleDelete = () => {
    editorStore.removeElement(block.id)
  }

  const handleSaveInnerSection = (name: string) => {
    if (block instanceof InnerSection) {
      savedWidgetsStore.saveWidget(name, 'InnerSection', block.toCloneJSON())
    }
  }

  // const getBlockBadgeType = (blockType: string) => {
  //   if (blockType === 'Image') return 'image'
  //   if (blockType === 'Paragraph' || blockType === 'Headline') return 'text'
  //   return 'block'
  // }

  // Handle InnerSection (nested columns)
  if (block instanceof InnerSection) {
    const classNames = [isSelected ? 'is-selected' : '', isHovered ? 'is-hovered' : '']
      .filter(Boolean)
      .join(' ')

    return (
      <Container
        className={classNames}
        style={{ ...block.style, flex: 1, width: '100%' }}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <ElementLabel label="Inner Section" color="#607d8b" />
        <BlockActions
          isVisible={isSelected}
          onEdit={handleEdit}
          onCopy={handleCopy}
          onSave={() => setShowSaveModal(true)}
          onDelete={handleDelete}
        />
        {showSaveModal && (
          <SaveWidgetModal
            defaultName="My Inner Section"
            onSave={handleSaveInnerSection}
            onClose={() => setShowSaveModal(false)}
          />
        )}
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          {block.children.length === 0 ? (
            <div
              style={{
                flex: 1,
                padding: '16px',
                background: '#f5f5f5',
                textAlign: 'center',
                color: '#999',
              }}
            >
              Empty Inner Section
            </div>
          ) : (
            block.children.map((col, index) => (
              <ColumnBox
                key={col.key}
                column={col}
                sectionId={block.id}
                isLast={index === block.children.length - 1}
                isOnlyColumn={block.children.length === 1}
              />
            ))
          )}
        </div>
      </Container>
    )
  }

  // Handle Block
  if (block instanceof Block) {
    const classNames = [isSelected ? 'is-selected' : '', isHovered ? 'is-hovered' : '']
      .filter(Boolean)
      .join(' ')

    // Separate container styles from element styles
    // container* styles go on the wrapper, regular styles go on the element
    const {
      containerBackgroundColor,
      containerPaddingTop,
      containerPaddingRight,
      containerPaddingBottom,
      containerPaddingLeft,
      containerMarginTop,
      containerMarginRight,
      containerMarginBottom,
      containerMarginLeft,
      ...elementStyle
    } = block.style

    // Build container padding string
    const containerPadding =
      containerPaddingTop || containerPaddingRight || containerPaddingBottom || containerPaddingLeft
        ? `${containerPaddingTop || 0} ${containerPaddingRight || 0} ${containerPaddingBottom || 0} ${containerPaddingLeft || 0}`
        : undefined

    // Build container margin string
    const containerMargin =
      containerMarginTop || containerMarginRight || containerMarginBottom || containerMarginLeft
        ? `${containerMarginTop || 0} ${containerMarginRight || 0} ${containerMarginBottom || 0} ${containerMarginLeft || 0}`
        : undefined

    // Container styles (wrapper)
    const containerStyle: React.CSSProperties = {
      backgroundColor: (containerBackgroundColor as string) || 'transparent',
      ...(containerPadding && { padding: containerPadding }),
      ...(containerMargin && { margin: containerMargin }),
    }

    return (
      <Draggable
        id={`canvas-block-${block.id}`}
        data={{
          source: 'canvas',
          blockId: block.id,
          blockType: block.type,
          parentId: columnId,
        }}
        style={{ flex: 1, width: '100%', display: 'block' }}
      >
        <Container
          className={classNames}
          style={containerStyle}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        >
          <ElementLabel label={block.type} color="#37474f" />
          <BlockActions
            isVisible={isSelected}
            onEdit={handleEdit}
            onCopy={handleCopy}
            onDelete={handleDelete}
          />
          {renderBlockContent(block, elementStyle)}
        </Container>
      </Draggable>
    )
  }

  return null
})

interface StyleProperties {
  [key: string]: string | number | undefined
}

// Helper to build padding/margin string from individual sides
function buildSpacingString(
  style: StyleProperties,
  prefix: 'padding' | 'margin'
): string | undefined {
  const top = style[`${prefix}Top`]
  const right = style[`${prefix}Right`]
  const bottom = style[`${prefix}Bottom`]
  const left = style[`${prefix}Left`]

  if (top || right || bottom || left) {
    return `${top || 0} ${right || 0} ${bottom || 0} ${left || 0}`
  }
  return undefined
}

function renderBlockContent(block: Block, elementStyle?: StyleProperties) {
  // Use provided elementStyle (filtered) or fall back to block.style
  const style = elementStyle || block.style
  // Get defaults from model - single source of truth
  const d = getWidgetDefaults(block.type)

  // Build padding and margin strings from individual sides
  const padding = buildSpacingString(style, 'padding')
  const margin = buildSpacingString(style, 'margin')

  switch (block.type) {
    case WidgetType.Image:
      return (
        <div className="block-image" style={{ height: 'auto', background: 'transparent' }}>
          {block.data.src ? (
            <img
              src={block.data.src as string}
              alt={(block.data.alt as string) || ''}
              style={{
                maxWidth: '100%',
                width: style.width,
                height: style.height,
                borderRadius: style.borderRadius,
                objectFit: 'cover',
              }}
            />
          ) : (
            <Image size={32} />
          )}
        </div>
      )

    case WidgetType.Button: {
      const btnDefaults = getWidgetDefaults(WidgetType.Button)
      return (
        <a
          href={(block.data.href as string) || '#'}
          className="block-button"
          style={{
            display: 'inline-block',
            padding: padding || btnDefaults.padding,
            margin: margin,
            backgroundColor: (style.backgroundColor as string) || btnDefaults.backgroundColor,
            color: (style.color as string) || btnDefaults.color,
            borderRadius: style.borderRadius || `${btnDefaults.borderRadius}px`,
            fontSize: style.fontSize || `${btnDefaults.fontSize}px`,
            fontWeight: style.fontWeight || btnDefaults.fontWeight,
            textDecoration: 'none',
            textAlign: style.textAlign as React.CSSProperties['textAlign'],
          }}
        >
          {(block.data.text as string) || btnDefaults.defaultText}
        </a>
      )
    }

    case WidgetType.Headline:
      return (
        <h3
          style={{
            margin: margin || 0,
            padding: padding,
            fontSize: style.fontSize || `${d.fontSize}px`,
            fontFamily: (style.fontFamily as string) || d.fontFamily,
            fontWeight: style.fontWeight || d.fontWeight,
            color: (style.color as string) || d.color,
            textAlign: style.textAlign as React.CSSProperties['textAlign'],
            textDecoration: style.textDecoration || d.textDecoration,
            textTransform: style.textTransform as React.CSSProperties['textTransform'],
            letterSpacing: style.letterSpacing ?? d.letterSpacing,
            lineHeight: style.lineHeight || `${d.lineHeight}px`,
          }}
        >
          {(block.data.content as string) || d.defaultContent}
        </h3>
      )

    case WidgetType.List: {
      const listDefaults = getWidgetDefaults(WidgetType.List)
      const items = (block.data.items as string[]) || ['Item 1', 'Item 2', 'Item 3']
      const listType = (block.data.listType as string) || 'bullet'
      const ListTag = listType === 'numbered' ? 'ol' : 'ul'

      return (
        <ListTag
          style={{
            margin: margin || 0,
            padding: padding,
            paddingLeft: style.paddingLeft || '1.5em',
            fontSize: style.fontSize || `${listDefaults.fontSize}px`,
            fontFamily: (style.fontFamily as string) || listDefaults.fontFamily,
            color: (style.color as string) || listDefaults.color,
            textAlign: style.textAlign as React.CSSProperties['textAlign'],
            textDecoration: style.textDecoration || listDefaults.textDecoration,
            textTransform: style.textTransform as React.CSSProperties['textTransform'],
            letterSpacing: style.letterSpacing ?? listDefaults.letterSpacing,
            lineHeight: style.lineHeight || `${listDefaults.lineHeight}px`,
          }}
        >
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ListTag>
      )
    }

    case WidgetType.Spacer:
      return (
        <div
          style={{
            height: style.height || (block.data.height as string) || '20px',
            background: style.backgroundColor || '#f0f0f0',
          }}
        />
      )

    case WidgetType.Divider: {
      const divDefaults = getWidgetDefaults(WidgetType.Divider)
      return (
        <hr
          style={{
            border: 'none',
            borderTop: `${style.borderTopWidth || '1px'} ${style.borderTopStyle || 'solid'} ${style.borderTopColor || divDefaults.backgroundColor}`,
            margin: margin || 0,
          }}
        />
      )
    }

    case WidgetType.SocialLinks: {
      const socialDefaults = getWidgetDefaults(WidgetType.SocialLinks)
      const links = (block.data.links as Array<{ platform: string; url: string }>) || [
        { platform: 'facebook', url: 'https://facebook.com' },
        { platform: 'twitter', url: 'https://twitter.com' },
        { platform: 'instagram', url: 'https://instagram.com' },
      ]
      const iconSize = (block.data.iconSize as number) || 24
      const iconColor = (style.color as string) || socialDefaults.color || '#333333'
      const gap = (block.data.gap as number) || 12

      const iconMap: Record<string, React.FC<{ size?: number; color?: string }>> = {
        facebook: Facebook,
        twitter: Twitter,
        instagram: Instagram,
        linkedin: Linkedin,
        youtube: Youtube,
        email: Mail,
      }

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              style.textAlign === 'center'
                ? 'center'
                : style.textAlign === 'right'
                  ? 'flex-end'
                  : 'flex-start',
            gap: `${gap}px`,
            padding: padding,
            margin: margin,
          }}
        >
          {links.map((link, index) => {
            const Icon = iconMap[link.platform] || Globe
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={iconSize} />
              </a>
            )
          })}
        </div>
      )
    }

    default: {
      // Paragraph
      const pDefaults = getWidgetDefaults(WidgetType.Paragraph)
      return (
        <p
          className="block-content"
          style={{
            margin: margin || 0,
            padding: padding,
            fontSize: style.fontSize || `${pDefaults.fontSize}px`,
            fontFamily: (style.fontFamily as string) || pDefaults.fontFamily,
            color: (style.color as string) || pDefaults.color,
            textAlign: style.textAlign as React.CSSProperties['textAlign'],
            textDecoration: style.textDecoration || pDefaults.textDecoration,
            textTransform: style.textTransform as React.CSSProperties['textTransform'],
            letterSpacing: style.letterSpacing ?? pDefaults.letterSpacing,
            lineHeight: style.lineHeight || `${pDefaults.lineHeight}px`,
          }}
        >
          {(block.data.content as string) || pDefaults.defaultContent}
        </p>
      )
    }
  }
}
