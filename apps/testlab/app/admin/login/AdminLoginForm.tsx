'use client'

import { useTransition, useState } from 'react'
import { Shield, Loader2, AlertCircle } from 'lucide-react'
import { adminLoginAction } from './actions'

export default function AdminLoginForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await adminLoginAction(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white">Admin Access</h1>
            <p className="text-sm text-white/60 mt-1">Test Lab Control Panel</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-white/80">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-gold-400 focus:bg-white/15 focus:ring-2 focus:ring-gold-400/30"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-white/80">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-gold-400 focus:bg-white/15 focus:ring-2 focus:ring-gold-400/30"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3.5 text-sm font-bold text-brand-900 shadow-lg shadow-gold-500/20 transition hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          Restricted to authorised administrators only.
        </p>
      </div>
    </div>
  )
}
