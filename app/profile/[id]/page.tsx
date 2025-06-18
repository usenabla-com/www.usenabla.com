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
      
      // Update profile with the returned data
      if (response?.profile) {
        setProfile(response.profile)
      }
      
      // Reload feed items from beginning
      await loadFeedItems(0, false)
      setPage(0)
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

  const downloadMembershipCard = async () => {
    if (!cardRef.current || !profile) return

    try {
      // Import html2canvas dynamically to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false
      })
      
      const link = document.createElement('a')
      link.download = `atelier-logos-membership-${profile.first_name}-${profile.last_name}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Error downloading card:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                <div className="flex gap-8">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Profile Not Found</h1>
              <p className="text-gray-600 mb-6">
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
    )
  }

  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Member'
  const profileImage = profile.profile_pic || '/placeholder-user.jpg'
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
              <Link href="/">← Back to Home</Link>
            </Button>
          </div>

          {/* Main Profile Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-gray-100 shadow-md">
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
                <div className="flex-1 min-w-0">
                  <div className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{displayName}</h1>
                    <p className="text-xl text-gray-600 mb-4">Atelier Logos Member</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary" className="px-3 py-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Member since {memberSince}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email</p>
                          <p className="text-sm text-gray-600">{profile.email}</p>
                        </div>
                      </div>

                      {profile.company && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Building className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Company</p>
                            <p className="text-sm text-gray-600">{profile.company}</p>
                          </div>
                        </div>
                      )}

                      {profile.linkedin_url && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Globe className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">LinkedIn</p>
                            <Link 
                              href={profile.linkedin_url} 
                              target="_blank"
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              View Profile →
                            </Link>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Member ID</p>
                          <p className="text-sm text-gray-600 font-mono">{profile.id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Membership Card */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Digital Membership Card</h3>
                  <Button 
                    onClick={downloadMembershipCard}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>

                {/* Membership Card Design */}
                <div 
                  ref={cardRef}
                  className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl w-64 h-96 mx-auto"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-4 translate-x-4"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-full blur-2xl translate-y-4 -translate-x-4"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                  </div>

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

                  {/* Card content */}
                  <div className="relative z-10 p-5 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm p-1">
                          <Image
                            src="/logo.png"
                            alt="Atelier Logos"
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="text-white font-bold text-lg">ATELIER</div>
                          <div className="text-white/60 text-xs tracking-wider">LOGOS</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/80 text-xs mb-1">VALID THRU</div>
                        <div className="text-white font-semibold text-sm">
                          {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Profile Photo */}
                    <div className="flex justify-center mb-5">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                        <Image
                          src={profileImage}
                          alt={displayName}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder-user.jpg'
                          }}
                        />
                      </div>
                    </div>

                    {/* Member Information */}
                    <div className="text-center mb-8 flex-1">
                      <div className="text-white font-bold text-lg mb-1 leading-tight">{displayName}</div>
                      <div className="text-white/70 text-xs mb-2 px-2 truncate">{profile.email}</div>
                      {profile.company && (
                        <div className="flex items-center justify-center gap-1 mb-4">
                          <Building className="h-3 w-3 text-white/60" />
                          <span className="text-white/60 text-xs truncate">{profile.company}</span>
                        </div>
                      )}
                      
                      {/* Member details in compact format */}
                      <div className="grid grid-cols-2 gap-4 text-xs px-2">
                        <div className="text-center">
                          <div className="text-white/40 text-xs mb-1">MEMBER ID</div>
                          <div className="text-white font-mono text-xs tracking-wider">
                            {profile.id.slice(-8).toUpperCase()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-white/40 text-xs mb-1">SINCE</div>
                          <div className="text-white text-xs">{memberSince}</div>
                        </div>
                      </div>
                    </div>

                    {/* Security strip */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs text-white/30 border-t border-white/10 pt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs">ACTIVE</span>
                        </div>
                        <div className="font-mono text-xs">
                          {profile.id.slice(0, 4).toUpperCase()}
                        </div>
                        <div className="text-xs">
                          ATELIER-LOGOS.COM
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Holographic effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50 pointer-events-none"></div>

                  {/* Subtle border glow */}
                  <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none"></div>
                </div>

                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Official Atelier Logos Membership
                  </p>
                  <p className="text-xs text-gray-600">
                    Present this digital card to access member benefits, community events, and exclusive resources.
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-600">Scan for verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Valid membership</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Curated Content with Feed */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Curated Content</h3>
                    {isOwnProfile && profile && !profile.customer && (
                      <p className="text-sm text-gray-600 mt-1">
                        {profile.curations} curation{profile.curations !== 1 ? 's' : ''} remaining
                      </p>
                    )}
                  </div>
                  {isOwnProfile && (
                    <div className="flex items-center gap-3">
                      {profile?.customer ? (
                        <Badge variant="default" className="bg-gradient-to-r from-indigo-500 to-purple-500">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Pro Member
                        </Badge>
                      ) : (
                        <>
                          <Badge variant="outline" className="border-gray-200">
                            <span className="text-gray-600">
                              {profile?.curations} curation{profile?.curations !== 1 ? 's' : ''} left
                            </span>
                          </Badge>
                          <Link 
                            href="https://buy.stripe.com/aFa3cvbcw69We9nfG218c01"
                            target="_blank"
                            className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                          >
                            Upgrade to Pro →
                          </Link>
                        </>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={triggerCuration}
                          disabled={triggering || (!profile?.customer && profile?.curations <= 0)}
                          size="sm"
                          variant="default"
                          className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                        >
                          {triggering ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                          {triggering ? 'Curating...' : 'Curate New'}
                        </Button>
                        <Button
                          onClick={() => loadFeedItems(0, false)}
                          disabled={feedLoading}
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          title="Refresh your existing feed (doesn't use a curation)"
                        >
                          <RefreshCw className={`h-4 w-4 ${feedLoading ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Feed Content */}
                {isOwnProfile ? (
                  <div className="space-y-4">
                    {feedError ? (
                      <div className="text-center py-6 px-4 bg-gray-50 rounded-lg">
                        {feedError.includes('No curations remaining') ? (
                          <>
                            <div className="mb-4">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="h-6 w-6 text-purple-600" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">Upgrade to Pro</h4>
                              <p className="text-gray-600 text-sm mb-4">
                                You've used all your free curations. Upgrade to Pro for unlimited content curation.
                              </p>
                              <Button 
                                asChild
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                              >
                                <Link href="https://buy.stripe.com/aFa3cvbcw69We9nfG218c01" target="_blank">
                                  Upgrade Now
                                </Link>
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-red-500 text-sm mb-2">{feedError}</div>
                            <Button onClick={() => loadFeedItems(0, false)} variant="outline" size="sm">
                              Try Again
                            </Button>
                          </>
                        )}
                      </div>
                    ) : null}

                    {feedItems.length === 0 && !feedLoading && !feedError ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm mb-2">
                          No curated content yet.
                        </p>
                        {profile && !profile.customer && profile.curations > 0 && (
                          <p className="text-xs text-gray-400">
                            You have {profile.curations} free curation{profile.curations !== 1 ? 's' : ''} remaining.
                            Click "Curate New" to discover relevant articles.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div 
                        ref={feedContainerRef}
                        className="space-y-2 max-h-[500px] overflow-y-auto pr-1 -mr-1 feed-scroll"
                      >
                        {feedItems.map((item) => (
                          <div key={item.id} className="transform scale-95">
                            <FeedItem item={item} />
                          </div>
                        ))}
                        
                        {feedLoading && (
                          <div className="flex items-center justify-center py-3">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">Loading more...</span>
                          </div>
                        )}
                        
                        {!hasMore && feedItems.length > 0 && (
                          <div className="text-center py-3">
                            <p className="text-xs text-gray-400">No more items to load</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  !profile.curation_prompt && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">
                        This member hasn't set up content curation yet.
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
  )
}
