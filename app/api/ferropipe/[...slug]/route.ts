import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { RustApiClient } from '@/lib/ferropipe/api-client'
import { RustDocParser } from '@/lib/ferropipe/parser'

// Initialize Supabase client for server-side operations
async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

const supabase = createSupabaseServerClient()
const rustApiClient = new RustApiClient()
const parser = new RustDocParser()

// In-memory rate limit cache (in production, use Redis)
const rateLimitCache = new Map<string, { count: number; resetTime: number }>()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const [action, ...args] = slug

    // Create supabase client for this request
    const supabase = await createSupabaseServerClient()

    // Authenticate API request
    const apiKey = request.headers.get('x-api-key') || searchParams.get('api_key')
    const authResult = await authenticateRequest(apiKey, request, supabase)
    
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Rate limiting check
    const rateLimitResult = await checkRateLimit(authResult.user, request)
    if (!rateLimitResult.success) {
      const errorResponse = NextResponse.json({ error: rateLimitResult.error || 'Rate limit exceeded' }, { status: 429 })
      if (rateLimitResult.rateLimitInfo) {
        addRateLimitHeaders(errorResponse, rateLimitResult.rateLimitInfo)
      }
      return errorResponse
    }

    // Add rate limit info to user object for handlers to use
    const userWithRateLimit = { ...authResult.user, rateLimitInfo: rateLimitResult.rateLimitInfo }

    switch (action) {
      case 'crate':
        return await handleCrateRequest(args[0], searchParams, userWithRateLimit, supabase)
      case 'search':
        return await handleSearchRequest(searchParams, userWithRateLimit, supabase)
      case 'bulk':
        return await handleBulkRequest(searchParams, userWithRateLimit, supabase)
      case 'popular':
        return await handlePopularRequest(searchParams, userWithRateLimit)
      case 'debug':
        const debugResponse = await handleDebugRequest(supabase)
        addRateLimitHeaders(debugResponse, userWithRateLimit.rateLimitInfo)
        return debugResponse
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleCrateRequest(
  crateName: string, 
  searchParams: URLSearchParams, 
  user: any,
  supabase: any
) {
  if (!crateName) {
    return NextResponse.json({ error: 'Crate name is required' }, { status: 400 })
  }

  const options = {
    version: searchParams.get('version') || 'latest',
    depth: (searchParams.get('depth') as 'basic' | 'full' | 'deep') || 'basic',
    fresh: searchParams.get('fresh') === 'true',
    includeExamples: searchParams.get('examples') === 'true',
    includeDependencies: searchParams.get('dependencies') === 'true',
  }

  // Check user's tier permissions
  if (!canAccessDepth(user.tier, options.depth)) {
    return NextResponse.json({
      error: `${options.depth} extraction requires ${getRequiredTier(options.depth)} tier or higher`
    }, { status: 403 })
  }

  const startTime = Date.now()
  const data = await getCrateData(crateName, options, supabase)
  const responseTime = Date.now() - startTime

  // Track usage for billing
  await trackApiUsage({
    user_id: user.id,
    api_key: user.api_key,
    endpoint: `/crate/${crateName}`,
    package_name: crateName,
    extraction_depth: options.depth,
    response_time_ms: responseTime,
    cache_hit: data._cached || false
  }, supabase)

  // Create response with rate limit headers
  const response = NextResponse.json(data)
  addRateLimitHeaders(response, user.rateLimitInfo)
  return response
}

async function getCrateData(crateName: string, options: any, supabase: any) {
  const { version, depth, fresh } = options

  // Check cache first (unless fresh=true)
  if (!fresh) {
    console.log('🔍 Checking cache for:', { crateName, version, depth })
    
    const { data: cached, error: cacheError } = await supabase
      .from('packages')
      .select('*')
      .eq('package_name', crateName)
      .eq('version', version)
      .eq('extraction_depth', depth)
      .gt('cache_expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (cacheError) {
      console.log('🔍 Cache error:', cacheError.message)
    }

    if (cached) {
      console.log('✅ Cache hit! Using cached data:', cached.id)
      // Update usage stats
      await supabase
        .from('packages')
        .update({ 
          last_requested: new Date().toISOString(),
          request_count: cached.request_count + 1
        })
        .eq('id', cached.id)

      return { ...cached, _cached: true }
    } else {
      console.log('🔍 Cache miss - proceeding with fresh extraction')
    }
  }

  // Extract fresh data
  const startTime = Date.now()
  
  let crateInfo
  try {
    crateInfo = await rustApiClient.getCrateDetails(crateName)
  } catch (error) {
    console.error('❌ Failed to fetch crate details from crates.io:', error instanceof Error ? error.message : 'Unknown error')
    // Provide fallback data when crates.io is unavailable
    crateInfo = {
      name: crateName,
      max_version: version === 'latest' ? '0.0.0' : version,
      description: `Package information for ${crateName}`,
      downloads: 0,
      repository: null,
      homepage: null,
      documentation: null
    }
  }
  
  const docText = await getDocumentationText(crateName)
  
  // Fetch Cargo.toml content
  const cargoTomlContent = await fetchCargoToml(crateName, version === 'latest' ? crateInfo.max_version : version)
  
  // Fetch full source code (for full/deep tiers)
  let sourceCodeData = null
  if (depth === 'full' || depth === 'deep') {
    console.log('🔍 Fetching full source code...')
    sourceCodeData = await fetchSourceCode(crateName, version === 'latest' ? crateInfo.max_version : version)
  }
  
  let extractedData: any = {
    package_name: crateName,
    version: version === 'latest' ? crateInfo.max_version : version,
    extraction_depth: depth,
    description: crateInfo.description,
    downloads: crateInfo.downloads,
    repository: crateInfo.repository,
    llm_text: docText,
    cargo_toml: cargoTomlContent,
    source: sourceCodeData,
    extraction_time_ms: 0,
    cache_expires_at: calculateCacheExpiry(crateName, depth),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_requested: new Date().toISOString(),
    request_count: 1
  }

  // Extract structured data based on depth
  const structuredData = await parser.extractStructuredData(docText, crateInfo)
  extractedData = { ...extractedData, ...structuredData }

  // Enhanced extraction for full/deep tiers
  if (depth === 'full' || depth === 'deep') {
    console.log('🔍 Enhanced extraction for depth:', depth, 'includeExamples:', options.includeExamples)
    if (options.includeExamples) {
      console.log('🔍 Starting code example extraction for:', crateName)
      extractedData.api_usage_examples = await extractCodeExamples(crateName)
      console.log('✅ Code example extraction completed. Found:', extractedData.api_usage_examples.length, 'examples')
    } else {
      console.log('⚠️ Code examples not requested (includeExamples is false)')
      extractedData.api_usage_examples = []
    }
    if (options.includeDependencies) {
      extractedData.dependency_graph = await analyzeDependencies(crateName)
    }
  } else {
    console.log('⚠️ Depth is', depth, '- skipping enhanced extraction')
    extractedData.api_usage_examples = []
  }

  if (depth === 'deep') {
    // For deep tier, we can add additional analysis here if needed
    // Removed detailed_modules, detailed_structs, and performance_metrics as they're redundant
    console.log('🔍 Deep tier processing - enhanced data already included')
  }

  extractedData.extraction_time_ms = Date.now() - startTime

  // Generate comprehensive LLM text using OpenAI (for full/deep tiers)
  if ((depth === 'full' || depth === 'deep') && process.env.OPENAI_API_KEY) {
    console.log('🤖 Generating comprehensive LLM text with OpenAI...')
    extractedData.llm_text = await generateComprehensiveLLMText(crateName, extractedData, crateInfo)
  }

  // Save to Supabase
  console.log('💾 Saving to Supabase...', { package_name: extractedData.package_name, version: extractedData.version, depth })
  
  const { data: savedData, error } = await supabase
    .from('packages')
    .upsert(extractedData, { 
      onConflict: 'package_name,version,extraction_depth',
      ignoreDuplicates: false 
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Error saving to Supabase:', error)
    console.error('Data being saved:', JSON.stringify(extractedData, null, 2))
    return extractedData // Return data even if save fails
  }

  console.log('✅ Successfully saved to Supabase:', savedData?.id)
  return { ...savedData, _cached: false }
}

async function handleSearchRequest(searchParams: URLSearchParams, user: any, supabase: any) {
  const query = searchParams.get('q') || searchParams.get('query')
  const semantic = searchParams.get('semantic') === 'true'
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
  }

  let results = []

  if (semantic && user.tier !== 'basic') {
    // Semantic search using vector embeddings
    const queryEmbedding = await generateEmbedding(query)
    
    const { data, error } = await supabase.rpc('search_packages_semantic', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit
    })

    if (!error) results = data
  } else {
    // Full-text search
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .textSearch('llm_text', query, { type: 'websearch' })
      .limit(limit)

    if (!error) results = data
  }

  const responseData = {
    query,
    semantic,
    results,
    total: results.length,
    timestamp: new Date().toISOString()
  }

  const response = NextResponse.json(responseData)
  addRateLimitHeaders(response, user.rateLimitInfo)
  return response
}

