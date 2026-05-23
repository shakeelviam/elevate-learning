'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdmin, issueAdminSessionCookie } from '../../../lib/auth'

export async function adminLoginAction(formData: FormData) {
  const username = (formData.get('username') as string ?? '').trim()
  const password  = (formData.get('password') as string ?? '').trim()

  const identity = await verifyAdmin(username, password)
  if (!identity) return { error: 'Invalid admin credentials.' }

  await issueAdminSessionCookie(identity)
  redirect('/admin/dashboard')
}

export async function adminLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('tl_admin_session')
  redirect('/admin/login')
}
