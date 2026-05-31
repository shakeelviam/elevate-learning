import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const ALLOWED_ROLES = ['staff', 'admin', 'management']

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/sign-in') || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const { userId, sessionClaims } = await auth()

  if (!userId) {
    const signIn = new URL('/sign-in', req.url)
    signIn.searchParams.set('redirect_url', pathname)
    return NextResponse.redirect(signIn)
  }

  const role = (sessionClaims?.publicMetadata as Record<string, string> | undefined)?.role
  if (!ALLOWED_ROLES.includes(role ?? '')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\..*).*)'],
}
