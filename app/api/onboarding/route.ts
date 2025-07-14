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

  if (!api_key || !email) {
    return NextResponse.json({ error: 'api_key and email required' }, { status: 400 })
  }

  // 1️⃣  Update customer details collected earlier by the Stripe webhook
  const { error: customerError } = await supabase
    .from('customers')
    .update({
      first_name,
      last_name,
      email,
      company,
      referred_by,
      onboarded: true
    })
    .eq('api_key', api_key)

  if (customerError) {
    console.error('❌  Failed to upsert customer:', customerError)
    return NextResponse.json({ error: 'db error' }, { status: 500 })
  }

  // 2️⃣  Create an Auth user & send magic-link (invite)
  const { data: adminCreated, error: authError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { api_key }
  })

  // 2.5️⃣  Link api_keys.user_id immediately so confirm page is optional
  if (adminCreated?.user?.id) {
    await supabase
      .from('api_keys')
      .update({ user_id: adminCreated.user.id })
      .eq('api_key', api_key)
  }

  if (authError || !adminCreated?.user) {
    console.error('❌  Failed to create auth user:', authError)
    return NextResponse.json({ error: 'auth error' }, { status: 500 })
  }

  return NextResponse.json({ uid: adminCreated.user.id, api_key, email })
}
