'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import supabaseService from '@/lib/supabase'

interface NotificationModalProps {
  onComplete?: () => void
}

export default function NotificationModal({ onComplete }: NotificationModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Initialize Pusher client and register device interest
    const initializePusherClient = async () => {
      try {
        // Get current user to subscribe to their specific interest
        const user = await supabaseService.getCurrentUser()
        
        if (!user) {
          console.log('No authenticated user - skipping notification setup')
          return
        }

        // Check notification permission first
        if (typeof window !== 'undefined' && 'Notification' in window) {
          const permission = Notification.permission
          
          if (permission === 'denied') {
            console.log('Notifications are denied - dispatching event for bell to shake')
            window.dispatchEvent(new CustomEvent('notificationsDenied'))
            return
          }
          
          if (permission === 'default') {
            // Request permission
            const newPermission = await Notification.requestPermission()
            if (newPermission === 'denied') {
              console.log('User denied notifications - dispatching event for bell to shake')
              window.dispatchEvent(new CustomEvent('notificationsDenied'))
              return
            }
          }
        }

        const PusherPushNotifications = await import('@pusher/push-notifications-web')
        const client = new PusherPushNotifications.Client({
          instanceId: process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID!,
        })
        
        await client.start()
        
        // Subscribe to user-specific interest for support notifications
        await client.addDeviceInterest(`user-${user.id}`)
        console.log(`Successfully registered for notifications: user-${user.id}`)
        
        // Check if this is a new user and show welcome modal
        await checkAndShowWelcomeModal()
      } catch (error) {
        console.error('Failed to initialize Pusher client:', error)
      }
    }

    // Check if we should show the welcome modal for new users
    const checkAndShowWelcomeModal = async () => {
      try {
        // Check if user has already completed the onboarding flow
        const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding')
        
        if (!hasCompletedOnboarding) {
          console.log('📱 New user detected - showing welcome modal after notification setup')
          
          // Small delay to ensure everything is ready
          setTimeout(() => {
            setIsOpen(true)
          }, 1000)
        } else {
          console.log('👤 Returning user - no modal needed')
        }
      } catch (error) {
        console.error('❌ Error checking onboarding status:', error)
      }
    }

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          console.log('🔄 Registering service worker...')
          const registration = await navigator.serviceWorker.register('/service-worker.js')
          console.log('✅ ServiceWorker registration successful')
          
          // Initialize Pusher after service worker is ready
          await initializePusherClient()
        } catch (error) {
          console.error('❌ ServiceWorker registration failed:', error)
        }
      }
    }

    // Listen for custom events
    const handleShowUserInfoModal = () => {
      console.log('📱 Showing user info modal from auth callback')
      window.dispatchEvent(new CustomEvent('openProfileModal'))
    }

    // Listen for when user completes onboarding
    const handleOnboardingComplete = () => {
      localStorage.setItem('hasCompletedOnboarding', 'true')
      onComplete?.()
    }

    window.addEventListener('showUserInfoModal', handleShowUserInfoModal)
    window.addEventListener('onboardingComplete', handleOnboardingComplete)

    // Initialize everything when component mounts
    registerServiceWorker()

    return () => {
      window.removeEventListener('showUserInfoModal', handleShowUserInfoModal)
      window.removeEventListener('onboardingComplete', handleOnboardingComplete)
    }
  }, [onComplete])

  const handleCreateProfile = () => {
    console.log('👤 User chose to create profile')
    setIsOpen(false)
    // Trigger the profile modal
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openProfileModal'))
    }, 300)
  }

  const handleSkip = () => {
    console.log('👤 User chose to skip profile creation')
    setIsOpen(false)
    // Mark as completed even if skipped
    localStorage.setItem('hasCompletedOnboarding', 'true')
    onComplete?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center">
            <div className="text-5xl mb-4">👋</div>
            <DialogTitle className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to Atelier Logos!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-6">
              You're all set up for notifications! Would you like to create a profile to personalize your experience?
            </DialogDescription>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={handleCreateProfile}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Profile
              </Button>
              <Button 
                onClick={handleSkip} 
                variant="secondary"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
} 