import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from './db'

const FASTAPI_SECRET = process.env.FASTAPI_JWT_SECRET ?? 'insecure-dev-key-change-in-production'
const ADMIN_SECRET   = process.env.ADMIN_SESSION_SECRET ?? 'dev-admin-secret'
const ADMIN_COOKIE   = 'tl_admin_session'

// ── FastAPI JWT ────────────────────────────────────────────────────────────────

export async function issueFastApiJwt(
  userId: number,
  username: string,
  isAdmin: boolean,
  expiresAt: Date | null,
): Promise<string> {
  const secret = new TextEncoder().encode(FASTAPI_SECRET)
  const exp = expiresAt ?? new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)
  return new SignJWT({ sub: String(userId), username, is_admin: isAdmin })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(Math.floor(exp.getTime() / 1000))
    .sign(secret)
}

// ── Student credentials ────────────────────────────────────────────────────────

export async function verifyCredential(username: string, password: string) {
  const credential = await db.tlCredential.findUnique({
    where: { username: username.toLowerCase() },
  })
  if (!credential || !credential.isActive) return null

  const valid = await bcrypt.compare(password, credential.passwordHash)
  if (!valid) return null

  if (credential.expiresAt && credential.expiresAt < new Date()) return null

  return credential
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

// ── Admin identity ─────────────────────────────────────────────────────────────

export type AdminIdentity = { username: string; isSuperAdmin: boolean }

export async function verifyAdmin(
  username: string,
  password: string,
): Promise<AdminIdentity | null> {
  const u = username.trim()
  const envUser = process.env.ADMIN_USERNAME ?? 'admin'
  const envPass = process.env.ADMIN_PASSWORD ?? ''

  // Env-configured super admin (case-insensitive username)
  if (u.toLowerCase() === envUser.toLowerCase() && password === envPass) {
    return { username: envUser, isSuperAdmin: true }
  }

  // DB-managed admin users
  const admin = await db.adminUser.findUnique({ where: { username: u.toLowerCase() } })
  if (!admin || !admin.isActive) return null

  const valid = await bcrypt.compare(password, admin.passwordHash)
  if (!valid) return null

  return { username: admin.username, isSuperAdmin: admin.isSuperAdmin }
}

// ── Admin session cookie (JWT) ─────────────────────────────────────────────────

export async function issueAdminSessionCookie(identity: AdminIdentity) {
  const secret = new TextEncoder().encode(ADMIN_SECRET)
  const token = await new SignJWT({
    username: identity.username,
    super: identity.isSuperAdmin,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 8 * 60 * 60,
  })
}

export async function getAdminSession(): Promise<AdminIdentity | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) return null

  try {
    const secret = new TextEncoder().encode(ADMIN_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return {
      username: payload.username as string,
      isSuperAdmin: payload.super as boolean,
    }
  } catch {
    return null
  }
}

// ── Admin user CRUD (super admin only) ────────────────────────────────────────

export type AdminUser = {
  id: number
  username: string
  displayName: string | null
  isSuperAdmin: boolean
  isActive: boolean
  createdBy: string | null
  createdAt: Date
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  return db.adminUser.findMany({ orderBy: { createdAt: 'asc' } })
}

export async function createAdminUser(data: {
  username: string
  password: string
  displayName?: string
  createdBy: string
}): Promise<{ error?: string }> {
  const username = data.username.trim().toLowerCase()
  if (!username || data.password.length < 6) return { error: 'Invalid data.' }

  const existing = await db.adminUser.findUnique({ where: { username } })
  if (existing) return { error: 'Username already exists.' }

  const passwordHash = await bcrypt.hash(data.password, 12)
  await db.adminUser.create({
    data: {
      username,
      passwordHash,
      displayName: data.displayName?.trim() || null,
      createdBy: data.createdBy,
    },
  })
  return {}
}

export async function setAdminUserActive(id: number, isActive: boolean) {
  return db.adminUser.update({ where: { id }, data: { isActive } })
}

export async function deleteAdminUser(id: number) {
  return db.adminUser.delete({ where: { id } })
}

export async function resetAdminUserPassword(id: number, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, 12)
  return db.adminUser.update({ where: { id }, data: { passwordHash } })
}
