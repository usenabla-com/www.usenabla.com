'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Globe } from 'lucide-react'
import { ogParserService } from '@/lib/og-parser'

interface URLPreviewProps {
  url: string
  className?: string
}

export function URLPreview({ url, className = '' }: URLPreviewProps) {
  const [ogData, setOgData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchOGData = async () => {
      try {
        setLoading(true)
        setError(false)
        const data = await ogParserService.parseOGData(url)
        setOgData(data)
      } catch (err) {
        console.error('Failed to fetch OG data:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchOGData()
  }, [url])

  if (loading) {
    return (
      <Card className={`mt-2 ${className}`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4 animate-pulse" />
            <span>Loading preview...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !ogData || (!ogData.title && !ogData.description && !ogData.image)) {
    return (
      <Card className={`${className} w-full max-w-full shadow-sm hover:shadow-md transition-all duration-200 border border-border/40 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate flex-1 font-medium transition-colors"
            >
              {ogParserService.getDomain(url)}
            </a>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className} w-full max-w-full shadow-md hover:shadow-lg transition-all duration-200 border border-border/30 bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm hover:scale-[1.01]`}>
      <CardContent className="p-0">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:bg-muted/30 transition-all duration-200 rounded-lg"
        >
          <div className="flex max-w-full">
            {ogData.image && (
              <div className="w-16 sm:w-20 h-12 sm:h-16 flex-shrink-0">
                <img 
                  src={ogData.image} 
                  alt={ogData.title || 'Preview'}
                  className="w-full h-full object-cover rounded-l-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            <div className="flex-1 p-2 sm:p-3 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <img 
                  src={ogParserService.getFaviconUrl(url)} 
                  alt=""
                  className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 rounded-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span className="text-xs text-muted-foreground/80 truncate font-medium">
                  {ogData.siteName || ogParserService.getDomain(url)}
                </span>
                <ExternalLink className="h-3 w-3 text-muted-foreground/60 flex-shrink-0" />
              </div>
              {ogData.title && (
                <h4 className="font-semibold text-xs sm:text-sm line-clamp-2 mb-1 text-foreground">
                  {ogData.title}
                </h4>
              )}
              {ogData.description && (
                <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                  {ogData.description}
                </p>
              )}
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  )
} 