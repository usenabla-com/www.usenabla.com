import { exaService } from './exa'
import supabaseService from '@/lib/supabase/client'

interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  curation_prompt: string
  created_at: string
}

interface FeedItem {
  subscriber: string
  title: string
  url: string
  snippet: string
  author: string | null
  published_date: string | null
}

class CurationService {
  async curateForAllUsers(): Promise<void> {
    console.log('🚀 Starting feed curation for all users...')
    
    try {
      // Get all users with curation prompts
      const { data: users, error: usersError } = await supabaseService.supabase
        .from('subscribers')
        .select('*')
        .not('curation_prompt', 'is', null)
        .neq('curation_prompt', '')

      if (usersError) {
        throw new Error(`Failed to fetch users: ${usersError.message}`)
      }

      if (!users || users.length === 0) {
        console.log('📭 No users with curation prompts found')
        return
      }

      console.log(`👥 Found ${users.length} users to curate content for`)

      // Process each user
      const results = await Promise.allSettled(
        users.map(user => this.curateForUser(user))
      )

      // Log results
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length
      
      console.log(`✅ Curation completed: ${successful} successful, ${failed} failed`)
      
      if (failed > 0) {
        const errors = results
          .filter(r => r.status === 'rejected')
          .map(r => (r as PromiseRejectedResult).reason)
        console.error('❌ Failed curations:', errors)
      }

    } catch (error) {
      console.error('💥 Fatal error during curation:', error)
      throw error
    }
  }

  async curateForUser(user: UserProfile): Promise<void> {
    console.log(`🔍 Curating content for user: ${user.email} (${user.id})`)
    
    try {
      // Ensure curation_prompt is a string and not empty
      const curationPrompt = typeof user.curation_prompt === 'string' 
        ? user.curation_prompt.trim()
        : String(user.curation_prompt || '').trim()
      
      if (!curationPrompt) {
        throw new Error(`User ${user.id} has no valid curation prompt`)
      }
      
      console.log(`📝 Using curation prompt: "${curationPrompt}"`)
      
      // Search for content using Exa
      const searchResults = await exaService.curateFeedForUser(curationPrompt, {
        numResults: 5,
        startPublishedDate: this.getLastWeekDate()
      })

      if (searchResults.length === 0) {
        console.log(`📭 No new content found for user: ${user.email}`)
        return
      }

      console.log(`📰 Found ${searchResults.length} articles for user: ${user.email}`)

      // Check for duplicates and store new items
      let newItemsCount = 0
      for (const result of searchResults) {
        try {
          // Check if this URL already exists for this user
          const { data: existing } = await supabaseService.supabase
            .from('feeds')
            .select('id')
            .eq('subscriber', user.id)
            .eq('url', result.url)
            .single()

          if (existing) {
            console.log(`⏭️  Skipping duplicate URL for ${user.email}: ${result.url}`)
            continue
          }

          // Store the new feed item
          const feedItem: FeedItem = {
            subscriber: user.id,
            title: result.title,
            url: result.url,
            snippet: result.snippet,
            author: result.author || null,
            published_date: result.publishedDate || null
          }

          const { error: insertError } = await supabaseService.supabase
            .from('feeds')
            .insert(feedItem)

          if (insertError) {
            console.error(`❌ Failed to store feed item for ${user.email}:`, insertError)
            continue
          }

          newItemsCount++
          console.log(`✅ Stored new article for ${user.email}: ${result.title}`)

        } catch (error) {
          console.error(`❌ Error processing article for ${user.email}:`, error)
          continue
        }
      }

      console.log(`🎉 Successfully curated ${newItemsCount} new articles for user: ${user.email}`)

    } catch (error) {
      console.error(`💥 Failed to curate content for user ${user.email}:`, error)
      throw error
    }
  }

  async curateForSingleUser(userId: string): Promise<void> {
    console.log(`🎯 Curating content for single user: ${userId}`)
    
    try {
      // Get the specific user
      const { data: user, error: userError } = await supabaseService.supabase
        .from('subscribers')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError || !user) {
        throw new Error(`User not found: ${userId}`)
      }

      if (!user.curation_prompt || user.curation_prompt.trim() === '') {
        throw new Error(`User ${userId} has no curation prompt set`)
      }

      await this.curateForUser(user)
      
    } catch (error) {
      console.error(`💥 Failed to curate for user ${userId}:`, error)
      throw error
    }
  }

  private getLastWeekDate(): string {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date.toISOString().split('T')[0]
  }
}

export const curationService = new CurationService() 