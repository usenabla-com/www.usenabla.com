import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { curationService } from '@/lib/curation'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  // Create server client with request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // We don't need to set cookies in the response for this endpoint
        },
        remove(name: string, options: any) {
          // We don't need to remove cookies in the response for this endpoint
        },
      },
    }
  )

  try {
    // Perform curation
    await curationService.curateForUser(userId, supabase)
    
    // Get the latest profile data
    const { data: profile, error: profileError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('id', userId)
      .single()
      
    if (profileError) {
      throw profileError
    }

    console.log('Returning updated profile data:', profile)

    return NextResponse.json({ 
      success: true,
      profile 
    })
  } catch (error: any) {
    // Check if the error is related to subscription
    if (error.message?.includes('No curations remaining')) {
      return NextResponse.json({
        error: error.message,
        code: 'SUBSCRIPTION_REQUIRED',
        upgradeUrl: 'https://buy.stripe.com/4gM5kD0xSdCoc1fbpM18c03'
      }, { status: 402 }) // 402 Payment Required
    }
    return NextResponse.json({ error: error.message || 'Curation failed' }, { status: 500 })
  }
} 