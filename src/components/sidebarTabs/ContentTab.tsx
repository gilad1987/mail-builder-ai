import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Plus, Trash2 } from 'lucide-react'
import { tokens } from '../../styles/tokens'
import { editorStore } from '../../stores/EditorStore'
import { WidgetType } from '../../config/elementControls'

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

  .select-input {
    width: 100%;
    padding: ${tokens.spacing[2]};
    font-size: ${tokens.fontSize.sm};
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    color: var(--input-text);
    cursor: pointer;
    transition: border-color ${tokens.transition.fast};

    &:hover {
      border-color: var(--text-secondary);
    }

    &:focus {
      outline: none;
      border-color: var(--accent);
    }
  }

  .list-items {
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing[2]};
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: ${tokens.spacing[2]};

    .text-input {
      flex: 1;
    }

    .delete-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      background: transparent;
      border: 1px solid var(--input-border);
      border-radius: ${tokens.borderRadius.sm};
      color: var(--text-secondary);
      cursor: pointer;
      transition: all ${tokens.transition.fast};

      &:hover {
        background: ${tokens.colors.red[50]};
        border-color: ${tokens.colors.red[300]};
        color: ${tokens.colors.red[500]};
      }
    }
  }

  .add-item-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${tokens.spacing[1]};
    width: 100%;
    padding: ${tokens.spacing[2]};
    margin-top: ${tokens.spacing[2]};
    background: transparent;
    border: 1px dashed var(--input-border);
    border-radius: ${tokens.borderRadius.md};
    color: var(--text-secondary);
    font-size: ${tokens.fontSize.sm};
    cursor: pointer;
    transition: all ${tokens.transition.fast};

    &:hover {
      background: var(--input-bg);
      border-color: var(--accent);
      color: var(--accent);
    }
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

  // Helper to get list items
  const getListItems = (): string[] => {
    const items = element.data.items as string[] | undefined
    return items && items.length > 0 ? items : ['Item 1', 'Item 2', 'Item 3']
  }

  // Helper to update list items
  const updateListItems = (items: string[]) => {
    editorStore.updateSelectedData('items', items)
  }

  // Helper to update a single list item
  const updateListItem = (index: number, value: string) => {
    const items = [...getListItems()]
    items[index] = value
    updateListItems(items)
  }

  // Helper to add a list item
  const addListItem = () => {
    const items = [...getListItems(), `Item ${getListItems().length + 1}`]
    updateListItems(items)
  }

  // Helper to remove a list item
  const removeListItem = (index: number) => {
    const items = getListItems().filter((_, i) => i !== index)
    updateListItems(items.length > 0 ? items : ['Item 1'])
  }

  // Render content fields based on element type
  const renderContentFields = () => {
    switch (elementType) {
      case WidgetType.Image:
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

      case WidgetType.Button:
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

      case WidgetType.Headline:
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

      case WidgetType.Paragraph:
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

      case WidgetType.List:
        return (
          <>
            <div className="field">
              <label className="field-label">List Type</label>
              <select
                className="select-input"
                value={getData('listType', 'bullet')}
                onChange={e => updateData('listType', e.target.value)}
              >
                <option value="bullet">Bullet List</option>
                <option value="numbered">Numbered List</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">List Items</label>
              <div className="list-items">
                {getListItems().map((item, index) => (
                  <div key={index} className="list-item">
                    <input
                      type="text"
                      className="text-input"
                      placeholder={`Item ${index + 1}`}
                      value={item}
                      onChange={e => updateListItem(index, e.target.value)}
                    />
                    <button
                      className="delete-btn"
                      onClick={() => removeListItem(index)}
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="add-item-btn" onClick={addListItem}>
                <Plus size={14} />
                Add Item
              </button>
            </div>
          </>
        )

      case WidgetType.Spacer:
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

      case WidgetType.Divider:
        return <p className="no-selection">Divider has no content properties. Use the Style tab.</p>

      case WidgetType.SocialLinks: {
        interface SocialLink {
          platform: string
          url: string
        }

        const links = (element.data.links as SocialLink[]) || [
          { platform: 'facebook', url: 'https://facebook.com' },
          { platform: 'twitter', url: 'https://twitter.com' },
          { platform: 'instagram', url: 'https://instagram.com' },
        ]

        const updateLinks = (newLinks: SocialLink[]) => {
          editorStore.updateSelectedData('links', newLinks)
        }

        const updateLink = (index: number, field: keyof SocialLink, value: string) => {
          const newLinks = [...links]
          newLinks[index] = { ...newLinks[index], [field]: value }
          updateLinks(newLinks)
        }

        const addLink = () => {
          updateLinks([...links, { platform: 'facebook', url: '' }])
        }

        const removeLink = (index: number) => {
          updateLinks(links.filter((_, i) => i !== index))
        }

        return (
          <>
            <div className="field">
              <label className="field-label">Icon Size (px)</label>
              <input
                type="number"
                className="text-input"
                placeholder="24"
                value={(element.data.iconSize as number) || 24}
                onChange={e =>
                  editorStore.updateSelectedData('iconSize', parseInt(e.target.value) || 24)
                }
              />
            </div>
            <div className="field">
              <label className="field-label">Gap Between Icons (px)</label>
              <input
                type="number"
                className="text-input"
                placeholder="12"
                value={(element.data.gap as number) || 12}
                onChange={e =>
                  editorStore.updateSelectedData('gap', parseInt(e.target.value) || 12)
                }
              />
            </div>
            <div className="field">
              <label className="field-label">Social Links</label>
              <div className="list-items">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="list-item"
                    style={{ flexDirection: 'column', alignItems: 'stretch', gap: '4px' }}
                  >
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      <select
                        className="select-input"
                        style={{ flex: '0 0 120px' }}
                        value={link.platform}
                        onChange={e => updateLink(index, 'platform', e.target.value)}
                      >
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter/X</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="youtube">YouTube</option>
                        <option value="email">Email</option>
                      </select>
                      <button
                        className="delete-btn"
                        onClick={() => removeLink(index)}
                        title="Remove link"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="text-input"
                      placeholder="https://..."
                      value={link.url}
                      onChange={e => updateLink(index, 'url', e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <button className="add-item-btn" onClick={addLink}>
                <Plus size={14} />
                Add Social Link
              </button>
            </div>
          </>
        )
      }

      case WidgetType.Section:
      case WidgetType.Column:
      case WidgetType.InnerSection:
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
