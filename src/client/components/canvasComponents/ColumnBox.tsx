import { useDroppable } from '@dnd-kit/core'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Column } from '../../models'
import { editorStore } from '../../stores/EditorStore'
import { tokens } from '../../styles/tokens'
import { useDndState } from '../dnd'
import { AddColumnButton, ColumnActions, ElementLabel } from '../WidgetActions'
import { BlockElement } from './BlockElement'

interface ColumnBoxProps {
  column: Column
  sectionId: string
  index: number
  isLast?: boolean
  isOnlyColumn?: boolean
}

const Container = styled.div`
  position: relative;
  min-height: 80px;
  min-width: 0; /* Allow flex shrinking */
  overflow: visible;
  background: transparent;
  border: 2px dashed transparent;
  border-radius: ${tokens.borderRadius.md};
  padding: ${tokens.spacing[3]};
  transition: all ${tokens.transition.fast};

  &.is-hovered {
    border-color: #1e88e5;
    border-style: solid;

    > .element-label {
      opacity: 1;
    }
  }

  &.is-selected {
    border-color: #1e88e5;
    border-style: solid;
    box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.2);

    .add-column-btn {
      opacity: 1;
    }
  }

  &.is-over {
    background: rgba(30, 136, 229, 0.05);
    border-color: #1e88e5;
  }

  .column-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 60px;
    color: ${tokens.colors.gray[400]};
    font-size: ${tokens.fontSize.xs};
    border: 2px dashed transparent;
    border-radius: ${tokens.borderRadius.sm};
    transition: all ${tokens.transition.fast};
  }

  .column-blocks {
    min-height: 40px;
  }

  .drop-placeholder {
    height: 40px;
    border: 2px dashed #1e88e5;
    border-radius: ${tokens.borderRadius.sm};
    background: rgba(30, 136, 229, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e88e5;
    font-size: ${tokens.fontSize.xs};
    margin: ${tokens.spacing[1]} 0;
  }
`

const ColumnDropZone = styled.div<{ $isOver: boolean; $isDraggingColumn: boolean }>`
  width: ${({ $isDraggingColumn }) => ($isDraggingColumn ? '8px' : '0')};
  margin: ${({ $isDraggingColumn }) => ($isDraggingColumn ? '0 -4px' : '0')};
  transition: all ${tokens.transition.fast};
  align-self: stretch;
  position: relative;
  z-index: 5;

  ${({ $isOver }) =>
    $isOver &&
    `
    width: 40px !important;
    margin: 0 8px !important;
    background: rgba(30, 136, 229, 0.15);
    border: 2px dashed #1e88e5;
    border-radius: ${tokens.borderRadius.md};
  `}
`

const TrailingElementDropZone = styled.div<{ $isOver: boolean; $isDraggingElement: boolean }>`
  height: ${({ $isDraggingElement }) => ($isDraggingElement ? '24px' : '0')};
  margin: ${({ $isDraggingElement }) => ($isDraggingElement ? '4px 0' : '0')};
  transition: all ${tokens.transition.fast};
  position: relative;
  z-index: 5;
  width: 100%;
  border-radius: ${tokens.borderRadius.sm};

  ${({ $isDraggingElement }) =>
    $isDraggingElement &&
    `
    background: rgba(55, 71, 79, 0.05);
    border: 2px dashed rgba(55, 71, 79, 0.3);
  `}

  ${({ $isOver }) =>
    $isOver &&
    `
    height: 40px !important;
    margin: 8px 0 !important;
    background: rgba(55, 71, 79, 0.15) !important;
    border: 2px dashed #37474f !important;
  `}
`

