import { NextRequest, NextResponse } from 'next/server'

const BEAMS_INSTANCE_ID = process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID!
const BEAMS_SECRET_KEY = process.env.BEAMS_SECRET_KEY!

export async function POST(request: NextRequest) {
  try {
    const { title, body, interests = ['hello'] } = await request.json()

    if (!title || !body) {
      return NextResponse.json(
        { success: false, error: 'Title and body are required' },
        { status: 400 }
      )
    }

    if (!BEAMS_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: 'Beams secret key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://${BEAMS_INSTANCE_ID}.pushnotifications.pusher.com/publish_api/v1/instances/${BEAMS_INSTANCE_ID}/publishes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEAMS_SECRET_KEY}`
        },
        body: JSON.stringify({
          interests,
          web: {
            notification: {
              title,
              body
            }
          }
        })
      }
    )

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({ success: true, data })
    } else {
      const errorText = await response.text()
      return NextResponse.json(
        { success: false, error: `Pusher API error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 