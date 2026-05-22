'use client'

import { useTransition, useState } from 'react'
import {
  Shield, Plus, Trash2, Ban, CheckCircle2, KeyRound,
  LogOut, Users, Clock, BadgeCheck, AlertCircle, Loader2,
} from 'lucide-react'
import { cn, formatExpiry } from '../../../lib/utils'
import {
  createCredentialAction,
  revokeCredentialAction,
  restoreCredentialAction,
  deleteCredentialAction,
  resetPasswordAction,
} from './actions'
import { adminLogoutAction } from '../login/actions'

type Credential = {
  id: number
  username: string
  tier: string
  expiresAt: Date | null
  isActive: boolean
  note: string | null
  createdAt: Date
  _count: { sessions: number }
}

const DURATIONS = [
  { value: '1d',      label: '1 Day' },
  { value: '3d',      label: '3 Days' },
  { value: '1w',      label: '1 Week' },
  { value: '1m',      label: '1 Month' },
  { value: '1y',      label: '1 Year' },
  { value: 'custom',  label: 'Custom (days)' },
  { value: 'forever', label: 'Free Forever' },
]

function CreateForm({ onCreated }: { onCreated: () => void }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [duration, setDuration] = useState('1m')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createCredentialAction(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        ;(e.target as HTMLFormElement).reset()
        setDuration('1m')
        onCreated()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Username</label>
          <input
            name="username"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-200"
            placeholder="student_name"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-200"
              placeholder="min. 6 chars"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration</label>
          <select
            name="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          >
            {DURATIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {duration === 'custom' ? (
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Days</label>
            <input
              name="customDays"
              type="number"
              min={1}
              max={3650}
              required
              defaultValue={14}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            />
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Tier</label>
            <select
              name="tier"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            >
              <option value="paid">Paid</option>
              <option value="free">Free</option>
            </select>
          </div>
        )}
      </div>

      {duration === 'custom' && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Tier</label>
          <select
            name="tier"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          >
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Note (optional)
        </label>
        <input
          name="note"
          maxLength={120}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          placeholder="e.g. John Smith — IELTS prep"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {pending ? 'Creating…' : 'Create Credential'}
      </button>
    </form>
  )
}

function CredentialRow({ cred, onAction }: { cred: Credential; onAction: () => void }) {
  const [pending, startTransition] = useTransition()
  const [showReset, setShowReset] = useState(false)
  const [resetError, setResetError] = useState('')

  const isExpired = cred.expiresAt ? cred.expiresAt < new Date() : false
  const statusColor = !cred.isActive ? 'text-gray-400' : isExpired ? 'text-red-500' : 'text-green-600'
  const statusLabel = !cred.isActive ? 'Revoked' : isExpired ? 'Expired' : 'Active'

  const act = (fn: () => Promise<void>) => {
    startTransition(async () => { await fn(); onAction() })
  }

  const handleResetSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setResetError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await resetPasswordAction(cred.id, formData)
      if (result?.error) setResetError(result.error)
      else setShowReset(false)
    })
  }

  return (
    <div className={cn(
      'rounded-xl border p-4 transition-all',
      !cred.isActive ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-gray-100 bg-white hover:border-brand-100'
    )}>
      <div className="flex flex-wrap items-start gap-3">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-gray-900">{cred.username}</span>
            <span className={cn('text-xs font-semibold', statusColor)}>{statusLabel}</span>
            <span className={cn(
              'rounded-full px-2 py-0.5 text-xs font-bold',
              cred.tier === 'paid'
                ? 'bg-gold-100 text-gold-700'
                : 'bg-green-100 text-green-700'
            )}>
              {cred.tier === 'paid' ? 'Paid' : 'Free'}
            </span>
          </div>
          {cred.note && (
            <p className="text-xs text-gray-500 mb-1">{cred.note}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatExpiry(cred.expiresAt)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {cred.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <>
              <button
                onClick={() => setShowReset((v) => !v)}
                title="Reset password"
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-brand-600"
              >
                <KeyRound className="h-4 w-4" />
              </button>
              {cred.isActive ? (
                <button
                  onClick={() => act(() => revokeCredentialAction(cred.id))}
                  title="Revoke access"
                  className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Ban className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => act(() => restoreCredentialAction(cred.id))}
                  title="Restore access"
                  className="rounded-lg p-1.5 text-gray-400 transition hover:bg-green-50 hover:text-green-600"
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm(`Delete credential for "${cred.username}"? This cannot be undone.`)) {
                    act(() => deleteCredentialAction(cred.id))
                  }
                }}
                title="Delete permanently"
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Inline password reset */}
      {showReset && (
        <form onSubmit={handleResetSubmit} className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
          <input
            name="newPassword"
            type="text"
            required
            minLength={6}
            placeholder="New password (min 6 chars)"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none"
          />
          <button type="submit" disabled={pending} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-500 disabled:opacity-50">
            Save
          </button>
          <button type="button" onClick={() => setShowReset(false)} className="rounded-lg px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600">
            Cancel
          </button>
          {resetError && <span className="text-xs text-red-500">{resetError}</span>}
        </form>
      )}
    </div>
  )
}

export default function AdminDashboard({ credentials: initialCreds }: { credentials: Credential[] }) {
  const [credentials, setCredentials] = useState(initialCreds)
  const [pending, startTransition] = useTransition()
  const [tab, setTab] = useState<'all' | 'active' | 'expired'>('all')
  const [showCreate, setShowCreate] = useState(false)

  const refresh = () => {
    // Next.js Server Actions with revalidatePath handle this automatically
    // but we trigger a router refresh for the client state
    startTransition(() => window.location.reload())
  }

  const activeCount = credentials.filter((c) => c.isActive && (!c.expiresAt || c.expiresAt > new Date())).length
  const expiredCount = credentials.filter((c) => c.expiresAt && c.expiresAt < new Date()).length

  const filtered = credentials.filter((c) => {
    if (tab === 'active') return c.isActive && (!c.expiresAt || c.expiresAt > new Date())
    if (tab === 'expired') return !c.isActive || (c.expiresAt && c.expiresAt < new Date())
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-gray-900">Test Lab Admin</h1>
              <p className="text-xs text-gray-400">Credential Management</p>
            </div>
          </div>
          <form action={adminLogoutAction}>
            <button type="submit" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: credentials.length, icon: Users, color: 'text-gray-700' },
            { label: 'Active', value: activeCount, icon: BadgeCheck, color: 'text-green-600' },
            { label: 'Expired / Revoked', value: expiredCount + credentials.filter((c) => !c.isActive).length, icon: AlertCircle, color: 'text-red-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn('h-4 w-4', color)} />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
              <p className={cn('text-2xl font-black', color)}>{value}</p>
            </div>
          ))}
        </div>

        {/* Create credential */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-brand-600" />
              <span className="font-semibold text-gray-900">Create New Credential</span>
            </div>
            <span className="text-xs text-gray-400">{showCreate ? '▲ Collapse' : '▼ Expand'}</span>
          </button>
          {showCreate && (
            <div className="border-t border-gray-100 px-6 pb-6 pt-5">
              <CreateForm onCreated={() => { setShowCreate(false); refresh() }} />
            </div>
          )}
        </div>

        {/* Credentials list */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-bold text-gray-900">Credentials</h2>
            <div className="flex gap-1">
              {(['all', 'active', 'expired'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'rounded-lg px-3 py-1 text-xs font-semibold capitalize transition',
                    tab === t ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-3">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No credentials yet. Create one above.</p>
            ) : (
              filtered.map((cred) => (
                <CredentialRow key={cred.id} cred={cred} onAction={refresh} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
