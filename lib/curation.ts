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

interface ContentItem {
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

  async curateForUser(userId: string, supabase?: SupabaseClient): Promise<void> {
    console.log(`🎯 Curating content for user: ${userId}`)
    
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

      // Ensure curation_prompt is a string and not empty
      const curationPrompt = typeof subscriber.curation_prompt === 'string' 
        ? subscriber.curation_prompt.trim()
        : String(subscriber.curation_prompt || '').trim()
      
      console.log(`📝 Using curation prompt: "${curationPrompt}"`)
      
      // Search for content using Exa
      const searchResults = await exaService.curateFeedForUser(curationPrompt, {
        numResults: 5,
        startPublishedDate: this.getLastWeekDate()
      })

      if (searchResults.length === 0) {
        console.log(`📭 No new content found for user: ${userId}`)
        return
      }

      console.log(`📰 Found ${searchResults.length} articles for user: ${userId}`)

      // Check for duplicates and store new items
      let newItemsCount = 0
      for (const result of searchResults) {
        try {
          // Check if this URL already exists for this subscriber
          const { data: existing } = await client
            .from('content')
            .select('id')
            .eq('subscriber', subscriber.id)
            .eq('url', result.url)
            .single()

          if (existing) {
            console.log(`⏭️  Skipping duplicate URL for ${subscriber.email}: ${result.url}`)
            continue
          }

          // Store the new content item
          const contentItem: ContentItem = {
            subscriber: subscriber.id,
            title: result.title,
            url: result.url,
            snippet: result.snippet,
            author: result.author || null,
            published_date: result.publishedDate || null
          }

          const { error: insertError } = await client
            .from('content')
            .insert(contentItem)

          if (insertError) {
            console.error(`❌ Failed to store content item for ${subscriber.email}:`, insertError)
            continue
          }

          newItemsCount++
          console.log(`✅ Stored new article for ${subscriber.email}: ${result.title}`)

        } catch (error) {
          console.error(`❌ Error processing article for ${subscriber.email}:`, error)
          continue
        }
      }

      console.log(`🎉 Successfully curated ${newItemsCount} new articles for user: ${userId}`)

    } catch (error) {
      console.error(`💥 Failed to curate content for user ${userId}:`, error)
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