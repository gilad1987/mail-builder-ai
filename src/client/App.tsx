import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MailBuilder, TemplatesLibrary, StartTemplatesPage } from './pages'
import './styles/main.scss'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TemplatesLibrary />} />
        <Route path="/templates" element={<TemplatesLibrary />} />
        <Route path="/start-templates" element={<StartTemplatesPage />} />
        <Route path="/builder" element={<MailBuilder />} />
        <Route path="/builder/:templateId" element={<MailBuilder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
