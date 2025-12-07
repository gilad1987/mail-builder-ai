import { useState, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import {
  ChevronDown,
  ChevronRight,
  Columns,
  Heading1,
  Image,
  LayoutGrid,
  MousePointer,
  Rows3,
  Square,
  Type,
} from 'lucide-react'
import { tokens } from '../../styles/tokens'
import { editorStore } from '../../stores/EditorStore'
import { Block, Box, Column, InnerSection, Section } from '../../models'

const Container = styled.div`
  .tree-item {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[1]};
    padding: ${tokens.spacing[1]} ${tokens.spacing[2]};
    margin: 1px ${tokens.spacing[2]};
    cursor: pointer;
    font-size: ${tokens.fontSize.sm};
    color: var(--text-primary);
    border-radius: ${tokens.borderRadius.sm};
    &:hover {
      background: var(--bg-elevated);
    }
    &.is-selected {
      background: ${tokens.colors.purple[600]};
      color: white;
    }
    &.is-selected .tree-icon {
      color: white;
    }
  }

  .tree-icon {
    color: var(--text-secondary);
    flex-shrink: 0;
  }
  .tree-label {
    flex: 1;
  }
  .tree-toggle {
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
  }
`

const getBlockIcon = (type: string) => {
  const icons: Record<string, React.FC<{ size?: number; className?: string }>> = {
    Image: Image,
    Headline: Heading1,
    Paragraph: Type,
    Button: MousePointer,
  }
  return icons[type] || Type
}

export const LayersTree = observer(() => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['body', 'template']))
  const selectedRef = useRef<HTMLDivElement>(null)

  // Find the path to an element (all parent IDs)
  const findPathToElement = (targetId: string): string[] => {
    const path: string[] = []

    const searchInChildren = (element: Box, currentPath: string[]): boolean => {
      if (element.id === targetId) {
        path.push(...currentPath)
        return true
      }

      for (const child of element.children) {
        if (searchInChildren(child, [...currentPath, element.id])) {
          return true
        }
      }
      return false
    }

    for (const section of editorStore.sections) {
      if (searchInChildren(section, [])) {
        break
      }
    }

    return path
  }

  // Auto-expand tree to show selected element
  useEffect(() => {
    if (editorStore.selectedElementId) {
      const pathToElement = findPathToElement(editorStore.selectedElementId)
      if (pathToElement.length > 0) {
        setExpanded(prev => {
          const next = new Set(prev)
          next.add('body')
          next.add('template')
          pathToElement.forEach(id => next.add(id))
          return next
        })
      }
      // Scroll selected element into view
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 50)
    }
  }, [])

  const toggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const renderElement = (element: Box, depth: number) => {
    const isExpanded = expanded.has(element.id)
    const isSelected = editorStore.selectedElementId === element.id
    const hasChildren = element.children.length > 0

    if (element instanceof Section) {
      return (
        <div key={element.key}>
          <div
            ref={isSelected ? selectedRef : undefined}
            className={`tree-item ${isSelected ? 'is-selected' : ''}`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => editorStore.setSelectedElement(element.id)}
          >
            <span className="tree-toggle" onClick={e => toggle(element.id, e)}>
              {hasChildren && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
            </span>
            <Rows3 size={16} className="tree-icon" />
            <span className="tree-label">Section</span>
          </div>
          {isExpanded && element.children.map(child => renderElement(child, depth + 1))}
        </div>
      )
    }

    if (element instanceof Column) {
      return (
        <div key={element.key}>
          <div
            ref={isSelected ? selectedRef : undefined}
            className={`tree-item ${isSelected ? 'is-selected' : ''}`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => editorStore.setSelectedElement(element.id)}
          >
            <span className="tree-toggle" onClick={e => toggle(element.id, e)}>
              {hasChildren && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
            </span>
            <Columns size={16} className="tree-icon" />
            <span className="tree-label">Column ({element.width}%)</span>
          </div>
          {isExpanded && element.children.map(child => renderElement(child, depth + 1))}
        </div>
      )
    }

    if (element instanceof InnerSection) {
      return (
        <div key={element.key}>
          <div
            ref={isSelected ? selectedRef : undefined}
            className={`tree-item ${isSelected ? 'is-selected' : ''}`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => editorStore.setSelectedElement(element.id)}
          >
            <span className="tree-toggle" onClick={e => toggle(element.id, e)}>
              {hasChildren && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
            </span>
            <Square size={16} className="tree-icon" />
            <span className="tree-label">Inner Section</span>
          </div>
          {isExpanded && element.children.map(child => renderElement(child, depth + 1))}
        </div>
      )
    }

    if (element instanceof Block) {
      const Icon = getBlockIcon(element.type)
      return (
        <div
          ref={isSelected ? selectedRef : undefined}
          key={element.key}
          className={`tree-item ${isSelected ? 'is-selected' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => editorStore.setSelectedElement(element.id)}
        >
          <span className="tree-toggle" />
          <Icon size={16} className="tree-icon" />
          <span className="tree-label">{element.type}</span>
        </div>
      )
    }

    return null
  }

  return (
    <Container>
      <div
        className={`tree-item ${!editorStore.selectedElementId ? 'is-selected' : ''}`}
        style={{ paddingLeft: '8px' }}
        onClick={() => editorStore.setSelectedElement(null)}
      >
        <span className="tree-toggle" onClick={e => toggle('body', e)}>
          {expanded.has('body') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <LayoutGrid size={16} className="tree-icon" />
        <span className="tree-label">Template</span>
      </div>

      {expanded.has('body') && (
        <div
          className="tree-item"
          style={{ paddingLeft: '24px' }}
          onClick={() => editorStore.setSelectedElement(null)}
        >
          <span className="tree-toggle" onClick={e => toggle('template', e)}>
            {expanded.has('template') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
          <Square size={16} className="tree-icon" />
          <span className="tree-label">Body</span>
        </div>
      )}

      {expanded.has('body') &&
        expanded.has('template') &&
        editorStore.sections.map(section => renderElement(section, 2))}
    </Container>
  )
})
