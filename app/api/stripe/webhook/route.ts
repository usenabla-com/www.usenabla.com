import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Product price IDs for our subscriptions
const PREMIUM_SUPPORT_PRICE_ID = process.env.STRIPE_PREMIUM_SUPPORT_PRICE_ID! // $85.99/month
const CURATION_PLAN_PRICE_ID = process.env.STRIPE_CURATION_PLAN_PRICE_ID! // $20.99/month

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error('⚠️  Webhook signature verification failed.', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  console.log('🔔 Received Stripe webhook event:', event.type)

  try {
    const supabase = await createClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('✅ Checkout session completed:', session.id)

        if (session.mode === 'subscription' && session.customer) {
          await handleSubscriptionCreated(session, supabase)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        console.log(`📝 Subscription ${event.type}:`, subscription.id)

        await handleSubscriptionChange(subscription, supabase)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('🗑️ Subscription deleted:', subscription.id)

        await handleSubscriptionCanceled(subscription, supabase)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('💰 Invoice payment succeeded:', invoice.id)

        await handlePaymentSucceeded(invoice, supabase)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('❌ Invoice payment failed:', invoice.id)

        await handlePaymentFailed(invoice, supabase)
        break
      }

      default:
        console.log(`🤷‍♂️ Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('💥 Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(session: Stripe.Checkout.Session, supabase: any) {
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  // Get the subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const customer = await stripe.customers.retrieve(customerId)

  if (!customer || customer.deleted) {
    console.error('❌ Customer not found or deleted:', customerId)
    return
  }

  const customerEmail = customer.email
  if (!customerEmail) {
    console.error('❌ Customer email not found:', customerId)
    return
  }

  // Find user by email
  const { data: subscriber, error: subscriberError } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', customerEmail)
    .single()

  if (subscriberError || !subscriber) {
    console.error('❌ Subscriber not found for email:', customerEmail)
    return
  }

  // Determine subscription type and set appropriate values
  const priceId = subscription.items.data[0]?.price.id
  let isCustomer = false
  let curations = subscriber.curations

  if (priceId === PREMIUM_SUPPORT_PRICE_ID) {
    // Premium Support Plan - $85.99/month
    isCustomer = true
    curations = -1 // Unlimited curations (we use -1 to indicate unlimited)
    console.log('🎉 Premium Support subscription activated for:', customerEmail)
  } else if (priceId === CURATION_PLAN_PRICE_ID) {
    // Curation Plan - $20.99/month
    // Only set customer to false, unlimited curations for curation plan
    curations = -1 // Unlimited curations but not customer status
    console.log('📊 Curation Plan subscription activated for:', customerEmail)
  }

  // Update subscriber
  const { error: updateError } = await supabase
    .from('subscribers')
    .update({
      customer: isCustomer,
      curations: curations,
      stripe_customer_id: customerId,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriber.id)

  if (updateError) {
    console.error('❌ Failed to update subscriber:', updateError)
    return
  }

  // Create purchase record
  await createPurchaseRecord(
    subscriber.id,
    session.id,
    customerId,
    session.amount_total || 0,
    session.currency || 'usd',
    'completed',
    supabase
  )

  console.log('✅ Subscription setup completed for:', customerEmail)
}

async function handleSubscriptionChange(subscription: Stripe.Subscription, supabase: any) {
  const customerId = subscription.customer as string
  
  // Get customer details
  const customer = await stripe.customers.retrieve(customerId)
  if (!customer || customer.deleted) {
    console.error('❌ Customer not found:', customerId)
    return
  }

  const customerEmail = customer.email
  if (!customerEmail) {
    console.error('❌ Customer email not found:', customerId)
    return
  }

  // Find subscriber
  const { data: subscriber, error: subscriberError } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', customerEmail)
    .single()

  if (subscriberError || !subscriber) {
    console.error('❌ Subscriber not found for email:', customerEmail)
    return
  }

  // Check subscription status and active items
  const isActive = subscription.status === 'active'
  const priceId = subscription.items.data[0]?.price.id

  let isCustomer = false
  let curations = subscriber.curations

  if (isActive) {
    if (priceId === PREMIUM_SUPPORT_PRICE_ID) {
      // Premium Support Plan
      isCustomer = true
      curations = -1 // Unlimited
    } else if (priceId === CURATION_PLAN_PRICE_ID) {
      // Curation Plan
      curations = -1 // Unlimited curations but not customer status
    }
  } else {
    // Subscription is not active, check if they have other active subscriptions
    const customerSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    })

    // Check if they have any active subscriptions
    const hasPremiumSupport = customerSubscriptions.data.some(sub => 
      sub.items.data.some(item => item.price.id === PREMIUM_SUPPORT_PRICE_ID)
    )
    const hasCurationPlan = customerSubscriptions.data.some(sub => 
      sub.items.data.some(item => item.price.id === CURATION_PLAN_PRICE_ID)
    )

    if (hasPremiumSupport) {
      isCustomer = true
      curations = -1
    } else if (hasCurationPlan) {
      curations = -1
    } else {
      // No active subscriptions, reset to default
      isCustomer = false
      curations = 3 // Default number of curations for non-customers
    }
  }

  // Update subscriber
  const { error: updateError } = await supabase
    .from('subscribers')
    .update({
      customer: isCustomer,
      curations: curations,
      stripe_customer_id: customerId,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriber.id)

  if (updateError) {
    console.error('❌ Failed to update subscriber:', updateError)
  } else {
    console.log('✅ Subscriber updated for subscription change:', customerEmail)
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription, supabase: any) {
  const customerId = subscription.customer as string
  
  // Get customer details
  const customer = await stripe.customers.retrieve(customerId)
  if (!customer || customer.deleted) {
    console.error('❌ Customer not found:', customerId)
    return
  }

  const customerEmail = customer.email
  if (!customerEmail) {
    console.error('❌ Customer email not found:', customerId)
    return
  }

  // Find subscriber
  const { data: subscriber, error: subscriberError } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', customerEmail)
    .single()

  if (subscriberError || !subscriber) {
    console.error('❌ Subscriber not found for email:', customerEmail)
    return
  }

  // Check if they have other active subscriptions
  const customerSubscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
  })

  const hasPremiumSupport = customerSubscriptions.data.some(sub => 
    sub.items.data.some(item => item.price.id === PREMIUM_SUPPORT_PRICE_ID)
  )
  const hasCurationPlan = customerSubscriptions.data.some(sub => 
    sub.items.data.some(item => item.price.id === CURATION_PLAN_PRICE_ID)
  )

  let isCustomer = false
  let curations = 3 // Default number of curations

  if (hasPremiumSupport) {
    isCustomer = true
    curations = -1
  } else if (hasCurationPlan) {
    curations = -1
  }

  // Update subscriber
  const { error: updateError } = await supabase
    .from('subscribers')
    .update({
      customer: isCustomer,
      curations: curations,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriber.id)

  if (updateError) {
    console.error('❌ Failed to update subscriber after cancellation:', updateError)
  } else {
    console.log('✅ Subscriber updated after subscription cancellation:', customerEmail)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  const customerId = invoice.customer as string

  // Update purchase record if it exists
  const { error: updateError } = await supabase
    .from('purchases')
    .update({
      status: 'completed',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)
    .eq('status', 'pending')

  if (updateError) {
    console.log('⚠️  Could not update purchase record:', updateError)
  }

  console.log('✅ Payment succeeded for customer:', customerId)
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  const customerId = invoice.customer as string

  // Get customer details
  const customer = await stripe.customers.retrieve(customerId)
  if (!customer || customer.deleted) {
    console.error('❌ Customer not found:', customerId)
    return
  }

  const customerEmail = customer.email
  if (!customerEmail) {
    console.error('❌ Customer email not found:', customerId)
    return
  }

  // Find subscriber
  const { data: subscriber, error: subscriberError } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', customerEmail)
    .single()

  if (subscriberError || !subscriber) {
    console.error('❌ Subscriber not found for email:', customerEmail)
    return
  }

  // On payment failure, we might want to downgrade the user or send a notification
  // For now, we'll just log it and potentially update purchase status
  const { error: updateError } = await supabase
    .from('purchases')
    .update({
      status: 'failed',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)
    .eq('status', 'pending')

  if (updateError) {
    console.log('⚠️  Could not update purchase record:', updateError)
  }

  console.log('⚠️  Payment failed for customer:', customerEmail)
}

async function createPurchaseRecord(
  userId: string,
  sessionId: string,
  customerId: string,
  amountTotal: number,
  currency: string,
  status: string,
  supabase: any
) {
  const { error } = await supabase
    .from('purchases')
    .insert({
      user_id: userId,
      stripe_session_id: sessionId,
      stripe_customer_id: customerId,
      amount_total: amountTotal,
      currency: currency,
      status: status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('❌ Failed to create purchase record:', error)
  } else {
    console.log('✅ Purchase record created successfully')
  }
} 