import { NextRequest, NextResponse } from 'next/server'
import { curationService } from '@/lib/curation'

export async function GET (req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }
  try {
    await curationService.curateForSingleUser(userId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Curation failed' }, { status: 500 })
  }
} 