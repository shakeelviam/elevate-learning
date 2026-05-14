import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/:locale/dashboard(.*)',
])

// Routes accessible only when NOT authenticated
const isAuthRoute = createRouteMatcher([
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Handle root redirect to /en
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/en', req.url))
  }

  // Protect dashboard routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth()
    if (!userId) {
      const locale = req.nextUrl.pathname.split('/')[1] || 'en'
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url))
    }
  }

  // Run intl middleware
  return intlMiddleware(req)
})

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    '/',
    '/(en|ar)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
