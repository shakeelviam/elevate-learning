'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '../../../lib/db'
import { hashPassword, getAdminSession, createAdminUser, setAdminUserActive, deleteAdminUser, resetAdminUserPassword } from '../../../lib/auth'
import { durationToExpiry } from '../../../lib/utils'

const CreateSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-z0-9_]+$/, 'Lowercase letters, numbers, underscores only'),
  password: z.string().min(6).max(72),
  tier: z.enum(['free', 'paid']),
  duration: z.enum(['1d', '3d', '1w', '1m', '1y', 'custom', 'forever']),
  customDays: z.coerce.number().int().min(1).max(3650).optional(),
  note: z.string().max(120).optional(),
})

export async function createCredentialAction(formData: FormData) {
  const raw = {
    username: (formData.get('username') as string ?? '').trim().toLowerCase(),
    password: formData.get('password') as string,
    tier: formData.get('tier') as string,
    duration: formData.get('duration') as string,
    customDays: formData.get('customDays') ? Number(formData.get('customDays')) : undefined,
    note: (formData.get('note') as string ?? '').trim() || undefined,
  }

  const parsed = CreateSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { username, password, tier, duration, customDays, note } = parsed.data

  const exists = await db.tlCredential.findUnique({ where: { username } })
  if (exists) return { error: `Username "${username}" is already taken.` }

  const passwordHash = await hashPassword(password)
  const expiresAt = durationToExpiry(duration, customDays)

  await db.tlCredential.create({
    data: { username, passwordHash, tier, expiresAt, note },
  })

  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function revokeCredentialAction(id: number) {
  await db.tlCredential.update({
    where: { id },
    data: { isActive: false },
  })
  // Invalidate all active sessions for this credential
  await db.tlSession.deleteMany({ where: { credentialId: id } })
  revalidatePath('/admin/dashboard')
}

export async function restoreCredentialAction(id: number) {
  await db.tlCredential.update({
    where: { id },
    data: { isActive: true },
  })
  revalidatePath('/admin/dashboard')
}

export async function deleteCredentialAction(id: number) {
  await db.tlCredential.delete({ where: { id } })
  revalidatePath('/admin/dashboard')
}

export async function resetPasswordAction(id: number, formData: FormData) {
  const newPassword = (formData.get('newPassword') as string ?? '').trim()
  if (newPassword.length < 6) return { error: 'Password must be at least 6 characters.' }
  const passwordHash = await hashPassword(newPassword)
  await db.tlCredential.update({ where: { id }, data: { passwordHash } })
  revalidatePath('/admin/dashboard')
  return { success: true }
}

// ── Admin user management (super admin only) ──────────────────────────────────

async function requireSuperAdmin() {
  const session = await getAdminSession()
  if (!session?.isSuperAdmin) throw new Error('Forbidden')
}

export async function createAdminUserAction(formData: FormData) {
  await requireSuperAdmin()
  const session = await getAdminSession()
  const username    = (formData.get('username') as string ?? '').trim()
  const password    = (formData.get('password') as string ?? '').trim()
  const displayName = (formData.get('displayName') as string ?? '').trim()

  if (!username || password.length < 6) return { error: 'Username required and password must be at least 6 characters.' }

  const result = await createAdminUser({
    username,
    password,
    displayName: displayName || undefined,
    createdBy: session?.username ?? 'superadmin',
  })

  revalidatePath('/admin/dashboard')
  return result
}

export async function toggleAdminActiveAction(id: number, isActive: boolean) {
  await requireSuperAdmin()
  await setAdminUserActive(id, isActive)
  revalidatePath('/admin/dashboard')
}

export async function deleteAdminUserAction(id: number) {
  await requireSuperAdmin()
  await deleteAdminUser(id)
  revalidatePath('/admin/dashboard')
}

export async function resetAdminUserPasswordAction(id: number, formData: FormData) {
  await requireSuperAdmin()
  const newPassword = (formData.get('newPassword') as string ?? '').trim()
  if (newPassword.length < 6) return { error: 'Password must be at least 6 characters.' }
  await resetAdminUserPassword(id, newPassword)
  revalidatePath('/admin/dashboard')
  return { success: true }
}
