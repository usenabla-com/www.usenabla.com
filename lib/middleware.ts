import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  console.log('🔍 Middleware: Processing request for path:', request.nextUrl.pathname)
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!
  
  console.log('🔌 Middleware: Initializing Supabase with URL:', supabaseUrl)
  
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log('🔐 Middleware: User check -', user ? 'Found user' : 'No user')

    const isAuthCallback = request.nextUrl.pathname.startsWith('/auth')
    const isBlogApi = request.nextUrl.pathname.startsWith('/api/blog')
    const isBlog = request.nextUrl.pathname.startsWith('/blog')
    const isSupport = request.nextUrl.pathname.startsWith('/support')
    const isOnboarding = request.nextUrl.pathname.startsWith('/onboarding')
    const isProfile = request.nextUrl.pathname.startsWith('/profile')
    const isPublicRoute = request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/onboarding'
    const isServiceWorker = request.nextUrl.pathname.includes('service-worker.js')
    const isPublicAsset = request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|json)$/)

    // Allow public assets, service worker, and blog API
    if (isServiceWorker || isPublicAsset || isBlogApi || isBlog) {
      return response
    }

    if (isSupport && user?.id !== 'ec241bb3-293e-4f03-9d07-591f0208d0ad') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (isSupport && user?.id === 'ec241bb3-293e-4f03-9d07-591f0208d0ad') {
      return response
    }

    // If no user, only allow public routes and auth callbacks
    if (!user) {
      console.log('⚠️ Middleware: No authenticated user')
      if (!isPublicRoute && !isAuthCallback) {
        console.log('🔄 Middleware: Redirecting to home - no auth')
        return NextResponse.redirect(new URL('/', request.url))
      }
      return response
    }

    // We have an authenticated user
    console.log('👤 Middleware: Authenticated user:', user.id)

    try {
      // Only check subscriber profile if accessing profile or onboarding pages
      if (isProfile || isOnboarding) {
        console.log('🔍 Middleware: Checking subscriber profile for user:', user.id)
        
        // First, let's verify we can query the database at all
        const { data: tables, error: tablesError } = await supabase
          .from('subscribers')
          .select('count')
          .limit(1)
        
        console.log('📊 Middleware: Database check:', { tables, error: tablesError })
        
        const { data: subscribers, error: subscriberError } = await supabase
          .from('subscribers')
          .select('*')
          .eq('id', user.id)

        if (subscriberError) {
          console.error('❌ Middleware: Error checking subscriber:', subscriberError)
          return response
        }

        console.log('📊 Middleware: Query result:', { subscribers, error: subscriberError })
        
        const hasProfile = subscribers && subscribers.length > 0
        console.log('📋 Middleware: Subscriber check -', hasProfile ? 'Found' : 'Not found', 
          `(${subscribers?.length || 0} records)`)

        // If trying to access profile but no subscriber profile exists
        if (isProfile && !hasProfile) {
          console.log('🔄 Middleware: Redirecting to onboarding - no profile')
          return NextResponse.redirect(new URL('/onboarding', request.url))
        }

        // If trying to access onboarding but already has profile
        if (isOnboarding && hasProfile) {
          const { data: user, error: userError } = await supabase.auth.getUser()
          if (userError) {
            console.error('❌ Middleware: Error checking user:', userError)
            return response
          }
          console.log('🔄 Middleware: Redirecting to home - already has profile')
          return NextResponse.redirect(new URL(`/profile/${user.user.id}`, request.url))
        }
      }

      // Allow access to all other routes
      console.log('✅ Middleware: Access granted')
      return response

    } catch (error) {
      console.error('❌ Middleware: Error in subscriber check:', error)
      return response
    }

  } catch (error) {
    console.error('❌ Middleware: Error in user check:', error)
    return response
  }
}