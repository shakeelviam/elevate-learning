// Server-side helper to ensure a FastAPI user account exists for a credential.
// Called during login so the user's session/score data can be tracked in FastAPI.

const FASTAPI_URL = process.env.FASTAPI_URL ?? 'http://localhost:8000'
const SERVICE_TOKEN = process.env.FASTAPI_SERVICE_TOKEN ?? ''

export async function ensureFastApiUser(username: string, password: string): Promise<{ userId: number; isAdmin: boolean } | null> {
  // Try login first
  const loginRes = await fetch(`${FASTAPI_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  }).catch(() => null)

  if (loginRes?.ok) {
    const data = await loginRes.json()
    return { userId: data.user_id, isAdmin: data.is_admin }
  }

  // User doesn't exist — register them
  const regRes = await fetch(`${FASTAPI_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email: `${username}@testlab.local`, password }),
  }).catch(() => null)

  if (regRes?.ok) {
    const data = await regRes.json()
    return { userId: data.user_id, isAdmin: false }
  }

  return null
}