export const ColumnBox = observer(
  ({ column, sectionId, index, isLast, isOnlyColumn }: ColumnBoxProps) => {
    const isSelected = editorStore.selectedElementId === column.id
    const isHovered = editorStore.hoveredElementId === column.id
    const { activeData } = useDndState()

    // Check if parent section is using Grid layout
    const section = editorStore.findElementById(sectionId)
    const isGridLayout = section?.style?.display === 'grid'

    // Check if dragging a column (from sidebar or canvas)
    const isDraggingColumn =
      (activeData?.source === 'sidebar' && activeData?.type === 'column') ||
      (activeData?.source === 'canvas' && activeData?.type === 'column')

    // Drop zone before this column for column reordering
    const { isOver: isOverDropZone, setNodeRef: setDropZoneRef } = useDroppable({
      id: `column-drop-${column.id}`,
      data: { type: 'column', columnId: column.id, sectionId, index },
    })

    // Make this container directly droppable
    // Also include sectionId so column drops can be handled at section level
    const { isOver, setNodeRef } = useDroppable({
      id: `column-${column.id}`,
      data: { accepts: 'block', columnId: column.id, sectionId, type: 'column' },
    })

    // Only show placeholder for block drops, not column drops
    const showPlaceholder =
      isOver && activeData?.source === 'sidebar' && activeData?.type === 'block'

    // Check if dragging an element
    const isDraggingElement = activeData?.source === 'canvas' && activeData?.type === 'element'

    // Trailing drop zone for elements (at end of column)
    const { isOver: isOverTrailingElement, setNodeRef: setTrailingElementRef } = useDroppable({
      id: `element-drop-trailing-${column.id}`,
      data: { type: 'element', columnId: column.id, index: column.children.length },
    })

    const handleMouseOver = (e: React.MouseEvent) => {
      e.stopPropagation()
      // Only set hover if mouse is directly over this element or empty area
      const target = e.target as HTMLElement
      if (
        e.currentTarget === e.target ||
        target.classList.contains('column-empty') ||
        target.classList.contains('column-blocks')
      ) {
        editorStore.setHoveredElement(column.id)
      }
    }

    const handleMouseLeave = () => {
      if (editorStore.hoveredElementId === column.id) {
        editorStore.setHoveredElement(null)
      }
    }

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      editorStore.setSelectedElement(column.id)
    }

    const handleCopy = () => {
      editorStore.copyElement(column.id)
    }

    const handleDelete = () => {
      editorStore.removeElement(column.id)
    }

    const handleAddColumn = () => {
      // Add a new column after this one (no fixed width = auto-expand with flex: 1)
      const section = editorStore.findElementById(sectionId)
      if (section) {
        editorStore.addColumnToSection(sectionId)
      }
    }

    const classNames = [
      isSelected ? 'is-selected' : '',
      isOver && !isDraggingColumn ? 'is-over' : '',
      isHovered ? 'is-hovered' : '',
    ]
      .filter(Boolean)
      .join(' ')

    // Extract flex child properties from column style
    const { alignSelf, order, flexGrow, flexShrink, flexBasis, ...otherColumnStyles } = column.style

    // For Grid layout: columns are grid items, no flex properties needed
    // For Flex layout: use flex-basis and flex-grow
    // But if user has set a custom width in styles, respect that instead
    const hasCustomWidth = otherColumnStyles.width !== undefined
    const hasExplicitFlexProps = flexGrow !== undefined || flexShrink !== undefined

    const layoutStyle: React.CSSProperties = isGridLayout
      ? {} // Grid items don't need special sizing - they follow grid template
      : hasExplicitFlexProps
        ? {} // User has set explicit flex properties, don't override
        : hasCustomWidth
          ? {} // User has set custom width, don't override with flex
          : isOnlyColumn
            ? { flex: 1 }
            : column.width !== undefined
              ? { flex: `0 0 ${column.width}%`, maxWidth: `${column.width}%` }
              : { flex: 1 }

    // Flex child styles (applied to this column as a flex item of its parent section)
    const flexChildStyle: React.CSSProperties = {
      // Default to stretch if no alignSelf is set
      alignSelf: (alignSelf as React.CSSProperties['alignSelf']) || 'stretch',
      ...(order !== undefined && { order: order as number }),
      ...(flexGrow !== undefined && { flexGrow: flexGrow as number }),
      ...(flexShrink !== undefined && { flexShrink: flexShrink as number }),
      ...(flexBasis !== undefined && { flexBasis: flexBasis as React.CSSProperties['flexBasis'] }),
    }

    // Get column styles, but exclude width when in grid layout (grid controls sizing)
    const columnStyle = { ...otherColumnStyles }
    if (isGridLayout) {
      delete columnStyle.width
      delete columnStyle.maxWidth
    }

    return (
      <>
        {/* Drop zone before column for reordering */}
        <ColumnDropZone
          ref={setDropZoneRef}
          $isOver={isOverDropZone}
          $isDraggingColumn={isDraggingColumn}
        />
        <Container
          ref={setNodeRef}
          className={classNames}
          style={{
            ...layoutStyle,
            ...flexChildStyle,
            ...columnStyle,
          }}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          data-column-id={column.id}
        >
          <ElementLabel label="Column" color="#1e88e5" />
          <ColumnActions
            isVisible={isSelected}
            columnId={column.id}
            sectionId={sectionId}
            columnIndex={index}
            onCopy={handleCopy}
            onDelete={handleDelete}
          />
          {!isLast && <AddColumnButton onClick={handleAddColumn} />}

          {column.children.length === 0 ? (
            <div
              className="column-empty"
              style={{
                borderColor: isOver && !isDraggingColumn ? '#1e88e5' : 'transparent',
                background: isOver && !isDraggingColumn ? 'rgba(30, 136, 229, 0.1)' : 'transparent',
              }}
            >
              {isOver && !isDraggingColumn ? 'Drop here' : 'Drop elements here'}
            </div>
          ) : (
            <div
              className="column-blocks"
              style={{
                display: (column.style.display as React.CSSProperties['display']) || 'flex',
                // Flex properties
                ...(column.style.display !== 'grid' && {
                  flexDirection:
                    (column.style.flexDirection as React.CSSProperties['flexDirection']) ||
                    'column',
                  flexWrap: column.style.flexWrap as React.CSSProperties['flexWrap'],
                }),
                // Grid properties
                ...(column.style.display === 'grid' && {
                  gridTemplateColumns: column.style.gridTemplateColumns as string,
                  gridTemplateRows: column.style.gridTemplateRows as string,
                  gridAutoFlow: column.style.gridAutoFlow as React.CSSProperties['gridAutoFlow'],
                  justifyItems: column.style.justifyItems as React.CSSProperties['justifyItems'],
                }),
                // Common properties
                justifyContent: column.style
                  .justifyContent as React.CSSProperties['justifyContent'],
                alignItems: column.style.alignItems as React.CSSProperties['alignItems'],
                gap:
                  column.style.columnGap || column.style.rowGap
                    ? `${column.style.rowGap || '0px'} ${column.style.columnGap || '0px'}`
                    : tokens.spacing[2],
              }}
            >
              {showPlaceholder && <div className="drop-placeholder">Drop here</div>}
              {column.children.map((child, idx) => (
                <BlockElement key={child.key} block={child} columnId={column.id} index={idx} />
              ))}
              {/* Trailing drop zone for elements */}
              <TrailingElementDropZone
                ref={setTrailingElementRef}
                $isOver={isOverTrailingElement}
                $isDraggingElement={isDraggingElement}
              />
            </div>
          )}
        </Container>
      </>
    )
  }
)
