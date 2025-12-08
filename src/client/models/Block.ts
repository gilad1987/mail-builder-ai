import { Box, type BoxJSON, type StyleRecord, WidgetType } from './Box'

export interface BlockJSON extends BoxJSON {
  type?: WidgetType
  data?: Record<string, unknown>
}

export class Block extends Box {
  constructor(json: BlockJSON = {}, parent: Box | null = null) {
    super(json, parent)
    this.name = 'Block'
    this.type = (json.type as WidgetType) || WidgetType.Paragraph
    this.data = json.data || { content: 'Lorem ipsum...' }
    if (json._style) {
      this._style = json._style as StyleRecord
    }
  }

  fromJSON(json: BlockJSON): void {
    this.type = json.type || WidgetType.Paragraph
    this.data = json.data || {}
    if (json._style) {
      this._style = json._style as StyleRecord
    }
  }

  clone(): Block {
    return new Block(this.toCloneJSON() as BlockJSON, this.parent)
  }

  renderHTML(): string {
    // Separate container styles from element styles
    const desktopStyle = { ...this._style.desktop }

    // Extract container-specific styles
    const containerBgColor = desktopStyle.containerBackgroundColor as string | undefined
    const containerPaddingTop = desktopStyle['containerPaddingTop-size'] as number | undefined
    const containerPaddingRight = desktopStyle['containerPaddingRight-size'] as number | undefined
    const containerPaddingBottom = desktopStyle['containerPaddingBottom-size'] as number | undefined
    const containerPaddingLeft = desktopStyle['containerPaddingLeft-size'] as number | undefined
    const containerMarginTop = desktopStyle['containerMarginTop-size'] as number | undefined
    const containerMarginRight = desktopStyle['containerMarginRight-size'] as number | undefined
    const containerMarginBottom = desktopStyle['containerMarginBottom-size'] as number | undefined
    const containerMarginLeft = desktopStyle['containerMarginLeft-size'] as number | undefined

    // Remove container-specific styles from element styles
    delete desktopStyle.containerBackgroundColor
    delete desktopStyle['containerPaddingTop-size']
    delete desktopStyle['containerPaddingTop-unit']
    delete desktopStyle['containerPaddingRight-size']
    delete desktopStyle['containerPaddingRight-unit']
    delete desktopStyle['containerPaddingBottom-size']
    delete desktopStyle['containerPaddingBottom-unit']
    delete desktopStyle['containerPaddingLeft-size']
    delete desktopStyle['containerPaddingLeft-unit']
    delete desktopStyle['containerMarginTop-size']
    delete desktopStyle['containerMarginTop-unit']
    delete desktopStyle['containerMarginRight-size']
    delete desktopStyle['containerMarginRight-unit']
    delete desktopStyle['containerMarginBottom-size']
    delete desktopStyle['containerMarginBottom-unit']
    delete desktopStyle['containerMarginLeft-size']
    delete desktopStyle['containerMarginLeft-unit']

    const style = this.styleToCSS(desktopStyle)

    let elementHtml: string
    switch (this.type) {
      case WidgetType.Image:
        elementHtml = `<img class="${this.id}" src="${(this.data.src as string) || ''}" alt="${(this.data.alt as string) || ''}" style="${style}" />`
        break

      case WidgetType.Button: {
        const d = this.defaults
        // Build button-specific styles with defaults from model
        const buttonDefaults = 'display:inline-block;text-decoration:none;'
        const bgDefault = !desktopStyle.backgroundColor
          ? `background-color:${d.backgroundColor};`
          : ''
        const colorDefault = !desktopStyle.color ? `color:${d.color};` : ''
        const fontDefault = !desktopStyle['fontSize-size'] ? `font-size:${d.fontSize}px;` : ''
        const paddingDefault =
          !desktopStyle['paddingTop-size'] && !desktopStyle['padding-size']
            ? `padding:${d.padding};`
            : ''
        // Only apply default radius if no unified or individual radius is set
        const hasIndividualRadius =
          desktopStyle['borderTopLeftRadius-size'] !== undefined ||
          desktopStyle['borderTopRightRadius-size'] !== undefined ||
          desktopStyle['borderBottomLeftRadius-size'] !== undefined ||
          desktopStyle['borderBottomRightRadius-size'] !== undefined
        const radiusDefault =
          !desktopStyle['borderRadius-size'] && !hasIndividualRadius
            ? `border-radius:${d.borderRadius}px;`
            : ''
        const buttonStyle = `${buttonDefaults}${bgDefault}${colorDefault}${fontDefault}${paddingDefault}${radiusDefault}${style}`
        elementHtml = `<a class="${this.id}" href="${(this.data.href as string) || '#'}" style="${buttonStyle}">${(this.data.text as string) || d.defaultText}</a>`
        break
      }

      case WidgetType.Headline:
        elementHtml = `<h2 class="${this.id}" style="${style}">${(this.data.content as string) || ''}</h2>`
        break

      case WidgetType.Spacer:
        elementHtml = `<div class="${this.id}" style="height:${(this.data.height as string) || '20px'};${style}"></div>`
        break

      case WidgetType.Divider:
        elementHtml = `<hr class="${this.id}" style="${style}" />`
        break

      case WidgetType.List: {
        const items = (this.data.items as string[]) || ['Item 1', 'Item 2', 'Item 3']
        const listType = (this.data.listType as string) || 'bullet'
        const tag = listType === 'numbered' ? 'ol' : 'ul'
        const itemsHtml = items.map((item) => `<li>${item}</li>`).join('')
        elementHtml = `<${tag} class="${this.id}" style="${style}">${itemsHtml}</${tag}>`
        break
      }

      case WidgetType.SocialLinks: {
        const links = (this.data.links as Array<{ platform: string; url: string }>) || []
        const iconSize = (this.data.iconSize as number) || 24
        const gap = (this.data.gap as number) || 12
        const textAlign = (desktopStyle.textAlign as string) || 'center'

        // Social platform icon URLs (using simple SVG data URIs for email compatibility)
        const iconUrls: Record<string, string> = {
          facebook: 'https://cdn-icons-png.flaticon.com/512/733/733547.png',
          twitter: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
          instagram: 'https://cdn-icons-png.flaticon.com/512/733/733558.png',
          linkedin: 'https://cdn-icons-png.flaticon.com/512/733/733561.png',
          youtube: 'https://cdn-icons-png.flaticon.com/512/733/733646.png',
          email: 'https://cdn-icons-png.flaticon.com/512/732/732200.png',
        }

        const iconsHtml = links
          .map((link) => {
            const iconUrl = iconUrls[link.platform] || iconUrls.email
            return `<a href="${link.url}" style="text-decoration:none;margin:0 ${gap / 2}px;display:inline-block;"><img src="${iconUrl}" alt="${link.platform}" width="${iconSize}" height="${iconSize}" style="display:block;" /></a>`
          })
          .join('')

        elementHtml = `<div class="${this.id}" style="text-align:${textAlign};${style}">${iconsHtml}</div>`
        break
      }

      case WidgetType.Video: {
        const videoUrl = (this.data.videoUrl as string) || ''
        const thumbnailUrl = (this.data.thumbnailUrl as string) || ''
        const textAlign = (desktopStyle.textAlign as string) || 'center'

        // Extract YouTube video ID from URL
        const getYouTubeId = (url: string): string | null => {
          const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
          const match = url.match(regex)
          return match ? match[1] : null
        }

        const videoId = getYouTubeId(videoUrl)
        const autoThumbnail = videoId
          ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          : ''
        const displayThumbnail = thumbnailUrl || autoThumbnail
        const videoLink = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#'

        if (displayThumbnail) {
          // Render as clickable thumbnail linking to YouTube
          elementHtml = `<div class="${this.id}" style="text-align:${textAlign};${style}">
            <a href="${videoLink}" target="_blank" style="display:inline-block;position:relative;max-width:100%;">
              <img src="${displayThumbnail}" alt="Video thumbnail" style="max-width:100%;display:block;" />
              <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:68px;height:48px;background:rgba(255,0,0,0.9);border-radius:12px;display:flex;align-items:center;justify-content:center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </a>
          </div>`
        } else {
          elementHtml = `<div class="${this.id}" style="text-align:${textAlign};${style}">
            <p style="color:#666;">Add a YouTube video URL</p>
          </div>`
        }
        break
      }

      default:
        // Paragraph
        elementHtml = `<p class="${this.id}" style="${style}">${(this.data.content as string) || ''}</p>`
    }

    // Check if we need a container wrapper
    const hasContainerBg = containerBgColor && containerBgColor !== 'transparent'
    const hasContainerPadding =
      containerPaddingTop || containerPaddingRight || containerPaddingBottom || containerPaddingLeft
    const hasContainerMargin =
      containerMarginTop || containerMarginRight || containerMarginBottom || containerMarginLeft

    if (hasContainerBg || hasContainerPadding || hasContainerMargin) {
      const containerStyles: string[] = []
      if (hasContainerBg) {
        containerStyles.push(`background-color:${containerBgColor}`)
      }
      if (hasContainerPadding) {
        const padding = `${containerPaddingTop || 0}px ${containerPaddingRight || 0}px ${containerPaddingBottom || 0}px ${containerPaddingLeft || 0}px`
        containerStyles.push(`padding:${padding}`)
      }
      if (hasContainerMargin) {
        const margin = `${containerMarginTop || 0}px ${containerMarginRight || 0}px ${containerMarginBottom || 0}px ${containerMarginLeft || 0}px`
        containerStyles.push(`margin:${margin}`)
      }
      return `<div class="${this.id}-container" style="${containerStyles.join(';')}">${elementHtml}</div>`
    }

    return elementHtml
  }

