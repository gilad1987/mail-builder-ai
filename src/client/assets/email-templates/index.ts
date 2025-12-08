import abandonedCart from './abandoned-cart.json'
import blackFridaySale from './black-friday-sale.json'
import eventInvitation from './event-invitation.json'
import featureAnnouncement from './feature-announcement.json'
import feedbackRequest from './feedback-request.json'
import orderConfirmation from './order-confirmation.json'
import productNewsletter from './product-newsletter.json'
import promotionalSale from './promotional-sale.json'
import referralProgram from './referral-program.json'
import trialEnding from './trial-ending.json'
import weeklyDigest from './weekly-digest.json'
import welcomeOnboarding from './welcome-onboarding.json'
import winBack from './win-back.json'

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
  {
    id: 'black-friday-sale',
    name: 'Black Friday Flash Sale',
    description: 'Bold dark-themed flash sale email with countdown urgency and striking typography',
    thumbnail: 'black-friday-sale.png',
    data: blackFridaySale,
  },
  {
    id: 'trial-ending',
    name: 'Trial Ending Reminder',
    description:
      'Modern SaaS trial expiration email with gradient accents and clear value proposition',
    thumbnail: 'trial-ending.png',
    data: trialEnding,
  },
  {
    id: 'event-invitation',
    name: 'Event Invitation',
    description: 'Elegant event invitation with sophisticated typography and refined color palette',
    thumbnail: 'event-invitation.png',
    data: eventInvitation,
  },
  {
    id: 'abandoned-cart',
    name: 'Abandoned Cart Recovery',
    description:
      'Warm and persuasive cart recovery email with product showcase and urgency elements',
    thumbnail: 'abandoned-cart.png',
    data: abandonedCart,
  },
  {
    id: 'weekly-digest',
    name: 'Weekly Digest',
    description:
      'Clean and informative weekly newsletter with stats, articles, and curated content',
    thumbnail: 'weekly-digest.png',
    data: weeklyDigest,
  },
  {
    id: 'feature-announcement',
    name: 'Feature Announcement',
    description:
      'Vibrant and exciting new feature announcement with dynamic gradients and modern design',
    thumbnail: 'feature-announcement.png',
    data: featureAnnouncement,
  },
  {
    id: 'order-confirmation',
    name: 'Order Confirmation',
    description:
      'Clean and reassuring order confirmation with order details and tracking information',
    thumbnail: 'order-confirmation.png',
    data: orderConfirmation,
  },
  {
    id: 'referral-program',
    name: 'Referral Program',
    description:
      'Playful and rewarding referral invitation with gamified elements and clear benefits',
    thumbnail: 'referral-program.png',
    data: referralProgram,
  },
  {
    id: 'feedback-request',
    name: 'Feedback Request',
    description:
      'Friendly and engaging feedback request with rating options and personalized touch',
    thumbnail: 'feedback-request.png',
    data: feedbackRequest,
  },
  {
    id: 'win-back',
    name: 'Win-Back Campaign',
    description: 'Compelling re-engagement email with nostalgic touch and exclusive comeback offer',
    thumbnail: 'win-back.png',
    data: winBack,
  },
]

export {
  abandonedCart,
  blackFridaySale,
  eventInvitation,
  featureAnnouncement,
  feedbackRequest,
  orderConfirmation,
  productNewsletter,
  promotionalSale,
  referralProgram,
  trialEnding,
  weeklyDigest,
  welcomeOnboarding,
  winBack,
}
