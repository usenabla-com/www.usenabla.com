'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'

interface PushNotificationSenderProps {
  userName?: string
  className?: string
}

export function PushNotificationSender({ userName, className }: PushNotificationSenderProps) {
  const [sending, setSending] = useState(false)
  const [lastResult, setLastResult] = useState<{ success: boolean; error?: string } | null>(null)

  const sendPusherNotification = async (title: string, body: string) => {
    setSending(true)
    setLastResult(null)

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          interests: ['hello']
        })
      })

      const result = await response.json()

      if (result.success) {
        setLastResult({ success: true })
      } else {
        setLastResult({ success: false, error: result.error })
      }
    } catch (error) {
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setSending(false)
    }
  }

  const sendTestNotification = () => {
    sendPusherNotification('Test Notification', 'Hello from Atelier Logos! 👋')
  }

  const sendWelcomeNotification = () => {
    const welcomeMessage = userName 
      ? `Welcome to Atelier Logos, ${userName}! 🎉`
      : 'Welcome to Atelier Logos! 🎉'
    sendPusherNotification('Welcome!', welcomeMessage)
  }

  const sendCurationNotification = () => {
    const curationMessage = userName
      ? `Hey ${userName}, we've curated some new content just for you! ✨`
      : 'New curated content is available! ✨'
    sendPusherNotification('New Curation', curationMessage)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={sendTestNotification}
          disabled={sending}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Test Notification
        </Button>

        <Button
          onClick={sendWelcomeNotification}
          disabled={sending}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Welcome Message
        </Button>

        <Button
          onClick={sendCurationNotification}
          disabled={sending}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Curation Update
        </Button>
      </div>

      {lastResult && (
        <div className={`text-sm p-2 rounded ${
          lastResult.success 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {lastResult.success 
            ? '✅ Notification sent successfully via Pusher!' 
            : `❌ Failed: ${lastResult.error}`
          }
        </div>
      )}
    </div>
  )
} 