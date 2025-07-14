"use server"

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'



// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string

// Helper to generate api_key values that look like sk_5rGvZqTb...
function generateApiKey() {
  const rand = randomBytes(24).toString('base64url') // ~32 chars URL-safe
  return `sk_${rand}`
}

function planToRateLimit(plan: string): number {
  switch (plan) {
    case 'Crate Intelligence':
      return 60
    case 'SBOM Builder':
      return 120
    case 'Binary Analysis':
      return 30
    default:
      return 60
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature') as string | null

  if (!signature || !WEBHOOK_SECRET) {
    return new NextResponse('Webhook configuration error', { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('❌  Stripe webhook signature verification failed.', err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id as string | null | undefined
    // Plan can come from metadata or fall back to client_reference_id (useful for Stripe-hosted checkout links)
    const plan = (session.metadata?.plan as string | undefined) || (session.client_reference_id as string | undefined)

    // Plan is required for provisioning; userId may be null until the customer completes onboarding.
    if (!plan) {
      console.warn('Session missing required metadata – plan.')
      return NextResponse.json({ received: true })
    }

    const apiKey = generateApiKey()
    const rateLimit = planToRateLimit(plan)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string // service-role for RLS bypass
    )

    // Insert into api_keys table
    const { error: apiKeyError } = await supabase.from('api_keys').insert({
      session_id: session.id,
      // user_id may be null until the customer finishes onboarding
      user_id: userId ?? null,
      key_name: `${plan} Key`,
      api_key: apiKey,
      plan,
      rate_limit_per_minute: rateLimit,
      is_active: true
    })

    if (apiKeyError) {
      console.error('❌  Failed to insert api_key:', apiKeyError)
      return new NextResponse('Database insert error', { status: 500 })
    }

    // Create a minimal customers record so onboarding can update it later
    await supabase.from('customers').upsert({
      api_key: apiKey,
      email: session.customer_details?.email || null,
      onboarded: false
    })
  }

  // Return a 200 to acknowledge receipt of the event
  return NextResponse.json({ received: true })
}
