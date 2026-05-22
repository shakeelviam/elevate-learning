'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '../../../lib/auth'

export async function adminLoginAction(formData: FormData) {
  const username = (formData.get('username') as string ?? '').trim()
  const password = (formData.get('password') as string ?? '').trim()

  if (!verifyAdmin(username, password)) {
    return { error: 'Invalid admin credentials.' }
  }

  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return { error: 'Server misconfiguration: ADMIN_SESSION_SECRET not set.' }

  const cookieStore = await cookies()
  cookieStore.set('tl_admin_session', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 8 * 60 * 60, // 8 hours
  })

  redirect('/admin/dashboard')
}

export async function adminLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('tl_admin_session')
  redirect('/admin/login')
}
