import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Copy,
  Eye,
  FolderOpen,
  Loader2,
  Mail,
  Pencil,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { remult } from 'remult'
import { TemplateEntity } from '../../server/entities/TemplateEntity'
import { editorStore } from '../stores/EditorStore'

// Built-in template data
const builtInTemplates = [
  {
    id: 'welcome-onboarding',
    name: 'Welcome Onboarding',
    description: 'Clean Google-style welcome email with friendly onboarding steps',
    colors: { bg: '#eff6ff', icon: '#2563eb', lines: ['#2563eb', '#7c3aed', '#059669'] },
  },
  {
    id: 'product-newsletter',
    name: 'Product Newsletter',
    description: 'Material Design inspired product update newsletter',
    colors: { bg: '#10b981', icon: '#ffffff', lines: ['#ffffff', '#d1fae5', '#10b981'] },
  },
  {
    id: 'promotional-sale',
    name: 'Promotional Sale',
    description: 'Modern minimalist promotional email with bold typography',
    colors: { bg: '#1a1a1a', icon: '#c9a96e', lines: ['#ffffff', '#c9a96e', '#999999'] },
  },
  {
    id: 'black-friday-sale',
    name: 'Black Friday Flash Sale',
    description: 'Bold dark-themed flash sale with countdown urgency',
    colors: { bg: '#0a0a0a', icon: '#fbbf24', lines: ['#ffffff', '#fbbf24', '#ef4444'] },
  },
  {
    id: 'trial-ending',
    name: 'Trial Ending Reminder',
    description: 'Modern SaaS trial expiration with clear value proposition',
    colors: { bg: '#0ea5e9', icon: '#ffffff', lines: ['#ffffff', '#7dd3fc', '#0c4a6e'] },
  },
  {
    id: 'event-invitation',
    name: 'Event Invitation',
    description: 'Elegant invitation with sophisticated typography',
    colors: { bg: '#1c1917', icon: '#d4a574', lines: ['#fefdfb', '#d4a574', '#78716c'] },
  },
  {
    id: 'abandoned-cart',
    name: 'Abandoned Cart Recovery',
    description: 'Warm and persuasive cart recovery with product showcase',
    colors: { bg: '#fff7ed', icon: '#ea580c', lines: ['#ea580c', '#9a3412', '#16a34a'] },
  },
  {
    id: 'weekly-digest',
    name: 'Weekly Digest',
    description: 'Clean newsletter with stats, articles, and curated content',
    colors: { bg: '#6366f1', icon: '#ffffff', lines: ['#ffffff', '#c7d2fe', '#1e293b'] },
  },
  {
    id: 'feature-announcement',
    name: 'Feature Announcement',
    description: 'Vibrant new feature announcement with dynamic design',
    colors: { bg: '#a855f7', icon: '#ffffff', lines: ['#ffffff', '#f5d0fe', '#1e1b4b'] },
  },
  {
    id: 'order-confirmation',
    name: 'Order Confirmation',
    description: 'Clean and reassuring order confirmation with tracking info',
    colors: { bg: '#0d9488', icon: '#ffffff', lines: ['#ffffff', '#99f6e4', '#134e4a'] },
  },
  {
    id: 'referral-program',
    name: 'Referral Program',
    description: 'Playful referral invitation with gamified elements',
    colors: { bg: '#f59e0b', icon: '#78350f', lines: ['#ffffff', '#fef3c7', '#78350f'] },
  },
  {
    id: 'feedback-request',
    name: 'Feedback Request',
    description: 'Friendly feedback request with rating options',
    colors: { bg: '#8b5cf6', icon: '#ffffff', lines: ['#ffffff', '#ede9fe', '#4c1d95'] },
  },
  {
    id: 'win-back',
    name: 'Win-Back Campaign',
    description: 'Compelling re-engagement with exclusive comeback offer',
    colors: { bg: '#164e63', icon: '#a5f3fc', lines: ['#ffffff', '#67e8f9', '#0891b2'] },
  },
]

const templateRepo = remult.repo(TemplateEntity)

