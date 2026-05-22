import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/admin/login']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow public paths and static assets
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Admin routes: require admin session cookie
  if (pathname.startsWith('/admin')) {
    const adminToken = req.cookies.get('tl_admin_session')?.value
    if (!adminToken || adminToken !== process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  // All other routes (exam, session, result): require user session cookie
  const sessionToken = req.cookies.get('tl_session')?.value
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
