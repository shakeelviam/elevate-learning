import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { ...user.publicMetadata, must_change_password: 'false' },
  })

  return NextResponse.json({ ok: true })
}