// Pure function for formatting dates - takes "now" as parameter
const formatDateRelative = (date: Date | null, now: number) => {
  if (!date) return 'Template'
  const days = Math.floor((now - date.getTime()) / 86400000)
  if (days === 0) return 'Edited today'
  if (days === 1) return 'Edited yesterday'
  if (days < 7) return `Edited ${days} days ago`
  return `Edited ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

export const TemplatesLibrary = () => {
  const navigate = useNavigate()
  const [savedTemplates, setSavedTemplates] = useState<TemplateEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    templateRepo
      .find({ orderBy: { updatedAt: 'desc' } })
      .then(templates => {
        setSavedTemplates(templates)
        setNow(Date.now()) // Update "now" when templates are fetched
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Memoize formatted dates based on templates and "now" timestamp
  const formattedDates = useMemo(() => {
    const map = new Map<string, string>()
    savedTemplates.forEach(t => map.set(t.id, formatDateRelative(t.updatedAt, now)))
    return map
  }, [savedTemplates, now])

  const handleDuplicate = async (e: React.MouseEvent, t: TemplateEntity) => {
    e.stopPropagation()
    await templateRepo.insert({ name: `${t.name} (Copy)`, data: t.data })
    setSavedTemplates(await templateRepo.find({ orderBy: { updatedAt: 'desc' } }))
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('Delete this template?')) return
    await templateRepo.delete(id)
    setSavedTemplates(prev => prev.filter(t => t.id !== id))
  }

  const openSaved = (t: TemplateEntity) => {
    editorStore.importFromJSON(t.data as Parameters<typeof editorStore.importFromJSON>[0])
    navigate(`/builder/${t.id}`)
  }

  return (
    <div className="templates-library">
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">
              <Mail size={20} />
            </div>
            <span className="logo-text">Mail Builder</span>
          </div>
        </div>
        <button className="my-templates-btn" onClick={() => navigate('/start-templates')}>
          <FolderOpen size={18} /> My Templates
        </button>
      </header>

      <div className="content">
        <div className="hero">
          <h1 className="hero-title">Design emails effortlessly</h1>
          <p className="hero-subtitle">
            Focus on your message. We'll make it beautiful. No code, no complexity — just results.
          </p>
        </div>

        <section className="ai-section">
          <div className="ai-header">
            <div className="ai-icon">
              <Sparkles size={20} />
            </div>
            <h2 className="ai-title">Create with AI</h2>
          </div>
          <p className="ai-subtitle">Describe the email you want and let AI generate it.</p>
          <div className="ai-input-wrapper">
            <input
              className="ai-input"
              placeholder="E.g., A welcome email for new subscribers..."
            />
            <button className="ai-submit">
              <Send size={18} /> Generate
            </button>
          </div>
          <div className="ai-suggestions">
            {['Welcome email', 'Newsletter', 'Product launch', 'Event invitation', 'Thank you'].map(
              s => (
                <button key={s} className="ai-suggestion">
                  {s}
                </button>
              )
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Start a new email</h2>
          </div>
          <div className="templates-grid">
            <div className="create-card-wrapper">
              <div
                className="create-card"
                onClick={() => {
                  editorStore.clearTemplate()
                  navigate('/builder')
                }}
              >
                <div className="create-icon">
                  <Plus size={24} />
                </div>
                <span className="create-text">Blank</span>
              </div>
              <div className="create-card-label" />
            </div>
            {builtInTemplates.map(t => (
              <div key={t.id}>
                <div className="template-card" onClick={() => navigate(`/builder/${t.id}`)}>
                  <div className="template-preview" style={{ background: t.colors.bg }}>
                    <span className="example-badge">Template</span>
                    <div className="preview-placeholder">
                      <div className="preview-icon" style={{ background: t.colors.icon }}>
                        <Mail size={20} color="#fff" />
                      </div>
                      <div className="preview-lines">
                        {t.colors.lines.map((c, i) => (
                          <div key={i} className="preview-line" style={{ background: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="template-info">
                  <div className="template-meta">
                    <div className="template-name">{t.name}</div>
                    <div className="template-date">{t.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Your saved templates</h2>
            {savedTemplates.length > 0 && (
              <span className="section-link">{savedTemplates.length} templates</span>
            )}
          </div>
          {loading ? (
            <div className="loading-state">
              <Loader2 size={20} /> Loading...
            </div>
          ) : savedTemplates.length === 0 ? (
            <div className="empty-state">No saved templates yet.</div>
          ) : (
            <div className="templates-grid">
              {savedTemplates.map(t => (
                <div key={t.id}>
                  <div className="template-card" onClick={() => openSaved(t)}>
                    <div className="template-preview">
                      <div className="preview-placeholder">
                        <div className="preview-icon">
                          <Mail size={20} />
                        </div>
                        <div className="preview-lines">
                          <div className="preview-line" />
                          <div className="preview-line" />
                          <div className="preview-line" />
                        </div>
                      </div>
                    </div>
                    <div className="template-info">
                      <div className="template-meta">
                        <div className="template-name">{t.name}</div>
                        <div className="template-date">{formattedDates.get(t.id)}</div>
                      </div>
                      <div className="template-actions">
                        <button
                          className="action-btn"
                          title="Preview"
                          onClick={e => e.stopPropagation()}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="action-btn"
                          title="Edit"
                          onClick={e => {
                            e.stopPropagation()
                            openSaved(t)
                          }}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="action-btn"
                          title="Duplicate"
                          onClick={e => handleDuplicate(e, t)}
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete"
                          onClick={e => handleDelete(e, t.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <Mail size={10} />
              </div>
              <span className="footer-logo-text">Mail Builder</span>
            </div>
            <nav className="footer-links">
              <a href="#" className="footer-link">
                Help
              </a>
              <a href="#" className="footer-link">
                Privacy
              </a>
              <a href="#" className="footer-link">
                Terms
              </a>
            </nav>
          </div>
          <div className="footer-right">© {new Date().getFullYear()} Mail Builder</div>
        </div>
      </footer>
    </div>
  )
}