// Add these functions after handleSearchRequest
async function handleBulkRequest(searchParams: URLSearchParams, user: any, supabase: any) {
  const names = searchParams.get('names')?.split(',') || []
  const depth = (searchParams.get('depth') as 'basic' | 'full' | 'deep') || 'basic'
  
  if (names.length === 0) {
    return NextResponse.json({ error: 'Crate names are required' }, { status: 400 })
  }

  // Check user's tier permissions for the requested depth
  if (!canAccessDepth(user.tier, depth)) {
    return NextResponse.json({
      error: `${depth} extraction requires ${getRequiredTier(depth)} tier or higher`
    }, { status: 403 })
  }

  // Check if bulk request count exceeds tier limits
  const maxBulkSize = getTierBulkLimit(user.tier)
  if (names.length > maxBulkSize) {
    return NextResponse.json({
      error: `Bulk requests limited to ${maxBulkSize} crates for ${user.tier} tier`
    }, { status: 403 })
  }

  const results = await Promise.allSettled(
    names.map(name => getCrateData(name.trim(), { depth }, supabase))
  )

  const successful = results
    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
    .map(result => result.value)

  const failed = results
    .map((result, index) => result.status === 'rejected' ? names[index] : null)
    .filter(Boolean)

  const responseData = {
    successful,
    failed,
    total_requested: names.length,
    total_successful: successful.length,
    timestamp: new Date().toISOString()
  }

  const response = NextResponse.json(responseData)
  addRateLimitHeaders(response, user.rateLimitInfo)
  return response
}

async function handlePopularRequest(searchParams: URLSearchParams, user: any) {
  const limit = parseInt(searchParams.get('limit') || '100')
  const packages = await rustApiClient.getTopPackages(limit)
  
  const responseData = {
    packages,
    total: packages.length,
    timestamp: new Date().toISOString()
  }

  const response = NextResponse.json(responseData)
  addRateLimitHeaders(response, user.rateLimitInfo)
  return response
}

// Helper functions
async function authenticateRequest(apiKey: string | null, request: NextRequest, supabase: any) {
  if (!apiKey) {
    return { success: false, error: 'API key required' }
  }

  const { data: keyData, error } = await supabase
    .from('api_keys')
    .select('*, user_id')
    .eq('api_key', apiKey)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error || !keyData) {
    return { success: false, error: 'Invalid API key' }
  }

  return { 
    success: true, 
    user: { 
      id: keyData.user_id, 
      tier: keyData.tier,
      api_key: apiKey,
      rate_limit: keyData.rate_limit_per_minute,
      monthly_quota: keyData.monthly_quota,
      current_usage: keyData.current_usage
    }
  }
}

