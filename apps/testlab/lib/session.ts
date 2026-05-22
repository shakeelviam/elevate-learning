import { cookies } from 'next/headers'
import { db } from './db'

const SESSION_COOKIE = 'tl_session'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 1 day browser session

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await db.tlSession.findUnique({
    where: { token },
    include: { credential: true },
  })

  if (!session) return null

  // Check browser session hasn't expired
  if (session.expiresAt < new Date()) {
    await db.tlSession.delete({ where: { token } })
    return null
  }

  // Check credential hasn't expired (null = free forever)
  if (session.credential.expiresAt && session.credential.expiresAt < new Date()) {
    return null
  }

  // Check credential is still active
  if (!session.credential.isActive) return null

  return session
}

export async function createSession(credentialId: number, fastApiToken: string | null) {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  const session = await db.tlSession.create({
    data: { credentialId, token, fastApiToken, expiresAt },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })

  return session
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    await db.tlSession.delete({ where: { token } }).catch(() => {})
    cookieStore.delete(SESSION_COOKIE)
  }
}
