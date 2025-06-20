declare global {
  interface Window {
    analytics: any
  }
}

export function useAnalytics() {
  const getAnalytics = () => {
    if (typeof window !== 'undefined') {
      return window.analytics
    }
    return null
  }

  const identify = (userId: string, traits?: Record<string, any>) => {
    const analytics = getAnalytics()
    if (analytics) {
      analytics.identify(userId, traits)
    }
  }

  const track = (event: string, properties?: Record<string, any>) => {
    const analytics = getAnalytics()
    if (analytics) {
      analytics.track(event, properties)
    }
  }

  const page = (name?: string, properties?: Record<string, any>) => {
    const analytics = getAnalytics()
    if (analytics) {
      analytics.page(name, properties)
    }
  }

  return { identify, track, page }
} 