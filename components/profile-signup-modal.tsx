'use client'

import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase/client'
import { X } from 'lucide-react'

interface UserData {
  firstName: string
  lastName: string
  email: string
  company: string
  linkedin: string
  curationPrompt: string
  profilePic: File | null
  profilePicUrl?: string
}

interface ProfileSignupModalProps {
  isOpen: boolean
  onClose: () => void
  initialUserData?: Partial<UserData>
}

export default function ProfileSignupModal({ isOpen, onClose, initialUserData }: ProfileSignupModalProps) {
  const [step, setStep] = useState<'form' | 'checkEmail' | 'profile' | 'success' | 'error'>('form')
  const [userData, setUserData] = useState<UserData>({
    firstName: initialUserData?.firstName || '',
    lastName: initialUserData?.lastName || '',
    email: initialUserData?.email || '',
    company: initialUserData?.company || '',
    linkedin: initialUserData?.linkedin || '',
    curationPrompt: initialUserData?.curationPrompt || '',
    profilePic: null,
    profilePicUrl: initialUserData?.profilePicUrl
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for authentication changes
  useEffect(() => {
    // Check if user is already authenticated when modal opens
    const checkAuth = async () => {
      const user = await supabase.getCurrentUser()
      if (user && step === 'checkEmail') {
        setIsAuthenticated(true)
        setStep('profile')
      }
    }

    if (isOpen) {
      checkAuth()
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && step === 'checkEmail') {
        setIsAuthenticated(true)
        setStep('profile')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isOpen, step])

  // Close on esc key
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('📧 Sending magic link to:', userData.email)
      
      // Store user data in localStorage so we can retrieve it after auth
      localStorage.setItem('pendingUserData', JSON.stringify(userData))
      
      // Send magic link
      const { data: authData, error: authError } = await supabase.signInWithOTP(userData.email, true)
      
      if (authError) {
        throw new Error('Failed to send authentication email: ' + authError)
      }
      
      console.log('✅ Magic link sent to:', userData.email)
      setStep('checkEmail')
      
    } catch (error: any) {
      console.error('❌ Failed to send magic link:', error)
      setError(error.message)
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProfile = async () => {
    setLoading(true)
    setError('')

    try {
      // Get user data from localStorage if not already in state
      const storedData = localStorage.getItem('pendingUserData')
      let profileUserData = userData
      
      if (storedData) {
        profileUserData = { ...JSON.parse(storedData), ...userData }
        localStorage.removeItem('pendingUserData')
      }

      // Convert profile picture to base64 string for storage
      let profilePicBase64 = null
      if (profileUserData.profilePic) {
        try {
          profilePicBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string)
            reader.onerror = reject
            reader.readAsDataURL(profileUserData.profilePic!)
          })
        } catch (error) {
          console.warn('⚠️ Failed to process profile picture:', error)
        }
      }

      // Create user profile
      const profileData = {
        first_name: profileUserData.firstName || null,
        last_name: profileUserData.lastName || null,
        email: profileUserData.email,
        company: profileUserData.company || null,
        linkedin_url: profileUserData.linkedin || null,
        curation_prompt: profileUserData.curationPrompt,
        profile_pic: profilePicBase64
      }

      console.log('💾 Creating user profile:', profileData)
      const { data: profileResult, error: profileError } = await supabase.createUserProfile(profileData)
      
      if (profileError) {
        throw new Error(profileError)
      }

      console.log('✅ Profile created successfully:', profileResult)
      setUserData(profileUserData) // Update state for success display
      setStep('success')
      
      // Auto-close after success
      setTimeout(() => {
        onClose()
      }, 3000)
      
    } catch (error: any) {
      console.error('❌ Profile creation failed:', error)
      setError(error.message)
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const handleResendLink = async () => {
    setLoading(true)
    setError('')

    try {
      await supabase.signInWithOTP(userData.email, true)
      console.log('📧 Magic link resent successfully')
    } catch (error: any) {
      console.error('Failed to resend magic link:', error)
      setError('Failed to resend link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUserData(prev => ({ ...prev, profilePic: file }))
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setUserData(prev => ({ ...prev, profilePicUrl: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const displayName = [userData.firstName, userData.lastName].filter(Boolean).join(' ') || 'Member'
  const profileImage = userData.profilePicUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNmM2Y0ZjYiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxMiIgZmlsbD0iIzZiNzI4MCIvPjxwYXRoIGQ9Im0yNSA3NWMwLTEzLjggMTEuMi0yNSAyNS0yNXMyNSAxMS4yIDI1IDI1IiBmaWxsPSIjNmI3MjgwIi8+PC9zdmc+'

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* User Info Form */}
        {step === 'form' && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Your Profile</h2>
              <p className="text-sm text-gray-600">We need just a few key details so we can send you curated content from Atelier Logos.</p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={userData.firstName}
                    onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={userData.lastName}
                    onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  value={userData.email}
                  onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={userData.company}
                  onChange={(e) => setUserData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={userData.linkedin}
                  onChange={(e) => setUserData(prev => ({ ...prev, linkedin: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Curation Prompt <span className="text-red-500">*</span></label>
                <textarea
                  required
                  placeholder="Tell us what kind of content you would like to see in your feed..."
                  value={userData.curationPrompt}
                  onChange={(e) => setUserData(prev => ({ ...prev, curationPrompt: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm min-h-[80px] resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleImageChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
                {userData.profilePicUrl && (
                  <div className="mt-2 text-center">
                    <img src={userData.profilePicUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 mx-auto" />
                  </div>
                )}
              </div>
              
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? '⏳ Sending...' : 'Send Magic Link'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Check Email */}
        {step === 'checkEmail' && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We sent a magic link to <strong>{userData.email}</strong>.<br />
              Click the link in your email to authenticate and complete your profile.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin text-blue-600">⏳</div>
                <div className="text-sm text-blue-800">
                  Waiting for you to click the magic link...
                </div>
              </div>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm mb-4">{error}</div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleResendLink}
                disabled={loading}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {loading ? '⏳ Sending...' : 'Resend Link'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Complete Profile (after magic link authentication) */}
        {step === 'profile' && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600 mb-6">You're successfully authenticated. Let's create your profile now.</p>
            
            {error && (
              <div className="text-red-600 text-sm mb-4">{error}</div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProfile}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? '⏳ Creating Profile...' : 'Create Profile'}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-green-600 mb-2">Welcome Aboard!</h2>
            <p className="text-gray-600 mb-6">Your Atelier Logos profile has been created successfully. You will start receiving curated content based on your preferences.</p>
            
            {/* Membership Card Preview */}
            <div className="bg-gradient-to-br from-blue-800 via-purple-800 to-orange-800 rounded-xl p-6 text-white mb-6 relative overflow-hidden shadow-2xl transform perspective-1000 rotate-x-5">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              <div className="absolute top-4 right-6 text-xs font-semibold tracking-widest opacity-70">MEMBER</div>
              
              <div className="flex items-center gap-5 relative z-10">
                <img src={profileImage} alt="Profile" className="w-16 h-16 rounded-lg object-cover border-2 border-white/40 shadow-lg" />
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-shadow">{displayName}</h3>
                  <p className="text-sm opacity-90">{userData.email}</p>
                  {userData.company && <p className="text-xs opacity-80 uppercase tracking-wide">{userData.company}</p>}
                </div>
              </div>
              
              <div className="mt-5 pt-5 border-t border-white/20 flex justify-between text-xs">
                <div>
                  <div className="opacity-70 tracking-wide mb-1">MEMBER SINCE</div>
                  <div className="font-semibold">{new Date().getFullYear()}</div>
                </div>
                <div className="text-right">
                  <div className="opacity-70 tracking-wide mb-1">CARD ID</div>
                  <div className="font-mono text-xs">AL-{Date.now().toString().slice(-6)}</div>
                </div>
              </div>
              
              <div className="absolute bottom-3 left-6 text-[8px] opacity-60 tracking-[2px]">ATELIER LOGOS STUDIO</div>
            </div>
            
            <button
              onClick={onClose}
              className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 