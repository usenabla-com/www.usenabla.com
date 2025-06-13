import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Calendar, User, Globe } from 'lucide-react'
import { EnhancedFeedItem } from '@/lib/og-parser'
import Image from 'next/image'

interface FeedItemProps {
  item: EnhancedFeedItem
}

export default function FeedItem({ item }: FeedItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return url
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

  // Use OG data if available, fallback to original data
  const displayTitle = item.og?.title || item.title
  const displayDescription = item.og?.description || item.snippet
  const displayAuthor = item.og?.author || item.author
  const displayImage = item.og?.image
  const siteName = item.og?.siteName || getDomain(item.url)
  const favicon = item.og?.favicon || getFaviconUrl(item.url)

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="flex gap-4 p-6">
          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header with site info */}
            <div className="flex items-center gap-2 mb-3">
              <Image
                src={favicon}
                alt=""
                width={16}
                height={16}
                className="rounded-sm"
                onError={(e) => {
                  e.currentTarget.src = '/favicon.ico'
                }}
              />
              <span className="text-sm text-gray-500 font-medium">
                {siteName}
              </span>
              <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {displayTitle}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {displayDescription}
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {displayAuthor && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {displayAuthor}
                </span>
              )}
              {item.published_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(item.published_date)}
                </span>
              )}
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {formatDate(item.created_at)}
              </Badge>
            </div>
          </div>

          {/* Image Section */}
          {displayImage && (
            <div className="flex-shrink-0">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={displayImage}
                  alt={displayTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </a>
    </Card>
  )
} 