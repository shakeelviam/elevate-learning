'use server'

import { redirect } from 'next/navigation'
import { verifyCredential } from '../../lib/auth'
import { createSession } from '../../lib/session'
import { ensureFastApiUser } from '../../lib/fastapi'
import { issueFastApiJwt } from '../../lib/auth'

export async function loginAction(formData: FormData) {
  const username = (formData.get('username') as string ?? '').trim().toLowerCase()
  const password = (formData.get('password') as string ?? '').trim()

  if (!username || !password) {
    return { error: 'Username and password are required.' }
  }

  const credential = await verifyCredential(username, password)
  if (!credential) {
    return { error: 'Invalid credentials or your access has expired. Contact your administrator.' }
  }

  // Ensure user exists in FastAPI and get their user ID
  let fastApiToken: string | null = null
  const faUser = await ensureFastApiUser(username, password)
  if (faUser) {
    fastApiToken = await issueFastApiJwt(faUser.userId, username, faUser.isAdmin, credential.expiresAt)
  }

  await createSession(credential.id, fastApiToken)
  redirect('/exam')
}