  // Helper to set block type
  setType(type: WidgetType): void {
    this.type = type
  }

  // Helper to set content
  setContent(content: string): void {
    this.data.content = content
  }

  // MJML Export
  toMJML(): string {
    switch (this.type) {
      case WidgetType.Image:
        return this.imageToMJML()
      case WidgetType.Button:
        return this.buttonToMJML()
      case WidgetType.Headline:
        return this.headlineToMJML()
      case WidgetType.Paragraph:
        return this.paragraphToMJML()
      case WidgetType.Divider:
        return this.dividerToMJML()
      case WidgetType.Spacer:
        return this.spacerToMJML()
      case WidgetType.List:
        return this.listToMJML()
      case WidgetType.SocialLinks:
        return this.socialLinksToMJML()
      case WidgetType.Video:
        return this.videoToMJML()
      default:
        return `<mj-text>${this.data.content || ''}</mj-text>`
    }
  }

  private imageToMJML(): string {
    const attrs: string[] = []
    const style = this._style.desktop

    attrs.push(`src="${(this.data.src as string) || ''}"`)
    attrs.push(`alt="${(this.data.alt as string) || ''}"`)

    // Width
    const widthSize = style['width-size'] as number | undefined
    if (widthSize) {
      const unit = (style['width-unit'] as string) || 'px'
      attrs.push(`width="${widthSize}${unit}"`)
    }

    // Padding
    const padding = this.getMJMLPadding()
    if (padding) attrs.push(`padding="${padding}"`)

    // Alignment
    const textAlign = style.textAlign as string | undefined
    if (textAlign) {
      attrs.push(`align="${textAlign}"`)
    }

    // Border radius - supports individual corners
    const borderRadiusAttr = this.getMJMLBorderRadius()
    if (borderRadiusAttr) {
      attrs.push(`border-radius="${borderRadiusAttr}"`)
    }

    return `<mj-image ${attrs.join(' ')} />`
  }

