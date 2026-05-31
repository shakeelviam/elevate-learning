'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function ChangePasswordPage() {
  const { user } = useUser()
  const router = useRouter()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showNext, setShowNext] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (next !== confirm) { setError('Passwords do not match.'); return }
    if (next.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      await user?.updatePassword({ currentPassword: current, newPassword: next })
      await fetch('/api/clear-password-flag', { method: 'POST' })
      router.push('/chat')
    } catch (err: unknown) {
      setError((err as { errors?: { message: string }[] })?.errors?.[0]?.message ?? 'Failed to update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F8FF] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-[#EBF4FF] shadow-lg p-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#2E80D8] mx-auto mb-5">
          <Lock className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-black text-[#1F6CBD] text-center mb-1">Set your password</h1>
        <p className="text-sm text-gray-400 text-center mb-6">You must set a new password before continuing.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Current Password</label>
            <input
              type="password"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              required
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D8EE8]"
              placeholder="Admin@pass2026"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNext ? 'text' : 'password'}
                value={next}
                onChange={e => setNext(e.target.value)}
                required
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D8EE8] pr-9"
                placeholder="Min. 8 characters"
              />
              <button type="button" onClick={() => setShowNext(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D8EE8]"
            />
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-md px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E80D8] hover:opacity-90 text-white font-semibold text-sm py-2.5 rounded-md transition-opacity disabled:opacity-60"
          >
            {loading ? 'Updating…' : 'Set Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
