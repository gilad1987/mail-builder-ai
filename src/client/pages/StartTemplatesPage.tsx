import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Loader2, Mail, Pencil, Plus, Trash2 } from 'lucide-react'
import { remult } from 'remult'
import { TemplateEntity } from '../../server/entities/TemplateEntity'

const templateRepo = remult.repo(TemplateEntity)

export const StartTemplatesPage = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<TemplateEntity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      setTemplates(await templateRepo.find({ orderBy: { updatedAt: 'desc' } }))
    } catch (e) {
      console.error('Failed to fetch templates:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const formatDate = (date: Date | null) =>
    date
      ? new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : ''

  const handleDuplicate = async (e: React.MouseEvent, t: TemplateEntity) => {
    e.stopPropagation()
    const nt = await templateRepo.insert({ name: `${t.name} (Copy)`, data: t.data })
    await fetchTemplates()
    navigate(`/builder/${nt.id}`)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Delete this template?')) {
      await templateRepo.delete(id)
      await fetchTemplates()
    }
  }

  return (
    <div className="start-templates">
      <header className="header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="header-title">My Templates</h1>
        </div>
        <button className="new-btn" onClick={() => navigate('/builder')}>
          <Plus size={18} /> New Template
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
            {templates.map(t => (
              <div
                key={t.id}
                className="template-card"
                onClick={() => navigate(`/builder/${t.id}`)}
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
                        navigate(`/builder/${t.id}`)
                      }}
                    >
                      Open Template
                    </button>
                  </div>
                </div>
                <div className="template-info">
                  <div className="template-meta">
                    <div className="template-name">{t.name}</div>
                    <div className="template-date">{formatDate(t.updatedAt)}</div>
                  </div>
                  <div className="template-actions">
                    <button
                      className="action-btn"
                      title="Edit"
                      onClick={e => {
                        e.stopPropagation()
                        navigate(`/builder/${t.id}`)
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="action-btn"
                      title="Duplicate"
                      onClick={e => handleDuplicate(e, t)}
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete"
                      onClick={e => handleDelete(e, t.id)}
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
            <button className="empty-btn" onClick={() => navigate('/builder')}>
              <Plus size={18} /> Create Template
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
