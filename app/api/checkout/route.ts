import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's email for Stripe
    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('email')
      .eq('id', user.id)
      .single()

    if (!subscriber) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get base URL from request headers or environment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
      `${request.nextUrl.protocol}//${request.nextUrl.host}`

    // Create Stripe checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: subscriber.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Support Access',
              description: 'Monthly subscription for direct access to our support team via chat'
            },
            unit_amount: 8599, // $85.99 in cents
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1
        }
      ],
      metadata: {
        user_id: user.id,
        email: subscriber.email
      },
      success_url: `${baseUrl}/chat?success=true`,
      cancel_url: `${baseUrl}/chat?canceled=true`
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 