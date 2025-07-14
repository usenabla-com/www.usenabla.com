import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'


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


  // Auth state change listener
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange(callback)
  }


  // Direct client access for advanced queries
  get supabase() {
    return this.client
  }

  // Expose auth for convenience (allows supabase.auth.*)
  get auth() {
    return this.client.auth
  }
}

// Export singleton instance
export const supabase = SupabaseService.getInstance()
export default supabase 