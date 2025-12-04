import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import { editorStore } from '../../stores/EditorStore'

const Container = styled.div`
  padding: ${tokens.spacing[4]};

  .field {
    margin-bottom: ${tokens.spacing[3]};
  }

  .field-label {
    display: block;
    font-size: ${tokens.fontSize.xs};
    font-weight: ${tokens.fontWeight.medium};
    color: var(--text-secondary);
    margin-bottom: ${tokens.spacing[1]};
  }

  .text-input {
    width: 100%;
    padding: ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.sm};
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    color: var(--input-text);
    transition: border-color ${tokens.transition.fast};

    &:hover {
      border-color: var(--text-secondary);
    }

    &:focus {
      outline: none;
      border-color: var(--accent);
    }

    &::placeholder {
      color: var(--text-muted);
    }
  }

  .textarea {
    width: 100%;
    min-height: 100px;
    padding: ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.sm};
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    color: var(--input-text);
    resize: vertical;
    font-family: inherit;
    transition: border-color ${tokens.transition.fast};

    &:hover {
      border-color: var(--text-secondary);
    }

    &:focus {
      outline: none;
      border-color: var(--accent);
    }

    &::placeholder {
      color: var(--text-muted);
    }
  }

  .no-selection {
    color: var(--text-secondary);
    font-size: ${tokens.fontSize.sm};
    font-style: italic;
  }
`

export const ContentTab = observer(() => {
  const element = editorStore.selectedElement
  const elementType = element?.type

  if (!element) {
    return (
      <Container>
        <p className="no-selection">Select an element to edit its content</p>
      </Container>
    )
  }

  // Helper to get data value
  const getData = (key: string, defaultValue: string = ''): string => {
    return (element.data[key] as string) ?? defaultValue
  }

  // Helper to update data value
  const updateData = (key: string, value: string) => {
    editorStore.updateSelectedData(key, value)
  }

  // Render content fields based on element type
  const renderContentFields = () => {
    switch (elementType) {
      case 'Image':
        return (
          <>
            <div className="field">
              <label className="field-label">Image URL</label>
              <input
                type="text"
                className="text-input"
                placeholder="https://example.com/image.jpg"
                value={getData('src')}
                onChange={e => updateData('src', e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">Alt Text</label>
              <input
                type="text"
                className="text-input"
                placeholder="Describe the image..."
                value={getData('alt')}
                onChange={e => updateData('alt', e.target.value)}
              />
            </div>
          </>
        )

      case 'Button':
        return (
          <>
            <div className="field">
              <label className="field-label">Button Text</label>
              <input
                type="text"
                className="text-input"
                placeholder="Click Me"
                value={getData('text')}
                onChange={e => updateData('text', e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">Link URL</label>
              <input
                type="text"
                className="text-input"
                placeholder="https://example.com"
                value={getData('href')}
                onChange={e => updateData('href', e.target.value)}
              />
            </div>
          </>
        )

      case 'Headline':
        return (
          <div className="field">
            <label className="field-label">Headline Text</label>
            <input
              type="text"
              className="text-input"
              placeholder="Enter headline..."
              value={getData('content')}
              onChange={e => updateData('content', e.target.value)}
            />
          </div>
        )

      case 'Paragraph':
        return (
          <div className="field">
            <label className="field-label">Paragraph Text</label>
            <textarea
              className="textarea"
              placeholder="Enter your text here..."
              value={getData('content')}
              onChange={e => updateData('content', e.target.value)}
            />
          </div>
        )

      case 'Spacer':
        return (
          <div className="field">
            <label className="field-label">Height</label>
            <input
              type="text"
              className="text-input"
              placeholder="20px"
              value={getData('height', '20px')}
              onChange={e => updateData('height', e.target.value)}
            />
          </div>
        )

      case 'Divider':
        return <p className="no-selection">Divider has no content properties. Use the Style tab.</p>

      case 'Section':
      case 'Column':
      case 'InnerSection':
        return (
          <p className="no-selection">
            {elementType} is a container element. Use the Container tab for layout options.
          </p>
        )

      default:
        return (
          <p className="no-selection">No content properties available for this element type.</p>
        )
    }
  }

  return <Container>{renderContentFields()}</Container>
})
