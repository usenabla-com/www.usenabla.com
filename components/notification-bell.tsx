'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface NotificationBellProps {
  className?: string
  showText?: boolean
}

export function NotificationBell({ className, showText = false }: NotificationBellProps) {
  const [notificationStatus, setNotificationStatus] = useState<'granted' | 'denied' | 'default'>('default')
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    checkNotificationStatus()
    
    // Listen for custom event when notifications are denied
    const handleNotificationsDenied = () => {
      setNotificationStatus('denied')
      setIsShaking(true)
    }
    
    window.addEventListener('notificationsDenied', handleNotificationsDenied)
    
    return () => {
      window.removeEventListener('notificationsDenied', handleNotificationsDenied)
    }
  }, [])

  const checkNotificationStatus = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const status = Notification.permission
      console.log('🔔 Notification permission status:', status)
      setNotificationStatus(status)
      
      // Set shaking based on notification status
      setIsShaking(status !== 'granted')
    } else {
      console.log('🔔 Notifications not supported')
    }
  }

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission()
        setNotificationStatus(permission)
        
        if (permission === 'granted') {
          // Re-initialize Pusher Beams with new permission
          await initializePusherBeams()
          setIsShaking(false)
        } else {
          // Keep shaking if not granted
          setIsShaking(true)
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error)
      }
    }
  }

  const initializePusherBeams = async () => {
    try {
      // Get current user
      const response = await fetch('/api/auth/user')
      if (!response.ok) {
        console.log('Failed to get user info for Pusher Beams')
        return
      }

      const { user } = await response.json()
      if (!user) {
        console.log('No user found for Pusher Beams')
        return
      }

      // Initialize Pusher Beams for push notifications
      const PusherPushNotifications = await import('@pusher/push-notifications-web')
      const client = new PusherPushNotifications.Client({
        instanceId: process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID!,
      })
      
      await client.start()
      await client.addDeviceInterest(`user-${user.id}`)
      console.log(`Successfully registered for notifications: user-${user.id}`)
      
    } catch (error) {
      console.error('Failed to initialize Pusher Beams:', error)
    }
  }

  // Always show the notification bell now
  console.log('🔔 Rendering notification bell, status:', notificationStatus)

  const BellIcon = notificationStatus === 'denied' ? BellOff : Bell
  
  // Determine styling based on notification status
  const getStatusStyling = () => {
    switch (notificationStatus) {
      case 'granted':
        return {
          textColor: 'text-green-600 hover:text-green-700',
          iconColor: 'text-green-600',
          statusText: 'Notifications Enabled'
        }
      case 'denied':
        return {
          textColor: 'text-muted-foreground hover:text-foreground',
          iconColor: 'text-muted-foreground',
          statusText: 'Notifications Blocked'
        }
      default:
        return {
          textColor: 'text-muted-foreground hover:text-foreground',
          iconColor: 'text-muted-foreground',
          statusText: 'Enable Notifications'
        }
    }
  }

  const styling = getStatusStyling()

  return (
    <>
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .shake {
          animation: shake 0.5s ease-in-out infinite;
        }
      `}</style>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={requestNotificationPermission}
              className={cn(
                "flex items-center gap-2 transition-colors",
                styling.textColor,
                className
              )}
            >
              <BellIcon 
                className={cn(
                  "h-4 w-4 transition-transform",
                  styling.iconColor,
                  isShaking && "shake"
                )} 
              />
              {showText && (
                <span className="text-sm">
                  {styling.statusText}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {notificationStatus === 'granted'
                ? 'Push notifications are enabled for real-time updates'
                : notificationStatus === 'denied' 
                ? 'Click to enable push notifications for real-time updates'
                : 'Enable push notifications to stay updated'
              }
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
} 