import { exaService } from './exa'
import { createServerClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

interface Subscriber {
  id: string
  email: string
  linkedin_url: string | null
  company: string | null
  profile_pic: string | null
  curation_prompt: string | null
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
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
  private getSupabaseClient() {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        cookies: {
          get(name: string) { return undefined },
          set(name: string, value: string, options: any) {},
          remove(name: string, options: any) {},
        },
      }
    )
  }

  async curateForAllUsers(supabase?: SupabaseClient): Promise<void> {
    console.log('🚀 Starting feed curation for all users...')
    
    try {
      const client = supabase || this.getSupabaseClient()
      // Get all subscribers with curation prompts
      const { data: subscribers, error: subscribersError } = await client
        .from('subscribers')
        .select('*')
        .not('curation_prompt', 'is', null)
        .neq('curation_prompt', '')

      if (subscribersError) {
        throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`)
      }

      if (!subscribers || subscribers.length === 0) {
        console.log('📭 No subscribers with curation prompts found')
        return
      }

      console.log(`👥 Found ${subscribers.length} subscribers to curate content for`)

      // Process each subscriber
      const results = await Promise.allSettled(
        subscribers.map(subscriber => this.curateForUser(subscriber, client))
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

  async curateForUser(subscriber: Subscriber, supabase?: SupabaseClient): Promise<void> {
    console.log(`🔍 Curating content for subscriber: ${subscriber.email} (${subscriber.id})`)
    
    try {
      const client = supabase || this.getSupabaseClient()
      // Ensure curation_prompt is a string and not empty
      const curationPrompt = typeof subscriber.curation_prompt === 'string' 
        ? subscriber.curation_prompt.trim()
        : String(subscriber.curation_prompt || '').trim()
      
      if (!curationPrompt) {
        throw new Error(`Subscriber ${subscriber.id} has no valid curation prompt`)
      }
      
      console.log(`📝 Using curation prompt: "${curationPrompt}"`)
      
      // Search for content using Exa
      const searchResults = await exaService.curateFeedForUser(curationPrompt, {
        numResults: 5,
        startPublishedDate: this.getLastWeekDate()
      })

      if (searchResults.length === 0) {
        console.log(`📭 No new content found for subscriber: ${subscriber.email}`)
        return
      }

      console.log(`📰 Found ${searchResults.length} articles for subscriber: ${subscriber.email}`)

      // Check for duplicates and store new items
      let newItemsCount = 0
      for (const result of searchResults) {
        try {
          // Check if this URL already exists for this subscriber
          const { data: existing } = await client
            .from('feeds')
            .select('id')
            .eq('subscriber', subscriber.id)
            .eq('url', result.url)
            .single()

          if (existing) {
            console.log(`⏭️  Skipping duplicate URL for ${subscriber.email}: ${result.url}`)
            continue
          }

          // Store the new feed item
          const feedItem: FeedItem = {
            subscriber: subscriber.id,
            title: result.title,
            url: result.url,
            snippet: result.snippet,
            author: result.author || null,
            published_date: result.publishedDate || null
          }

          const { error: insertError } = await client
            .from('feeds')
            .insert(feedItem)

          if (insertError) {
            console.error(`❌ Failed to store feed item for ${subscriber.email}:`, insertError)
            continue
          }

          newItemsCount++
          console.log(`✅ Stored new article for ${subscriber.email}: ${result.title}`)

        } catch (error) {
          console.error(`❌ Error processing article for ${subscriber.email}:`, error)
          continue
        }
      }

      console.log(`🎉 Successfully curated ${newItemsCount} new articles for subscriber: ${subscriber.email}`)

    } catch (error) {
      console.error(`💥 Failed to curate content for subscriber ${subscriber.email}:`, error)
      throw error
    }
  }

  async curateForSingleUser(userId: string, supabase?: SupabaseClient): Promise<void> {
    console.log(`🎯 Curating content for single subscriber: ${userId}`)
    
    try {
      const client = supabase || this.getSupabaseClient()
      // Get the specific subscriber
      const { data: subscriber, error: subscriberError } = await client
        .from('subscribers')
        .select('*')
        .eq('id', userId)
        .single()

      if (subscriberError || !subscriber) {
        throw new Error(`Subscriber not found: ${userId}`)
      }

      if (!subscriber.curation_prompt || subscriber.curation_prompt.trim() === '') {
        throw new Error(`Subscriber ${userId} has no curation prompt set`)
      }

      await this.curateForUser(subscriber, client)
      
    } catch (error) {
      console.error(`💥 Failed to curate for subscriber ${userId}:`, error)
      throw error
    }
  }

  private getLastWeekDate(): string {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date.toISOString().split('T')[0]
  }
}

// Export singleton instance
export const curationService = new CurationService()
export default curationService 