async function checkRateLimit(user: any, request: NextRequest) {
  // Check monthly quota first
  if (user.current_usage >= user.monthly_quota) {
    return { 
      success: false, 
      error: `Monthly quota of ${user.monthly_quota} requests exceeded` 
    }
  }

  // Per-minute rate limiting
  const now = Date.now()
  const minute = Math.floor(now / 60000) // Current minute
  const cacheKey = `${user.api_key}-${minute}`
  
  const currentLimit = rateLimitCache.get(cacheKey)
  let currentUsage = 0
  
  if (currentLimit) {
    currentUsage = currentLimit.count
    if (currentLimit.count >= user.rate_limit) {
      return {
        success: false,
        error: `Rate limit exceeded. Maximum ${user.rate_limit} requests per minute.`,
        rateLimitInfo: {
          limit: user.rate_limit,
          remaining: 0,
          reset: (minute + 1) * 60, // Next minute in Unix timestamp
          used: currentUsage
        }
      }
    }
    currentLimit.count++
    currentUsage = currentLimit.count
  } else {
    rateLimitCache.set(cacheKey, { count: 1, resetTime: minute })
    currentUsage = 1
    
    // Clean up old entries (older than 2 minutes)
    const cutoff = minute - 2
    for (const [key, value] of rateLimitCache.entries()) {
      if (value.resetTime < cutoff) {
        rateLimitCache.delete(key)
      }
    }
  }

  return { 
    success: true,
    rateLimitInfo: {
      limit: user.rate_limit,
      remaining: user.rate_limit - currentUsage,
      reset: (minute + 1) * 60, // Next minute in Unix timestamp
      used: currentUsage
    }
  }
}

async function trackApiUsage(usage: any, supabase: any) {
  try {
    // Insert usage record for analytics
    await supabase.from('api_usage').insert(usage)
    
    // Increment current usage for the API key to enforce monthly quotas
    const { data: keyData, error: selectError } = await supabase
      .from('api_keys')
      .select('current_usage')
      .eq('api_key', usage.api_key)
      .single()
    
    if (selectError) {
      console.error('❌ Error selecting current_usage:', selectError)
      return
    }
    
    if (keyData) {
      const { error: updateError } = await supabase
        .from('api_keys')
        .update({ 
          current_usage: keyData.current_usage + 1
        })
        .eq('api_key', usage.api_key)
      
      if (updateError) {
        console.error('❌ Error updating current_usage:', updateError)
      } else {
        console.log(`✅ Updated current_usage from ${keyData.current_usage} to ${keyData.current_usage + 1} for API key`)
      }
    }
  } catch (error) {
    console.error('❌ Error in trackApiUsage:', error)
  }
}

function canAccessDepth(tier: string, depth: string): boolean {
  const tierLevels = { basic: 1, professional: 2, enterprise: 3 }
  const depthLevels = { basic: 1, full: 2, deep: 3 }
  
  return tierLevels[tier as keyof typeof tierLevels] >= depthLevels[depth as keyof typeof depthLevels]
}

function getRequiredTier(depth: string): string {
  const requirements = { basic: 'basic', full: 'professional', deep: 'enterprise' }
  return requirements[depth as keyof typeof requirements]
}

function getTierBulkLimit(tier: string): number {
  const limits = { basic: 5, professional: 20, enterprise: 100 }
  return limits[tier as keyof typeof limits] || 5
}

function calculateCacheExpiry(crateName: string, depth: string): string {
  const hours = { basic: 24, full: 12, deep: 6 }
  const hoursToAdd = hours[depth as keyof typeof hours] || 24
  
  return new Date(Date.now() + (hoursToAdd * 60 * 60 * 1000)).toISOString()
}

// Placeholder implementations
async function getDocumentationText(crateName: string): Promise<string> {
  try {
    // Get basic crate info first
    const crateInfo = await rustApiClient.getCrateDetails(crateName)
    
    // Use the parser to extract actual documentation content
    console.log(`📖 Extracting documentation for ${crateName}...`)
    const structuredData = await parser.extractStructuredData('', crateInfo)
    
    // Build comprehensive LLM text from structured data
    let llmText = `${crateInfo.description || ''}\n\n`
    llmText += `Version: ${crateInfo.max_version}\n`
    llmText += `Downloads: ${crateInfo.downloads}\n`
    llmText += `Repository: ${crateInfo.repository || 'N/A'}\n\n`
    
    // Add modules information
    if (structuredData.key_modules?.modules?.length > 0) {
      llmText += `## Key Modules:\n`
      structuredData.key_modules.modules.forEach((mod: any) => {
        llmText += `- ${mod.name}: ${mod.description || 'Core module'}\n`
      })
      llmText += '\n'
    }
    
    // Add structs information
    if (structuredData.important_structs?.structs?.length > 0) {
      llmText += `## Important Structs:\n`
      structuredData.important_structs.structs.forEach((struct: any) => {
        llmText += `- ${struct.name}: ${struct.description || 'Key data structure'}\n`
      })
      llmText += '\n'
    }
    
    // Add traits information
    if (structuredData.traits?.traits?.length > 0) {
      llmText += `## Traits:\n`
      structuredData.traits.traits.forEach((trait: any) => {
        llmText += `- ${trait.name}: ${trait.description || 'Core trait'}\n`
      })
      llmText += '\n'
    }
    
    // Add features
    if (structuredData.features?.length > 0) {
      llmText += `## Features: ${structuredData.features.join(', ')}\n\n`
    }
    
    console.log(`✅ Generated ${llmText.length} characters of LLM text for ${crateName}`)
    return llmText
    
  } catch (error) {
    console.error(`Failed to get documentation for ${crateName}:`, error instanceof Error ? error.message : 'Unknown error')
    // Return fallback documentation when network is unavailable
    return `Documentation for ${crateName}\n\nThis is a Rust crate. Network unavailable for detailed information.`
  }
}

