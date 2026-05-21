'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Database,
  FileText,
  Loader2,
  RefreshCw,
  Shield,
  Trash2,
  Upload,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  type AdminUser,
  type CollectionStats,
  type UploadResponse,
  testLabApi,
} from '@/lib/test-lab-api'

interface AdminPanelProps {
  token: string
  locale: 'en' | 'ar'
}

const EXAM_TYPES = ['IELTS', 'TOEFL', 'OET', 'GMAT', 'SAT', 'PTE', 'GENERAL']
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const

// ── Drag-and-drop upload card ─────────────────────────────────────────────────

function UploadCard({ token, onSuccess, locale }: {
  token: string
  onSuccess: (r: UploadResponse) => void
  locale: 'en' | 'ar'
}) {
  const isRtl = locale === 'ar'
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
    if (dropped?.type === 'application/pdf') {
      setFile(dropped)
      setError('')
    } else {
      setError(isRtl ? 'ملفات PDF فقط مقبولة' : 'Only PDF files are accepted')
    }
  }, [isRtl])

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const result = await testLabApi.adminUploadPdf(
        token, file, examType, difficulty, chunkSize, chunkOverlap,
      )
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
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
          <Upload className="h-4.5 w-4.5 text-brand-600" />
        </div>
        <h2 className="font-bold text-gray-900">
          {isRtl ? 'رفع ملف PDF' : 'Upload PDF Material'}
        </h2>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`mb-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition-all ${
          dragging
            ? 'border-brand-400 bg-brand-50'
            : file
              ? 'border-green-300 bg-green-50'
              : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) { setFile(f); setError('') }
          }}
        />
        {file ? (
          <>
            <FileText className="h-8 w-8 text-green-500" />
            <p className="text-sm font-medium text-green-700">{file.name}</p>
            <p className="text-xs text-green-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">
              {isRtl ? 'اسحب ملف PDF هنا أو انقر للاختيار' : 'Drag a PDF here or click to browse'}
            </p>
            <p className="text-xs text-gray-400">PDF only · max 50 MB</p>
          </>
        )}
      </div>

      {/* Metadata selectors */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            {isRtl ? 'نوع الامتحان' : 'Exam Type'}
          </label>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          >
            {EXAM_TYPES.map((et) => <option key={et} value={et}>{et}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            {isRtl ? 'المستوى' : 'Difficulty'}
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as typeof DIFFICULTIES[number])}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          >
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Advanced settings toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="mb-4 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600"
      >
        {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        {isRtl ? 'إعدادات متقدمة' : 'Advanced chunking settings'}
      </button>

      {showAdvanced && (
        <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              {isRtl ? 'حجم القطعة (حرف)' : 'Chunk Size (chars)'}
            </label>
            <input
              type="number"
              value={chunkSize}
              min={200}
              max={2000}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              {isRtl ? 'التداخل (حرف)' : 'Overlap (chars)'}
            </label>
            <input
              type="number"
              value={chunkOverlap}
              min={0}
              max={400}
              onChange={(e) => setChunkOverlap(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || loading}
        isLoading={loading}
        className="w-full"
        size="lg"
      >
        <Upload className="h-4 w-4" />
        {loading
          ? isRtl ? 'جارٍ الاستيعاب…' : 'Ingesting…'
          : isRtl ? 'رفع واستيعاب' : 'Upload & Ingest'}
      </Button>
    </div>
  )
}

// ── Collection stats card ─────────────────────────────────────────────────────

function CollectionCard({ token, locale }: { token: string; locale: 'en' | 'ar' }) {
  const isRtl = locale === 'ar'
  const [stats, setStats] = useState<CollectionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const loadStats = useCallback(() => {
    setLoading(true)
    testLabApi.adminGetStats(token)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [token])

  useEffect(() => { loadStats() }, [loadStats])

  const handleReset = async () => {
    if (!confirmReset) { setConfirmReset(true); return }
    setResetting(true)
    try {
      await testLabApi.adminResetCollection(token)
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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
            <Database className="h-4.5 w-4.5 text-brand-600" />
          </div>
          <h2 className="font-bold text-gray-900">
            {isRtl ? 'إحصائيات المجموعة' : 'Collection Stats'}
          </h2>
        </div>
        <button onClick={loadStats} className="text-gray-400 hover:text-brand-500">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex h-24 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
        </div>
      ) : (
        <>
          <div className="mb-5">
            <p className="text-3xl font-black text-gray-900">{total.toLocaleString()}</p>
            <p className="text-xs text-gray-400">
              {isRtl ? 'إجمالي القطع المخزّنة' : 'total chunks stored'}
              {stats?.collection_name && (
                <span className="ml-2 text-gray-300">· {stats.collection_name}</span>
              )}
            </p>
          </div>

          {/* Breakdown bars */}
          {Object.keys(breakdown).length > 0 && (
            <div className="space-y-2.5">
              {Object.entries(breakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([et, count]) => (
                  <div key={et}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-semibold text-gray-700">{et}</span>
                      <span className="text-gray-400">{count.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all"
                        style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Reset */}
          <div className="mt-6 border-t border-gray-50 pt-4">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full text-xs ${confirmReset ? 'text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
              onClick={handleReset}
              isLoading={resetting}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {confirmReset
                ? isRtl ? 'انقر مرة أخرى للتأكيد — هذا لا يمكن التراجع عنه' : 'Click again to confirm — irreversible'
                : isRtl ? 'إعادة تعيين المجموعة' : 'Reset collection'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Users table ───────────────────────────────────────────────────────────────

function UsersTable({ token, locale, currentUserId }: {
  token: string
  locale: 'en' | 'ar'
  currentUserId: number
}) {
  const isRtl = locale === 'ar'
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<number | null>(null)

  useEffect(() => {
    testLabApi.adminListUsers(token)
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const toggleAdmin = async (user: AdminUser) => {
    setToggling(user.id)
    try {
      const updated = await testLabApi.adminSetAdminStatus(token, user.id, !user.is_admin)
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_admin: updated.is_admin } : u))
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
          <Users className="h-4.5 w-4.5 text-brand-600" />
        </div>
        <h2 className="font-bold text-gray-900">
          {isRtl ? `المستخدمون (${users.length})` : `Users (${users.length})`}
        </h2>
      </div>

      {loading ? (
        <div className="flex h-20 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-6">
          {isRtl ? 'لا يوجد مستخدمون بعد' : 'No users yet'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="pb-3 pr-4">{isRtl ? 'المستخدم' : 'User'}</th>
                <th className="pb-3 pr-4">{isRtl ? 'البريد' : 'Email'}</th>
                <th className="pb-3 pr-4">{isRtl ? 'الجلسات' : 'Sessions'}</th>
                <th className="pb-3 pr-4">{isRtl ? 'الانضمام' : 'Joined'}</th>
                <th className="pb-3">{isRtl ? 'الصلاحيات' : 'Role'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="group">
                  <td className="py-3 pr-4 font-medium text-gray-800">{u.username}</td>
                  <td className="py-3 pr-4 text-gray-500">{u.email}</td>
                  <td className="py-3 pr-4 text-gray-500">{u.session_count}</td>
                  <td className="py-3 pr-4 text-gray-400 text-xs">
                    {new Date(u.created_at).toLocaleDateString(
                      locale === 'ar' ? 'ar-KW' : 'en-GB',
                      { day: 'numeric', month: 'short', year: '2-digit' },
                    )}
                  </td>
                  <td className="py-3">
                    {u.id === currentUserId ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                        <Shield className="h-3 w-3" />
                        {isRtl ? 'أنت' : 'You'}
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleAdmin(u)}
                        disabled={toggling === u.id}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                          u.is_admin
                            ? 'bg-brand-100 text-brand-700 hover:bg-red-100 hover:text-red-700'
                            : 'bg-gray-100 text-gray-500 hover:bg-brand-50 hover:text-brand-700'
                        }`}
                      >
                        {toggling === u.id
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : u.is_admin
                            ? <Shield className="h-3 w-3" />
                            : null}
                        {u.is_admin
                          ? isRtl ? 'مشرف' : 'Admin'
                          : isRtl ? 'مستخدم' : 'User'}
                      </button>
                    )}
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

