import { NextRequest, NextResponse } from 'next/server'
import { curateAllUsers } from '@/lib/curation-utils'

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a CRON job (optional security)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🕐 CRON: Starting scheduled feed curation...')
    
    // Curate feeds for all users
    await curateAllUsers()
    
    return NextResponse.json({
      success: true,
      message: 'Feed curation completed successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('CRON: Feed curation failed:', error)
    return NextResponse.json(
      { 
        error: 'Feed curation failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
} 