  private buttonToMJML(): string {
    const attrs: string[] = []
    const style = this._style.desktop
    const d = this.defaults

    attrs.push(`href="${(this.data.href as string) || '#'}"`)

    // Background color
    const bgColor = style.backgroundColor as string | undefined
    attrs.push(
      `background-color="${bgColor && bgColor !== 'transparent' ? bgColor : d.backgroundColor}"`
    )

    // Text color
    const color = style.color as string | undefined
    attrs.push(`color="${color || d.color}"`)

    // Font size
    const fontSize = style['fontSize-size'] as number | undefined
    attrs.push(`font-size="${fontSize || d.fontSize}px"`)

    // Font weight
    const fontWeight = style.fontWeight as string | undefined
    if (fontWeight && fontWeight !== d.fontWeight) {
      attrs.push(`font-weight="${fontWeight}"`)
    }

    // Padding
    const padding = this.getMJMLPadding()
    attrs.push(`inner-padding="${padding || d.padding}"`)

    // Border radius
    const borderRadius = style['borderRadius-size'] as number | undefined
    attrs.push(`border-radius="${borderRadius !== undefined ? borderRadius : d.borderRadius}px"`)

    // Alignment
    const textAlign = style.textAlign as string | undefined
    if (textAlign) {
      attrs.push(`align="${textAlign}"`)
    }

    return `<mj-button ${attrs.join(' ')}>${(this.data.text as string) || d.defaultText}</mj-button>`
  }

