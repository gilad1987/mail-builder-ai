import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Eye, Pencil, Copy, Trash2, Plus, Mail, Sparkles, Send } from 'lucide-react'

interface TemplateItem {
  id: string
  name: string
  savedAt: Date | null
  thumbnail?: string
  isExample?: boolean
}

const exampleTemplates: TemplateItem[] = [
  { id: 'example-1', name: 'Welcome Email', savedAt: null, isExample: true },
  { id: 'example-2', name: 'Newsletter', savedAt: null, isExample: true },
  { id: 'example-3', name: 'Promotion', savedAt: null, isExample: true },
]

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
    gap: 12px;
    position: sticky;
    top: 0;
    background: rgba(15, 15, 17, 0.9);
    backdrop-filter: blur(12px);
    z-index: 10;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 12px rgba(99, 102, 241, 0.4);
  }

  .logo-text {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
  }

  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 32px 80px;
  }

  .hero {
    text-align: center;
    padding: 48px 0 56px;
  }

  .hero-title {
    font-size: 44px;
    font-weight: 400;
    color: #ffffff;
    margin-bottom: 16px;
    letter-spacing: -1px;
  }

  .hero-subtitle {
    font-size: 16px;
    color: #a1a1aa;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .section {
    margin-bottom: 56px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .section-title {
    font-size: 14px;
    font-weight: 500;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .section-link {
    font-size: 14px;
    color: #8b5cf6;
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
  }

  .template-card {
    background: #18181b;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;

    &:hover {
      border-color: rgba(139, 92, 246, 0.4);
      box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(139, 92, 246, 0.2);

      .template-actions {
        opacity: 1;
      }
    }
  }

  .template-preview {
    aspect-ratio: 4/5;
    background: #27272a;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s ease;

    .preview-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: #52525b;
    }

    .preview-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #3f3f46;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preview-lines {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
    }

    .preview-line {
      height: 4px;
      background: #3f3f46;
      border-radius: 2px;

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
  }

  .template-info {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 64px;
  }

  .template-meta {
    flex: 1;
    min-width: 0;
  }

  .template-name {
    font-size: 14px;
    font-weight: 500;
    color: #fafafa;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .template-date {
    font-size: 12px;
    color: #71717a;
  }

  .template-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: #71717a;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #3f3f46;
      color: #fafafa;
    }

    &.delete:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }
  }

  .create-card {
    background: #18181b;
    border: 2px dashed #3f3f46;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    aspect-ratio: 4/5;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      border-color: #8b5cf6;
      background: rgba(139, 92, 246, 0.05);

      .create-icon {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        transform: scale(1.05);
        box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
      }

      .create-text {
        color: #8b5cf6;
      }
    }

    .create-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #27272a;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #71717a;
      margin-bottom: 16px;
      transition: all 0.2s ease;
    }

    .create-text {
      font-size: 14px;
      font-weight: 500;
      color: #71717a;
      transition: color 0.2s ease;
    }
  }

  .create-card-wrapper {
    display: flex;
    flex-direction: column;
  }

  .create-card-label {
    padding: 16px;
    min-height: 64px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #e8f0fe;
    color: #1967d2;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
  }

  .example-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(39, 39, 42, 0.9);
    color: #a1a1aa;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .ai-section {
    margin-bottom: 56px;
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.1) 0%,
      rgba(139, 92, 246, 0.1) 50%,
      rgba(236, 72, 153, 0.05) 100%
    );
    border-radius: 16px;
    padding: 32px;
    border: 1px solid rgba(139, 92, 246, 0.2);
  }

  .ai-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .ai-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
  }

  .ai-title {
    font-size: 20px;
    font-weight: 600;
    color: #fafafa;
  }

  .ai-subtitle {
    font-size: 14px;
    color: #a1a1aa;
    margin-bottom: 20px;
    max-width: 500px;
  }

  .ai-input-wrapper {
    display: flex;
    gap: 12px;
    align-items: stretch;
  }

  .ai-input {
    flex: 1;
    padding: 14px 18px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    font-size: 15px;
    font-family: inherit;
    background: #18181b;
    color: #fafafa;
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
      color: #52525b;
    }

    &:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    }
  }

  .ai-submit {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 24px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .ai-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }

  .ai-suggestion {
    padding: 8px 14px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    font-size: 13px;
    color: #a1a1aa;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;

    &:hover {
      border-color: #8b5cf6;
      color: #c4b5fd;
      background: rgba(139, 92, 246, 0.1);
    }
  }

  .footer {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 24px 32px;
    margin-top: auto;
    background: #09090b;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
  }

  .footer-logo-icon {
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .footer-logo-text {
    color: #a1a1aa;
  }

  .footer-links {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .footer-link {
    font-size: 13px;
    color: #52525b;
    text-decoration: none;
    transition: color 0.15s ease;

    &:hover {
      color: #a1a1aa;
    }
  }

  .footer-right {
    font-size: 12px;
    color: #3f3f46;
  }
`

export const TemplatesLibrary = () => {
  const navigate = useNavigate()

  const userTemplates: TemplateItem[] = [
    { id: '668271', name: 'My First Template', savedAt: new Date('2024-12-01') },
  ]

  const formatDate = (date: Date | null) => {
    if (!date) return 'Template'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Edited today'
    if (days === 1) return 'Edited yesterday'
    if (days < 7) return `Edited ${days} days ago`
    return `Edited ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }

  const handleOpenTemplate = (templateId: string) => {
    navigate(`/builder/${templateId}`)
  }

  const handleCreateNew = () => {
    navigate('/builder')
  }

  return (
    <Container>
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <Mail size={20} />
          </div>
          <span className="logo-text">Mail Builder</span>
        </div>
      </header>

      <div className="content">
        <div className="hero">
          {/*<h1 className="hero-title">Create beautiful emails</h1>*/}
          <h1 className="hero-title">Design emails effortlessly</h1>
          {/*<p className="hero-subtitle">*/}
          {/*  Start with a template or create from scratch. Design responsive emails that look great*/}
          {/*  everywhere.*/}
          {/*</p>*/}
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
          <p className="ai-subtitle">
            Describe the email you want to create and let AI generate it for you.
          </p>
          <div className="ai-input-wrapper">
            <input
              type="text"
              className="ai-input"
              placeholder="E.g., A welcome email for new subscribers with a discount code..."
            />
            <button className="ai-submit">
              <Send size={18} />
              Generate
            </button>
          </div>
          <div className="ai-suggestions">
            <button className="ai-suggestion">Welcome email</button>
            <button className="ai-suggestion">Newsletter</button>
            <button className="ai-suggestion">Product launch</button>
            <button className="ai-suggestion">Event invitation</button>
            <button className="ai-suggestion">Thank you email</button>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Start a new email</h2>
          </div>
          <div className="templates-grid">
            <div className="create-card-wrapper">
              <div className="create-card" onClick={handleCreateNew}>
                <div className="create-icon">
                  <Plus size={24} />
                </div>
                <span className="create-text">Blank</span>
              </div>
              <div className="create-card-label" />
            </div>
            {exampleTemplates.map(template => (
              <div key={template.id}>
                <div className="template-card" onClick={() => handleOpenTemplate(template.id)}>
                  <div className="template-preview">
                    <span className="example-badge">Template</span>
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
                </div>
                <div className="template-info">
                  <div className="template-meta">
                    <div className="template-name">{template.name}</div>
                    <div className="template-date">{formatDate(template.savedAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Recent emails</h2>
            <span className="section-link">View all</span>
          </div>
          <div className="templates-grid">
            {userTemplates.map(template => (
              <div key={template.id}>
                <div className="template-card" onClick={() => handleOpenTemplate(template.id)}>
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
                      <div className="template-name">{template.name}</div>
                      <div className="template-date">{formatDate(template.savedAt)}</div>
                    </div>
                    <div className="template-actions">
                      <button
                        className="action-btn"
                        title="Preview"
                        onClick={e => {
                          e.stopPropagation()
                        }}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="action-btn"
                        title="Edit"
                        onClick={e => {
                          e.stopPropagation()
                          handleOpenTemplate(template.id)
                        }}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="action-btn"
                        title="Duplicate"
                        onClick={e => {
                          e.stopPropagation()
                        }}
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={e => {
                          e.stopPropagation()
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </Container>
  )
}
