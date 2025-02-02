import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const PUBLIC_ROUTES = ['/login', '/signup', '/auth/callback', '/reset-password']

export async function middleware(request: NextRequest) {
  try {
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            request.cookies.delete({
              name,
              ...options,
            })
          },
        },
      }
    )
    
    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error(`[AUTH_MIDDLEWARE] Error: ${error.message}`)
      // Only redirect to login for non-public routes
      if (!PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('from', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Allow access to public routes regardless of auth status
    if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
      return NextResponse.next()
    }

    // Redirect to login if accessing protected route without session
    if (!session) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // User is authenticated, allow access to protected route
    return NextResponse.next()
  } catch (error) {
    console.error('[AUTH_MIDDLEWARE] Unexpected error:', error)
    // Fail safe to login for any unexpected errors
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }
}

// Specify which routes should be protected
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 