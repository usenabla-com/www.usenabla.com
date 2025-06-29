import Stripe from 'stripe'

// Initialize Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

// Product price IDs
export const PREMIUM_SUPPORT_PRICE_ID = process.env.STRIPE_PREMIUM_SUPPORT_PRICE_ID!
export const CURATION_PLAN_PRICE_ID = process.env.STRIPE_CURATION_PLAN_PRICE_ID!

// Subscription status helpers
export function hasUnlimitedCurations(curations: number): boolean {
  return curations === -1
}

export function isPremiumSupport(customer: boolean): boolean {
  return customer === true
}

export function hasCurationPlan(customer: boolean, curations: number): boolean {
  return !customer && curations === -1
}

export function getSubscriptionType(customer: boolean, curations: number): 'premium' | 'curation' | 'free' {
  if (customer && curations === -1) return 'premium'
  if (!customer && curations === -1) return 'curation'
  return 'free'
}

export function getSubscriptionDisplayName(customer: boolean, curations: number): string {
  const type = getSubscriptionType(customer, curations)
  switch (type) {
    case 'premium':
      return 'Premium Support'
    case 'curation':
      return 'Curation Plan'
    case 'free':
      return 'Free'
    default:
      return 'Free'
  }
}

// Pricing helpers
export const SUBSCRIPTION_PRICES = {
  premium: {
    monthly: 8599, // $85.99 in cents
    display: '$85.99/month',
    features: ['Unlimited curations', 'Priority support chat', 'Direct access to support team']
  },
  curation: {
    monthly: 2099, // $20.99 in cents
    display: '$20.99/month',
    features: ['Unlimited curations', 'Email support']
  }
} as const

export function formatCurrency(amountInCents: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100)
} 