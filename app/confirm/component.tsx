"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function ConfirmPage() {
  const params = useSearchParams()
  const router = useRouter()
  const uid = params.get('uid')
  const apiKey = params.get('api_key')
  const [waiting, setWaiting] = useState(true)

  useEffect(() => {
    if (!uid || !apiKey) return

    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id === uid) {
        clearInterval(interval)
        // Link the api key on the server
        await fetch('/api/link-api-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: apiKey, uid })
        })
        setWaiting(false)
        router.push('/dashboard')
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [uid, apiKey, router])

  if (!uid || !apiKey) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-destructive">Invalid confirmation link</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-24">
      <h2 className="text-2xl font-semibold">Check your email 📧</h2>
      <p className="text-muted-foreground max-w-sm text-center">
        We just sent a magic sign-in link to <strong>{params.get('email') ?? 'your inbox'}</strong>.<br/>
        After you click it this page will automatically continue.
      </p>
      {waiting && <Button disabled>Waiting for confirmation…</Button>}
    </div>
  )
}
