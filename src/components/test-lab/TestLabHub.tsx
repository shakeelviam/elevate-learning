'use client'

import { useEffect, useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import {
  BookOpen,
  FlaskConical,
  LogOut,
  Settings,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTestLabAuth } from '@/hooks/useTestLabAuth'
import { TestLabAuth } from './TestLabAuth'
import { SessionStarter } from './SessionStarter'
import { WeakTopicsChart } from './WeakTopicsChart'
import { ScoreHistoryChart } from './ScoreHistoryChart'
import {
  type SessionSummary,
  type WeakTopic,
  type UserProfile,
  type SessionStartResponse,
  testLabApi,
} from '@/lib/test-lab-api'

interface TestLabHubProps {
  locale: 'en' | 'ar'
}

export function TestLabHub({ locale }: TestLabHubProps) {
  const isRtl = locale === 'ar'
  const router = useRouter()
  const { token, user, isAuthed, loading, login, logout } = useTestLabAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    if (!isAuthed || !token) return
    setDataLoading(true)
    Promise.all([
      testLabApi.getProfile(token).catch(() => null),
      testLabApi.listSessions(token).catch(() => []),
      testLabApi.getWeakTopics(token).catch(() => []),
    ]).then(([prof, sess, weak]) => {
      setProfile(prof)
      setSessions(sess as SessionSummary[])
      setWeakTopics(weak as WeakTopic[])
    }).finally(() => setDataLoading(false))
  }, [isAuthed, token])

  const handleSessionStarted = (session: SessionStartResponse) => {
    router.push(`/test-lab/session/${session.session_id}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
      </div>
    )
  }

  // ── Not authenticated — show auth form ───────────────────────────────────
  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Auth form */}
          <div className="flex justify-center">
            <TestLabAuth onAuth={login} locale={locale} />
          </div>

          {/* Right: Feature pitch */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-300/50 bg-gold-50 px-4 py-1.5 text-sm font-semibold text-gold-700">
              <FlaskConical className="h-3.5 w-3.5" />
              {isRtl ? 'مختبر الاختبارات التكيّفية' : 'Adaptive Practice Tests'}
            </div>
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
              {isRtl
                ? 'اختبارات لا نهاية لها، مُصمَّمة خصيصاً لك'
                : 'Unlimited tests, personalised for you'}
            </h2>
            <p className="text-gray-500 leading-relaxed">
              {isRtl
                ? 'يولّد المختبر أسئلة جديدة في كل جلسة، ويتكيّف مع نقاط ضعفك لتحسين أدائك بشكل مستمر. كل ذلك يعمل 100% على جهازك دون الحاجة إلى الإنترنت.'
                : 'The Test Lab generates fresh questions every session and adapts to your weak areas to continuously improve your performance — running 100% on your own hardware.'}
            </p>
            <div className="space-y-3">
              {[
                { icon: Target,     en: 'Questions adapt to your weak topics automatically',    ar: 'أسئلة تتكيّف مع مواضيع ضعفك تلقائياً' },
                { icon: BookOpen,   en: 'Covers IELTS, TOEFL, OET, GMAT, SAT, and more',       ar: 'يغطي IELTS وTOEFL وOET وGMAT وSAT والمزيد' },
                { icon: TrendingUp, en: 'Visual analytics track your improvement over time',    ar: 'تحليلات بصرية تتتبع تقدمك عبر الزمن' },
                { icon: Trophy,     en: 'Instant explanations for every answer',                ar: 'شرح فوري لكل إجابة' },
              ].map(({ icon: Icon, en, ar }) => (
                <div key={en} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100">
                    <Icon className="h-3.5 w-3.5 text-brand-600" />
                  </div>
                  <span className="text-sm text-gray-600">{isRtl ? ar : en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Authenticated — show dashboard ───────────────────────────────────────
  const completedSessions = sessions.filter((s) => s.finished_at !== null)
  const avgScore = completedSessions.length
    ? completedSessions.reduce((sum, s) => sum + (s.score_pct ?? 0), 0) / completedSessions.length
    : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-gold-500" />
            <span className="text-sm font-semibold text-gold-600">
              {isRtl ? 'مختبر الاختبارات' : 'Test Lab'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
            {isRtl ? `أهلاً، ${user?.username}` : `Welcome back, ${user?.username}`}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isRtl ? 'اختر نوع الامتحان وابدأ جلستك' : 'Pick your exam and start a session'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.is_admin && (
            <Link href="/test-lab/admin" locale={locale}>
              <Button variant="outline" size="sm" className="text-brand-600 border-brand-200">
                <Settings className="h-4 w-4" />
                {isRtl ? 'الإدارة' : 'Admin'}
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-red-600"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            {isRtl ? 'خروج' : 'Sign out'}
          </Button>
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: isRtl ? 'إجمالي الجلسات' : 'Total Sessions',
            value: profile?.total_sessions ?? sessions.length,
          },
          {
            label: isRtl ? 'جلسات مكتملة' : 'Completed',
            value: profile?.completed_sessions ?? completedSessions.length,
          },
          {
            label: isRtl ? 'متوسط النتيجة' : 'Avg Score',
            value: avgScore !== null ? `${avgScore.toFixed(1)}%` : '—',
          },
          {
            label: isRtl ? 'مواضيع ضعيفة' : 'Weak Topics',
            value: weakTopics.length,
          },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left col: charts */}
        <div className="space-y-8">
          {/* Score history */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
              {isRtl ? 'تطور النتائج' : 'Score History'}
            </h2>
            <ScoreHistoryChart sessions={sessions} locale={locale} />
          </div>

          {/* Weak topics */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
              {isRtl ? 'المواضيع التي تحتاج تدريباً' : 'Topics Needing Work'}
            </h2>
            <WeakTopicsChart topics={weakTopics} locale={locale} />
          </div>

          {/* Recent sessions table */}
          {sessions.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
                {isRtl ? 'الجلسات الأخيرة' : 'Recent Sessions'}
              </h2>
              <div className="divide-y divide-gray-50">
                {sessions.slice(0, 8).map((s) => (
                  <div key={s.session_id} className="flex items-center gap-4 py-3">
                    <span className="rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                      {s.exam_type}
                    </span>
                    <span className="flex-1 text-xs text-gray-400">
                      {new Date(s.started_at).toLocaleDateString(
                        locale === 'ar' ? 'ar-KW' : 'en-GB',
                        { day: 'numeric', month: 'short' },
                      )}
                    </span>
                    <span className="text-xs text-gray-500">{s.total_q}Q</span>
                    {s.score_pct !== null ? (
                      <span
                        className={`text-sm font-black ${
                          s.score_pct >= 80
                            ? 'text-green-600'
                            : s.score_pct >= 60
                              ? 'text-gold-600'
                              : 'text-red-500'
                        }`}
                      >
                        {s.score_pct.toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">
                        {isRtl ? 'غير مكتمل' : 'incomplete'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right col: session starter */}
        <div>
          <SessionStarter
            token={token!}
            onSessionStarted={handleSessionStarted}
            locale={locale}
            weakTopics={weakTopics.map((w) => w.topic)}
          />
        </div>
      </div>
    </div>
  )
}
