'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if running in standalone mode
    const checkStandalone = () => {
      const standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches
      setIsStandalone(standalone)
      console.log('PWA: Standalone mode:', standalone)
    }

    // Check if on mobile device
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
      console.log('PWA: Mobile device:', mobile)
    }

    checkStandalone()
    checkMobile()

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired - app is installable!')
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      console.log('PWA: App was installed')
      // Don't hide the button - keep it available for future reinstalls
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Debug: Check PWA criteria
    setTimeout(() => {
      console.log('PWA Install Button Debug:')
      console.log('- Has deferred prompt:', !!deferredPrompt)
      console.log('- Is installable:', isInstallable)
      console.log('- Is standalone:', isStandalone)
      console.log('- Is mobile:', isMobile)
      console.log('- Service worker supported:', 'serviceWorker' in navigator)
      console.log('- HTTPS:', location.protocol === 'https:')
    }, 2000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [deferredPrompt, isInstallable, isStandalone, isMobile])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('PWA: No deferred prompt available - showing manual instructions')
      // Show manual install instructions based on device
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const instructions = isIOS 
        ? 'To install this app:\n\n1. Tap the Share button (□↗)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm'
        : 'To install this app:\n\n1. Tap the menu (⋮) in your browser\n2. Look for "Install app" or "Add to Home Screen"\n3. Follow the prompts to install'
      
      alert(instructions)
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt')
      } else {
        console.log('PWA: User dismissed the install prompt')
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('PWA: Error during install prompt:', error)
    }
  }

  // Show button if:
  // 1. We have a deferred prompt (definitely installable), OR
  // 2. We're on mobile and not in standalone mode (likely installable)
  const shouldShowButton = isInstallable || (isMobile && !isStandalone)

  if (!shouldShowButton) {
    return null
  }

  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Smartphone className="h-4 w-4" />
      {isStandalone ? 'Reinstall App' : 'Install App'}
    </Button>
  )
} 