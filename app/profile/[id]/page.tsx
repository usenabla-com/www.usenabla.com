'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Download, 
  ExternalLink, 
  Mail, 
  Building, 
  User, 
  Calendar,
  QrCode,
  MapPin,
  Globe,
  RefreshCw,
  Loader2,
  Bell,
  TestTube,
  Sparkles
} from 'lucide-react'
import supabase, { UserProfile } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { EnhancedFeedItem, ogParserService } from '@/lib/og-parser'
import { curateUserFeed } from '@/lib/curation-utils'
import FeedItem from '@/components/feed/FeedItem'
import { PushNotificationSender } from '@/components/push-notification-sender'
import { useAnalytics } from '@/hooks/use-analytics'
import { ChatComponent } from '@/components/chat/chat-component'
import { NotificationBell } from '@/components/notification-bell'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const params = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  // Feed state
  const [feedItems, setFeedItems] = useState<EnhancedFeedItem[]>([])
  const [feedLoading, setFeedLoading] = useState(false)
  const [feedError, setFeedError] = useState<string | null>(null)
  const [triggering, setTriggering] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const feedContainerRef = useRef<HTMLDivElement>(null)
  const analytics = useAnalytics()

  const profileId = params?.id as string
  const isOwnProfile = currentUser?.id === profileId

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase.getUserProfile(profileId)
        if (error) {
          setError(error)
        } else {
          setProfile(data)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (profileId) {
      fetchProfile()
    }
  }, [profileId])

  // Load feed items
  const loadFeedItems = async (pageNum = 0, append = false) => {
    if (!isOwnProfile || !currentUser) return

    try {
      setFeedLoading(true)
      setFeedError(null)

      // Refresh profile data before loading feed
      if (!append) {
        const { data: freshProfile } = await supabase.getUserProfile(currentUser.id)
        if (freshProfile) {
          setProfile(freshProfile)
        }
      }

      const response = await supabase.getFeedItems(currentUser.id, 10, pageNum * 10)
      if (response.error) {
        setFeedError(response.error)
        return
      }
      
      // Enhance feed items with OG data
      const enhancedItems = await ogParserService.enhanceFeedItems(response.data || [])
      
      if (append) {
        setFeedItems(prev => [...prev, ...enhancedItems])
      } else {
        setFeedItems(enhancedItems)
      }

      // Check if there are more items
      setHasMore(enhancedItems.length === 10)
      
    } catch (err) {
      console.error('Failed to load feed items:', err)
      setFeedError('Failed to load feed items')
    } finally {
      setFeedLoading(false)
    }
  }

  // Trigger curation
  const triggerCuration = async () => {
    if (!currentUser || !profile) return

    setTriggering(true)
    try {
      const response = await curateUserFeed(currentUser.id)
      console.log('Curation response:', response)
      
      // Update profile with the returned data
      if (response?.profile) {
        console.log('Updating profile with:', response.profile)
        setProfile(response.profile)
      } else {
        console.log('No profile data in response, fetching fresh data')
        // Fallback to fetching fresh profile data
        const { data: freshProfile } = await supabase.getUserProfile(currentUser.id)
        if (freshProfile) {
          setProfile(freshProfile)
        }
      }
      
      // Reload feed items from beginning
      await loadFeedItems(0, false)
      setPage(0)
      analytics.track('Curation Triggered')
    } catch (err) {
      console.error('Failed to trigger curation:', err)
      setFeedError(err instanceof Error ? err.message : 'Failed to trigger curation')
    } finally {
      setTriggering(false)
    }
  }

  // Load more items for infinite scroll
  const loadMore = async () => {
    if (feedLoading || !hasMore) return
    
    const nextPage = page + 1
    setPage(nextPage)
    await loadFeedItems(nextPage, true)
  }

  // Infinite scroll handler
  useEffect(() => {
    const container = feedContainerRef.current
    if (!container || !isOwnProfile) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !feedLoading) {
        loadMore()
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [hasMore, feedLoading, page, isOwnProfile])

  // Load initial feed items
  useEffect(() => {
    if (isOwnProfile && currentUser && !loading) {
      loadFeedItems()
    }
  }, [isOwnProfile, currentUser, loading])

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        
        {/* Decorative elements */}
        <div className="fixed top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" />
        <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse delay-1000" />
        
        <main className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse">
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm p-8 mb-6">
                  <div className="flex gap-8">
                    <div className="w-48 h-48 bg-muted/50 rounded-lg"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-8 bg-muted/50 rounded w-1/3"></div>
                      <div className="h-4 bg-muted/50 rounded w-1/4"></div>
                      <div className="h-4 bg-muted/50 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        
        {/* Decorative elements */}
        <div className="fixed top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" />
        <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse delay-1000" />
        
        <main className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm p-12">
                <h1 className="text-2xl font-bold text-destructive mb-4">Profile Not Found</h1>
                <p className="text-muted-foreground mb-6">
                  {error || 'The requested profile could not be found.'}
                </p>
                <Button asChild>
                  <Link href="/">Return Home</Link>
                </Button>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    )
  }

  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Member'
  const profileImage = profile.profile_pic || '/placeholder-user.jpg'
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  })

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      {/* Decorative elements */}
      <div className="fixed top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" />
      <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse delay-1000" />
      
      <main className="relative z-10">
        <Navbar />
        
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          <div className="max-w-6xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-4 sm:mb-6">
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground backdrop-blur-sm text-sm sm:text-base">
                <Link href="/">← Back to Home</Link>
              </Button>
            </div>

            {/* Main Profile Section */}
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm mb-4 sm:mb-6 relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
              
              <div className="relative p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                  {/* Profile Image */}
                  <div className="flex-shrink-0 self-center lg:self-start">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-xl overflow-hidden bg-muted/30 shadow-lg border border-border/50 backdrop-blur-sm">
                      <Image
                        src={profileImage}
                        alt={displayName}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-user.jpg'
                        }}
                      />
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0 text-center lg:text-left">
                    <div className="mb-4 sm:mb-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3 sm:mb-4">
                        <div className="mb-3 lg:mb-0">
                          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 font-display break-words">{displayName}</h1>
                          <p className="text-lg sm:text-xl text-muted-foreground mb-3 sm:mb-4">Atelier Logos Member</p>
                        </div>
                        {isOwnProfile && (
                          <div className="flex justify-center lg:justify-end">
                            <NotificationBell showText />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-center lg:justify-start mb-4">
                        <Badge variant="secondary" className="px-3 py-1 bg-muted/50 backdrop-blur-sm border border-border/50 text-xs sm:text-sm">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Member since {memberSince}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="mb-4 sm:mb-6 bg-border/50" />

                    {/* Contact Information */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 font-display">Contact Information</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 p-2 sm:p-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-primary/20 flex-shrink-0">
                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-foreground">Email</p>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">{profile.email}</p>
                          </div>
                        </div>

                        {profile.company && (
                          <div className="flex items-center gap-3 p-2 sm:p-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-border/50 flex-shrink-0">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm font-medium text-foreground">Company</p>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">{profile.company}</p>
                            </div>
                          </div>
                        )}

                        {profile.linkedin_url && (
                          <div className="flex items-center gap-3 p-2 sm:p-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-primary/20 flex-shrink-0">
                              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm font-medium text-foreground">LinkedIn</p>
                              <Link 
                                href={profile.linkedin_url} 
                                target="_blank"
                                className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors truncate block"
                              >
                                View Profile →
                              </Link>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3 p-2 sm:p-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-border/50 flex-shrink-0">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-foreground">Member ID</p>
                            <p className="text-xs sm:text-sm text-muted-foreground font-mono">{profile.id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Chat Component */}
              {isOwnProfile && (
                <div className="order-2 xl:order-1">
                  <ChatComponent />
                </div>
              )}

              {/* Curated Content with Feed */}
              <Card className={cn(
                "bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm relative overflow-hidden",
                isOwnProfile ? "order-1 xl:order-2" : "col-span-full"
              )}>
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
                
                <CardContent className="relative p-4 sm:p-6">
                  {/* Header Section */}
                  <div className="mb-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg sm:text-xl font-semibold text-foreground font-display flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          Curated Content
                        </h3>
                        {isOwnProfile && (
                          <Button
                            onClick={() => loadFeedItems(0, false)}
                            disabled={feedLoading}
                            size="sm"
                            variant="ghost"
                            className="gap-2 hover:bg-background/50 backdrop-blur-sm text-muted-foreground hover:text-foreground"
                            title="Refresh your existing feed (doesn't use a curation)"
                          >
                            <RefreshCw className={`h-4 w-4 ${feedLoading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                          </Button>
                        )}
                      </div>
                      
                      {/* Status and Controls Row */}
                      {isOwnProfile && (
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                          <div className="flex items-center gap-3">
                            {profile?.customer ? (
                              <Badge 
                                variant="default" 
                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium"
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Pro Member - Unlimited Curations
                              </Badge>
                            ) : (
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant="outline" 
                                  className="px-3 py-1.5 border-border/50 bg-background/50 backdrop-blur-sm flex items-center gap-2 text-sm"
                                >
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  <span className="font-medium text-foreground">{profile?.curations}</span>
                                  <span className="text-muted-foreground">curations remaining</span>
                                </Badge>
                                {profile?.curations <= 0 && (
                                  <Badge variant="destructive" className="px-3 py-1.5 text-sm">
                                    No curations left
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={triggerCuration}
                              disabled={triggering || (!profile?.customer && profile?.curations <= 0)}
                              size="sm"
                              variant="default"
                              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium px-4 py-2"
                            >
                              {triggering ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Curating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  {profile?.customer ? 'Curate New' : 'Use Curation'}
                                </>
                              )}
                            </Button>
                            
                            {!profile?.customer && profile?.curations <= 0 && (
                              <Button 
                                asChild
                                size="sm"
                                variant="outline"
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 font-medium px-4 py-2"
                              >
                                <Link href="https://buy.stripe.com/aFa3cvbcw69We9nfG218c01" target="_blank">
                                  Upgrade to Pro
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feed Content */}
                  {isOwnProfile ? (
                    <div className="space-y-4">
                      {feedError ? (
                        <div className="text-center py-8 px-6 bg-muted/30 backdrop-blur-sm rounded-lg border border-border/50">
                          {feedError.includes('No curations remaining') ? (
                            <div className="space-y-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
                                <Sparkles className="h-8 w-8 text-indigo-500" />
                              </div>
                              <div>
                                <h4 className="text-xl font-semibold text-foreground mb-2 font-display">Unlock Unlimited Curations</h4>
                                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                                  You've used all your free curations. Upgrade to Pro for unlimited AI-powered content curation tailored to your interests.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                  <Button 
                                    asChild
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium px-6"
                                  >
                                    <Link href="https://buy.stripe.com/aFa3cvbcw69We9nfG218c01" target="_blank">
                                      <Sparkles className="h-4 w-4 mr-2" />
                                      Upgrade to Pro
                                    </Link>
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => loadFeedItems(0, false)}
                                    className="bg-background/50 backdrop-blur-sm border-border/50"
                                  >
                                    View Existing Content
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                                <ExternalLink className="h-6 w-6 text-destructive" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h4>
                                <p className="text-destructive text-sm mb-4">{feedError}</p>
                                <Button 
                                  onClick={() => loadFeedItems(0, false)} 
                                  variant="outline" 
                                  size="sm"
                                  className="bg-background/50 backdrop-blur-sm border-border/50"
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Try Again
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}

                      {feedItems.length === 0 && !feedLoading && !feedError ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50">
                            <Sparkles className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h4 className="text-lg font-semibold text-foreground mb-2 font-display">No content yet</h4>
                          <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
                            Start curating personalized content based on your interests and preferences.
                          </p>
                          {profile && !profile.customer && profile.curations > 0 && (
                            <div className="space-y-3">
                              <p className="text-xs text-muted-foreground/70 bg-muted/30 px-3 py-2 rounded-lg inline-block">
                                💡 You have {profile.curations} free curation{profile.curations !== 1 ? 's' : ''} remaining
                              </p>
                              <Button
                                onClick={triggerCuration}
                                disabled={triggering}
                                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
                              >
                                {triggering ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Curating...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Get Started
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Your curated articles</span>
                            <span>{feedItems.length} item{feedItems.length !== 1 ? 's' : ''}</span>
                          </div>
                          <div 
                            ref={feedContainerRef}
                            className="space-y-3 max-h-[600px] overflow-y-auto pr-2 -mr-2 feed-scroll"
                            style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: 'hsl(var(--border)) transparent'
                            }}
                          >
                            {feedItems.map((item) => (
                              <div key={item.id} className="transform hover:scale-[1.02] transition-transform duration-200">
                                <FeedItem item={item} />
                              </div>
                            ))}
                            
                            {feedLoading && (
                              <div className="flex items-center justify-center py-6 bg-muted/20 rounded-lg border border-dashed border-border/50">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-3" />
                                <span className="text-sm text-muted-foreground">Loading more articles...</span>
                              </div>
                            )}
                            
                            {!hasMore && feedItems.length > 0 && (
                              <div className="text-center py-4 border-t border-border/50">
                                <p className="text-xs text-muted-foreground/70">✨ You've reached the end</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    !profile.curation_prompt && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h4 className="text-lg font-semibold text-foreground mb-2 font-display">Private Content</h4>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                          This member's curated content is private and not visible to other users.
                        </p>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  )
}
