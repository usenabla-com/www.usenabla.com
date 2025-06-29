import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
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

    // Check if user is a customer (Premium Support subscribers only)
    if (!profile.customer) {
      return NextResponse.json({ 
        error: 'Customer access required',
        message: 'Chat support is only available for Premium Support customers. Please upgrade to Premium Support ($85.99/month) to access this feature.'
      }, { status: 403 })
    }

    // Check if user has an existing chat room (prefer open, but also check recent ones)
    const { data: existingRooms, error: roomError } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (!roomError && existingRooms && existingRooms.length > 0) {
      // First try to find an open room
      let existingRoom = existingRooms.find(room => room.status === 'open')
      
      // If no open room, use the most recent one and reopen it
      if (!existingRoom) {
        existingRoom = existingRooms[0]
        // Reopen the most recent room
        const { data: reopenedRoom } = await supabase
          .from('chat_rooms')
          .update({ status: 'open', updated_at: new Date().toISOString() })
          .eq('id', existingRoom.id)
          .select()
          .single()
        
        if (reopenedRoom) {
          existingRoom = reopenedRoom
        }
      }

      // Return existing room with messages
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_room_id', existingRoom.id)
        .order('created_at', { ascending: true })

      return NextResponse.json({
        room: existingRoom,
        messages: messages || []
      })
    }

    // Create new chat room
    const displayName = profile ? 
      `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email 
      : user.email

    const { data: newRoom, error: createError } = await supabase
      .from('chat_rooms')
      .insert({
        user_id: user.id,
        title: `Support Chat - ${displayName}`,
        status: 'open'
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating chat room:', createError)
      return NextResponse.json(
        { error: 'Failed to create chat room' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      room: newRoom,
      messages: []
    })

  } catch (error) {
    console.error('Chat room error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 