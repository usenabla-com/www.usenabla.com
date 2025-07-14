"use server"

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function GET(request: NextRequest) {
  const session_id = request.nextUrl.searchParams.get('session_id')
  if (!session_id) return NextResponse.redirect(new URL('/', request.url))

  let apiKey: string | null = null
  // Poll for up to ~10 seconds in case webhook hasn’t finished yet
  for (let i = 0; i < 10; i++) {
    const { data, error } = await supabase
      .from('api_keys')
      .select('api_key')
      .eq('session_id', session_id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching api_key for session', session_id, error)
      break
    }
    if (data?.api_key) {
      apiKey = data.api_key as string
      break
    }
    // wait 1 second before next retry
    await new Promise(res => setTimeout(res, 1000))
  }

  if (!apiKey) {
    // Fallback: show waiting page or redirect home
    return NextResponse.redirect(new URL('/?status=processing', request.url))
  }

  return NextResponse.redirect(
    new URL(`/onboarding?api_key=${apiKey}`, request.url)
  )
}
