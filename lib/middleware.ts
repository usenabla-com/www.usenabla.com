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
    const isStripeWebhook = request.nextUrl.pathname.startsWith('/api/stripe/webhook')
    const isBlog = request.nextUrl.pathname.startsWith('/blog')
    const isNabla = request.nextUrl.pathname.includes('/nabla')
    const isPublicRoute = request.nextUrl.pathname === '/'
    const isPublicAsset = request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|json)$/)
    const isOnboarding = request.nextUrl.pathname.includes('/onboarding')
    const isConfirm = request.nextUrl.pathname.includes('/confirm')
    // Allow public assets, service worker, and blog API, docs, and dashboard
    if (isPublicAsset || isBlogApi || isBlog || isStripeWebhook || isNabla || isPublicRoute || isOnboarding || isConfirm) {
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

    // Allow access to all other routes
    return response
  } catch (error) {
    console.error('❌ Middleware: Error in user check:', error)
    return NextResponse.redirect(new URL('/', request.url)) 
  }
}