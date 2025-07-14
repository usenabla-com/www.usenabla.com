"use server"

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  )

  const data = await request.json()
  const {
    api_key,
    first_name,
    last_name,
    email,
    company,
    referred_by
  } = data

  if (!api_key) {
    return new NextResponse('api_key is required', { status: 400 })
  }

  const { error } = await supabase.from('customers').upsert({
    api_key,
    first_name,
    last_name,
    email,
    company,
    referred_by,
    onboarded: true
  })

  if (error) {
    console.error('❌  Failed to upsert customer:', error)
    return new NextResponse('Database error', { status: 500 })
  }

  return NextResponse.json({ success: true })
}