async function extractCodeExamples(crateName: string): Promise<Array<{
  code: string
  description: string
  type: string
  language: string
}>> {
  try {
    console.log(`🔍 Extracting code examples for ${crateName} from docs.rs...`)
    
    // Fetch the main docs.rs page for the crate
    const docsUrl = `https://docs.rs/${crateName}/latest/${crateName}/`
    const response = await fetch(docsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ferropipeBot/1.0)'
      }
    })
    
    if (!response.ok) {
      console.log(`❌ Failed to fetch docs for ${crateName}: ${response.status}`)
      return []
    }
    
    const html = await response.text()
    const cheerio = await import('cheerio')
    const $ = cheerio.load(html)
    
    const examples: Array<{
      code: string
      description: string
      type: string
      language: string
    }> = []
    
    // 1. Extract examples from the main crate documentation
    $('.docblock .example-wrap pre, .docblock pre code').each((i, el) => {
      const $el = $(el)
      const code = $el.text().trim()
      
      // Check if it's Rust code with meaningful content
      if (code.length > 30 && 
          (code.includes('use ' + crateName) || 
           code.includes('extern crate') ||
           code.includes('::') ||
           code.includes('fn main()') ||
           code.includes('.unwrap()') ||
           code.includes('#[') ||
           (code.includes('use ') && code.includes(';')))) {
        
        // Get surrounding context for description
        let description = 'Code example'
        const $docblock = $el.closest('.docblock')
        if ($docblock.length > 0) {
          // Look for preceding text in the same docblock
          const precedingText = $docblock.clone().find('pre').remove().end().text().trim()
          if (precedingText && precedingText.length < 300) {
            description = precedingText.substring(0, 200) + (precedingText.length > 200 ? '...' : '')
          }
        }
        
        examples.push({
          code: code,
          description: description,
          type: 'main_documentation',
          language: 'rust'
        })
      }
    })
    
    // 2. Look for "Examples" sections specifically
    $('h1, h2, h3, h4, h5, h6').each((i, el) => {
      const $heading = $(el)
      const headingText = $heading.text().trim().toLowerCase()
      
      if (headingText.includes('example') || headingText.includes('usage') || headingText === 'examples') {
        // Find code blocks after this heading
        let $current = $heading.next()
        let attempts = 0
        
        while ($current.length > 0 && attempts < 8) {
          const $code = $current.find('pre code, .example-wrap pre').first()
          if ($code.length > 0) {
            const code = $code.text().trim()
            if (code.length > 20 && 
                (code.includes('use ') || 
                 code.includes('fn ') || 
                 code.includes('let ') ||
                 code.includes('impl ') ||
                 code.includes(crateName))) {
              
              examples.push({
                code: code,
                description: headingText.charAt(0).toUpperCase() + headingText.slice(1),
                type: 'examples_section',
                language: 'rust'
              })
              break
            }
          }
          
          // Also check if the current element itself is a code block
          if ($current.is('pre') || $current.hasClass('example-wrap')) {
            const code = $current.find('code').text().trim() || $current.text().trim()
            if (code.length > 20 && code.includes(crateName)) {
              examples.push({
                code: code,
                description: headingText.charAt(0).toUpperCase() + headingText.slice(1),
                type: 'examples_section',
                language: 'rust'
              })
              break
            }
          }
          
          $current = $current.next()
          attempts++
        }
      }
    })
    
    // 3. Extract from method documentation pages
    try {
      // Look for common method documentation that often has examples
      const methodUrls = [
        `https://docs.rs/${crateName}/latest/${crateName}/fn.new.html`,
        `https://docs.rs/${crateName}/latest/${crateName}/struct.${crateName.charAt(0).toUpperCase() + crateName.slice(1)}.html`,
      ]
      
      for (const methodUrl of methodUrls.slice(0, 2)) { // Limit to avoid too many requests
        try {
          const methodResponse = await fetch(methodUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ferropipeBot/1.0)' }
          })
          
          if (methodResponse.ok) {
            const methodHtml = await methodResponse.text()
            const $method = cheerio.load(methodHtml)
            
            $method('.docblock .example-wrap pre, .docblock pre code').each((j, methodEl) => {
              const methodCode = $method(methodEl).text().trim()
              if (methodCode.length > 25 && methodCode.includes(crateName)) {
                examples.push({
                  code: methodCode,
                  description: 'Method documentation example',
                  type: 'method_documentation',
                  language: 'rust'
                })
              }
            })
          }
        } catch (methodError) {
          // Silently continue if method page doesn't exist
        }
      }
    } catch (error) {
      // Don't fail the whole function if method scraping fails
    }
    
    // Remove duplicates and prioritize examples
    const uniqueExamples = examples
      .filter((example, index, self) => {
        // Remove duplicates based on code similarity
        const codeLines = example.code.split('\n').filter(line => line.trim().length > 0)
        return index === self.findIndex(e => {
          const otherLines = e.code.split('\n').filter(line => line.trim().length > 0)
          return codeLines.length === otherLines.length && 
                 codeLines.slice(0, 3).join('') === otherLines.slice(0, 3).join('')
        })
      })
      .sort((a, b) => {
        // Prioritize examples_section over others
        if (a.type === 'examples_section' && b.type !== 'examples_section') return -1
        if (b.type === 'examples_section' && a.type !== 'examples_section') return 1
        return b.code.length - a.code.length // Longer examples first
      })
      .slice(0, 8) // Limit to 8 best examples
    
    console.log(`✅ Found ${uniqueExamples.length} code examples for ${crateName}`)
    return uniqueExamples
    
  } catch (error) {
    console.error(`❌ Error extracting examples for ${crateName}:`, error instanceof Error ? error.message : 'Unknown error')
    return []
  }
}

