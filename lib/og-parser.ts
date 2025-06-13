interface OGData {
  title?: string
  description?: string
  image?: string
  siteName?: string
  type?: string
  url?: string
  author?: string
  publishedTime?: string
  favicon?: string
}

export interface EnhancedFeedItem {
  id: string
  created_at: string
  title: string
  url: string
  snippet: string
  author: string | null
  published_date: string | null
  og?: OGData
}

class OGParserService {
  private cache = new Map<string, OGData>()

  async parseOGData(url: string): Promise<OGData> {
    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url)!
    }

    try {
      // Use a CORS proxy or serverless function to fetch the HTML
      const response = await fetch(`/api/parser?url=${encodeURIComponent(url)}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch OG data: ${response.status}`)
      }

      const ogData = await response.json()
      
      // Cache the result
      this.cache.set(url, ogData)
      
      return ogData
    } catch (error) {
      console.error('Failed to parse OG data for', url, error)
      
      // Return minimal data on error
      const fallbackData: OGData = {
        title: undefined,
        description: undefined,
        image: undefined,
        url
      }
      
      this.cache.set(url, fallbackData)
      return fallbackData
    }
  }

  async enhanceFeedItems(items: any[]): Promise<EnhancedFeedItem[]> {
    const enhancedItems = await Promise.allSettled(
      items.map(async (item) => {
        try {
          const ogData = await this.parseOGData(item.url)
          return {
            ...item,
            og: ogData
          }
        } catch (error) {
          console.error('Failed to enhance item', item.id, error)
          return {
            ...item,
            og: undefined
          }
        }
      })
    )

    return enhancedItems
      .filter((result): result is PromiseFulfilledResult<EnhancedFeedItem> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value)
  }

  // Extract domain from URL for display
  getDomain(url: string): string {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  // Get a favicon URL for a domain
  getFaviconUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
    } catch {
      return '/favicon.ico'
    }
  }
}

export const ogParserService = new OGParserService() 