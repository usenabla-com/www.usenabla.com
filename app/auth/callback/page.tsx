'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleMagicLink = async () => {
      const code = searchParams.get('code')

      if (!code) {
        setStatus('error')
        setMessage('Missing verification code. Please try again.')
        return
      }

      // You also need the user's email. In some flows, this is stored in localStorage.
      const email = searchParams.get('email')

      if (!email) {
        setStatus('error')
        setMessage('Missing email. Please restart login.')
        return
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: code,
          type: 'magiclink',
        })

        if (error) {
          console.error('❌ Verification error:', error.message)
          setStatus('error')
          setMessage('Authentication failed. The magic link may have expired.')
          return
        }

        const user = data?.user
        if (user) {
          console.log('✅ User authenticated via magic link:', user.email)

          // Optional: fetch user profile here
          setStatus('success')
          setMessage('Welcome back! Redirecting to dashboard...')
          setTimeout(() => router.push('/'), 1500)
        } else {
          setStatus('error')
          setMessage('Authentication failed. No user found.')
        }
      } catch (err) {
        console.error('🔥 Unexpected error during verification:', err)
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    }

    handleMagicLink()
  }, [router, searchParams])

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
