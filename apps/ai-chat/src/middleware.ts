import { clerkMiddleware, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const ALLOWED_ROLES = ['staff', 'admin', 'management']
const PUBLIC_PATHS = ['/sign-in', '/api/', '/unauthorized', '/change-password']

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const { userId } = await auth()

  if (!userId) {
    const signIn = new URL('/sign-in', req.url)
    signIn.searchParams.set('redirect_url', pathname)
    return NextResponse.redirect(signIn)
  }

  // Fetch metadata directly from Clerk API — reliable regardless of JWT template config
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const meta = user.publicMetadata as Record<string, string>

  if (!ALLOWED_ROLES.includes(meta?.role ?? '')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  if (meta?.must_change_password === 'true') {
    return NextResponse.redirect(new URL('/change-password', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\..*).*)'],
}
