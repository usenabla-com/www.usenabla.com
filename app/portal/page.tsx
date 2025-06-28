'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import supabase, { UserProfile, Feed, Post, Portal } from '@/lib/supabase'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'
import { 
  Home, 
  MessageCircle, 
  Store, 
  HandHeart, 
  Users, 
  Bell,
  Search,
  Plus,
  MoreVertical,
  Heart,
  MessageSquare,
  Share2,
  DollarSign,
  Package,
  Clock,
  Hash,
  X,
  Globe,
  Lock,
  Eye,
  UserPlus,
  ArrowLeft,
  Send,
  RadioTower,
  BaggageClaim,
  Book,
  CreditCard,
  Settings
} from 'lucide-react'

type TabType = 'home' | 'feed' | 'directory' | 'requests'
type FeedViewType = 'feeds' | 'posts'

interface Comment {
  id: string
  author: string
  authorId: string
  content: string
  timestamp: string
}

interface CreateFeedData {
  name: string
  description: string
  nsfw: boolean
  public: boolean
}

interface CreateRequestData {
  memo: string
  currency: string
  amount: number
  handle: string
}

function CreateFeedModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading 
}: { 
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateFeedData) => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState<CreateFeedData>({
    name: '',
    description: '',
    nsfw: false,
    public: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() && formData.description.trim()) {
      onSubmit(formData)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', description: '', nsfw: false, public: true })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Feed</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feed Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              placeholder="e.g., General Discussion"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent resize-none"
              rows={3}
              placeholder="Describe what this feed is about..."
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="public"
                checked={formData.public}
                onChange={(e) => setFormData(prev => ({ ...prev, public: e.target.checked }))}
                className="h-4 w-4 text-gray-600 focus:ring-gray-300 border-gray-300 rounded"
              />
              <label htmlFor="public" className="text-sm text-gray-700">
                Public feed
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="nsfw"
                checked={formData.nsfw}
                onChange={(e) => setFormData(prev => ({ ...prev, nsfw: e.target.checked }))}
                className="h-4 w-4 text-red-600 focus:ring-red-300 border-gray-300 rounded"
              />
              <label htmlFor="nsfw" className="text-sm text-gray-700">
                NSFW
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || !formData.description.trim() || isLoading}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors",
                (!formData.name.trim() || !formData.description.trim() || isLoading)
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800"
              )}
            >
              {isLoading ? 'Creating...' : 'Create Feed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function PortalPage() {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [portal, setPortal] = useState<Portal | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [feedView, setFeedView] = useState<FeedViewType>('feeds')
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null)
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [feedMemberships, setFeedMemberships] = useState<Record<string, boolean>>({})
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [newComment, setNewComment] = useState<{[key: string]: string}>({})
  const [showCreateFeedModal, setShowCreateFeedModal] = useState(false)
  const [createFeedLoading, setCreateFeedLoading] = useState(false)
  const [directoryMembers, setDirectoryMembers] = useState<any[]>([])
  const [directoryLoading, setDirectoryLoading] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false)
  const [createRequestLoading, setCreateRequestLoading] = useState(false)
  const [handles, setHandles] = useState<any[]>([])
  const [memberCount, setMemberCount] = useState<number>(0)

  const portalId = searchParams?.get('portalId')

  useEffect(() => {
    async function loadUserData() {
      try {
        if (!portalId) {
          setLoading(false)
          return
        }

        const currentUser = await supabase.getCurrentUser()
        setUser(currentUser)
        
        if (currentUser) {
          const { data: profile } = await supabase.getUserProfile()
          setUserProfile(profile)
        }
        
        // Load portal data
        const { data: portalData } = await supabase.getPortalById(portalId)
        setPortal(portalData)
        
        // Load feeds for this portal
        if (portalData) {
          await loadFeeds(portalId)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [portalId])

  useEffect(() => {
    async function loadDirectory() {
      if (!portal) return
      try {
        setDirectoryLoading(true)
        
        // Get all memberships for this portal
        const { data: memberships, error: membershipError } = await supabase.supabase
          .from('memberships')
          .select('users')
          .eq('portal', portal.id)

        if (membershipError) throw membershipError
        
        const memberIds = memberships?.map(m => m.users) || []
        if (memberIds.length === 0) {
          setDirectoryMembers([])
          return
        }

        // Fetch users profiles
        const { data: profilesData, error: profilesError } = await supabase.supabase
          .from('users')
          .select('id, handle, profile_pic, first_name, last_name, headline, status')
          .in('id', memberIds)

        if (profilesError) throw profilesError

        // Fetch balances for these members in this portal
        const { data: balancesData, error: balancesError } = await supabase.supabase
          .from('balances')
          .select('user, balance, denomination')
          .eq('portal', portal.id)
          .in('user', memberIds)

        if (balancesError) throw balancesError

        const balanceMap: Record<string, { balance: number, denomination: string }> = {}
        if (balancesData) {
          for (const b of balancesData) {
            balanceMap[b.user] = {
              balance: b.balance ?? 0,
              denomination: b.denomination ?? ''
            }
          }
        }

        const combined = (profilesData || []).map((p) => ({
          id: p.id,
          first_name: p.first_name,
          last_name: p.last_name,
          profile_pic: p.profile_pic,
          headline: p.headline ?? '',
          status: p.status ?? 'offline',
          balance: balanceMap[p.id]?.balance ?? 0,
          denomination: balanceMap[p.id]?.denomination ?? ''
        }))

        setDirectoryMembers(combined)
      } catch (err) {
        console.error('Error loading directory:', err)
      } finally {
        setDirectoryLoading(false)
      }
    }

    if (portal) {
      loadDirectory()
    }
  }, [portal])

  useEffect(() => {
    async function loadRequests() {
      if (!portal) return
      try {
        setRequestsLoading(true)
        const { data: requestsData, error } = await supabase.supabase
          .from('requests')
          .select('*')
          .eq('portal', portal.id)
          .order('created_at', { ascending: false })
        if (error) throw error
        setRequests(requestsData || [])
      } catch (err) {
        console.error('Error loading requests:', err)
      } finally {
        setRequestsLoading(false)
      }
    }

    async function loadHandles() {
      if (!portal || !user) return
      try {
        const { data, error } = await supabase.supabase
          .from('handles')
          .select('*')
          .eq('portal', portal.id)
          .eq('user', user.id)
        if (error) throw error
        setHandles(data || [])
      } catch (err) {
        console.error('Error loading handles:', err)
      }
    }

    if (portal) {
      loadRequests()
      loadHandles()
    }
  }, [portal, user])

  useEffect(() => {
    async function loadMemberCount() {
      if (!portal) return
      try {
        const { data: memberships, error } = await supabase.supabase
          .from('memberships')
          .select('id', { count: 'exact' })
          .eq('portal', portal.id)

        if (error) throw error
        setMemberCount(memberships?.length || 0)
      } catch (err) {
        console.error('Error loading member count:', err)
      }
    }

    if (portal) {
      loadMemberCount()
    }
  }, [portal])

  useEffect(() => {
    async function loadFeedMemberships() {
      if (!user || !feeds.length) return
      try {
        const { data: memberships } = await supabase.supabase
          .from('feed_memberships')
          .select('feed_id')
          .eq('user_id', user.id)

        const membershipMap: Record<string, boolean> = {}
        if (memberships) {
          memberships.forEach(m => {
            membershipMap[m.feed_id] = true
          })
        }
        setFeedMemberships(membershipMap)
      } catch (err) {
        console.error('Error loading feed memberships:', err)
      }
    }

    if (user && feeds.length > 0) {
      loadFeedMemberships()
    }
  }, [user, feeds])

  const loadFeeds = async (portalId: string) => {
    try {
      const { data: feedsData } = await supabase.getFeedsByPortal(portalId)
      setFeeds(feedsData || [])
    } catch (error) {
      console.error('Error loading feeds:', error)
    }
  }

  const handleCreateFeed = async (feedData: CreateFeedData) => {
    if (!portalId) return
    
    setCreateFeedLoading(true)
    try {
      const { data, error } = await supabase.createFeed({
        ...feedData,
        profile_pic: null,
        portal_id: portalId
      })

      if (error) {
        console.error('Error creating feed:', error)
        return
      }

      if (data) {
        setFeeds(prev => [data, ...prev])
        setShowCreateFeedModal(false)
      }
    } catch (error) {
      console.error('Error creating feed:', error)
    } finally {
      setCreateFeedLoading(false)
    }
  }

  const handleSelectFeed = async (feed: Feed) => {
    setSelectedFeed(feed)
    setFeedView('posts')
    
    try {
      const { data: postsData } = await supabase.getPostsByFeed(feed.id)
      setPosts(postsData || [])
    } catch (error) {
      console.error('Error loading posts:', error)
      setPosts([])
    }
  }

  const handleBackToFeeds = () => {
    setFeedView('feeds')
    setSelectedFeed(null)
    setPosts([])
  }

  const handleCreatePost = async () => {
    if (!newPost.trim() || !userProfile || !selectedFeed || !user) return

    try {
      const { data, error } = await supabase.createPost({
        poster: user.id,
        content: newPost.trim(),
        mentions: [],
        comments: [],
        reactions: {},
        attachments: null,
        feed: selectedFeed.id
      })

      if (error) {
        console.error('Error creating post:', error)
        return
      }

      if (data) {
        // Add poster name for display
        const enrichedPost = {
          ...data,
          posterName: `${userProfile.first_name} ${userProfile.last_name}`
        }
        setPosts(prev => [enrichedPost, ...prev])
        setNewPost('')
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleAddComment = async (postId: string) => {
    const commentText = newComment[postId]
    if (!commentText?.trim()) return

    try {
      const { data, error } = await supabase.addComment(postId, commentText.trim())

      if (error) {
        console.error('Error adding comment:', error)
        return
      }

      if (data) {
        setPosts(prev => prev.map(post => 
          post.id === postId ? data : post
        ))
        setNewComment(prev => ({ ...prev, [postId]: '' }))
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleLikePost = async (postId: string) => {
    try {
      const { data, error } = await supabase.addReaction(postId, 'likes')

      if (error) {
        console.error('Error adding reaction:', error)
        return
      }

      if (data) {
        setPosts(prev => prev.map(post => 
          post.id === postId ? data : post
        ))
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  const handleJoinFeed = async (feedId: string) => {
    try {
      const { data, error } = await supabase.joinFeed(feedId)

      if (error) {
        console.error('Error joining feed:', error)
        return
      }

      if (data) {
        setFeeds(prev => prev.map(feed => 
          feed.id === feedId ? data : feed
        ))
      }
    } catch (error) {
      console.error('Error joining feed:', error)
    }
  }

  const handleCreateRequest = async (requestData: CreateRequestData) => {
    if (!portal || !user) return
    setCreateRequestLoading(true)
    try {
      const { data, error } = await supabase.supabase
        .from('requests')
        .insert({
          user: user.id,
          amount: requestData.amount,
          currency: requestData.currency,
          memo: requestData.memo,
          status: 'pending',
          portal: portal.id,
          handle: requestData.handle
        })
        .select()
        .single()
      if (error) throw error
      setRequests(prev => [data, ...prev])
      setShowCreateRequestModal(false)
    } catch (err) {
      console.error('Error creating request:', err)
    } finally {
      setCreateRequestLoading(false)
    }
  }

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'feed', label: 'Feed', icon: RadioTower },
    { id: 'directory', label: 'Directory', icon: Book },
    { id: 'requests', label: 'Requests', icon: BaggageClaim },
    { id: 'offers', label: 'Offers', icon: HandHeart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const renderHome = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the {portal?.name} Portal</h1>
        <p className="text-gray-600 mb-6">Your community hub for mutual aid, marketplace, and connections</p>
        
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
            onClick={() => setActiveTab('feed')}
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all text-center"
        >
            <MessageCircle className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Community Feed</div>
        </button>
        <button 
            onClick={() => setActiveTab('directory')}
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all text-center"
        >
            <Store className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">user Directory</div>
        </button>
          <div className="p-4 border border-gray-200 rounded-lg text-center">
            <Users className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">{memberCount} Members</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          {feeds.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No community activity yet. Be the first to create a feed!</p>
          ) : (
            <div className="space-y-4">
              {feeds.slice(0, 3).map((feed) => (
                <div key={feed.id} className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Hash className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{feed.name}</p>
                    <p className="text-sm text-gray-600">{feed.member_count} members • {feed.posts.length} posts</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderFeedsList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Feeds</h2>
          <p className="text-gray-600">Discover and join conversations in {portal?.name}</p>
        </div>
        <button 
          onClick={() => setShowCreateFeedModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Feed</span>
        </button>
      </div>
      
      {feeds.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Feeds Yet</h3>
          <p className="text-gray-600 mb-6">Be the first to create a community feed for {portal?.name}</p>
          <button 
            onClick={() => setShowCreateFeedModal(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create First Feed
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {feeds.map((feed) => {
            const isCreator = feed.creator === user?.id
            return (
              <div key={feed.id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer" onClick={() => handleSelectFeed(feed)}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        {feed.profile_pic ? (
                          <img src={feed.profile_pic} alt={feed.name} className="h-12 w-12 rounded-lg object-cover" />
                        ) : (
                          <Hash className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{feed.name}</h3>
                          {feed.public ? (
                            <Globe className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                          {feed.nsfw && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">NSFW</span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{feed.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{feed.member_count} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{feed.online} online</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{feed.posts.length} posts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleJoinFeed(feed.id)
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <UserPlus className="h-4 w-4 inline mr-2" />
                      {feedMemberships[feed.id] ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderPostsView = () => {
    if (!selectedFeed) return null

    return (
    <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleBackToFeeds}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedFeed.name}</h2>
            <p className="text-gray-600">{selectedFeed.description}</p>
      </div>
      </div>

        {/* Create Post */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={`Share something with ${selectedFeed.name}...`}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Lock className="h-4 w-4" />
                  <span>End-to-end encrypted</span>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    newPost.trim()
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Send className="h-4 w-4 inline mr-2" />
                  Post
                </button>
              </div>
            </div>
          </div>
      </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Yet</h3>
            <p className="text-gray-600">Be the first to start a conversation in {selectedFeed.name}</p>
    </div>
        ) : (
    <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg border border-gray-200">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {(post as any).posterName ? (post as any).posterName.split(' ').map((n: string) => n[0]).join('') : 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {(post as any).posterName || 'Anonymous'}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                        {(post as any).isEncrypted !== false && (
                          <>
                            <span className="text-gray-500">•</span>
                            <div className="flex items-center space-x-1">
                              <Lock className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-600">Encrypted</span>
                            </div>
                          </>
                        )}
      </div>
                      <p className="text-gray-900 mb-4">{post.content}</p>
                      
                      {/* Reactions */}
                      <div className="flex items-center space-x-6 mb-4">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{post.reactions?.likes || 0}</span>
                        </button>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <MessageSquare className="h-4 w-4" />
                          <span className="text-sm">{post.comments?.length || 0}</span>
              </div>
            </div>
            
                      {/* Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="space-y-3 mb-4">
                  {post.comments.map((comment: any) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {comment.author?.split(' ').map((n: string) => n[0]).join('') || 'A'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
              </div>
            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment */}
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
                          </span>
              </div>
                        <div className="flex-1 flex items-center space-x-2">
                          <input
                            type="text"
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Add a comment..."
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-sm"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id)
                              }
                            }}
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComment[post.id]?.trim()}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              newComment[post.id]?.trim()
                                ? "bg-gray-900 text-white hover:bg-gray-800"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            )}
                          >
                            <Send className="h-3 w-3" />
              </button>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
          </div>
        ))}
          </div>
        )}
      </div>
    )
  }

  const renderFeed = () => {
    if (feedView === 'posts') {
      return renderPostsView()
    }
    return renderFeedsList()
  }

    const renderDMs = () => (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <HandHeart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Messages Coming Soon</h3>
        <p className="text-gray-600">Send private, encrypted messages to community members</p>
      </div>
    )

  const renderDirectory = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Member Directory</h2>
        <p className="text-gray-600">All users in {portal?.name}</p>
      </div>
      {directoryLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading members...</p>
        </div>
      ) : directoryMembers.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Members Found</h3>
          <p className="text-gray-600">Directory will appear once users join this portal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {directoryMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-6 rounded-2xl flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {member.profile_pic ? (
                  <img src={member.profile_pic} alt={member.first_name} className="h-full w-full object-cover" />
                ) : (
                  <span className="h-full w-full flex items-center justify-center text-gray-400 font-semibold text-xl">
                    {member.first_name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate text-lg">{member.first_name} {member.last_name}</p>
                <p className="text-sm text-gray-500 truncate">{member.headline}</p>
                {member.status && (
                  <p className="text-xs text-gray-500 italic truncate mt-1">"{member.status}"</p>
                )}
                <div className="flex items-baseline space-x-1 text-sm text-gray-600 mt-2">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-semibold text-gray-900">{Number(member.balance).toLocaleString()}</span>
                  <span className="text-xs">{member.denomination}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Aid Requests</h2>
          <p className="text-gray-600">All open and fulfilled requests in {portal?.name}</p>
        </div>
        <button
          onClick={() => setShowCreateRequestModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Request
        </button>
      </div>

      {requestsLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <BaggageClaim className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requests Yet</h3>
          <p className="text-gray-600">Be the first to request aid.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div>
                <p className="font-medium text-gray-900">{req.memo}</p>
                <p className="text-sm text-gray-500">Requested on {new Date(req.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-baseline gap-1 text-gray-900 font-semibold">
                {Number(req.amount).toLocaleString()} {req.currency}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHome()
      case 'feed':
        return renderFeed()
      case 'directory':
        return renderDirectory()
      case 'requests':
        return renderRequests()
      default:
        return renderHome()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading portal...</p>
            </div>
          </div>
    )
  }

  if (!portalId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Portal Not Found</h1>
          <p className="text-gray-600">Please provide a valid portal ID to access this portal.</p>
        </div>
      </div>
    )
  }

  if (!portal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Portal Not Found</h1>
          <p className="text-gray-600">The requested portal could not be found.</p>
            </div>
          </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">{portal?.name} Portal</h1>
            <p className="text-sm text-gray-600 mt-1">
              {userProfile ? `Welcome, ${userProfile.first_name}` : 'Community Hub'}
                    </p>
                  </div>
            
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                  <button
                      onClick={() => {
                        setActiveTab(item.id as TabType)
                        if (item.id === 'feed') {
                          setFeedView('feeds')
                          setSelectedFeed(null)
                        }
                      }}
                    className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                      activeTab === item.id
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                  </button>
                  </li>
                )
              })}
            </ul>
            </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
      
      {/* Create Feed Modal */}
      <CreateFeedModal
        isOpen={showCreateFeedModal}
        onClose={() => setShowCreateFeedModal(false)}
        onSubmit={handleCreateFeed}
        isLoading={createFeedLoading}
      />

      <CreateRequestModal
        isOpen={showCreateRequestModal}
        onClose={() => setShowCreateRequestModal(false)}
        onSubmit={handleCreateRequest}
        isLoading={createRequestLoading}
        handles={handles}
      />
    </div>
  )
}

const currencyOptions = ['USD','EUR','GBP','CAD']

function CreateRequestModal({ isOpen, onClose, onSubmit, isLoading, handles }: { isOpen: boolean, onClose: () => void, onSubmit: (data: CreateRequestData) => void, isLoading: boolean, handles: any[] }) {
  const [formData, setFormData] = useState<CreateRequestData>({ memo: '', currency: 'USD', amount: 0, handle: '' })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (!formData.memo.trim() || !formData.amount || !formData.handle) return
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({ memo: '', currency: 'USD', amount: 0, handle: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create Request</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Memo</label>
            <textarea
              value={formData.memo}
              onChange={e=>setFormData(prev=>({...prev,memo:e.target.value}))}
              className="w-full border bg-gray-100 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              rows={3}
              placeholder="What is this request for?"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Currency</label>
              <select
                value={formData.currency}
                onChange={e=>setFormData(prev=>({...prev,currency:e.target.value}))}
                className="w-full border bg-gray-100 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                {currencyOptions.map(cur=>(<option key={cur} value={cur}>{cur}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={e=>setFormData(prev=>({...prev,amount:parseFloat(e.target.value)}))}
                className="w-full border bg-gray-100 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Handle</label>
            <select
              value={formData.handle}
              onChange={e=>setFormData(prev=>({...prev,handle:e.target.value}))}
              className="w-full border bg-gray-100 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            >
              <option value="" disabled>Select handle</option>
              {handles.map(h=>(<option key={h.id} value={h.id}>{h.method}: {h.handle}</option>))}
            </select>
          </div>
          <div className="flex items-center space-x-3 pt-4">
            <button type="button" onClick={handleClose} className="flex-1 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-800">{isLoading?'Creating...':'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  )
} 