'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, BellOff } from 'lucide-react'

export function PushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding (which includes Pusher setup)
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding')
    setIsSubscribed(!!hasCompletedOnboarding)
  }, [])

  const handleToggle = () => {
    if (isSubscribed) {
      // User wants to disable - just update local state
      // (In a real app, you might want to call Pusher to remove device interest)
      setIsSubscribed(false)
      localStorage.removeItem('hasCompletedOnboarding')
    } else {
      // User wants to enable - trigger the notification modal flow
      window.dispatchEvent(new CustomEvent('showNotificationModal'))
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleToggle}
        variant={isSubscribed ? 'outline' : 'default'}
        className="gap-2"
      >
        {isSubscribed ? (
          <BellOff className="h-4 w-4" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {isSubscribed ? 'Disable Notifications' : 'Enable Notifications'}
      </Button>
      
      {isSubscribed && (
        <div className="text-sm text-green-600">
          ✓ Push notifications enabled via Pusher
        </div>
      )}
    </div>
  )
} 