import { observer } from 'mobx-react-lite'
import { X, Copy, Check, Download } from 'lucide-react'
import React, { useState, useMemo } from 'react'
import { editorStore } from '../stores/EditorStore'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

// Syntax highlighting for HTML
const highlightHTML = (html: string): React.ReactElement[] => {
  const lines = html.split('\n')

  return lines.map((line, lineIndex) => {
    const tokens: React.ReactElement[] = []
    let remaining = line
    let keyIndex = 0

    // Calculate indentation
    const indentMatch = remaining.match(/^(\s*)/)
    const indent = indentMatch ? indentMatch[1] : ''
    remaining = remaining.slice(indent.length)

    while (remaining.length > 0) {
      // DOCTYPE
      if (remaining.match(/^<!DOCTYPE[^>]*>/i)) {
        const match = remaining.match(/^<!DOCTYPE[^>]*>/i)!
        tokens.push(
          <span key={keyIndex++} className="token-doctype">
            {match[0]}
          </span>
        )
        remaining = remaining.slice(match[0].length)
        continue
      }

      // Comments
      if (remaining.match(/^<!--[\s\S]*?-->/)) {
        const match = remaining.match(/^<!--[\s\S]*?-->/)!
        tokens.push(
          <span key={keyIndex++} className="token-comment">
            {match[0]}
          </span>
        )
        remaining = remaining.slice(match[0].length)
        continue
      }

      // Closing tags
      if (remaining.match(/^<\/[a-zA-Z][a-zA-Z0-9]*>/)) {
        const match = remaining.match(/^<\/([a-zA-Z][a-zA-Z0-9]*)>/)!
        tokens.push(
          <span key={keyIndex++}>
            <span className="token-bracket">{'</'}</span>
            <span className="token-tag">{match[1]}</span>
            <span className="token-bracket">{'>'}</span>
          </span>
        )
        remaining = remaining.slice(match[0].length)
        continue
      }

      // Opening tags with attributes
      if (remaining.match(/^<[a-zA-Z][a-zA-Z0-9]*/)) {
        const tagMatch = remaining.match(/^<([a-zA-Z][a-zA-Z0-9]*)/)!
        tokens.push(
          <span key={keyIndex++}>
            <span className="token-bracket">{'<'}</span>
            <span className="token-tag">{tagMatch[1]}</span>
          </span>
        )
        remaining = remaining.slice(tagMatch[0].length)

        // Parse attributes
        while (remaining.length > 0 && !remaining.startsWith('>') && !remaining.startsWith('/>')) {
          // Whitespace
          if (remaining.match(/^\s+/)) {
            const wsMatch = remaining.match(/^\s+/)!
            tokens.push(<span key={keyIndex++}>{wsMatch[0]}</span>)
            remaining = remaining.slice(wsMatch[0].length)
            continue
          }

          // Attribute with value
          if (remaining.match(/^([a-zA-Z_:][a-zA-Z0-9_:.-]*)(\s*=\s*)("[^"]*"|'[^']*')/)) {
            const attrMatch = remaining.match(
              /^([a-zA-Z_:][a-zA-Z0-9_:.-]*)(\s*=\s*)("[^"]*"|'[^']*')/
            )!
            tokens.push(
              <span key={keyIndex++}>
                <span className="token-attr-name">{attrMatch[1]}</span>
                <span className="token-punctuation">{attrMatch[2]}</span>
                <span className="token-attr-value">{attrMatch[3]}</span>
              </span>
            )
            remaining = remaining.slice(attrMatch[0].length)
            continue
          }

          // Boolean attribute
          if (remaining.match(/^[a-zA-Z_:][a-zA-Z0-9_:.-]*/)) {
            const boolMatch = remaining.match(/^[a-zA-Z_:][a-zA-Z0-9_:.-]*/)!
            tokens.push(
              <span key={keyIndex++} className="token-attr-name">
                {boolMatch[0]}
              </span>
            )
            remaining = remaining.slice(boolMatch[0].length)
            continue
          }

          break
        }

        // Self-closing or closing bracket
        if (remaining.startsWith('/>')) {
          tokens.push(
            <span key={keyIndex++} className="token-bracket">
              {'/>'}
            </span>
          )
          remaining = remaining.slice(2)
        } else if (remaining.startsWith('>')) {
          tokens.push(
            <span key={keyIndex++} className="token-bracket">
              {'>'}
            </span>
          )
          remaining = remaining.slice(1)
        }
        continue
      }

      // CSS in style tags - simplified
      if (remaining.match(/^[^<]+/)) {
        const textMatch = remaining.match(/^[^<]+/)!
        const text = textMatch[0]

        // Check if this looks like CSS
        if (text.includes('{') || text.includes('}') || text.includes(':')) {
          // Highlight CSS properties and values
          const cssTokens = text.split(/(\{|\}|;|:)/).map((part, i) => {
            if (part === '{' || part === '}') {
              return (
                <span key={i} className="token-css-bracket">
                  {part}
                </span>
              )
            }
            if (part === ':') {
              return (
                <span key={i} className="token-punctuation">
                  {part}
                </span>
              )
            }
            if (part === ';') {
              return (
                <span key={i} className="token-punctuation">
                  {part}
                </span>
              )
            }
            // Property name (before colon)
            if (part.match(/^[a-zA-Z-]+$/)) {
              return (
                <span key={i} className="token-css-property">
                  {part}
                </span>
              )
            }
            return (
              <span key={i} className="token-css-value">
                {part}
              </span>
            )
          })
          tokens.push(<span key={keyIndex++}>{cssTokens}</span>)
        } else {
          tokens.push(
            <span key={keyIndex++} className="token-text">
              {text}
            </span>
          )
        }
        remaining = remaining.slice(text.length)
        continue
      }

      // Fallback - take one character
      tokens.push(<span key={keyIndex++}>{remaining[0]}</span>)
      remaining = remaining.slice(1)
    }

    return (
      <div key={lineIndex} className="code-line">
        <span className="line-number">{lineIndex + 1}</span>
        <span className="line-content">
          {indent && <span className="indent">{indent}</span>}
          {tokens}
        </span>
      </div>
    )
  })
}

// Format HTML with proper indentation
const formatHTML = (html: string): string => {
  let formatted = ''
  let indent = 0
  const tab = '  '

  // Split by tags while keeping the tags
  const tokens = html.split(/(<[^>]+>)/g).filter(Boolean)

  for (const token of tokens) {
    const trimmed = token.trim()
    if (!trimmed) continue

    // Closing tag
    if (trimmed.startsWith('</')) {
      indent = Math.max(0, indent - 1)
      formatted += tab.repeat(indent) + trimmed + '\n'
    }
    // Self-closing tag or DOCTYPE or meta
    else if (
      trimmed.startsWith('<!') ||
      trimmed.endsWith('/>') ||
      trimmed.match(/^<(meta|link|br|hr|img|input)\b/i)
    ) {
      formatted += tab.repeat(indent) + trimmed + '\n'
    }
    // Opening tag
    else if (trimmed.startsWith('<')) {
      formatted += tab.repeat(indent) + trimmed + '\n'
      // Don't indent for void elements
      if (!trimmed.match(/^<(style|script)\b/i)) {
        indent++
      } else {
        indent++
      }
    }
    // Text content
    else {
      // Handle style/script content specially
      const lines = trimmed.split('\n').filter(l => l.trim())
      for (const line of lines) {
        formatted += tab.repeat(indent) + line.trim() + '\n'
      }
    }
  }

  return formatted.trim()
}

export const ExportModal = observer(({ isOpen, onClose }: ExportModalProps) => {
  const [copied, setCopied] = useState(false)

  const html = editorStore.exportAsHTML()

  const formattedHTML = useMemo(() => formatHTML(html), [html])
  const highlightedCode = useMemo(() => highlightHTML(formattedHTML), [formattedHTML])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    editorStore.downloadHTML()
  }

  if (!isOpen) return null

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={e => e.stopPropagation()}>
        <div className="export-modal__header">
          <div className="export-modal__file-tab">
            <span className="export-modal__file-icon">{'</>'}</span>
            <span className="export-modal__file-name">email-template.html</span>
          </div>
          <div className="export-modal__actions">
            <button className="export-modal__action-btn" onClick={handleCopy} title="Copy HTML">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              className="export-modal__action-btn"
              onClick={handleDownload}
              title="Download HTML"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            <button className="export-modal__close" onClick={onClose} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="export-modal__content">
          <div className="export-modal__code">{highlightedCode}</div>
        </div>
      </div>
    </div>
  )
})
