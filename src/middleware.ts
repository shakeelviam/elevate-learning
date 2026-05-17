import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const isProtectedRoute = createRouteMatcher([
  '/:locale/dashboard(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (req.nextUrl.pathname.startsWith('/studio')) {
    const { userId } = await auth()
    if (!userId) {
      const url = req.nextUrl.clone()
      url.pathname = '/en/sign-in'
      url.search = ''
      url.searchParams.set('redirect_url', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/en', req.url))
  }

  if (isProtectedRoute(req)) {
    // Use relative redirect_url so Clerk's allowlist validation passes
    const { userId } = await auth()
    if (!userId) {
      const locale = req.nextUrl.pathname.split('/')[1] || 'en'
      const url = req.nextUrl.clone()
      url.pathname = `/${locale}/sign-in`
      url.search = ''
      url.searchParams.set('redirect_url', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return intlMiddleware(req)
})

export const config = {
  matcher: [
    '/',
    '/(en|ar)/:path*',
    '/((?!api|_next|_vercel|studio|.*\\..*).*)',
  ],
}
