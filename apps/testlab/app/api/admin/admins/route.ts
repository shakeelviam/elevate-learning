import { NextResponse } from 'next/server'
import { getAdminSession, listAdminUsers } from '../../../../lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session?.isSuperAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const admins = await listAdminUsers()
  return NextResponse.json(admins)
}
