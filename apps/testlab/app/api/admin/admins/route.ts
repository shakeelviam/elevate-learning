import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { listAdminUsers } from '../../../../lib/auth'

async function isSuperAdminRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('tl_admin_session')?.value
  if (!token) return false
  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET ?? '')
    const { payload } = await jwtVerify(token, secret)
    return payload.super === true
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  if (!(await isSuperAdminRequest(req))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const admins = await listAdminUsers()
  return NextResponse.json(admins)
}
