import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'

// Database types
export interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  company: string | null
  linkedin_url: string | null
  curation_prompt: string
  profile_pic: string | null
  created_at: string
  updated_at: string
  curations: number
  customer: boolean
}

export interface Content {
  id: string
  created_at: string
  subscriber: string
  title: string
  url: string
  snippet: string
  author: string | null
  published_date: string | null
}

class SupabaseService {
  private static instance: SupabaseService
  private client: SupabaseClient

  private constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    this.client = createClient(supabaseUrl, supabaseKey)
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService()
    }
    return SupabaseService.instance
  }

  // Auth methods
  async signInWithOTP(email: string, shouldCreateUser = true) {
    try {
      const { data, error } = await this.client.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email_action_type: 'signup'
          }
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Error sending magic link:', error)
      return { data: null, error: error.message }
    }
  }

  async verifyOTP(email: string, token: string) {
    try {
      const { data, error } = await this.client.auth.verifyOtp({
        email,
        token,
        type: 'email'
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Error verifying OTP:', error)
      return { data: null, error: error.message }
    }
  }

  async signOut() {
    try {
      const { error } = await this.client.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      console.error('Error signing out:', error)
      return { error: error.message }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await this.client.auth.getUser()
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await this.client.auth.getSession()
      return session
    } catch (error) {
      console.error('Error getting current session:', error)
      return null
    }
  }

  // User profile methods
  async createUserProfile(profileData: Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('No authenticated user found')

      const { data, error } = await this.client
        .from('subscribers')
        .insert({
          id: user.id,
          ...profileData
        })
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Error creating user profile:', error)
      return { data: null, error: error.message }
    }
  }

  async getUserProfile(userId?: string): Promise<{ data: UserProfile | null; error: string | null }> {
    try {
      let targetUserId = userId
      if (!targetUserId) {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No authenticated user found')
        targetUserId = user.id
      }

      const { data, error } = await this.client
        .from('subscribers')
        .select('*')
        .eq('id', targetUserId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Error getting user profile:', error)
      return { data: null, error: error.message }
    }
  }

  async updateUserProfile(profileData: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('No authenticated user found')

      const { data, error } = await this.client
        .from('subscribers')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Error updating user profile:', error)
      return { data: null, error: error.message }
    }
  }

  // Auth state change listener
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange(callback)
  }

  // Feed methods
  async createFeedItem(feedData: Omit<Content, 'id' | 'created_at'>) {
    try {
      const { data, error } = await this.client
        .from('content')
        .insert(feedData)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Error creating content item:', error)
      return { data: null, error: error.message }
    }
  }

  async getFeedItems(userId?: string, limit = 20, offset = 0): Promise<{ data: Content[] | null; error: string | null }> {
    try {
      let targetUserId = userId
      if (!targetUserId) {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No authenticated user found')
        targetUserId = user.id
      }

      const { data, error } = await this.client
        .from('content')
        .select('*')
        .eq('subscriber', targetUserId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Error getting content items:', error)
      return { data: null, error: error.message }
    }
  }

  async deleteFeedItem(feedId: string) {
    try {
      const { error } = await this.client
        .from('content')
        .delete()
        .eq('id', feedId)

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      console.error('Error deleting content item:', error)
      return { error: error.message }
    }
  }

  // Direct client access for advanced queries
  get supabase() {
    return this.client
  }
}

// Export singleton instance
export const supabase = SupabaseService.getInstance()
export default supabase 