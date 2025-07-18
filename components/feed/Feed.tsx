import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import supabaseService from '@/lib/supabase'
import { curateUserFeed } from '@/lib/curation-utils'
import { EnhancedFeedItem, ogParserService } from '@/lib/og-parser'
import FeedItem from './FeedItem'

interface FeedProps {
  className?: string
}

export default function Feed({ className }: FeedProps) {
  const [feedItems, setFeedItems] = useState<EnhancedFeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [triggering, setTriggering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFeedItems = async () => {
    try {
      const user = await supabaseService.getCurrentUser()
      if (!user) {
        setError('Please sign in to view your feed')
        return
      }

      const response = await supabaseService.getFeedItems(user.id)
      if (response.error) {
        setError(response.error)
        return
      }
      
      // Enhance feed items with OG data
      const enhancedItems = await ogParserService.enhanceFeedItems(response.data || [])
      
      setFeedItems(enhancedItems)
      setError(null)
    } catch (err) {
      console.error('Failed to load feed items:', err)
      setError('Failed to load feed items')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshFeed = async () => {
    setRefreshing(true)
    await loadFeedItems()
  }

  const triggerCuration = async () => {
    setTriggering(true)
    try {
      const user = await supabaseService.getCurrentUser()
      if (!user) {
        throw new Error('Please sign in to curate content')
      }

      await curateUserFeed(user.id)
      await loadFeedItems()
      
    } catch (err) {
      console.error('Failed to trigger curation:', err)
      setError(err instanceof Error ? err.message : 'Failed to trigger curation')
    } finally {
      setTriggering(false)
    }
  }

  useEffect(() => {
    loadFeedItems()
  }, [])

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Curated Feed</h2>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex gap-4 p-6">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="w-32 h-24 bg-gray-200 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Curated Feed</h2>
        <div className="flex gap-2">
          <Button
            onClick={triggerCuration}
            disabled={triggering}
            variant="default"
            size="sm"
          >
            {triggering ? 'Curating...' : 'Curate New Content'}
          </Button>
          <Button
            onClick={refreshFeed}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {feedItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">
              No curated content yet. Your personalized feed will appear here once our AI finds relevant articles based on your interests.
            </p>
            <p className="text-sm text-gray-400">
              Make sure you have set up your curation preferences in your profile.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedItems.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
} 