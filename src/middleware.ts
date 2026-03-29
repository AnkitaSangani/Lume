import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Safe client for middleware context bypassing distinct cookie API conflicts natively
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const currentPath = request.nextUrl.pathname;
  const isAuthRoute = currentPath === '/login';
  const isOnboardingRoute = currentPath === '/onboarding';

  // 1. Unauthenticated users -> lock access down and redirect to login
  if (!user && !isAuthRoute && !currentPath.startsWith('/api/') && !currentPath.startsWith('/_next/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // 2. Fetch user custom table context to verify onboarding status specifically hitting identical Database map natively
    const { data: userData } = await supabase.from('users').select('is_onboarded').eq('id', user.id).single();
    
    // 3. Authenticated but not onboarded -> aggressively intercept resolving towards onboarding setup mapping specifically to not loop
    if (!userData?.is_onboarded && !isOnboardingRoute && !currentPath.startsWith('/api/') && !currentPath.startsWith('/_next/')) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
    }

    // 4. Authenticated & Onboarded trying to access login/onboarding -> bounce gracefully to safe Dashboard home natively
    if ((isAuthRoute || isOnboardingRoute) && userData?.is_onboarded && !currentPath.startsWith('/api/')) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