async function analyzeDependencies(crateName: string): Promise<any> {
  try {
    console.log(`🔍 Analyzing dependencies for ${crateName} from docs.rs...`)
    
    // Fetch the main crate page from docs.rs which shows dependencies in sidebar
    const crateUrl = `https://docs.rs/crate/${crateName}/latest`
    const response = await fetch(crateUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ferropipeBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const html = await response.text()
    const cheerio = await import('cheerio')
    const $ = cheerio.load(html)
    
    const dependencies: Array<{
      name: string
      version_req: string
      optional: boolean
      kind: string
    }> = []
    
    // Target the exact structure: "Dependencies" heading followed by sub-menu with links
    let foundDependencies = false
    
    // Look for the Dependencies heading in the sidebar menu
    $('.pure-menu-heading').each((i, el) => {
      const $heading = $(el)
      const headingText = $heading.text().trim()
      
      if (headingText === 'Dependencies') {
        foundDependencies = true
        console.log('🔍 Found Dependencies section in sidebar')
        
        // The dependencies are in the next sibling's sub-menu
        const $depSection = $heading.next('.pure-menu-item')
        
        // Find all dependency links in the sub-menu
        $depSection.find('.pure-menu-list .pure-menu-item a.pure-menu-link').each((j, linkEl) => {
          const $link = $(linkEl)
          const linkText = $link.text().trim()
          
          // Extract dependency name and version from text like "serde_derive ^1"
          const depMatch = linkText.match(/^([a-zA-Z0-9_-]+)\s+([^\s]+)/)
          
          if (depMatch && depMatch[1] && depMatch[2]) {
            const depName = depMatch[1]
            const version = depMatch[2]
            
            // Check for optional and kind indicators
            const isOptional = $link.find('i').text().includes('optional')
            const kindEl = $link.find('i.dependencies')
            let kind = 'normal'
            
            if (kindEl.length > 0) {
              const kindText = kindEl.text().trim().toLowerCase()
              if (['dev', 'build'].includes(kindText)) {
                kind = kindText
              }
            }
            
            dependencies.push({
              name: depName,
              version_req: version,
              optional: isOptional,
              kind: kind
            })
          }
        })
      }
    })
    
    // Fallback: If no Dependencies heading found, look for dependency-like links
    if (!foundDependencies || dependencies.length === 0) {
      console.log('🔍 Fallback: searching for dependency patterns in sidebar...')
      
      // Look for links that match dependency patterns
      $('.pure-menu-list .pure-menu-item a').each((i, el) => {
        const $link = $(el)
        const href = $link.attr('href') || ''
        const linkText = $link.text().trim()
        
        // Dependencies typically have hrefs like "/crate/serde_derive/^1"
        if (href.startsWith('/crate/') && href !== `/crate/${crateName}`) {
          const depMatch = linkText.match(/^([a-zA-Z0-9_-]+)\s+([^\s]+)$/)
          
          if (depMatch && depMatch[1] && depMatch[2]) {
            const depName = depMatch[1]
            const version = depMatch[2]
            
            // Validate it's a real dependency
            if (depName.length > 1 && 
                depName !== crateName &&
                version.match(/^[\^~>=<\d\.\*]/) &&
                !version.includes('/')) {
              
              dependencies.push({
                name: depName,
                version_req: version,
                optional: linkText.includes('optional'),
                kind: linkText.includes('dev') ? 'dev' : 'normal'
              })
            }
          }
        }
      })
    }
    
    // Remove duplicates and clean up
    const uniqueDeps = dependencies
      .filter((dep, index, self) => 
        index === self.findIndex(d => d.name === dep.name && d.kind === dep.kind)
      )
      .filter(dep => {
        // Final validation
        return dep.name.length > 1 &&
               dep.name.match(/^[a-zA-Z][a-zA-Z0-9_-]*$/) &&
               dep.version_req.length > 0
      })
      .slice(0, 25) // Reasonable limit
    
    console.log(`✅ Found ${uniqueDeps.length} dependencies for ${crateName}`)
    
    return {
      dependencies: uniqueDeps,
      total_count: uniqueDeps.length,
      runtime_count: uniqueDeps.filter(dep => dep.kind === 'normal').length,
      source: 'docs.rs_sidebar'
    }
    
  } catch (error) {
    console.error(`❌ Error analyzing dependencies for ${crateName}:`, error instanceof Error ? error.message : 'Unknown error')
    
    // Fallback to crates.io API if docs.rs fails
    try {
      console.log(`🔄 Falling back to crates.io API for ${crateName}...`)
      const apiResponse = await fetch(`https://crates.io/api/v1/crates/${crateName}/dependencies`, {
        headers: {
          'User-Agent': 'ferropipe-crawler/1.0',
          'Accept': 'application/json'
        }
      })
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json()
        const apiDeps = apiData.dependencies || []
        
        const processedDeps = apiDeps
          .filter((dep: any) => dep.kind === 'normal')
          .slice(0, 20)
          .map((dep: any) => ({
            name: dep.crate_id,
            version_req: dep.req,
            optional: dep.optional,
            kind: dep.kind
          }))
        
        return {
          dependencies: processedDeps,
          total_count: apiDeps.length,
          runtime_count: processedDeps.length,
          source: 'crates.io_api_fallback'
        }
      }
    } catch (fallbackError) {
      console.error('Both docs.rs and crates.io failed for dependencies')
    }
    
    return {
      dependencies: [],
      total_count: 0,
      runtime_count: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'failed'
    }
  }
}

async function generateEmbedding(text: string): Promise<number[] | null> {
  // Implement OpenAI embedding generation
  // For now, return null to avoid vector dimension errors
  return null
}

