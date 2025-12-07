import welcomeOnboarding from './welcome-onboarding.json'
import productNewsletter from './product-newsletter.json'
import promotionalSale from './promotional-sale.json'

export interface TemplateInfo {
  id: string
  name: string
  description: string
  thumbnail: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export const templates: TemplateInfo[] = [
  {
    id: 'welcome-onboarding',
    name: 'Welcome Onboarding',
    description: 'Clean Google-style welcome email with friendly onboarding steps',
    thumbnail: 'welcome-onboarding.png',
    data: welcomeOnboarding,
  },
  {
    id: 'product-newsletter',
    name: 'Product Newsletter',
    description: 'Material Design inspired product update newsletter with feature highlights',
    thumbnail: 'product-newsletter.png',
    data: productNewsletter,
  },
  {
    id: 'promotional-sale',
    name: 'Promotional Sale',
    description: 'Modern minimalist promotional email with bold typography and clean layout',
    thumbnail: 'promotional-sale.png',
    data: promotionalSale,
  },
]

export { welcomeOnboarding, productNewsletter, promotionalSale }
