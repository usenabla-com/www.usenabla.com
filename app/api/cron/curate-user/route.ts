import { NextRequest, NextResponse } from 'next/server'
import { curateUserFeed } from '@/lib/curation-utils'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a CRON job
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log(`🕐 CRON: Starting scheduled feed curation for user: ${userId}`)
    
    // Curate feed for specific user
    await curateUserFeed(userId)
    
    return NextResponse.json({
      success: true,
      message: `Feed curation completed for user: ${userId}`,
      userId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('CRON: User feed curation failed:', error)
    return NextResponse.json(
      { 
        error: 'User feed curation failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 