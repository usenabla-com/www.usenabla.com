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
    const contentType = request.headers.get('content-type')
    let message: string | null = null
    let chatRoomId: string | null = null
    let attachment: any = null
    let uploadedFile: File | null = null

    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (file uploads)
      const formData = await request.formData()
      message = formData.get('message') as string
      chatRoomId = formData.get('chatRoomId') as string
      uploadedFile = formData.get('file') as File
      
      // Handle attachment data from form
      const attachmentType = formData.get('attachmentType') as string
      const attachmentUrl = formData.get('attachmentUrl') as string
      const attachmentFilename = formData.get('attachmentFilename') as string
      const attachmentSize = formData.get('attachmentSize') as string
      const attachmentMimeType = formData.get('attachmentMimeType') as string
      
      if (attachmentType && attachmentUrl) {
        attachment = {
          type: attachmentType,
          url: attachmentUrl,
          filename: attachmentFilename,
          size: parseInt(attachmentSize),
          mimeType: attachmentMimeType
        }
      }
    } else {
      // Handle JSON (text messages and media recorder uploads)
      const body = await request.json()
      message = body.message
      chatRoomId = body.chatRoomId
      attachment = body.attachment
    }

    // Validate that either message or attachment or uploaded file exists
    if (!((message && message.trim()) || attachment || uploadedFile)) {
      return NextResponse.json(
        { error: 'Message, attachment, or file is required' },
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

    // Verify this is the support user
    if (user.id !== SUPPORT_USER_ID) {
      return NextResponse.json({ error: 'Forbidden - Support access only' }, { status: 403 })
    }

    // Get chat room to find the user
    const { data: chatRoom, error: roomError } = await supabase
      .from('chat_rooms')
      .select('user_id')
      .eq('id', chatRoomId)
      .single()

    if (roomError || !chatRoom) {
      return NextResponse.json({ error: 'Chat room not found' }, { status: 404 })
    }

    // Handle file upload if present
    if (uploadedFile) {
      try {
        const fileExt = uploadedFile.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `chat-files/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('chat-files')
          .upload(filePath, uploadedFile)

        if (uploadError) {
          console.error('File upload error:', uploadError)
          return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
          )
        }

        const { data: { publicUrl } } = supabase.storage
          .from('chat-files')
          .getPublicUrl(filePath)

        // Determine file type
        const getFileType = (mimeType: string): string => {
          if (mimeType.startsWith('image/')) return 'image'
          if (mimeType.startsWith('video/')) return 'video'
          if (mimeType.startsWith('audio/')) return 'audio'
          if (mimeType === 'application/pdf') return 'pdf'
          if (mimeType.includes('document') || mimeType.includes('word')) return 'document'
          return 'file'
        }

        attachment = {
          type: getFileType(uploadedFile.type),
          url: publicUrl,
          filename: uploadedFile.name,
          size: uploadedFile.size,
          mimeType: uploadedFile.type
        }
      } catch (uploadError) {
        console.error('File upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        )
      }
    }

    // Prepare message data for database
    const messageData: any = {
      chat_room_id: chatRoomId,
      sender_id: user.id,
      sender_type: 'support',
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

    // Update chat room's last message timestamp and assign support agent
    await supabase
      .from('chat_rooms')
      .update({ 
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        support_agent_id: user.id,
        status: 'assigned'
      })
      .eq('id', chatRoomId)

    // Prepare message data for Pusher
    const pusherMessageData = {
      id: chatMessage.id,
      chat_room_id: chatRoomId,
      sender_id: user.id,
      sender_type: 'support',
      sender_name: 'Atelier Logos Support',
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

    // Send push notification to the user
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'
      
      // Create notification body
      let notificationBody = ''
      if (chatMessage.message) {
        notificationBody = `Atelier Logos Support: ${chatMessage.message.slice(0, 50)}${chatMessage.message.length > 50 ? '...' : ''}`
      } else if (attachment) {
        notificationBody = `Atelier Logos Support sent ${attachment.type === 'image' ? 'an image' : attachment.type === 'video' ? 'a video' : attachment.type === 'audio' ? 'an audio file' : 'a file'}`
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
            interests: [`user-${chatRoom.user_id}`],
            web: {
              notification: {
                title: `Support Response`,
                body: notificationBody,
                deep_link: `${siteUrl}/profile/${chatRoom.user_id}`,
                icon: `${siteUrl}/web-app-manifest-192x192.png`,
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
    console.error('Support chat send error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 