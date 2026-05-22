'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FlaskConical, LogOut, Target, BookOpen, TrendingUp, Trophy } from 'lucide-react'
import { Button } from '../ui/button'
import { SessionStarter } from './SessionStarter'
import { WeakTopicsChart } from './WeakTopicsChart'
import { ScoreHistoryChart } from './ScoreHistoryChart'
import {
  type SessionSummary,
  type WeakTopic,
  type UserProfile,
  type SessionStartResponse,
  testLabApi,
  getStoredToken,
  storeToken,
  storeSession,
} from '../../lib/test-lab-api'

interface ExamHubProps {
  username: string
  fastApiToken: string | null
}

export function ExamHub({ username, fastApiToken }: ExamHubProps) {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [noBackend, setNoBackend] = useState(false)

  useEffect(() => {
    // Prefer the freshly-issued token passed from the server; fall back to stored
    const t = fastApiToken ?? getStoredToken()
    if (t) {
      storeToken(t)
      setToken(t)
    } else {
      setNoBackend(true)
      setLoading(false)
      return
    }

    setLoading(true)
    Promise.all([
      testLabApi.getProfile(t).catch(() => null),
      testLabApi.listSessions(t).catch(() => []),
      testLabApi.getWeakTopics(t).catch(() => []),
    ]).then(([prof, sess, weak]) => {
      setProfile(prof)
      setSessions(sess as SessionSummary[])
      setWeakTopics(weak as WeakTopic[])
    }).finally(() => setLoading(false))
  }, [fastApiToken])

  const handleSessionStarted = (session: SessionStartResponse) => {
    storeSession(session)
    router.push(`/session/${session.session_id}`)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
      </div>
    )
  }

  const completedSessions = sessions.filter((s) => s.finished_at !== null)
  const avgScore = completedSessions.length
    ? completedSessions.reduce((sum, s) => sum + (s.score_pct ?? 0), 0) / completedSessions.length
    : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-gold-500" />
            <span className="text-sm font-semibold text-gold-600">Test Lab</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">Welcome back, {username}</h1>
          <p className="mt-1 text-sm text-gray-500">Pick your exam and start a session</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      {noBackend && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
          AI backend not connected. Start the FastAPI server to generate questions.
        </div>
      )}

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Sessions', value: profile?.total_sessions ?? sessions.length },
          { label: 'Completed', value: profile?.completed_sessions ?? completedSessions.length },
          { label: 'Avg Score', value: avgScore !== null ? `${avgScore.toFixed(1)}%` : '—' },
          { label: 'Weak Topics', value: weakTopics.length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">Score History</h2>
            <ScoreHistoryChart sessions={sessions} />
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">Topics Needing Work</h2>
            <WeakTopicsChart topics={weakTopics} />
          </div>
          {sessions.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">Recent Sessions</h2>
              <div className="divide-y divide-gray-50">
                {sessions.slice(0, 8).map((s) => (
                  <div key={s.session_id} className="flex items-center gap-4 py-3">
                    <span className="rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">{s.exam_type}</span>
                    <span className="flex-1 text-xs text-gray-400">{new Date(s.started_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    <span className="text-xs text-gray-500">{s.total_q}Q</span>
                    {s.score_pct !== null ? (
                      <span className={`text-sm font-black ${s.score_pct >= 80 ? 'text-green-600' : s.score_pct >= 60 ? 'text-gold-600' : 'text-red-500'}`}>
                        {s.score_pct.toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">incomplete</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {token ? (
            <SessionStarter token={token} onSessionStarted={handleSessionStarted} weakTopics={weakTopics.map((w) => w.topic)} />
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                {[
                  { icon: Target,     text: 'Questions adapt to your weak topics automatically' },
                  { icon: BookOpen,   text: 'Covers IELTS, TOEFL, OET, GMAT, SAT, and more' },
                  { icon: TrendingUp, text: 'Visual analytics track your improvement over time' },
                  { icon: Trophy,     text: 'Instant explanations for every answer' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100">
                      <Icon className="h-3.5 w-3.5 text-brand-600" />
                    </div>
                    <span className="text-sm text-gray-600">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
