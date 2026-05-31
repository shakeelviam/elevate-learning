import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const ALLOWED_ROLES = ['staff', 'admin', 'management']
const PUBLIC_PATHS = ['/sign-in', '/api/', '/unauthorized', '/change-password']

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const { userId, sessionClaims } = await auth()

  if (!userId) {
    const signIn = new URL('/sign-in', req.url)
    signIn.searchParams.set('redirect_url', pathname)
    return NextResponse.redirect(signIn)
  }

  const meta = sessionClaims?.publicMetadata as Record<string, string> | undefined
  const role = meta?.role
  if (!ALLOWED_ROLES.includes(role ?? '')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  // Force password change on first login
  if (meta?.must_change_password === 'true' && pathname !== '/change-password') {
    return NextResponse.redirect(new URL('/change-password', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\..*).*)'],
}
