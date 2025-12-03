import { observer } from 'mobx-react-lite'
import {
  ChevronDown,
  ChevronRight,
  Columns,
  Heading1,
  Image,
  MousePointer,
  Type,
} from 'lucide-react'
import { type Block, type Column, editorStore } from '../../stores/EditorStore'

const getBlockIcon = (type: string) => {
  const icons: Record<string, React.FC<{ size?: number; className?: string }>> = {
    Image: Image,
    Headline: Heading1,
    Paragraph: Type,
    Button: MousePointer,
  }
  return icons[type] || Type
}

interface TreeItemProps {
  block?: Block
  column?: Column
  depth?: number
  expanded?: Set<string>
  onToggle?: (id: string, e: React.MouseEvent) => void
}

export const TreeItem = observer(
  ({ block, column, depth = 2, expanded, onToggle }: TreeItemProps) => {
    if (block) {
      const Icon = getBlockIcon(block.type)
      const isSelected = editorStore.selectedBlockId === block.id

      return (
        <div
          className={`tree-item ${isSelected ? 'is-selected' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => editorStore.setSelectedBlock(block.id)}
        >
          <span className="tree-toggle" />
          <Icon size={16} className="tree-icon" />
          <span className="tree-label">{block.type}</span>
        </div>
      )
    }

    if (column && expanded && onToggle) {
      const isExpanded = expanded.has(column.id)
      const hasChildren = column.blocks.length > 0

      return (
        <div>
          <div
            className="tree-item"
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => editorStore.setSelectedBlock(column.id)}
          >
            <span className="tree-toggle" onClick={e => onToggle(column.id, e)}>
              {hasChildren && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
            </span>
            <Columns size={16} className="tree-icon" />
            <span className="tree-label">Column</span>
          </div>
          {isExpanded &&
            column.blocks.map(b => <TreeItem key={b.id} block={b} depth={depth + 1} />)}
        </div>
      )
    }

    return null
  }
)