async function handleDebugRequest(supabase: any) {
  const debugResults: any = {}
  
  // Test 1: Check if we can read from packages table
  console.log('🔍 Testing packages table read access...')
  const { data: packagesData, error: packagesError } = await supabase
    .from('packages')
    .select('*')
    .limit(5)
  
  debugResults.packages_read = {
    success: !packagesError,
    error: packagesError?.message,
    count: packagesData?.length || 0,
    data: packagesData
  }
  
  // Test 2: Try to insert a test record
  console.log('🔍 Testing packages table write access...')
  const testRecord = {
    package_name: 'debug-test-' + Date.now(),
    version: '1.0.0',
    extraction_depth: 'basic',
    description: 'Test record for debugging RLS',
    downloads: 0,
    repository: null,
    homepage: null,
    documentation: null,
    llm_text: 'Test text for debugging',
    extraction_time_ms: 0,
    cache_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_requested: new Date().toISOString(),
    request_count: 1,
    key_modules: { modules: [] },
    important_structs: { structs: [] },
    notable_functions: { functions: [] },
    traits: { traits: [] },
    features: [],
    embedding: null
  }
  
  const { data: insertData, error: insertError } = await supabase
    .from('packages')
    .insert(testRecord)
    .select()
    .single()
  
  debugResults.packages_write = {
    success: !insertError,
    error: insertError?.message,
    error_code: insertError?.code,
    error_details: insertError?.details,
    data: insertData
  }
  
  // Test 3: Check RLS policies
  console.log('🔍 Checking RLS status...')
  const { data: rlsData, error: rlsError } = await supabase
    .from('pg_tables')
    .select('*')
    .eq('tablename', 'packages')
  
  debugResults.rls_info = {
    success: !rlsError,
    error: rlsError?.message,
    data: rlsData
  }
  
  // Test 4: Check api_keys table access
  console.log('🔍 Testing api_keys table access...')
  const { data: apiKeysData, error: apiKeysError } = await supabase
    .from('api_keys')
    .select('*')
    .limit(1)
  
  debugResults.api_keys_access = {
    success: !apiKeysError,
    error: apiKeysError?.message,
    count: apiKeysData?.length || 0
  }
  
  return NextResponse.json({
    debug_results: debugResults,
    service_role_key_present: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    timestamp: new Date().toISOString()
  })
}