  private headlineToMJML(): string {
    const attrs = this.getTextMJMLAttributes()
    const content = (this.data.content as string) || this.defaults.defaultContent || ''

    return `<mj-text ${attrs.join(' ')}><h2 style="margin:0;font-size:inherit;font-weight:inherit;">${content}</h2></mj-text>`
  }

  private paragraphToMJML(): string {
    const attrs = this.getTextMJMLAttributes()
    const content = (this.data.content as string) || this.defaults.defaultContent || ''

    return `<mj-text ${attrs.join(' ')}>${content}</mj-text>`
  }

  private listToMJML(): string {
    const attrs = this.getTextMJMLAttributes()
    const items = (this.data.items as string[]) || ['Item 1', 'Item 2', 'Item 3']
    const listType = (this.data.listType as string) || 'bullet'
    const tag = listType === 'numbered' ? 'ol' : 'ul'
    const itemsHtml = items.map((item) => `<li>${item}</li>`).join('')

    return `<mj-text ${attrs.join(' ')}><${tag} style="margin:0;padding-left:20px;">${itemsHtml}</${tag}></mj-text>`
  }

  private dividerToMJML(): string {
    const attrs: string[] = []
    const style = this._style.desktop

    // Border color
    const borderColor = style.borderColor as string | undefined
    const bgColor = style.backgroundColor as string | undefined
    if (borderColor) {
      attrs.push(`border-color="${borderColor}"`)
    } else if (bgColor && bgColor !== 'transparent') {
      attrs.push(`border-color="${bgColor}"`)
    }

    // Border width
    const borderWidth = style['borderWidth-size'] as number | undefined
    if (borderWidth) {
      attrs.push(`border-width="${borderWidth}px"`)
    }

    // Padding
    const padding = this.getMJMLPadding()
    if (padding) attrs.push(`padding="${padding}"`)

    return `<mj-divider ${attrs.join(' ')} />`
  }

  private spacerToMJML(): string {
    const height = (this.data.height as string) || '20px'
    return `<mj-spacer height="${height}" />`
  }

  private socialLinksToMJML(): string {
    const links = (this.data.links as Array<{ platform: string; url: string }>) || []
    const iconSize = (this.data.iconSize as number) || 24

    const socialElements = links
      .map((link) => {
        return `<mj-social-element name="${link.platform}" href="${link.url}" icon-size="${iconSize}px" />`
      })
      .join('\n')

    const style = this._style.desktop
    const align = (style.textAlign as string) || 'center'
    const padding = this.getMJMLPadding()

    return `<mj-social align="${align}"${padding ? ` padding="${padding}"` : ''} mode="horizontal">\n${socialElements}\n</mj-social>`
  }

