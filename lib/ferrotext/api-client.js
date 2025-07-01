export class RustApiClient {
  constructor(options = {}) {
    this.baseUrl = 'https://crates.io/api/v1'
    this.userAgent = options.userAgent || 'rustoleum-crawler/1.0'
    this.rateLimitDelay = options.rateLimitDelay || 1000 // 1 second between requests
  }

  async getTopPackages(limit = 1000) {
    console.log(`🔍 Fetching top ${limit} most popular Rust packages...`)
    
    const packages = []
    const perPage = 100 // Max allowed by crates.io API
    const totalPages = Math.ceil(limit / perPage)
    
    for (let page = 1; page <= totalPages; page++) {
      const pageLimit = Math.min(perPage, limit - packages.length)
      
      try {
        console.log(`📄 Fetching page ${page}/${totalPages} (${packages.length}/${limit} packages)`)
        
        const response = await this.makeRequest(`/crates`, {
          page,
          per_page: pageLimit,
          sort: 'downloads' // Sort by download count (popularity)
        })
        
        if (!response.crates || response.crates.length === 0) {
          console.log('No more packages found')
          break
        }
        
        packages.push(...response.crates)
        
        // Rate limiting
        if (page < totalPages) {
          await this.sleep(this.rateLimitDelay)
        }
        
      } catch (error) {
        console.error(`Failed to fetch page ${page}:`, error.message)
        // Continue with next page instead of failing completely
        continue
      }
    }
    
    console.log(`✅ Retrieved ${packages.length} packages`)
    return packages.slice(0, limit) // Ensure we don't exceed the limit
  }

  async getCrateDetails(crateName) {
    try {
      const response = await this.makeRequest(`/crates/${crateName}`)
      return response.crate
    } catch (error) {
      console.error(`Failed to get details for ${crateName}:`, error.message)
      throw error
    }
  }

  async getCrateVersions(crateName) {
    try {
      const response = await this.makeRequest(`/crates/${crateName}/versions`)
      return response.versions
    } catch (error) {
      console.error(`Failed to get versions for ${crateName}:`, error.message)
      throw error
    }
  }

  async makeRequest(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })
    
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async testConnection() {
    try {
      const response = await this.makeRequest('/crates', { per_page: 1 })
      console.log('✅ Crates.io API connection successful')
      return true
    } catch (error) {
      console.error('❌ Crates.io API connection failed:', error.message)
      return false
    }
  }
} 