async function fetchCargoToml(crateName: string, version: string): Promise<string | null> {
  try {
    console.log(`🔍 Fetching Cargo.toml for ${crateName}@${version}`)
    
    // Try to fetch from docs.rs source
    const url = `https://docs.rs/crate/${crateName}/${version}/source/Cargo.toml`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ferropipe API v1.0 (Rust Crate Intelligence)'
      }
    })

    if (!response.ok) {
      console.log(`⚠️ Failed to fetch Cargo.toml from docs.rs: ${response.status}`)
      return null
    }

    const html = await response.text()
    
    // Extract content from the syntax-highlighted source code div
    const sourceCodeMatch = html.match(/<div id="source-code"[^>]*>[\s\S]*?<pre><code>([\s\S]*?)<\/code><\/pre>[\s\S]*?<\/div>/i)
    
    if (sourceCodeMatch && sourceCodeMatch[1]) {
      // Clean up the syntax-highlighted HTML to get plain text
      let cargoTomlContent = sourceCodeMatch[1]
        // Remove all span tags but keep their content
        .replace(/<span[^>]*>/g, '')
        .replace(/<\/span>/g, '')
        // Decode HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        // Clean up extra whitespace and normalize line breaks
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .trim()
      
      if (cargoTomlContent) {
        console.log(`✅ Successfully fetched Cargo.toml for ${crateName} (${cargoTomlContent.length} chars)`)
        return cargoTomlContent
      }
    }
    
    console.log(`⚠️ Could not extract Cargo.toml content from HTML for ${crateName}`)
    return null
    
  } catch (error) {
    console.error(`❌ Error fetching Cargo.toml for ${crateName}:`, error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

async function fetchSourceCode(crateName: string, version: string): Promise<any> {
  try {
    console.log(`🔍 Fetching source code for ${crateName}@${version}`)
    
    const sourceFiles: { [path: string]: string } = {}
    const fileMetadata: { [path: string]: { size: number, lines: number, type: string } } = {}
    
    // Start crawling from the root source directory
    await crawlSourceDirectory(crateName, version, 'src/', sourceFiles, fileMetadata)
    
    // Also fetch root files like Cargo.toml, README.md, etc.
    await crawlSourceDirectory(crateName, version, '', sourceFiles, fileMetadata, true)
    
    const totalFiles = Object.keys(sourceFiles).length
    const totalSize = Object.values(sourceFiles).reduce((sum, content) => sum + content.length, 0)
    
    console.log(`✅ Successfully fetched ${totalFiles} source files for ${crateName} (${Math.round(totalSize / 1024)} KB)`)
    
    return {
      source_files: sourceFiles,
      file_metadata: fileMetadata,
      stats: {
        total_files: totalFiles,
        total_size_bytes: totalSize,
        rust_files: Object.keys(fileMetadata).filter(path => path.endsWith('.rs')).length,
        config_files: Object.keys(fileMetadata).filter(path => 
          path.includes('Cargo.toml') || path.includes('.toml') || path.includes('.json')
        ).length,
        doc_files: Object.keys(fileMetadata).filter(path => 
          path.includes('README') || path.includes('.md') || path.includes('LICENSE')
        ).length
      }
    }
    
  } catch (error) {
    console.error(`❌ Error fetching source code for ${crateName}:`, error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

async function crawlSourceDirectory(
  crateName: string, 
  version: string, 
  relativePath: string, 
  sourceFiles: { [path: string]: string },
  fileMetadata: { [path: string]: { size: number, lines: number, type: string } },
  isRoot: boolean = false,
  depth: number = 0
): Promise<void> {
  // Prevent infinite recursion and limit depth
  if (depth > 10) {
    console.log(`⚠️ Maximum depth reached for ${relativePath}`)
    return
  }

  try {
    const url = `https://docs.rs/crate/${crateName}/${version}/source/${relativePath}`
    console.log(`🔍 Crawling directory: ${relativePath || 'root'} (depth: ${depth})`)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ferropipe API v1.0 (Rust Crate Intelligence)'
      }
    })

    if (!response.ok) {
      console.log(`⚠️ Failed to fetch directory ${relativePath}: ${response.status}`)
      return
    }

    const html = await response.text()
    const cheerio = await import('cheerio')
    const $ = cheerio.load(html)
    
    // Extract file and directory listings from the menu
    const items: Array<{ name: string, isDirectory: boolean, href: string }> = []
    
    $('.pure-menu-list .pure-menu-item a.pure-menu-link').each((i, el) => {
      const $link = $(el)
      const href = $link.attr('href') || ''
      const text = $link.find('.text').text().trim()
      const icon = $link.find('.fa').attr('class') || ''
      
      // Skip parent directory links
      if (text === '..' || !text) return
      
      // Determine if it's a directory or file
      const isDirectory = icon.includes('fa-folder') || href.endsWith('/')
      const isRustFile = icon.includes('fa-rust') || text.endsWith('.rs')
      const isConfigFile = text.includes('.toml') || text.includes('.json') || text.includes('.lock')
      const isDocFile = text.includes('README') || text.includes('LICENSE') || text.endsWith('.md')
      
      // For root directory, only fetch important files
      if (isRoot) {
        if (isRustFile || isConfigFile || isDocFile) {
          items.push({ name: text, isDirectory: false, href })
        }
      } else {
        // For src directory, fetch everything
        items.push({ name: text, isDirectory, href })
      }
    })
    
    console.log(`📁 Found ${items.length} items in ${relativePath || 'root'}`)
    
    // Process each item
    for (const item of items) {
      const fullPath = relativePath ? `${relativePath}${item.name}` : item.name
      
      if (item.isDirectory) {
        // Recursively crawl subdirectories (only in src, not root)
        if (!isRoot && depth < 8) {
          await crawlSourceDirectory(
            crateName, 
            version, 
            `${fullPath}/`, 
            sourceFiles, 
            fileMetadata, 
            false, 
            depth + 1
          )
        }
      } else {
        // Fetch file content
        await fetchSingleSourceFile(crateName, version, fullPath, sourceFiles, fileMetadata)
      }
      
      // Add small delay to be respectful to docs.rs
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
  } catch (error) {
    console.error(`❌ Error crawling directory ${relativePath}:`, error instanceof Error ? error.message : 'Unknown error')
  }
}

async function fetchSingleSourceFile(
  crateName: string,
  version: string,
  filePath: string,
  sourceFiles: { [path: string]: string },
  fileMetadata: { [path: string]: { size: number, lines: number, type: string } }
): Promise<void> {
  try {
    const url = `https://docs.rs/crate/${crateName}/${version}/source/${filePath}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ferropipe API v1.0 (Rust Crate Intelligence)'
      }
    })

    if (!response.ok) {
      console.log(`⚠️ Failed to fetch file ${filePath}: ${response.status}`)
      return
    }

    const html = await response.text()
    
    // Extract content from the syntax-highlighted source code div (same logic as Cargo.toml)
    const sourceCodeMatch = html.match(/<div id="source-code"[^>]*>[\s\S]*?<pre><code>([\s\S]*?)<\/code><\/pre>[\s\S]*?<\/div>/i)
    
    if (sourceCodeMatch && sourceCodeMatch[1]) {
      // Clean up the syntax-highlighted HTML to get plain text
      let fileContent = sourceCodeMatch[1]
        // Remove all span tags but keep their content
        .replace(/<span[^>]*>/g, '')
        .replace(/<\/span>/g, '')
        // Decode HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        // Clean up extra whitespace and normalize line breaks
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .trim()
      
      if (fileContent) {
        sourceFiles[filePath] = fileContent
        
        // Calculate metadata
        const lines = fileContent.split('\n').length
        const size = fileContent.length
        let type = 'unknown'
        
        if (filePath.endsWith('.rs')) type = 'rust'
        else if (filePath.includes('.toml')) type = 'config'
        else if (filePath.includes('.json')) type = 'config'
        else if (filePath.includes('README') || filePath.includes('.md')) type = 'documentation'
        else if (filePath.includes('LICENSE')) type = 'license'
        else if (filePath.includes('.txt')) type = 'text'
        
        fileMetadata[filePath] = { size, lines, type }
        
        console.log(`✅ Fetched ${filePath} (${lines} lines, ${size} bytes)`)
      }
    } else {
      console.log(`⚠️ Could not extract content from ${filePath}`)
    }
    
  } catch (error) {
    console.error(`❌ Error fetching file ${filePath}:`, error instanceof Error ? error.message : 'Unknown error')
  }
}

async function generateComprehensiveLLMText(
  crateName: string,
  extractedData: any,
  crateInfo: any
): Promise<string> {
  try {
    console.log(`🤖 Generating comprehensive LLM text for ${crateName} using OpenAI...`)
    
    // Prepare all available data for the prompt
    const sourceCodeSample = extractedData.source?.source_files 
      ? Object.entries(extractedData.source.source_files)
          .filter(([path, _]) => path.endsWith('.rs'))
          .slice(0, 3)
          .map(([path, content]) => `\n### ${path}\n\`\`\`rust\n${(content as string).slice(0, 1000)}${(content as string).length > 1000 ? '\n... (truncated)' : ''}\n\`\`\``)
          .join('\n')
      : ''
    
    const dependenciesText = extractedData.dependency_graph?.dependencies
      ? `\n### Dependencies (${extractedData.dependency_graph.total_count} total):\n` +
        extractedData.dependency_graph.dependencies
          .slice(0, 10)
          .map((dep: any) => `- ${dep.name} ${dep.version_req}${dep.optional ? ' (optional)' : ''}`)
          .join('\n')
      : ''
    
    const examplesText = extractedData.api_usage_examples?.length > 0
      ? `\n### Code Examples:\n` +
        extractedData.api_usage_examples
          .slice(0, 2)
          .map((example: any) => `\n**${example.description}**\n\`\`\`rust\n${example.code.slice(0, 500)}${example.code.length > 500 ? '\n... (truncated)' : ''}\n\`\`\``)
          .join('\n')
      : ''
    
    const cargoTomlSample = extractedData.cargo_toml
      ? `\n### Cargo.toml Configuration:\n\`\`\`toml\n${extractedData.cargo_toml.slice(0, 800)}${extractedData.cargo_toml.length > 800 ? '\n... (truncated)' : ''}\n\`\`\`\n`
      : ''
    
    const structuredDataText = [
      extractedData.key_modules?.modules?.length > 0 ? `\n### Key Modules:\n${extractedData.key_modules.modules.map((m: any) => `- ${m.name}: ${m.description || 'Core module'}`).join('\n')}` : '',
      extractedData.important_structs?.structs?.length > 0 ? `\n### Important Structs:\n${extractedData.important_structs.structs.map((s: any) => `- ${s.name}: ${s.description || 'Key data structure'}`).join('\n')}` : '',
      extractedData.traits?.traits?.length > 0 ? `\n### Traits:\n${extractedData.traits.traits.map((t: any) => `- ${t.name}: ${t.description || 'Core trait'}`).join('\n')}` : '',
      extractedData.features?.length > 0 ? `\n### Features:\n${extractedData.features.join(', ')}` : ''
    ].filter(Boolean).join('\n')
    
    const prompt = `You are a technical documentation expert. Create comprehensive, detailed documentation for the Rust crate "${crateName}" based on the following extracted data. The output should be informative, well-structured, and suitable for developers who want to understand and use this crate.

**Basic Information:**
- Name: ${crateName}
- Version: ${extractedData.version}
- Description: ${crateInfo.description || 'No description available'}
- Downloads: ${crateInfo.downloads?.toLocaleString() || 'Unknown'}
- Repository: ${crateInfo.repository || 'Not specified'}
- License: ${crateInfo.license || 'Not specified'}

**Source Code Analysis:**${sourceCodeSample}

**Dependencies:**${dependenciesText}

**Code Examples:**${examplesText}

**Configuration:**${cargoTomlSample}

**Structured Data:**${structuredDataText}

**Instructions:**
1. Create a comprehensive overview that explains what this crate does and why developers would use it
2. Describe the main features and capabilities
3. Explain the architecture and key components (modules, structs, traits)
4. Provide usage guidance and best practices
5. Highlight important dependencies and how they relate to functionality
6. Include practical examples and use cases
7. Make it informative for both beginners and experienced Rust developers
8. Keep it well-organized with clear sections
9. Focus on practical, actionable information
10. Aim for 800-1500 words of high-quality technical documentation

Generate comprehensive documentation:`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a technical documentation expert specializing in Rust crates. Create comprehensive, accurate, and useful documentation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.3
      })
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }
    
    const result = await response.json()
    const comprehensiveText = result.choices?.[0]?.message?.content?.trim()
    
    if (!comprehensiveText) {
      throw new Error('No content received from OpenAI')
    }
    
    console.log(`✅ Generated ${comprehensiveText.length} characters of comprehensive LLM text for ${crateName}`)
    return comprehensiveText
    
  } catch (error) {
    console.error(`❌ Error generating comprehensive LLM text for ${crateName}:`, error instanceof Error ? error.message : 'Unknown error')
    
    // Fallback to basic concatenation if OpenAI fails
    return generateFallbackLLMText(crateName, extractedData, crateInfo)
  }
}

