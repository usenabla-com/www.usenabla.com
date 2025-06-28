import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'audio/mp3',
  'audio/mpeg',
  'audio/wav',
  'audio/webm',
  'audio/ogg',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

function getAttachmentType(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  return 'file'
}

export async function POST(request: NextRequest) {
  console.log('=== UPLOAD API CALLED ===')
  
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.log('Auth error:', userError)
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: userError?.message || 'No user found'
      }, { status: 401 })
    }
    console.log('User authenticated:', user.id)

    // Parse form data with error handling
    let formData
    try {
      formData = await request.formData()
    } catch (parseError) {
      console.log('Form data parse error:', parseError)
      return NextResponse.json({ 
        error: 'Invalid form data',
        details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      }, { status: 400 })
    }

    const file = formData.get('file') as File
    const chatRoomId = formData.get('chatRoomId') as string

    console.log('Form data received:')
    console.log('- File:', file ? `${file.name} (${file.type}, ${file.size} bytes)` : 'null')
    console.log('- Chat Room ID:', chatRoomId)

    if (!file) {
      console.log('No file provided')
      return NextResponse.json({
        error: 'File is required',
        details: 'No file was uploaded'
      }, { status: 400 })
    }

    if (!chatRoomId) {
      console.log('No chat room ID provided')
      return NextResponse.json({
        error: 'Chat room ID is required',
        details: 'chatRoomId parameter is missing'
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.log('File too large:', file.size, 'bytes')
      return NextResponse.json({
        error: 'File size must be less than 10MB',
        details: `File size: ${file.size} bytes, limit: ${MAX_FILE_SIZE} bytes`
      }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log('File type not allowed:', file.type)
      console.log('Allowed types:', ALLOWED_TYPES)
      return NextResponse.json({
        error: `File type not supported: ${file.type}`,
        details: `Allowed types: ${ALLOWED_TYPES.join(', ')}`
      }, { status: 400 })
    }

    console.log('File validation passed')

    // Verify user has access to chat room
    const { data: chatRoom, error: roomError } = await supabase
      .from('chat_rooms')
      .select('user_id')
      .eq('id', chatRoomId)
      .single()

    if (roomError) {
      console.log('Chat room query error:', roomError)
      return NextResponse.json({ 
        error: 'Chat room not found',
        details: roomError.message
      }, { status: 404 })
    }

    if (!chatRoom) {
      console.log('Chat room not found for ID:', chatRoomId)
      return NextResponse.json({ 
        error: 'Chat room not found',
        details: `No chat room with ID: ${chatRoomId}`
      }, { status: 404 })
    }

    console.log('Chat room found:', chatRoom)

    // Check if user owns the room or is support
    const SUPPORT_USER_ID = 'ec241bb3-293e-4f03-9d07-591f0208d0ad'
    if (chatRoom.user_id !== user.id && user.id !== SUPPORT_USER_ID) {
      console.log('Access denied for user:', user.id, 'room owner:', chatRoom.user_id)
      return NextResponse.json({ 
        error: 'Access denied',
        details: `User ${user.id} does not have access to room ${chatRoomId}`
      }, { status: 403 })
    }

    console.log('Access granted, uploading file...')

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop() || 'bin'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `chat-attachments/${chatRoomId}/${fileName}`

    console.log('Uploading to path:', filePath)

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

    console.log('Upload successful:', uploadData)

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('chat-files')
      .getPublicUrl(filePath)

    console.log('Public URL:', urlData.publicUrl)

    const result = {
      success: true,
      attachment: {
        type: getAttachmentType(file.type),
        url: urlData.publicUrl,
        filename: file.name,
        size: file.size,
        mimeType: file.type
      }
    }

    console.log('Returning result:', result)
    return NextResponse.json(result)

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 