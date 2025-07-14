"use server"

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { api_key, uid } = await req.json()

    if (!api_key || !uid) {
      return NextResponse.json({ error: 'api_key and uid required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    )

    const { error } = await supabase
      .from('api_keys')
      .update({ user_id: uid })
      .eq('api_key', api_key)

    if (error) {
      console.error('Error updating api_key with user_id', error)
      return NextResponse.json({ error: 'db error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Unexpected error in link-api-key', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
