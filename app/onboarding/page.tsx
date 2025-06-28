'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Loader2 } from 'lucide-react'
import { useAnalytics } from '@/hooks/use-analytics'

interface SubscriberData {
  first_name: string
  last_name: string
  email: string
  linkedin_url: string
  company: string
  profile_pic: File | null
  profile_pic_url?: string
  curation_prompt: string
}

export default function OnboardingPage() {
  const [subscriberData, setSubscriberData] = useState<SubscriberData>({
    first_name: '',
    last_name: '',
    email: '',
    linkedin_url: '',
    company: '',
    profile_pic: null,
    profile_pic_url: undefined,
    curation_prompt: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isWaitingForMagicLink, setIsWaitingForMagicLink] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const analytics = useAnalytics()

  useEffect(() => {
    // Check if user is already logged in
    analytics.page('Onboarding Page Viewed')
    const checkUser = async () => {
      console.log('🔍 Onboarding: Checking user authentication')
        const { data: { user } } = await supabase.supabase.auth.getUser()
      
        if (user) {
        console.log('👤 Onboarding: Found authenticated user:', user.id)
        setIsAuthenticated(true)
        setUserId(user.id)
        setSubscriberData(prev => ({ ...prev, email: user.email || '' }))

        // Check if user already has a profile
        console.log('🔍 Onboarding: Checking subscriber profile for user:', user.id)
        const { data: subscribers, error } = await supabase.supabase
          .from('subscribers')
          .select('id')
          .eq('id', user.id)

        if (error) {
          console.error('❌ Onboarding: Error checking subscriber:', error)
        } else {
          console.log('📊 Onboarding: Query result:', { subscribers, error })
          const hasProfile = subscribers && subscribers.length > 0
          if (hasProfile) {
            console.log('📋 Onboarding: User has profile:', subscribers[0])
            router.push('/')
          } else {
            console.log('📝 Onboarding: No profile found. Query returned empty array')
          }
        }
      } else {
        console.log('⚠️ Onboarding: No authenticated user')
        setIsAuthenticated(false)
        setUserId(null)
        }
    }
    checkUser()
  }, [router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSubscriberData(prev => ({ ...prev, profile_pic: file }))
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setSubscriberData(prev => ({ ...prev, profile_pic_url: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.supabase.auth.signInWithOtp({
        email: subscriberData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      setIsWaitingForMagicLink(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link.')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!userId) {
        throw new Error('No authenticated user found')
      }

      const { error } = await supabase.supabase.from('subscribers').insert({
        id: userId,
        first_name: subscriberData.first_name,
        last_name: subscriberData.last_name,
        email: subscriberData.email,
        linkedin_url: subscriberData.linkedin_url,
        company: subscriberData.company,
        profile_pic: subscriberData.profile_pic_url || null,
        curation_prompt: subscriberData.curation_prompt
      })

      if (error) {
        throw new Error(error.message)
      }

      // Redirect to home after successful profile creation
      router.push('/')
      useAnalytics().track('Profile Created')
    } catch (err: any) {
      setError(err.message || 'Failed to create subscriber profile.')
      setLoading(false)
    }
  }

  if (isWaitingForMagicLink) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex-grow">
            <div className="max-w-md mx-auto text-center p-8 bg-card rounded-lg shadow-md border">
                <div className="text-5xl mb-4">📧</div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Check Your Email</h2>
                <p className="text-muted-foreground mb-6">
              We sent a magic link to <strong className="text-foreground">{subscriberData.email}</strong>.<br />
              Click the link in your email to continue.
                </p>
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex-grow">
          <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-md border">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome!</h1>
              <p className="text-muted-foreground">First, let's get you signed in.</p>
            </div>

            <form onSubmit={handleAuthentication} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-foreground">Email <span className="text-destructive">*</span></Label>
                <input 
                  id="email" 
                  type="email" 
                  required 
                  value={subscriberData.email} 
                  onChange={(e) => setSubscriberData(prev => ({ ...prev, email: e.target.value }))} 
                  className="w-full mt-1 p-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent" 
                />
              </div>

              {error && (
                <div className="text-destructive text-sm">{error}</div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Magic Link...
                  </>
                ) : (
                  'Continue with Email'
                )}
              </Button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-md border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Profile</h1>
            <p className="text-muted-foreground">Join our curated content network. Let's get you set up.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                <input 
                  id="firstName" 
                  type="text" 
                  maxLength={50} 
                  value={subscriberData.first_name} 
                  onChange={(e) => setSubscriberData(prev => ({ ...prev, first_name: e.target.value }))} 
                  className="w-full mt-1 p-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent" 
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                <input 
                  id="lastName" 
                  type="text" 
                  maxLength={50} 
                  value={subscriberData.last_name} 
                  onChange={(e) => setSubscriberData(prev => ({ ...prev, last_name: e.target.value }))} 
                  className="w-full mt-1 p-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent" 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="linkedin" className="text-foreground">LinkedIn URL</Label>
              <input 
                id="linkedin" 
                type="url" 
                value={subscriberData.linkedin_url} 
                onChange={(e) => setSubscriberData(prev => ({ ...prev, linkedin_url: e.target.value }))} 
                className="w-full mt-1 p-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent" 
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            
            <div>
              <Label htmlFor="company" className="text-foreground">Company</Label>
              <input 
                id="company" 
                type="text" 
                value={subscriberData.company} 
                onChange={(e) => setSubscriberData(prev => ({ ...prev, company: e.target.value }))} 
                className="w-full mt-1 p-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            
            <div>
              <Label htmlFor="curationPrompt" className="text-foreground">What content would you like us to curate for you?</Label>
              <textarea 
                id="curationPrompt" 
                value={subscriberData.curation_prompt} 
                onChange={(e) => setSubscriberData(prev => ({ ...prev, curation_prompt: e.target.value }))} 
                className="w-full mt-1 p-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                rows={4}
                placeholder="E.g., Latest news and insights about AI and machine learning, focusing on practical applications in business"
              />
            </div>
            
            <div>
              <Label htmlFor="profilePic" className="text-foreground">Profile Picture</Label>
              <input 
                id="profilePic" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="w-full mt-1 p-3 bg-background border border-border rounded-lg text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 focus:ring-2 focus:ring-ring focus:border-transparent" 
              />
              {subscriberData.profile_pic_url && (
                <div className="mt-2">
                  <img 
                    src={subscriberData.profile_pic_url} 
                    alt="Profile preview" 
                    className="w-20 h-20 object-cover rounded-full border-2 border-border" 
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="text-destructive text-sm">{error}</div>
            )}
            
            <Button
              type="submit"
              disabled={loading} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Create Profile'
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
