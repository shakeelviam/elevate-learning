import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { db } from './db'

const FASTAPI_SECRET = process.env.FASTAPI_JWT_SECRET ?? 'insecure-dev-key-change-in-production'
const FASTAPI_ALGORITHM = 'HS256'

// Issue a FastAPI-compatible JWT for the given user so the frontend can
// call the FastAPI backend directly without a separate login step.
export async function issueFastApiJwt(userId: number, username: string, isAdmin: boolean, expiresAt: Date | null): Promise<string> {
  const secret = new TextEncoder().encode(FASTAPI_SECRET)

  // Free-forever credentials get a 10-year token; otherwise use credential expiry
  const exp = expiresAt ?? new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)

  return new SignJWT({ sub: String(userId), username, is_admin: isAdmin })
    .setProtectedHeader({ alg: FASTAPI_ALGORITHM })
    .setExpirationTime(Math.floor(exp.getTime() / 1000))
    .sign(secret)
}

export async function verifyCredential(username: string, password: string) {
  const credential = await db.tlCredential.findUnique({ where: { username: username.toLowerCase() } })
  if (!credential || !credential.isActive) return null

  const valid = await bcrypt.compare(password, credential.passwordHash)
  if (!valid) return null

  // Credential is expired
  if (credential.expiresAt && credential.expiresAt < new Date()) return null

  return credential
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

// Verify admin identity from env-configured credentials
export function verifyAdmin(username: string, password: string): boolean {
  const adminUser = process.env.ADMIN_USERNAME ?? 'admin'
  const adminPass = process.env.ADMIN_PASSWORD ?? ''
  return username === adminUser && password === adminPass
}
