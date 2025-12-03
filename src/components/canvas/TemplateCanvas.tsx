import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { editorStore } from '../../stores/EditorStore'
import { ElementRenderer } from './ElementRenderer'
import { tokens } from '../../styles/tokens'

const Container = styled.div`
  background: #ffffff;
  min-height: 100%;
  padding: ${tokens.spacing[4]};

  .template-content {
    max-width: 650px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing[4]};
  }

  .empty-state {
    text-align: center;
    padding: ${tokens.spacing[8]};
    color: ${tokens.colors.gray[500]};
    border: 2px dashed ${tokens.colors.gray[300]};
    border-radius: ${tokens.borderRadius.lg};
  }
`

export const TemplateCanvas = observer(() => {
  const { template } = editorStore

  const handleCanvasClick = () => {
    editorStore.setSelectedElement(null)
  }

  return (
    <Container onClick={handleCanvasClick}>
      <div className="template-content" style={template.style}>
        {template.children.length === 0 ? (
          <div className="empty-state">
            <p>Drag elements here to build your email template</p>
          </div>
        ) : (
          template.children.map(section => <ElementRenderer key={section.key} element={section} />)
        )}
      </div>
    </Container>
  )
})
