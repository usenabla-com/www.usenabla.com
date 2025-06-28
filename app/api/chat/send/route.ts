import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_CHANNELS_APP_ID!,
  key: process.env.NEXT_PUBLIC_CHANNELS_KEY!,
  secret: process.env.CHANNELS_SECRET!,
  cluster: process.env.NEXT_PUBLIC_CHANNELS_CLUSTER!,
  useTLS: true,
})

const SUPPORT_USER_ID = 'ec241bb3-293e-4f03-9d07-591f0208d0ad'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let message: string | undefined
    let chatRoomId: string | undefined
    let attachment: any = undefined
    let file: File | undefined

    // Handle different content types
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (file uploads)
      const formData = await request.formData()
      message = formData.get('message') as string
      chatRoomId = formData.get('chatRoomId') as string
      file = formData.get('file') as File

      if (file) {
        // Upload file to storage first
        const fileExt = file.name.split('.').pop() || 'bin'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `chat-attachments/${chatRoomId}/${fileName}`

        const supabase = await createClient()
        
        // Get current user for auth
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('chat-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Storage upload error:', uploadError)
          return NextResponse.json({
            error: 'Failed to upload file',
            details: uploadError.message
          }, { status: 500 })
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('chat-files')
          .getPublicUrl(filePath)

        // Create attachment object
        attachment = {
          type: getAttachmentType(file.type),
          url: urlData.publicUrl,
          filename: file.name,
          size: file.size,
          mimeType: file.type
        }
      }
    } else {
      // Handle JSON (media recorder uploads)
      const body = await request.json()
      message = body.message
      chatRoomId = body.chatRoomId
      attachment = body.attachment
    }

    // Validate that either message or attachment exists
    if (!((message && message.trim()) || attachment)) {
      return NextResponse.json(
        { error: 'Message or attachment is required' },
        { status: 400 }
      )
    }

    if (!chatRoomId) {
      return NextResponse.json(
        { error: 'Chat room ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a customer
    const { data: profile, error: profileError } = await supabase
      .from('subscribers')
      .select('first_name, last_name, email, customer')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (!profile.customer) {
      return NextResponse.json({ 
        error: 'Customer access required',
        message: 'Chat support is only available for customers. Please upgrade your account to access this feature.'
      }, { status: 403 })
    }

    const displayName = profile ? 
      `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email 
      : user.email

    // Prepare message data for database
    const messageData: any = {
      chat_room_id: chatRoomId,
      sender_id: user.id,
      sender_type: 'user',
    }

    // Add message text if provided
    if (message && message.trim()) {
      messageData.message = message.trim()
    }

    // Add attachment data if provided
    if (attachment) {
      messageData.attachment_type = attachment.type
      messageData.attachment_url = attachment.url
      messageData.attachment_filename = attachment.filename
      messageData.attachment_size = attachment.size
      messageData.attachment_mime_type = attachment.mimeType
    }

    // Insert message into database
    const { data: chatMessage, error: messageError } = await supabase
      .from('chat_messages')
      .insert(messageData)
      .select()
      .single()

    if (messageError) {
      console.error('Database error:', messageError)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // Update chat room's last message timestamp
    await supabase
      .from('chat_rooms')
      .update({ 
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', chatRoomId)

    // Prepare message data for Pusher
    const pusherMessageData = {
      id: chatMessage.id,
      chat_room_id: chatRoomId,
      sender_id: user.id,
      sender_type: 'user',
      sender_name: displayName,
      message: chatMessage.message,
      attachment_type: chatMessage.attachment_type,
      attachment_url: chatMessage.attachment_url,
      attachment_filename: chatMessage.attachment_filename,
      attachment_size: chatMessage.attachment_size,
      attachment_mime_type: chatMessage.attachment_mime_type,
      created_at: chatMessage.created_at,
    }

    // Send via Pusher Channels to the chat room
    await pusher.trigger(`chat-${chatRoomId}`, 'new-message', pusherMessageData)

    // Send via Pusher Channels to support dashboard
    await pusher.trigger('support-dashboard', 'new-user-message', {
      ...pusherMessageData,
      chat_room_id: chatRoomId,
    })

    // Send push notification to support user
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'
      
      // Create notification body
      let notificationBody = ''
      if (chatMessage.message) {
        notificationBody = `${displayName}: ${chatMessage.message.slice(0, 50)}${chatMessage.message.length > 50 ? '...' : ''}`
      } else if (attachment) {
        notificationBody = `${displayName} sent ${attachment.type === 'image' ? 'an image' : attachment.type === 'video' ? 'a video' : attachment.type === 'audio' ? 'an audio file' : 'a file'}`
      }

      const notificationResponse = await fetch(
        `https://${process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID}.pushnotifications.pusher.com/publish_api/v1/instances/${process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID}/publishes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BEAMS_SECRET_KEY}`
          },
          body: JSON.stringify({
            interests: [`user-${SUPPORT_USER_ID}`],
            web: {
              notification: {
                title: `New Support Message`,
                body: notificationBody,
                deep_link: `${siteUrl}/support/${SUPPORT_USER_ID}`,
                icon: `${siteUrl}/favicon.ico`,
              }
            }
          })
        }
      )

      if (!notificationResponse.ok) {
        console.error('Push notification failed:', await notificationResponse.text())
      }
    } catch (notificationError) {
      console.error('Push notification error:', notificationError)
    }

    return NextResponse.json({ 
      success: true, 
      message: pusherMessageData 
    })

  } catch (error) {
    console.error('Chat send error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to determine attachment type
function getAttachmentType(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  return 'file'
} 