function generateFallbackLLMText(crateName: string, extractedData: any, crateInfo: any): string {
  console.log(`🔧 Generating fallback LLM text for ${crateName}`)
  
  let text = `# ${crateName}\n\n`
  text += `${crateInfo.description || 'A Rust crate'}\n\n`
  text += `**Version:** ${extractedData.version}\n`
  text += `**Downloads:** ${crateInfo.downloads?.toLocaleString() || 'Unknown'}\n`
  text += `**Repository:** ${crateInfo.repository || 'Not specified'}\n`
  text += `**License:** ${crateInfo.license || 'Not specified'}\n\n`
  
  // Add modules
  if (extractedData.key_modules?.modules?.length > 0) {
    text += `## Key Modules\n`
    extractedData.key_modules.modules.forEach((mod: any) => {
      text += `- **${mod.name}**: ${mod.description || 'Core module'}\n`
    })
    text += '\n'
  }
  
  // Add structs
  if (extractedData.important_structs?.structs?.length > 0) {
    text += `## Important Data Structures\n`
    extractedData.important_structs.structs.forEach((struct: any) => {
      text += `- **${struct.name}**: ${struct.description || 'Key data structure'}\n`
    })
    text += '\n'
  }
  
  // Add traits
  if (extractedData.traits?.traits?.length > 0) {
    text += `## Core Traits\n`
    extractedData.traits.traits.forEach((trait: any) => {
      text += `- **${trait.name}**: ${trait.description || 'Core trait'}\n`
    })
    text += '\n'
  }
  
  // Add dependencies summary
  if (extractedData.dependency_graph?.dependencies?.length > 0) {
    text += `## Dependencies\n`
    text += `This crate depends on ${extractedData.dependency_graph.total_count} external crates, including:\n`
    extractedData.dependency_graph.dependencies.slice(0, 5).forEach((dep: any) => {
      text += `- ${dep.name} ${dep.version_req}\n`
    })
    text += '\n'
  }
  
  // Add features
  if (extractedData.features?.length > 0) {
    text += `## Available Features\n`
    text += `${extractedData.features.join(', ')}\n\n`
  }
  
  // Add examples summary
  if (extractedData.api_usage_examples?.length > 0) {
    text += `## Usage Examples\n`
    text += `This crate provides ${extractedData.api_usage_examples.length} documented code examples covering common use cases.\n\n`
  }
  
  // Add source stats
  if (extractedData.source?.stats) {
    const stats = extractedData.source.stats
    text += `## Source Code Statistics\n`
    text += `- **Total Files:** ${stats.total_files}\n`
    text += `- **Rust Files:** ${stats.rust_files}\n`
    text += `- **Total Size:** ${Math.round(stats.total_size_bytes / 1024)} KB\n\n`
  }
  
  return text
}

// Helper function to add rate limit headers
function addRateLimitHeaders(response: NextResponse, rateLimitInfo: any) {
  if (rateLimitInfo) {
    response.headers.set('X-RateLimit-Limit', rateLimitInfo.limit.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitInfo.reset.toString())
    response.headers.set('X-RateLimit-Used', rateLimitInfo.used.toString())
  }
} 