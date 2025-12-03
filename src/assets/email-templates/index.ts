import welcomeEmail from './welcome-email.json'
import productLaunch from './product-launch.json'
import newsletter from './newsletter.json'

export interface EmailTemplateItem {
  id: string
  name: string
  description: string
  category: 'welcome' | 'marketing' | 'newsletter'
  template: unknown
  previewColors: {
    primary: string
    secondary: string
    accent: string
  }
}

export const emailTemplates: EmailTemplateItem[] = [
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    description: 'Clean onboarding with indigo hero',
    category: 'welcome',
    template: welcomeEmail,
    previewColors: {
      primary: '#4f46e5',
      secondary: '#ffffff',
      accent: '#4f46e5',
    },
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Dark theme for announcements',
    category: 'marketing',
    template: productLaunch,
    previewColors: {
      primary: '#18181b',
      secondary: '#27272a',
      accent: '#8b5cf6',
    },
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Editorial style for digests',
    category: 'newsletter',
    template: newsletter,
    previewColors: {
      primary: '#1a1a1a',
      secondary: '#ffffff',
      accent: '#b8860b',
    },
  },
]

export { welcomeEmail, productLaunch, newsletter }
