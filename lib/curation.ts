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
  curations: number
  customer: boolean
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

      console.log('Initial subscriber data:', subscriber)

      if (subscriberError || !subscriber) {
        throw new Error(`Subscriber not found: ${userId}`)
      }

      // Check if user has remaining curations, unlimited curations, or is a paying customer
      // -1 curations means unlimited (either Premium Support or Curation Plan)
      const hasUnlimitedCurations = subscriber.curations === -1
      const hasRemainingCurations = subscriber.curations > 0
      
      if (!hasUnlimitedCurations && !hasRemainingCurations) {
        throw new Error('No curations remaining. Please upgrade to our Curation Plan ($20.99/month) or Premium Support ($85.99/month) at https://buy.stripe.com/aFa3cvbcw69We9nfG218c01')
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

      // If content was successfully curated and user doesn't have unlimited curations, decrement their curations
      console.log('Checking conditions for decrementing curations:', {
        newItemsCount,
        hasUnlimitedCurations: subscriber.curations === -1,
        currentCurations: subscriber.curations
      })

      if (newItemsCount > 0 && subscriber.curations !== -1) {
        console.log(`Decrementing curations for user ${subscriber.email} from ${subscriber.curations} to ${subscriber.curations - 1}`)
        
        // First, get the current curations count to ensure we have the latest value
        const { data: currentData, error: fetchError } = await client
          .from('subscribers')
          .select('curations, customer')
          .eq('id', userId)
          .single()

        console.log('Current subscriber data:', currentData)

        if (fetchError || !currentData) {
          console.error(`❌ Failed to fetch current curations for ${subscriber.email}:`, fetchError)
          throw new Error('Failed to verify current curations')
        }

        // Only decrement if they don't have unlimited curations
        if (currentData.curations !== -1) {
          // Update with the verified current count
          const newCount = Math.max(0, currentData.curations - 1)
          console.log(`Attempting to update curations to ${newCount}`)
          
          // Perform the update without expecting a return value
          const { error: updateError } = await client
            .from('subscribers')
            .update({ 
              curations: newCount,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)

          if (updateError) {
            console.error(`❌ Failed to update remaining curations for ${subscriber.email}:`, updateError)
            throw new Error('Failed to update remaining curations')
          }

          // Verify the update with a separate query
          const { data: verifyData, error: verifyError } = await client
            .from('subscribers')
            .select('curations')
            .eq('id', userId)
            .single()

          console.log('Verification after update:', {
            expected: newCount,
            actual: verifyData?.curations,
            error: verifyError
          })

          if (verifyError || verifyData?.curations !== newCount) {
            console.error('❌ Update verification failed:', {
              expected: newCount,
              actual: verifyData?.curations,
              error: verifyError
            })
            throw new Error('Failed to verify curation count update')
          }

          // Log the successful update
          console.log(`✅ Successfully updated and verified curations for ${subscriber.email} to ${newCount}`)
          
          // Update the subscriber object with new count
          subscriber.curations = newCount
        } else {
          console.log('Skipping curation decrement: user has unlimited curations')
        }
      } else {
        console.log('Skipping curation decrement:', {
          reason: newItemsCount === 0 ? 'no new items curated' : 'user has unlimited curations',
          newItemsCount,
          hasUnlimitedCurations: subscriber.curations === -1
        })
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