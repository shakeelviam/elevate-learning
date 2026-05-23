import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/login', '/admin/login']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // API routes handle their own auth — never redirect them to a login page
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('tl_admin_session')?.value
    if (!token) return NextResponse.redirect(new URL('/admin/login', req.url))
    try {
      const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET ?? '')
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  const sessionToken = req.cookies.get('tl_session')?.value
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
