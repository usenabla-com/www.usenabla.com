import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SUPPORT_USER_ID = 'ec241bb3-293e-4f03-9d07-591f0208d0ad'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user and verify it's the support user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user || user.id !== SUPPORT_USER_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all chat rooms with their latest messages (only the most recent per user)
    const { data: rooms, error: roomsError } = await supabase
      .from('chat_rooms')
      .select('*')
      .order('created_at', { ascending: false })

    if (roomsError) {
      console.error('Error fetching chat rooms:', roomsError)
      return NextResponse.json(
        { error: 'Failed to fetch chat rooms' },
        { status: 500 }
      )
    }

    // Deduplicate rooms by user_id (keep only the most recent per user)
    const deduplicatedRooms = (rooms || []).reduce((acc, room) => {
      const existingRoom = acc.find((r: any) => r.user_id === room.user_id)
      if (!existingRoom || new Date(room.created_at) > new Date(existingRoom.created_at)) {
        return [...acc.filter((r: any) => r.user_id !== room.user_id), room]
      }
      return acc
    }, [] as typeof rooms)

    // Get messages for each room and calculate unread counts
    const roomsWithMessages = await Promise.all(
      deduplicatedRooms.map(async (room: any) => {
        // Get all messages for this room
        const { data: messages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_room_id', room.id)
          .order('created_at', { ascending: true })

        // Get user profile data from subscribers table
        const { data: userProfile, error: profileError } = await supabase
          .from('subscribers')
          .select('id, first_name, last_name, email, profile_pic, company, linkedin_url, customer')
          .eq('id', room.user_id)
          .single()

        console.log('Looking up user profile for user_id:', room.user_id)
        console.log('User profile result:', userProfile)
        console.log('User profile error:', profileError)

        // Create full name from first_name and last_name
        const fullName = userProfile 
          ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Unknown User'
          : 'Unknown User'

        // Calculate unread count (messages from users that haven't been read)
        const unreadCount = (messages || []).filter(
          msg => msg.sender_type === 'user' && !msg.read_at
        ).length

        return {
          ...room,
          messages: messages || [],
          unread_count: unreadCount,
          user_profile: userProfile ? {
            id: userProfile.id,
            full_name: fullName,
            email: userProfile.email,
            profile_pic: userProfile.profile_pic,
            company: userProfile.company,
            linkedin_url: userProfile.linkedin_url,
            customer: userProfile.customer,
          } : {
            id: room.user_id,
            full_name: 'Unknown User',
            email: 'unknown@example.com',
            profile_pic: null,
            company: null,
            linkedin_url: null
          }
        }
      })
    )

    // Sort by last message time (rooms with recent activity first)
    const sortedRooms = roomsWithMessages.sort((a, b) => {
      const aTime = a.last_message_at || a.created_at
      const bTime = b.last_message_at || b.created_at
      return new Date(bTime).getTime() - new Date(aTime).getTime()
    })

    return NextResponse.json({
      rooms: sortedRooms
    })

  } catch (error) {
    console.error('Support rooms error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 