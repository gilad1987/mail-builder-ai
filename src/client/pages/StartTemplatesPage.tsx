import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowLeft, Copy, Loader2, Mail, Pencil, Plus, Trash2 } from 'lucide-react'
import { remult } from 'remult'
import { TemplateEntity } from '../../server/entities/TemplateEntity'

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  background: #0f0f11;
  font-family: Poppins, Roboto, 'Noto Sans Hebrew', 'Noto Kufi Arabic', 'Noto Sans JP', sans-serif;

  .header {
    padding: 20px 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: rgba(15, 15, 17, 0.95);
    backdrop-filter: blur(12px);
    z-index: 10;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #a1a1aa;
    font-size: 14px;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
      color: #fafafa;
    }
  }

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
  }

  .new-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #00bfff 0%, #00a8e6 100%);
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(0, 191, 255, 0.3);
    }
  }

  .content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 32px 80px;
  }

  .hero {
    text-align: center;
    padding: 20px 0 40px;
  }

  .hero-title {
    font-size: 32px;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .hero-subtitle {
    font-size: 15px;
    color: #71717a;
    max-width: 400px;
    margin: 0 auto;
  }

  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .template-card {
    background: #18181b;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    transition: all 0.25s ease;
    cursor: pointer;

    &:hover {
      border-color: rgba(0, 191, 255, 0.4);
      transform: translateY(-4px);
      box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(0, 191, 255, 0.2);

      .template-overlay {
        opacity: 1;
      }

      .template-actions {
        opacity: 1;
      }
    }
  }

  .template-preview {
    aspect-ratio: 4/3;
    background: linear-gradient(135deg, #27272a 0%, #3f3f46 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .template-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .open-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #00bfff 0%, #00a8e6 100%);
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 24px rgba(0, 191, 255, 0.4);
    }
  }

  .preview-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .preview-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(0, 191, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00bfff;
  }

  .preview-lines {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
  }

  .preview-line {
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.15);

    &:nth-child(1) {
      width: 80px;
    }
    &:nth-child(2) {
      width: 100px;
    }
    &:nth-child(3) {
      width: 60px;
    }
  }

  .template-info {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .template-meta {
    flex: 1;
    min-width: 0;
  }

  .template-name {
    font-size: 15px;
    font-weight: 600;
    color: #fafafa;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .template-date {
    font-size: 12px;
    color: #52525b;
  }

  .template-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: #a1a1aa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fafafa;
    }

    &.delete:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: #71717a;
    gap: 16px;

    .spin {
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;

    .empty-icon {
      width: 80px;
      height: 80px;
      background: #27272a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: #52525b;
    }

    .empty-title {
      font-size: 18px;
      font-weight: 500;
      color: #a1a1aa;
      margin-bottom: 8px;
    }

    .empty-text {
      font-size: 14px;
      color: #52525b;
      margin-bottom: 24px;
    }

    .empty-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #00bfff 0%, #00a8e6 100%);
      border: none;
      border-radius: 10px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 24px rgba(0, 191, 255, 0.3);
      }
    }
  }
`

const templateRepo = remult.repo(TemplateEntity)

export const StartTemplatesPage = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<TemplateEntity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const data = await templateRepo.find({ orderBy: { updatedAt: 'desc' } })
      setTemplates(data)
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleOpenTemplate = (templateId: string) => {
    navigate(`/builder/${templateId}`)
  }

  const handleCreateNew = () => {
    navigate('/builder')
  }

  const handleDuplicateTemplate = async (e: React.MouseEvent, template: TemplateEntity) => {
    e.stopPropagation()
    try {
      const newTemplate = await templateRepo.insert({
        name: `${template.name} (Copy)`,
        data: template.data,
      })
      await fetchTemplates()
      navigate(`/builder/${newTemplate.id}`)
    } catch (error) {
      console.error('Failed to duplicate template:', error)
    }
  }

  const handleDeleteTemplate = async (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await templateRepo.delete(templateId)
        await fetchTemplates()
      } catch (error) {
        console.error('Failed to delete template:', error)
      }
    }
  }

  return (
    <Container>
      <header className="header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="header-title">My Templates</h1>
        </div>
        <button className="new-btn" onClick={handleCreateNew}>
          <Plus size={18} />
          New Template
        </button>
      </header>

      <div className="content">
        <div className="hero">
          <h1 className="hero-title">Your Template Library</h1>
          <p className="hero-subtitle">All your saved email templates in one place</p>
        </div>

        {loading ? (
          <div className="loading">
            <Loader2 size={32} className="spin" />
            <span>Loading templates...</span>
          </div>
        ) : templates.length > 0 ? (
          <div className="templates-grid">
            {templates.map(template => (
              <div
                key={template.id}
                className="template-card"
                onClick={() => handleOpenTemplate(template.id)}
              >
                <div className="template-preview">
                  <div className="preview-placeholder">
                    <div className="preview-icon">
                      <Mail size={24} />
                    </div>
                    <div className="preview-lines">
                      <div className="preview-line" />
                      <div className="preview-line" />
                      <div className="preview-line" />
                    </div>
                  </div>
                  <div className="template-overlay">
                    <button
                      className="open-btn"
                      onClick={e => {
                        e.stopPropagation()
                        handleOpenTemplate(template.id)
                      }}
                    >
                      Open Template
                    </button>
                  </div>
                </div>
                <div className="template-info">
                  <div className="template-meta">
                    <div className="template-name">{template.name}</div>
                    <div className="template-date">{formatDate(template.updatedAt)}</div>
                  </div>
                  <div className="template-actions">
                    <button
                      className="action-btn"
                      title="Edit"
                      onClick={e => {
                        e.stopPropagation()
                        handleOpenTemplate(template.id)
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="action-btn"
                      title="Duplicate"
                      onClick={e => handleDuplicateTemplate(e, template)}
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete"
                      onClick={e => handleDeleteTemplate(e, template.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Mail size={36} />
            </div>
            <div className="empty-title">No templates yet</div>
            <div className="empty-text">Create your first email template to get started</div>
            <button className="empty-btn" onClick={handleCreateNew}>
              <Plus size={18} />
              Create Template
            </button>
          </div>
        )}
      </div>
    </Container>
  )
}
