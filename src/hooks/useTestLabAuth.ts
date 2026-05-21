'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  type TokenResponse,
  clearAuth,
  getStoredToken,
  getStoredUser,
  storeAuth,
} from '@/lib/test-lab-api'

interface TestLabAuth {
  token: string | null
  user: TokenResponse | null
  isAuthed: boolean
  loading: boolean
  login: (resp: TokenResponse) => void
  logout: () => void
}

export function useTestLabAuth(): TestLabAuth {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<TokenResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setToken(getStoredToken())
    setUser(getStoredUser())
    setLoading(false)
  }, [])

  const login = useCallback((resp: TokenResponse) => {
    storeAuth(resp)
    setToken(resp.access_token)
    setUser(resp)
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setToken(null)
    setUser(null)
  }, [])

  return { token, user, isAuthed: !!token, loading, login, logout }
}
