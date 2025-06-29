# Stripe Webhook Setup Guide

This guide explains how to set up the Stripe webhook to handle subscription payments for your application.

## Overview

The webhook handles two subscription types:
- **Premium Support Plan** ($85.99/month): Gives customer status + unlimited curations + chat support
- **Curation Plan** ($20.99/month): Gives unlimited curations (but no customer status for chat support)

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...                    # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...                  # Webhook endpoint secret from Stripe
STRIPE_PREMIUM_SUPPORT_PRICE_ID=price_...        # Price ID for $85.99/month Premium Support
STRIPE_CURATION_PLAN_PRICE_ID=price_...          # Price ID for $20.99/month Curation Plan

# Existing Supabase Configuration (required)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_KEY=...
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

In your Stripe Dashboard:

1. **Create Premium Support Product**:
   - Name: "Premium Support"
   - Description: "Unlimited curations + priority chat support"
   - Price: $85.99/month recurring
   - Copy the Price ID to `STRIPE_PREMIUM_SUPPORT_PRICE_ID`

2. **Create Curation Plan Product**:
   - Name: "Curation Plan"
   - Description: "Unlimited content curations"
   - Price: $20.99/month recurring
   - Copy the Price ID to `STRIPE_CURATION_PLAN_PRICE_ID`

### 2. Set Up Webhook Endpoint

1. Go to **Developers → Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Set endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Database Schema

The webhook uses these database tables:

### subscribers table (existing)
- `customer` (boolean): True for Premium Support subscribers
- `curations` (integer): Number of curations (-1 = unlimited)
- `stripe_customer_id` (text): Stripe customer ID

### purchases table (new)
```sql
-- Create purchases table to track Stripe transactions
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  amount_total INTEGER, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session_id ON purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_customer_id ON purchases(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at);

-- Add RLS policies
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own purchases
CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Only authenticated users can insert purchases (for webhook)
CREATE POLICY "System can insert purchases" ON purchases
  FOR INSERT WITH CHECK (true);

-- Add stripe_customer_id column to subscribers if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscribers' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE subscribers ADD COLUMN stripe_customer_id TEXT;
    CREATE INDEX IF NOT EXISTS idx_subscribers_stripe_customer_id ON subscribers(stripe_customer_id);
  END IF;
END $$;
```

## Business Logic

### Subscription Behavior

| Plan Type | Customer Status | Curations | Chat Support |
|-----------|-----------------|-----------|--------------|
| Free | `false` | 3 (default) | ❌ |
| Curation Plan | `false` | -1 (unlimited) | ❌ |
| Premium Support | `true` | -1 (unlimited) | ✅ |

### Curation Logic

- **Free users**: Limited curations (decrements on use)
- **Curation Plan**: Unlimited curations, no chat support
- **Premium Support**: Unlimited curations + chat support
- **Unlimited curations**: Represented by `-1` in database

### Chat Support Logic

Chat support is available only when:
- `customer = true` (Premium Support subscribers)
- This is checked in the chat components and API routes

## Testing

### Test the Webhook

1. Use Stripe CLI to forward webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

2. Create a test subscription in Stripe Dashboard

3. Check your application logs for webhook events

### Test Subscription Flow

1. Create Stripe Checkout sessions for both plans
2. Complete test payments
3. Verify user status updates in your database
4. Test curation functionality with different subscription types

## Webhook Events Handled

- **`checkout.session.completed`**: Initial subscription setup
- **`customer.subscription.created/updated`**: Subscription changes
- **`customer.subscription.deleted`**: Subscription cancellations
- **`invoice.payment_succeeded`**: Successful payments
- **`invoice.payment_failed`**: Failed payments

## Security Considerations

1. **Webhook signature verification**: Always verify webhook signatures
2. **Environment variables**: Keep all Stripe keys secure
3. **Database access**: Use RLS policies for purchases table
4. **Error handling**: Log errors but don't expose sensitive information

## Monitoring

- Monitor webhook delivery in Stripe Dashboard
- Check application logs for webhook processing
- Set up alerts for failed payments
- Track subscription metrics in your analytics

## Troubleshooting

### Common Issues

1. **Webhook signature verification failed**
   - Check `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure raw request body is used for verification

2. **Subscriber not found**
   - Verify email matching between Stripe and your database
   - Check Stripe customer email is set correctly

3. **Price ID mismatch**
   - Verify `STRIPE_PREMIUM_SUPPORT_PRICE_ID` and `STRIPE_CURATION_PLAN_PRICE_ID`
   - Check Stripe product configuration

4. **Database update failures**
   - Check Supabase connection and permissions
   - Verify RLS policies allow webhook updates

### Debug Webhook

Add logging to webhook endpoint:
```typescript
console.log('Webhook event:', event.type)
console.log('Event data:', event.data.object)
```

Check Stripe Dashboard → Webhooks → [Your endpoint] for delivery status and response codes. 