  private videoToMJML(): string {
    const videoUrl = (this.data.videoUrl as string) || ''
    const thumbnailUrl = (this.data.thumbnailUrl as string) || ''

    // Extract YouTube video ID from URL
    const getYouTubeId = (url: string): string | null => {
      const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      const match = url.match(regex)
      return match ? match[1] : null
    }

    const videoId = getYouTubeId(videoUrl)
    const autoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
    const displayThumbnail = thumbnailUrl || autoThumbnail
    const videoLink = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#'

    const style = this._style.desktop
    const align = (style.textAlign as string) || 'center'
    const padding = this.getMJMLPadding()

    if (displayThumbnail && videoId) {
      // Use mj-image with href for clickable thumbnail
      return `<mj-image src="${displayThumbnail}" alt="Play video" href="${videoLink}" align="${align}"${padding ? ` padding="${padding}"` : ''} />`
    }

    return `<mj-text align="${align}"${padding ? ` padding="${padding}"` : ''}>Add a YouTube video URL</mj-text>`
  }

  private getTextMJMLAttributes(): string[] {
    const attrs: string[] = []
    const style = this._style.desktop
    const d = this.defaults

    // Color - use default if not set
    const color = style.color as string | undefined
    attrs.push(`color="${color || d.color || '#000000'}"`)

    // Font size - use default if not set
    const fontSize = style['fontSize-size'] as number | undefined
    attrs.push(`font-size="${fontSize || d.fontSize || 16}px"`)

    // Font weight - use default if not set
    const fontWeight = style.fontWeight as string | undefined
    attrs.push(`font-weight="${fontWeight || d.fontWeight || 'normal'}"`)

    // Line height - use default if not set
    const lineHeight = style['lineHeight-size'] as number | undefined
    if (lineHeight || d.lineHeight) {
      attrs.push(`line-height="${lineHeight || d.lineHeight}px"`)
    }

    // Text align
    const textAlign = style.textAlign as string | undefined
    if (textAlign) {
      attrs.push(`align="${textAlign}"`)
    }

    // Padding
    const padding = this.getMJMLPadding()
    if (padding) attrs.push(`padding="${padding}"`)

    return attrs
  }

  private getMJMLPadding(): string | null {
    const style = this._style.desktop

    const top = (style['paddingTop-size'] || style['padding-size'] || 0) as number
    const right = (style['paddingRight-size'] || style['padding-size'] || 0) as number
    const bottom = (style['paddingBottom-size'] || style['padding-size'] || 0) as number
    const left = (style['paddingLeft-size'] || style['padding-size'] || 0) as number

    if (top || right || bottom || left) {
      return `${top}px ${right}px ${bottom}px ${left}px`
    }
    return null
  }

  private getMJMLBorderRadius(): string | null {
    const style = this._style.desktop

    // Check for individual corner radii first
    const topLeft = style['borderTopLeftRadius-size'] as number | undefined
    const topRight = style['borderTopRightRadius-size'] as number | undefined
    const bottomLeft = style['borderBottomLeftRadius-size'] as number | undefined
    const bottomRight = style['borderBottomRightRadius-size'] as number | undefined

    if (
      topLeft !== undefined ||
      topRight !== undefined ||
      bottomLeft !== undefined ||
      bottomRight !== undefined
    ) {
      // Return individual corners in CSS order: top-left top-right bottom-right bottom-left
      return `${topLeft || 0}px ${topRight || 0}px ${bottomRight || 0}px ${bottomLeft || 0}px`
    }

    // Fall back to unified border radius
    const unified = style['borderRadius-size'] as number | undefined
    if (unified !== undefined) {
      return `${unified}px`
    }

    return null
  }
}
