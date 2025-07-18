"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, Sparkles, ArrowRight } from "lucide-react"

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Don't show banner on platform pages
    if (pathname.startsWith('/platform')) {
      setIsVisible(false)
      return
    }

    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('ferropipe-banner-dismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [pathname])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('ferropipe-banner-dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="relative z-50 bg-gradient-to-r from-secondary to-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-medium">New Product Launch</span>
            </div>
            <div className="hidden sm:block text-sm">
              <span className="font-semibold">Ferropipe is now available!</span>
              <span className="ml-2 opacity-90">
                Advanced Rust crate intelligence for developers and LLMs
              </span>
            </div>
            <div className="sm:hidden text-sm">
              <span className="font-semibold">Ferropipe is live!</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="text-xs px-3 py-1 h-7 bg-white/20 hover:bg-white/30 text-primary-foreground border-white/30"
              asChild
            >
              <Link href="/platform">
                Learn More
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 