import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

// Configure VAPID details (you should set these in environment variables)
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'YOUR_VAPID_PUBLIC_KEY',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'YOUR_VAPID_PRIVATE_KEY',
  subject: process.env.VAPID_SUBJECT?.startsWith('mailto:') 
    ? process.env.VAPID_SUBJECT 
    : `mailto:${process.env.VAPID_SUBJECT || 'james@atelierlogos.studio'}`
}

webpush.setVapidDetails(
  vapidKeys.subject,
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

// In-memory storage for subscriptions (use a database in production)
const subscriptions: webpush.PushSubscription[] = []

export async function POST(request: NextRequest) {
  try {
    const { action, subscription, message } = await request.json()

    switch (action) {
      case 'subscribe':
        // Add subscription to storage
        if (subscription && !subscriptions.find(sub => sub.endpoint === subscription.endpoint)) {
          subscriptions.push(subscription)
        }
        return NextResponse.json({ success: true, message: 'Subscribed successfully' })

      case 'unsubscribe':
        // Remove subscription from storage
        const index = subscriptions.findIndex(sub => sub.endpoint === subscription.endpoint)
        if (index > -1) {
          subscriptions.splice(index, 1)
        }
        return NextResponse.json({ success: true, message: 'Unsubscribed successfully' })

      case 'send':
        // Send push notification to all subscribers
        const payload = JSON.stringify({
          title: message.title || 'Atelier Logos',
          body: message.body || 'You have a new notification',
          icon: '/logo.png',
          badge: '/logo.png',
          data: message.data || {}
        })

        const sendPromises = subscriptions.map(subscription =>
          webpush.sendNotification(subscription, payload).catch((err: unknown) => {
            console.error('Error sending notification:', err)
            // Remove invalid subscriptions
            const invalidIndex = subscriptions.findIndex(sub => sub.endpoint === subscription.endpoint)
            if (invalidIndex > -1) {
              subscriptions.splice(invalidIndex, 1)
            }
          })
        )

        await Promise.all(sendPromises)
        return NextResponse.json({ 
          success: true, 
          message: `Notification sent to ${subscriptions.length} subscribers` 
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Push API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    publicKey: vapidKeys.publicKey,
    subscriptionCount: subscriptions.length
  })
}
