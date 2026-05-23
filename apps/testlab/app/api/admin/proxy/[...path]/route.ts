// Proxy admin requests to the FastAPI backend using a server-side service token.
// Only accessible when the tl_admin_session cookie is valid.

import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { issueFastApiJwt } from '../../../../../lib/auth'

const FASTAPI_URL = process.env.FASTAPI_URL ?? 'http://localhost:8000'

async function getServiceToken(): Promise<string> {
  return issueFastApiJwt(0, 'service_admin', true, null)
}

// Read the JWT directly from the request — avoids next/headers context issues in Route Handlers
async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('tl_admin_session')?.value
  if (!token) return false
  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET ?? '')
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

async function proxyRequest(req: NextRequest, params: { path: string[] }): Promise<NextResponse> {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const serviceToken = await getServiceToken()
  const targetPath = params.path.join('/')
  const targetUrl = `${FASTAPI_URL}/admin/${targetPath}${req.nextUrl.search}`

  const headers: Record<string, string> = {
    Authorization: `Bearer ${serviceToken}`,
  }

  // Forward Content-Type for non-FormData requests
  const contentType = req.headers.get('content-type')
  if (contentType && !contentType.includes('multipart/form-data')) {
    headers['Content-Type'] = contentType
  }

  const body = req.method === 'GET' || req.method === 'DELETE' ? undefined : await req.blob()

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
  }).catch(() => null)

  if (!upstream) {
    return NextResponse.json({ error: 'AI backend unreachable' }, { status: 502 })
  }

  const data = await upstream.blob()
  return new NextResponse(data, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
  })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params)
}
