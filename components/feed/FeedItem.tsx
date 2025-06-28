import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Calendar, User, Clock, Globe, AlertCircle } from 'lucide-react'
import { EnhancedFeedItem } from '@/lib/og-parser'
import Image from 'next/image'
import { useState } from 'react'

interface FeedItemProps {
  item: EnhancedFeedItem
}

export default function FeedItem({ item }: FeedItemProps) {
  const [imageError, setImageError] = useState(false)
  const [faviconError, setFaviconError] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Unknown'
      
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
      
      if (diffInHours < 1) return 'Just now'
      if (diffInHours < 24) return `${diffInHours}h ago`
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
      return formatDate(dateString)
    } catch {
      return 'Unknown'
    }
  }

  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return 'Unknown source'
    }
  }

  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
    } catch {
      return '/favicon.ico'
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text || typeof text !== 'string') return ''
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  const cleanText = (text: string | null | undefined) => {
    if (!text) return ''
    // Remove HTML tags and clean up the text
    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }

  // Use OG data if available, fallback to original data with safety checks
  const displayTitle = cleanText(item.og?.title || item.title) || 'Untitled Article'
  const displayDescription = cleanText(item.og?.description || item.snippet)
  const displayAuthor = cleanText(item.og?.author || item.author)
  const displayImage = item.og?.image && !imageError ? item.og.image : null
  const siteName = item.og?.siteName || getDomain(item.url || '')
  const favicon = item.og?.favicon || getFaviconUrl(item.url || '')
  const publishedDate = item.og?.publishedTime || item.published_date

  // Check if content seems broken or incomplete
  const hasMinimalContent = displayTitle.length < 10 && !displayDescription
  const isContentBroken = !displayTitle || displayTitle === 'Untitled Article'

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border/50 bg-card/95 backdrop-blur-sm relative overflow-hidden hover:border-primary/40 hover:bg-card">
      {/* Enhanced hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Content warning for broken articles */}
      {isContentBroken && (
        <div className="absolute top-2 right-2 z-20">
          <div className="w-6 h-6 bg-amber-500/90 rounded-full flex items-center justify-center" title="Content may be incomplete">
            <AlertCircle className="h-3 w-3 text-white" />
          </div>
        </div>
      )}
      
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative z-10 p-5"
      >
        <div className="flex gap-4">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Enhanced header with site info */}
            <div className="flex items-center gap-2 mb-3">
              {!faviconError && (
                <div className="relative w-5 h-5 rounded-sm overflow-hidden bg-muted/40 flex-shrink-0 border border-border/30">
                  <Image
                    src={favicon}
                    alt=""
                    width={20}
                    height={20}
                    className="object-cover"
                    onError={() => setFaviconError(true)}
                  />
                </div>
              )}
              {faviconError && (
                <div className="w-5 h-5 rounded-sm bg-muted/40 flex items-center justify-center border border-border/30 flex-shrink-0">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              <span className="text-sm text-muted-foreground font-medium truncate">
                {siteName}
              </span>
              <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full flex-shrink-0"></div>
              <span className="text-xs text-muted-foreground/70 flex-shrink-0">
                {formatRelativeTime(item.created_at)}
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:text-primary ml-auto flex-shrink-0" />
            </div>

            {/* Enhanced title with better typography */}
            <h3 className={`font-semibold leading-tight mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2 ${
              hasMinimalContent ? 'text-base text-muted-foreground' : 'text-lg text-foreground'
            }`}>
              {displayTitle}
            </h3>

            {/* Description with better handling */}
            {displayDescription && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                {truncateText(displayDescription, 160)}
              </p>
            )}

            {/* Enhanced metadata with better spacing */}
            <div className="flex items-center flex-wrap gap-2 text-xs">
              {displayAuthor && (
                <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1.5 rounded-md border border-border/30">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate max-w-[120px] font-medium text-muted-foreground">{displayAuthor}</span>
                </div>
              )}
              {publishedDate && (
                <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1.5 rounded-md border border-border/30">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{formatDate(publishedDate)}</span>
                </div>
              )}
              <Badge variant="secondary" className="text-xs px-2.5 py-1.5 bg-primary/10 text-primary border border-primary/20 font-medium">
                <Clock className="h-3 w-3 mr-1.5" />
                Curated
              </Badge>
            </div>
          </div>

          {/* Enhanced image with better fallback */}
          {displayImage && (
            <div className="flex-shrink-0">
              <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden bg-muted/40 border border-border/40 shadow-sm group-hover:shadow-md transition-all duration-300">
                <Image
                  src={displayImage}
                  alt={displayTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
                {/* Subtle image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          )}
          
          {/* Placeholder for articles without images */}
          {!displayImage && !hasMinimalContent && (
            <div className="flex-shrink-0">
              <div className="w-28 h-24 sm:w-32 sm:h-28 rounded-xl bg-gradient-to-br from-muted/30 to-muted/50 border border-border/30 flex items-center justify-center">
                <Globe className="h-8 w-8 text-muted-foreground/40" />
              </div>
            </div>
          )}
        </div>

        {/* Enhanced content quality indicator */}
        {hasMinimalContent && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-3 w-3" />
              <span>Limited content preview available</span>
            </div>
          </div>
        )}
      </a>
    </Card>
  )
} 