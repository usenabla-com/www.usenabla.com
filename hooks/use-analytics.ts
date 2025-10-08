declare global {
  interface Window {
    posthog: any
  }
}

export function useAnalytics() {
  const getPostHog = () => {
    if (typeof window !== 'undefined') {
      return window.posthog
    }
    return null
  }

  const identify = (userId: string, traits?: Record<string, any>) => {
    const posthog = getPostHog()
    if (posthog) {
      posthog.identify(userId, traits)
    }
  }

  const track = (event: string, properties?: Record<string, any>) => {
    const posthog = getPostHog()
    if (posthog) {
      posthog.capture(event, properties)
    }
  }

  const page = (name?: string, properties?: Record<string, any>) => {
    const posthog = getPostHog()
    if (posthog) {
      posthog.capture('$pageview', { name, ...properties })
    }
  }

  return { identify, track, page }
} 