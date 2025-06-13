'use server'

import { sendPushNotification, sendPushNotificationToMultiple } from '@/lib/web-push'
import type { PushNotificationPayload, PushSubscriptionData } from '@/lib/web-push'

interface SendNotificationResult {
  success: boolean
  error?: string
}

/**
 * Server action to send a push notification to a single user
 */
export async function sendNotificationAction(
  subscription: PushSubscriptionData,
  payload: PushNotificationPayload
): Promise<SendNotificationResult> {
  try {
    const result = await sendPushNotification(subscription, payload)
    return result
  } catch (error) {
    console.error('Server action - Failed to send notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Server action to send push notifications to multiple users
 */
export async function sendNotificationToMultipleAction(
  subscriptions: PushSubscriptionData[],
  payload: PushNotificationPayload
): Promise<{ success: boolean; results: Array<{ success: boolean; error?: string }> }> {
  try {
    const result = await sendPushNotificationToMultiple(subscriptions, payload)
    return result
  } catch (error) {
    console.error('Server action - Failed to send notifications:', error)
    return {
      success: false,
      results: [{ success: false, error: error instanceof Error ? error.message : 'Unknown error' }]
    }
  }
}

/**
 * Server action to send a notification about new curated content
 */
export async function sendCurationNotificationAction(
  subscriptions: PushSubscriptionData[],
  userName?: string
): Promise<SendNotificationResult> {
  try {
    const payload: PushNotificationPayload = {
      title: 'Fresh Content Ready! 🎯',
      body: userName 
        ? `${userName}, your personalized feed has been updated with new curated content.`
        : 'Your personalized feed has been updated with new curated content.',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      url: '/feed',
      data: {
        type: 'curation',
        timestamp: new Date().toISOString()
      }
    }

    if (subscriptions.length === 1) {
      return await sendPushNotification(subscriptions[0], payload)
    } else {
      const result = await sendPushNotificationToMultiple(subscriptions, payload)
      return {
        success: result.success,
        error: result.success ? undefined : 'Failed to send to some users'
      }
    }
  } catch (error) {
    console.error('Server action - Failed to send curation notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Server action to send a welcome notification to new users
 */
export async function sendWelcomeNotificationAction(
  subscription: PushSubscriptionData,
  userName?: string
): Promise<SendNotificationResult> {
  try {
    const payload: PushNotificationPayload = {
      title: 'Welcome to Atelier Logos! 🎨',
      body: userName 
        ? `Welcome ${userName}! Your profile is set up and ready to go.`
        : 'Welcome! Your profile is set up and ready to go.',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      url: '/profile',
      data: {
        type: 'welcome',
        timestamp: new Date().toISOString()
      }
    }

    return await sendPushNotification(subscription, payload)
  } catch (error) {
    console.error('Server action - Failed to send welcome notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Server action to test push notifications
 */
export async function sendTestNotificationAction(
  subscription: PushSubscriptionData
): Promise<SendNotificationResult> {
  try {
    const payload: PushNotificationPayload = {
      title: 'Test Notification 🧪',
      body: 'This is a test notification from Atelier Logos. Everything is working perfectly!',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      url: '/',
      data: {
        type: 'test',
        timestamp: new Date().toISOString()
      }
    }

    return await sendPushNotification(subscription, payload)
  } catch (error) {
    console.error('Server action - Failed to send test notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 