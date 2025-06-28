import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = await createClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription' && session.metadata?.user_id) {
          const userId = session.metadata.user_id
          const customerEmail = session.metadata.email || session.customer_email

          // Update user's customer status
          const { error: updateError } = await supabase
            .from('subscribers')
            .update({ 
              customer: true,
              stripe_customer_id: session.customer as string,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)

          if (updateError) {
            console.error('Error updating subscriber:', updateError)
            return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
          }

          // Create purchase record
          const { error: purchaseError } = await supabase
            .from('purchases')
            .insert({
              user_id: userId,
              stripe_session_id: session.id,
              stripe_customer_id: session.customer as string,
              amount_total: session.amount_total,
              currency: session.currency,
              status: 'completed'
            })

          if (purchaseError) {
            console.error('Error creating purchase record:', purchaseError)
          }

          console.log(`User ${userId} upgraded to customer via subscription`)
        }
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Get customer details to find our user
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        
        if ('email' in customer && customer.email) {
          const { data: subscriber } = await supabase
            .from('subscribers')
            .select('id')
            .eq('email', customer.email)
            .single()

          if (subscriber) {
            // Ensure customer status is set
            await supabase
              .from('subscribers')
              .update({ 
                customer: true,
                stripe_customer_id: subscription.customer as string,
                updated_at: new Date().toISOString()
              })
              .eq('id', subscriber.id)

            console.log(`Subscription created for user ${subscriber.id}`)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Handle subscription status changes
        const isActive = ['active', 'trialing'].includes(subscription.status)
        
        const { error } = await supabase
          .from('subscribers')
          .update({ 
            customer: isActive,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', subscription.customer as string)

        if (!error) {
          console.log(`Subscription updated: ${subscription.status} for customer ${subscription.customer}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Remove customer access when subscription is cancelled
        const { error } = await supabase
          .from('subscribers')
          .update({ 
            customer: false,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', subscription.customer as string)

        if (!error) {
          console.log(`Subscription cancelled for customer ${subscription.customer}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Optionally handle failed payments
        // You might want to send notifications or temporarily disable access
        console.log(`Payment failed for customer ${invoice.customer}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
} 