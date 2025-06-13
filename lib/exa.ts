import Exa from 'exa-js'

const exa = new Exa("bc4679ec-47ed-462f-8142-df9dd3b765b6")

export interface ExaSearchResult {
  title: string
  url: string
  snippet: string
  author?: string
  publishedDate?: string
}

export interface ExaSearchOptions {
  numResults?: number
  includeDomains?: string[]
  excludeDomains?: string[]
  startPublishedDate?: string
  endPublishedDate?: string
}

class ExaService {
  async searchContent(query: string, numResults: number = 10, startPublishedDate?: string): Promise<ExaSearchResult[]> {
    try {
      // Ensure query is a string and not empty
      if (typeof query !== 'string' || !query.trim()) {
        throw new Error(`Invalid query: expected non-empty string, got ${typeof query}: ${JSON.stringify(query)}`)
      }

      const cleanQuery = query.trim()
      
      console.log('🔍 Exa search starting with query:', cleanQuery)
      console.log('📊 Search parameters:', {
        numResults,
        startPublishedDate,
        queryType: typeof cleanQuery,
        queryLength: cleanQuery.length
      })

      // Call searchAndContents with correct parameters
      const response = await exa.searchAndContents(
        cleanQuery,
        {
          numResults,
          startPublishedDate,
          text: true
        }
      )

      console.log('✅ Exa search completed successfully')
      console.log('📈 Results count:', response.results?.length || 0)

      return response.results.map((result: any) => ({
        title: result.title || 'Untitled',
        url: result.url,
        snippet: result.text || result.highlights?.[0] || '',
        author: result.author || undefined,
        publishedDate: result.publishedDate || undefined
      }))
    } catch (error) {
      console.error('❌ Exa search failed:', error)
      throw error
    }
  }

  async curateFeedForUser(curationPrompt: string, options: ExaSearchOptions = {}): Promise<ExaSearchResult[]> {
    // Set default options for feed curation
    const defaultOptions: ExaSearchOptions = {
      numResults: 5,
      startPublishedDate: this.getLastWeekDate(),
      ...options
    }

    return this.searchContent(curationPrompt, defaultOptions.numResults, defaultOptions.startPublishedDate)
  }

  private getLastWeekDate(): string {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date.toISOString().split('T')[0]
  }
}

export const exaService = new ExaService() 