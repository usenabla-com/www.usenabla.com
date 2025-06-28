export interface ChatRoom {
  id: string
  user_id: string
  support_agent_id?: string
  title: string
  status: 'open' | 'closed' | 'assigned'
  created_at: string
  updated_at: string
  last_message_at?: string
}

export interface ChatMessage {
  id: string
  chat_room_id: string
  sender_id: string
  sender_type: 'user' | 'support'
  message: string
  read_at?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  company?: string
  linkedin_url?: string
  profile_pic?: string
  curation_prompt?: string
  curations: number
  customer: boolean
  created_at: string
} 