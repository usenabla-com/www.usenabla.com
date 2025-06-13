import { NextRequest, NextResponse } from 'next/server'
import { curateUserFeed } from '@/lib/curation-utils'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    await curateUserFeed(userId)

    return NextResponse.json({ 
      success: true,
      message: 'Curation completed successfully'
    })

  } catch (error) {
    console.error('Curate user API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 