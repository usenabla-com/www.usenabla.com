import { curationService } from './curation'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Trigger content curation for a specific user
 * @param userId The ID of the user to curate content for
 * @param supabase Optional Supabase client instance
 */
export async function curateUserFeed(userId: string, supabase?: SupabaseClient) {
  // If we're running in the browser, proxy the request to a serverless route to avoid CORS
  if (typeof window !== 'undefined') {
    const res = await fetch(`/api/curation?userId=${encodeURIComponent(userId)}`)
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Server curation failed: ${text}`)
    }
    const data = await res.json()
    return data
  }

  // Server-side execution
  try {
    console.log(`🎯 Starting content curation for user: ${userId}`)
    await curationService.curateForUser(userId, supabase)
    
    // Get updated profile
    if (supabase) {
      const { data: profile, error: profileError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
        
      if (profileError) {
        throw profileError
      }
      
      return { success: true, profile }
    }
    
    console.log(`✅ Content curation completed for user: ${userId}`)
    return { success: true }
  } catch (error) {
    console.error(`💥 Failed to curate content for user ${userId}:`, error)
    throw error
  }
}

// Set default options for feed curation 