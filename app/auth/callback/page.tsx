'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session
        const session = await supabase.getCurrentSession()
        
        if (session?.user) {
          console.log('✅ User authenticated via magic link:', session.user.email)
          
          // Check if user profile exists
          const { data: profile, error } = await supabase.getUserProfile()
          
          if (profile) {
            // User has a complete profile, redirect to home
            setStatus('success')
            setMessage('Welcome back! Redirecting to dashboard...')
            setTimeout(() => router.push('/'), 1500)
          } else {
            // New user from magic link, needs to complete profile setup
            setStatus('success')
            setMessage('Magic link verified! Completing your profile setup...')
            
            // Redirect to home and trigger profile modal to continue
            setTimeout(() => {
              router.push('/')
              // Small delay to ensure page loads before triggering modal
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('openProfileModal'))
              }, 500)
            }, 1000)
          }
        } else {
          setStatus('error')
          setMessage('Magic link authentication failed. The link may have expired.')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('Something went wrong during authentication. Please try again.')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">Verifying Magic Link...</h2>
              <p className="text-gray-600 mt-2">Please wait while we authenticate your account.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="text-green-500 text-5xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-900">Authentication Successful!</h2>
              <p className="text-gray-600 mt-2">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="text-red-500 text-5xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-gray-900">Authentication Failed</h2>
              <p className="text-gray-600 mt-2">{message}</p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Return to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 