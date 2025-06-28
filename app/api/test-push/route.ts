import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const beamsInstanceId = process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID
    const beamsSecretKey = process.env.BEAMS_SECRET_KEY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

    console.log('🔍 Testing push notification configuration...')
    console.log('BEAMS_INSTANCE_ID:', beamsInstanceId ? '✅ Set' : '❌ Missing')
    console.log('BEAMS_SECRET_KEY:', beamsSecretKey ? '✅ Set' : '❌ Missing')
    console.log('SITE_URL:', siteUrl || 'Using default')

    if (!beamsInstanceId) {
      return NextResponse.json({
        success: false,
        error: 'NEXT_PUBLIC_BEAMS_INSTANCE_ID environment variable is missing'
      }, { status: 500 })
    }

    if (!beamsSecretKey) {
      return NextResponse.json({
        success: false,
        error: 'BEAMS_SECRET_KEY environment variable is missing'
      }, { status: 500 })
    }

    // Test API connection with a simple test notification
    const testPayload = {
      interests: ['test-interest'],
      web: {
        notification: {
          title: 'Test Notification',
          body: 'This is a test from Atelier Logos',
          deep_link: siteUrl || 'https://localhost:3000',
          icon: `${siteUrl || 'https://localhost:3000'}/favicon.ico`,
        }
      }
    }

    console.log('📤 Sending test notification to Pusher Beams...')
    console.log('Payload:', JSON.stringify(testPayload, null, 2))

    const response = await fetch(
      `https://${beamsInstanceId}.pushnotifications.pusher.com/publish_api/v1/instances/${beamsInstanceId}/publishes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${beamsSecretKey}`
        },
        body: JSON.stringify(testPayload)
      }
    )

    const responseText = await response.text()
    console.log('📥 Pusher Beams response status:', response.status)
    console.log('📥 Pusher Beams response body:', responseText)

    if (response.ok) {
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        responseData = responseText
      }

      return NextResponse.json({
        success: true,
        message: 'Push notification configuration is working!',
        pusherResponse: responseData,
        config: {
          instanceId: beamsInstanceId,
          hasSecretKey: !!beamsSecretKey,
          siteUrl: siteUrl || 'Using default'
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: `Pusher Beams API error: ${response.status}`,
        details: responseText,
        config: {
          instanceId: beamsInstanceId,
          hasSecretKey: !!beamsSecretKey,
          siteUrl: siteUrl || 'Using default'
        }
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Test push notification error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 