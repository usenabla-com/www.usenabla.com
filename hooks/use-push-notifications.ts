import { useState, useEffect, useCallback } from 'react'

interface PushNotificationHook {
  isSupported: boolean
  subscription: PushSubscription | null
  isSubscribed: boolean
  isLoading: boolean
  error: string | null
  subscribe: () => Promise<void>
  unsubscribe: () => Promise<void>
  sendTestNotification: (message: { title: string; body: string; data?: any }) => Promise<void>
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function usePushNotifications(): PushNotificationHook {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSubscribed = !!subscription

  useEffect(() => {
    // Check if push notifications are supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      
      // Register service worker and get existing subscription
      navigator.serviceWorker.ready.then(async (registration) => {
        try {
          const existingSubscription = await registration.pushManager.getSubscription()
          setSubscription(existingSubscription)
        } catch (err) {
          console.error('Error getting existing subscription:', err)
        }
      })
    }
  }, [])

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Request notification permission
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Notification permission denied')
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready

      // Get VAPID public key from server
      const response = await fetch('/api/push')
      const { publicKey } = await response.json()

      // Subscribe to push notifications
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      })

      // Send subscription to server
      await fetch('/api/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'subscribe',
          subscription: pushSubscription
        })
      })

      setSubscription(pushSubscription)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe to push notifications')
      console.error('Push subscription error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isSupported])

  const unsubscribe = useCallback(async () => {
    if (!subscription) return

    setIsLoading(true)
    setError(null)

    try {
      // Unsubscribe from push notifications
      await subscription.unsubscribe()

      // Notify server
      await fetch('/api/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'unsubscribe',
          subscription
        })
      })

      setSubscription(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe from push notifications')
      console.error('Push unsubscription error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [subscription])

  const sendTestNotification = useCallback(async (message: { title: string; body: string; data?: any }) => {
    if (!isSubscribed) {
      setError('Not subscribed to push notifications')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'send',
          message
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send notification')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send test notification')
      console.error('Send notification error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isSubscribed])

  return {
    isSupported,
    subscription,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    sendTestNotification
  }
} 