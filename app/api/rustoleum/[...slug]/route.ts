import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { RustApiClient } from '@/lib/rustoleum/api-client'
import { RustDocParser } from '@/lib/rustoleum/parser'

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
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    switch (action) {
      case 'crate':
        return await handleCrateRequest(args[0], searchParams, authResult.user, supabase)
      case 'search':
        return await handleSearchRequest(searchParams, authResult.user, supabase)
      case 'bulk':
        return await handleBulkRequest(searchParams, authResult.user, supabase)
      case 'popular':
        return await handlePopularRequest(searchParams, authResult.user)
      case 'debug':
        return await handleDebugRequest(supabase)
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

  return NextResponse.json(data)
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
      license: 'Unknown',
      repository: null,
      homepage: null,
      documentation: null
    }
  }
  
  const docText = await getDocumentationText(crateName)
  
  let extractedData: any = {
    package_name: crateName,
    version: version === 'latest' ? crateInfo.max_version : version,
    extraction_depth: depth,
    description: crateInfo.description,
    downloads: crateInfo.downloads,
    license: crateInfo.license,
    repository: crateInfo.repository,
    homepage: crateInfo.homepage,
    documentation: crateInfo.documentation,
    llm_text: docText,
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
    if (options.includeExamples) {
      extractedData.api_usage_examples = await extractCodeExamples(crateName)
    }
    if (options.includeDependencies) {
      extractedData.dependency_graph = await analyzeDependencies(crateName)
    }
  }

  if (depth === 'deep') {
    extractedData.detailed_modules = await scrapeModulePages(crateName)
    extractedData.detailed_structs = await scrapeStructPages(crateName)
    extractedData.performance_metrics = await gatherPerformanceData(crateName)
  }

  extractedData.extraction_time_ms = Date.now() - startTime

  // Generate embedding for semantic search
  if (docText) {
    extractedData.embedding = await generateEmbedding(docText)
  } else {
    // Set to null instead of empty array to avoid vector dimension error
    extractedData.embedding = null
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

  return NextResponse.json({
    query,
    semantic,
    results,
    total: results.length,
    timestamp: new Date().toISOString()
  })
}

// Add these functions after handleSearchRequest
async function handleBulkRequest(searchParams: URLSearchParams, user: any, supabase: any) {
  const names = searchParams.get('names')?.split(',') || []
  const depth = (searchParams.get('depth') as 'basic' | 'full' | 'deep') || 'basic'
  
  if (names.length === 0) {
    return NextResponse.json({ error: 'Crate names are required' }, { status: 400 })
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

  return NextResponse.json({
    successful,
    failed,
    total_requested: names.length,
    total_successful: successful.length,
    timestamp: new Date().toISOString()
  })
}

async function handlePopularRequest(searchParams: URLSearchParams, user: any) {
  const limit = parseInt(searchParams.get('limit') || '100')
  const packages = await rustApiClient.getTopPackages(limit)
  
  return NextResponse.json({
    packages,
    total: packages.length,
    timestamp: new Date().toISOString()
  })
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
  // Implement rate limiting logic
  return { success: true }
}

async function trackApiUsage(usage: any, supabase: any) {
  await supabase.from('api_usage').insert(usage)
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

async function extractCodeExamples(crateName: string): Promise<any[]> {
  return []
}

async function analyzeDependencies(crateName: string): Promise<any> {
  return {}
}

async function scrapeModulePages(crateName: string): Promise<any[]> {
  return []
}

async function scrapeStructPages(crateName: string): Promise<any[]> {
  return []
}

async function gatherPerformanceData(crateName: string): Promise<any> {
  return {}
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
    license: 'MIT',
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