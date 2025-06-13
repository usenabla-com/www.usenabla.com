import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    // Validate URL
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }

  try {
    console.log('🔍 Fetching OG data for:', url)

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGParser/1.0; +https://atelierlogos.studio)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract Open Graph data
    const ogData: OGData = {}

    // Basic OG tags
    ogData.title = $('meta[property="og:title"]').attr('content') || 
                   $('meta[name="twitter:title"]').attr('content') ||
                   $('title').text() ||
                   undefined

    ogData.description = $('meta[property="og:description"]').attr('content') ||
                        $('meta[name="twitter:description"]').attr('content') ||
                        $('meta[name="description"]').attr('content') ||
                        undefined

    ogData.image = $('meta[property="og:image"]').attr('content') ||
                   $('meta[name="twitter:image"]').attr('content') ||
                   $('meta[name="twitter:image:src"]').attr('content') ||
                   undefined

    ogData.siteName = $('meta[property="og:site_name"]').attr('content') ||
                      $('meta[name="twitter:site"]').attr('content') ||
                      undefined

    ogData.type = $('meta[property="og:type"]').attr('content') || undefined

    ogData.url = $('meta[property="og:url"]').attr('content') ||
                 $('link[rel="canonical"]').attr('href') ||
                 url

    // Author information
    ogData.author = $('meta[property="article:author"]').attr('content') ||
                    $('meta[name="author"]').attr('content') ||
                    $('meta[property="og:author"]').attr('content') ||
                    undefined

    // Published time
    ogData.publishedTime = $('meta[property="article:published_time"]').attr('content') ||
                          $('meta[property="og:published_time"]').attr('content') ||
                          undefined

    // Favicon
    const faviconHref = $('link[rel="icon"]').attr('href') ||
                       $('link[rel="shortcut icon"]').attr('href') ||
                       $('link[rel="apple-touch-icon"]').attr('href')
    
    if (faviconHref) {
      ogData.favicon = faviconHref.startsWith('http') 
        ? faviconHref 
        : new URL(faviconHref, url).href
    }

    // Clean up relative URLs
    if (ogData.image && !ogData.image.startsWith('http')) {
      try {
        ogData.image = new URL(ogData.image, url).href
      } catch {
        ogData.image = undefined
      }
    }

    // Trim text content
    if (ogData.title) ogData.title = ogData.title.trim()
    if (ogData.description) ogData.description = ogData.description.trim()
    if (ogData.siteName) ogData.siteName = ogData.siteName.trim()
    if (ogData.author) ogData.author = ogData.author.trim()

    console.log('✅ Successfully parsed OG data for:', url)
    console.log('📊 OG data:', {
      title: ogData.title?.substring(0, 50) + '...',
      hasImage: !!ogData.image,
      hasDescription: !!ogData.description
    })

    return NextResponse.json(ogData)
  } catch (error) {
    console.error('❌ Failed to parse OG data for:', url, error)
    
    return NextResponse.json(
      { 
        error: 'Failed to parse Open Graph data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 