'use client'

import { useCallback, useEffect, useRef, useTransition, useState } from 'react'
import {
  Shield, Plus, Trash2, Ban, CheckCircle2, KeyRound,
  LogOut, Users, Clock, BadgeCheck, AlertCircle, Loader2,
  Upload, Database, RefreshCw, FileText, ChevronDown, ChevronUp,
  Key, ClipboardList,
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
import { TestsTab } from './TestsTab'

// ── Types ─────────────────────────────────────────────────────────────────────

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

type CollectionStats = {
  collection_name: string
  total_chunks: number
  breakdown: Record<string, number>
}

type FastApiUser = {
  id: number
  username: string
  email: string
  is_admin: boolean
  created_at: string
  session_count: number
}

type UploadResult = {
  filename: string
  chunks_added: number
  total_in_collection: number
  exam_type: string
  difficulty: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DURATIONS = [
  { value: '1d',      label: '1 Day' },
  { value: '3d',      label: '3 Days' },
  { value: '1w',      label: '1 Week' },
  { value: '1m',      label: '1 Month' },
  { value: '1y',      label: '1 Year' },
  { value: 'custom',  label: 'Custom (days)' },
  { value: 'forever', label: 'Free Forever' },
]

const EXAM_TYPES = ['IELTS', 'TOEFL', 'OET', 'GMAT', 'SAT', 'PTE', 'GRE', 'GENERAL']
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const
const PROXY = '/api/admin/proxy'

// ── Credentials tab ───────────────────────────────────────────────────────────

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
      if (result?.error) setError(result.error)
      else { (e.target as HTMLFormElement).reset(); setDuration('1m'); onCreated() }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Username</label>
          <input name="username" required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" placeholder="student_name" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
          <div className="relative">
            <input name="password" type={showPassword ? 'text' : 'password'} required minLength={6} className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm focus:border-brand-400 focus:outline-none" placeholder="min. 6 chars" />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? '🙈' : '👁️'}</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration</label>
          <select name="duration" value={duration} onChange={e => setDuration(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
            {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        {duration === 'custom' ? (
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Days</label>
            <input name="customDays" type="number" min={1} max={3650} required defaultValue={14} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" />
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Tier</label>
            <select name="tier" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
              <option value="paid">Paid</option>
              <option value="free">Free</option>
            </select>
          </div>
        )}
      </div>
      {duration === 'custom' && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Tier</label>
          <select name="tier" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>
        </div>
      )}
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Note (optional)</label>
        <input name="note" maxLength={120} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" placeholder="e.g. John Smith — IELTS prep" />
      </div>
      <button type="submit" disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:opacity-50">
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

  const act = (fn: () => Promise<void>) => startTransition(async () => { await fn(); onAction() })

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
    <div className={cn('rounded-xl border p-4 transition-all', !cred.isActive ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-gray-100 bg-white hover:border-brand-100')}>
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-gray-900">{cred.username}</span>
            <span className={cn('text-xs font-semibold', statusColor)}>{statusLabel}</span>
            <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold', cred.tier === 'paid' ? 'bg-gold-100 text-gold-700' : 'bg-green-100 text-green-700')}>
              {cred.tier === 'paid' ? 'Paid' : 'Free'}
            </span>
          </div>
          {cred.note && <p className="text-xs text-gray-500 mb-1">{cred.note}</p>}
          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatExpiry(cred.expiresAt)}</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{cred.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {pending ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : (
            <>
              <button onClick={() => setShowReset(v => !v)} title="Reset password" className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-brand-600"><KeyRound className="h-4 w-4" /></button>
              {cred.isActive ? (
                <button onClick={() => act(() => revokeCredentialAction(cred.id))} title="Revoke" className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"><Ban className="h-4 w-4" /></button>
              ) : (
                <button onClick={() => act(() => restoreCredentialAction(cred.id))} title="Restore" className="rounded-lg p-1.5 text-gray-400 transition hover:bg-green-50 hover:text-green-600"><CheckCircle2 className="h-4 w-4" /></button>
              )}
              <button onClick={() => { if (confirm(`Delete "${cred.username}"? Cannot be undone.`)) act(() => deleteCredentialAction(cred.id)) }} title="Delete" className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </>
          )}
        </div>
      </div>
      {showReset && (
        <form onSubmit={handleResetSubmit} className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
          <input name="newPassword" type="text" required minLength={6} placeholder="New password (min 6 chars)" className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none" />
          <button type="submit" disabled={pending} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-500 disabled:opacity-50">Save</button>
          <button type="button" onClick={() => setShowReset(false)} className="rounded-lg px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600">Cancel</button>
          {resetError && <span className="text-xs text-red-500">{resetError}</span>}
        </form>
      )}
    </div>
  )
}

function CredentialsTab({ credentials: initialCreds }: { credentials: Credential[] }) {
  const [credentials, setCredentials] = useState(initialCreds)
  const [, startTransition] = useTransition()
  const [credFilter, setCredFilter] = useState<'all' | 'active' | 'expired'>('all')
  const [showCreate, setShowCreate] = useState(false)

  const refresh = () => startTransition(() => window.location.reload())

  const activeCount = credentials.filter(c => c.isActive && (!c.expiresAt || c.expiresAt > new Date())).length
  const expiredRevoked = credentials.filter(c => !c.isActive || (c.expiresAt && c.expiresAt < new Date())).length

  const filtered = credentials.filter(c => {
    if (credFilter === 'active') return c.isActive && (!c.expiresAt || c.expiresAt > new Date())
    if (credFilter === 'expired') return !c.isActive || (c.expiresAt && c.expiresAt < new Date())
    return true
  })

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: credentials.length, icon: Key, color: 'text-gray-700' },
          { label: 'Active', value: activeCount, icon: BadgeCheck, color: 'text-green-600' },
          { label: 'Expired / Revoked', value: expiredRevoked, icon: AlertCircle, color: 'text-red-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1"><Icon className={cn('h-4 w-4', color)} /><span className="text-xs text-gray-400">{label}</span></div>
            <p className={cn('text-2xl font-black', color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Create */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <button onClick={() => setShowCreate(v => !v)} className="flex w-full items-center justify-between px-6 py-4 text-left">
          <div className="flex items-center gap-2"><Plus className="h-4 w-4 text-brand-600" /><span className="font-semibold text-gray-900">Create New Credential</span></div>
          <span className="text-xs text-gray-400">{showCreate ? '▲ Collapse' : '▼ Expand'}</span>
        </button>
        {showCreate && (
          <div className="border-t border-gray-100 px-6 pb-6 pt-5">
            <CreateForm onCreated={() => { setShowCreate(false); refresh() }} />
          </div>
        )}
      </div>

      {/* List */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-bold text-gray-900">Credentials</h2>
          <div className="flex gap-1">
            {(['all', 'active', 'expired'] as const).map(t => (
              <button key={t} onClick={() => setCredFilter(t)} className={cn('rounded-lg px-3 py-1 text-xs font-semibold capitalize transition', credFilter === t ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-100')}>{t}</button>
            ))}
          </div>
        </div>
        <div className="p-4 space-y-3">
          {filtered.length === 0
            ? <p className="py-8 text-center text-sm text-gray-400">No credentials yet. Create one above.</p>
            : filtered.map(cred => <CredentialRow key={cred.id} cred={cred} onAction={refresh} />)}
        </div>
      </div>
    </div>
  )
}

// ── Content tab (PDF upload + ChromaDB stats) ─────────────────────────────────

function UploadCard({ onSuccess }: { onSuccess: (r: UploadResult) => void }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [examType, setExamType] = useState('IELTS')
  const [difficulty, setDifficulty] = useState<typeof DIFFICULTIES[number]>('medium')
  const [chunkSize, setChunkSize] = useState(600)
  const [chunkOverlap, setChunkOverlap] = useState(80)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === 'application/pdf') { setFile(dropped); setError('') }
    else setError('Only PDF files are accepted')
  }, [])

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('exam_type', examType)
      form.append('difficulty', difficulty)
      form.append('chunk_size', String(chunkSize))
      form.append('chunk_overlap', String(chunkOverlap))

      const res = await fetch(`${PROXY}/upload`, { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(String(err.detail ?? `HTTP ${res.status}`))
      }
      const result: UploadResult = await res.json()
      onSuccess(result)
      setFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50"><Upload className="h-4 w-4 text-brand-600" /></div>
        <h2 className="font-bold text-gray-900">Upload PDF Material</h2>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn('mb-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition-all', dragging ? 'border-brand-400 bg-brand-50' : file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50')}
      >
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setError('') } }} />
        {file ? (
          <><FileText className="h-8 w-8 text-green-500" /><p className="text-sm font-medium text-green-700">{file.name}</p><p className="text-xs text-green-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p></>
        ) : (
          <><Upload className="h-8 w-8 text-gray-300" /><p className="text-sm font-medium text-gray-500">Drag a PDF here or click to browse</p><p className="text-xs text-gray-400">PDF only · max 50 MB</p></>
        )}
      </div>

      {/* Selectors */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Exam Type</label>
          <select value={examType} onChange={e => setExamType(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
            {EXAM_TYPES.map(et => <option key={et} value={et}>{et}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value as typeof DIFFICULTIES[number])} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Advanced */}
      <button type="button" onClick={() => setShowAdvanced(v => !v)} className="mb-4 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600">
        {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        Advanced chunking settings
      </button>
      {showAdvanced && (
        <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Chunk Size (chars)</label>
            <input type="number" value={chunkSize} min={200} max={2000} onChange={e => setChunkSize(Number(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Overlap (chars)</label>
            <input type="number" value={chunkOverlap} min={0} max={400} onChange={e => setChunkOverlap(Number(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm" />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
        </div>
      )}

      <button onClick={handleUpload} disabled={!file || loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:opacity-50">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Ingesting…</> : <><Upload className="h-4 w-4" />Upload & Ingest</>}
      </button>
    </div>
  )
}

function CollectionCard() {
  const [stats, setStats] = useState<CollectionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const loadStats = useCallback(() => {
    setLoading(true)
    fetch(`${PROXY}/collection`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadStats() }, [loadStats])

  const handleReset = async () => {
    if (!confirmReset) { setConfirmReset(true); return }
    setResetting(true)
    try {
      await fetch(`${PROXY}/collection/reset`, { method: 'DELETE' })
      setConfirmReset(false)
      loadStats()
    } finally {
      setResetting(false)
    }
  }

  const total = stats?.total_chunks ?? 0
  const breakdown = stats?.breakdown ?? {}

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50"><Database className="h-4 w-4 text-brand-600" /></div>
          <h2 className="font-bold text-gray-900">Collection Stats</h2>
        </div>
        <button onClick={loadStats} className="text-gray-400 hover:text-brand-500">
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </button>
      </div>

      {loading ? (
        <div className="flex h-24 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
      ) : (
        <>
          <div className="mb-5">
            <p className="text-3xl font-black text-gray-900">{total.toLocaleString()}</p>
            <p className="text-xs text-gray-400">
              total chunks stored
              {stats?.collection_name && <span className="ml-2 text-gray-300">· {stats.collection_name}</span>}
            </p>
          </div>

          {Object.keys(breakdown).length > 0 && (
            <div className="space-y-2.5">
              {Object.entries(breakdown).sort(([, a], [, b]) => b - a).map(([et, count]) => (
                <div key={et}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">{et}</span>
                    <span className="text-gray-400">{count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all" style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 border-t border-gray-50 pt-4">
            <button onClick={handleReset} disabled={resetting} className={cn('flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition', confirmReset ? 'text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-red-500')}>
              {resetting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              {confirmReset ? 'Click again to confirm — irreversible' : 'Reset collection'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function ContentTab() {
  const [uploadHistory, setUploadHistory] = useState<UploadResult[]>([])
  const [statsKey, setStatsKey] = useState(0)

  const handleUploadSuccess = (result: UploadResult) => {
    setUploadHistory(prev => [result, ...prev.slice(0, 9)])
    setStatsKey(k => k + 1)
  }

  return (
    <div className="space-y-6">
      {uploadHistory.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
          <div>
            <p className="text-sm font-semibold text-green-800">"{uploadHistory[0].filename}" ingested successfully</p>
            <p className="text-xs text-green-600">{uploadHistory[0].chunks_added} new chunks · total: {uploadHistory[0].total_in_collection}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <UploadCard onSuccess={handleUploadSuccess} />
        <CollectionCard key={statsKey} />
      </div>

      {uploadHistory.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">Upload Log (this session)</h2>
          <div className="divide-y divide-gray-50">
            {uploadHistory.map((r, i) => (
              <div key={i} className="flex flex-wrap items-center gap-4 py-3 text-sm">
                <span className="font-medium text-gray-800">{r.filename}</span>
                <span className="rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">{r.exam_type}</span>
                <span className="text-xs text-gray-500">{r.difficulty}</span>
                <span className="ms-auto text-xs font-semibold text-green-600">+{r.chunks_added} chunks</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Users tab (FastAPI users) ─────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<FastApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${PROXY}/users`)
      .then(r => r.json())
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleAdmin = async (user: FastApiUser) => {
    setToggling(user.id)
    try {
      const res = await fetch(`${PROXY}/users/${user.id}/make-admin?is_admin=${!user.is_admin}`, { method: 'PATCH' })
      if (res.ok) {
        const updated = await res.json()
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_admin: updated.is_admin } : u))
      }
    } finally {
      setToggling(null)
    }
  }

  if (loading) {
    return <div className="flex h-32 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="font-bold text-gray-900">FastAPI Users ({users.length})</h2>
        <p className="text-xs text-gray-400 mt-0.5">Users provisioned in the AI backend — one per Test Lab credential</p>
      </div>

      {users.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">No users yet. They appear here after first login.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-6 pb-3 pt-4">User</th>
                <th className="px-3 pb-3 pt-4">Email</th>
                <th className="px-3 pb-3 pt-4">Sessions</th>
                <th className="px-3 pb-3 pt-4">Joined</th>
                <th className="px-6 pb-3 pt-4 text-right">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3 font-medium text-gray-800">{u.username}</td>
                  <td className="px-3 py-3 text-gray-500">{u.email}</td>
                  <td className="px-3 py-3 text-gray-500">{u.session_count}</td>
                  <td className="px-3 py-3 text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => toggleAdmin(u)}
                      disabled={toggling === u.id}
                      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors', u.is_admin ? 'bg-brand-100 text-brand-700 hover:bg-red-100 hover:text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-brand-50 hover:text-brand-700')}
                    >
                      {toggling === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : u.is_admin ? <Shield className="h-3 w-3" /> : null}
                      {u.is_admin ? 'Admin' : 'User'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Root dashboard ─────────────────────────────────────────────────────────────

type MainTab = 'credentials' | 'content' | 'users' | 'tests'

const MAIN_TABS: { id: MainTab; label: string; icon: React.ElementType }[] = [
  { id: 'credentials', label: 'Credentials', icon: Key },
  { id: 'content',     label: 'Content',     icon: Database },
  { id: 'users',       label: 'Users',       icon: Users },
  { id: 'tests',       label: 'Tests',       icon: ClipboardList },
]

export default function AdminDashboard({ credentials }: { credentials: Credential[] }) {
  const [mainTab, setMainTab] = useState<MainTab>('credentials')

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
              <p className="text-xs text-gray-400">Management Console</p>
            </div>
          </div>
          <form action={adminLogoutAction}>
            <button type="submit" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition">
              <LogOut className="h-4 w-4" />Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="mx-auto flex max-w-5xl gap-1">
          {MAIN_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMainTab(id)}
              className={cn('flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors', mainTab === id ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700')}
            >
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        {mainTab === 'credentials' && <CredentialsTab credentials={credentials} />}
        {mainTab === 'content'     && <ContentTab />}
        {mainTab === 'users'       && <UsersTab />}
        {mainTab === 'tests'       && <TestsTab proxy={PROXY} />}
      </div>
    </div>
  )
}