// ── Main export ───────────────────────────────────────────────────────────────

export function AdminPanel({ token, locale }: AdminPanelProps) {
  const isRtl = locale === 'ar'
  const [uploadHistory, setUploadHistory] = useState<UploadResponse[]>([])
  const [statsKey, setStatsKey] = useState(0)

  const handleUploadSuccess = (result: UploadResponse) => {
    setUploadHistory((prev) => [result, ...prev.slice(0, 9)])
    setStatsKey((k) => k + 1) // force CollectionCard to re-fetch
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <Shield className="h-4 w-4 text-brand-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            {isRtl ? 'لوحة الإدارة' : 'Admin Panel'}
          </span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
          {isRtl ? 'إدارة المواد والمستخدمين' : 'Content & User Management'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isRtl
            ? 'ارفع ملفات PDF لإثراء قاعدة الأسئلة وأدر حسابات المستخدمين'
            : 'Upload PDFs to enrich the question pool and manage user accounts'}
        </p>
      </div>

      {/* Upload success toast */}
      {uploadHistory.length > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
          <div>
            <p className="text-sm font-semibold text-green-800">
              {isRtl
                ? `تم استيعاب "${uploadHistory[0].filename}" بنجاح`
                : `"${uploadHistory[0].filename}" ingested successfully`}
            </p>
            <p className="text-xs text-green-600">
              {isRtl
                ? `${uploadHistory[0].chunks_added} قطعة جديدة · الإجمالي: ${uploadHistory[0].total_in_collection}`
                : `${uploadHistory[0].chunks_added} new chunks · total: ${uploadHistory[0].total_in_collection}`}
            </p>
          </div>
        </div>
      )}

      {/* Top grid: upload + stats */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <UploadCard token={token} onSuccess={handleUploadSuccess} locale={locale} />
        <CollectionCard key={statsKey} token={token} locale={locale} />
      </div>

      {/* Recent uploads log */}
      {uploadHistory.length > 0 && (
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
            {isRtl ? 'سجل الرفع (هذه الجلسة)' : 'Upload Log (this session)'}
          </h2>
          <div className="divide-y divide-gray-50">
            {uploadHistory.map((r, i) => (
              <div key={i} className="flex flex-wrap items-center gap-4 py-3 text-sm">
                <span className="font-medium text-gray-800">{r.filename}</span>
                <span className="rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                  {r.exam_type}
                </span>
                <span className="text-xs text-gray-500">{r.difficulty}</span>
                <span className="ms-auto text-xs font-semibold text-green-600">
                  +{r.chunks_added} {isRtl ? 'قطعة' : 'chunks'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users table */}
      <UsersTable token={token} locale={locale} currentUserId={-1} />
    </div>
  )
}
