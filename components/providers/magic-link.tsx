'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function MagicLinkListenerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [keyId, setKeyId] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  // Poll for auth session
  useEffect(() => {
    const interval = setInterval(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user?.id) {
        clearInterval(interval)
        setUserId(session.user.id)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  // Once userId is set, fetch their API key
  useEffect(() => {
    const fetchKeyId = async () => {
      if (!userId) return

      try {
        const { data, error } = await supabase.supabase
          .from("api_keys")
          .select("id")
          .eq("user_id", userId)
          .limit(1)
          .single()

        if (error || !data) {
          console.error("Failed to fetch API key:", error)
          return
        }

        setKeyId(data.id)
      } catch (e) {
        console.error("Error fetching keyId:", e)
      }
    }

    fetchKeyId()
  }, [userId])

  // Redirect once both values are ready
  useEffect(() => {
    if (userId && keyId) {
      setChecking(false)
      router.push(`/dashboard?keyId=${keyId}&userId=${userId}`)
    }
  }, [userId, keyId, router])

  return <>{children}</>
}
