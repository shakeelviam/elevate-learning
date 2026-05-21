'use client'

import { useState } from 'react'
import { BookOpen, Clock, Loader2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type StartSessionRequest, type SessionStartResponse, testLabApi, storeSession } from '@/lib/test-lab-api'

const EXAM_TYPES = ['IELTS', 'TOEFL', 'OET', 'GMAT', 'SAT', 'PTE', 'GENERAL']

interface SessionStarterProps {
  token: string
  onSessionStarted: (session: SessionStartResponse) => void
  locale: 'en' | 'ar'
  weakTopics?: string[]
}

export function SessionStarter({
  token,
  onSessionStarted,
  locale,
  weakTopics = [],
}: SessionStarterProps) {
  const isRtl = locale === 'ar'
  const [examType, setExamType] = useState('IELTS')
  const [count, setCount] = useState(10)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(20)
  const [topicHint, setTopicHint] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const req: StartSessionRequest = {
        exam_type: examType,
        count,
        difficulty,
        time_limit_minutes: timeLimitMinutes,
        topic_hint: topicHint,
        weak_topics: weakTopics.slice(0, 3),
      }
      const session = await testLabApi.startSession(token, req)
      storeSession(session)
      onSessionStarted(session)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isRtl
            ? 'فشل بدء الجلسة. تأكد من تشغيل Ollama.'
            : 'Failed to start session. Make sure Ollama is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  const difficultyOpts: { value: 'easy' | 'medium' | 'hard'; label: string; labelAr: string }[] = [
    { value: 'easy',   label: 'Easy',   labelAr: 'سهل'   },
    { value: 'medium', label: 'Medium', labelAr: 'متوسط' },
    { value: 'hard',   label: 'Hard',   labelAr: 'صعب'   },
  ]

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50">
          <Zap className="h-5 w-5 text-gold-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">
            {isRtl ? 'بدء اختبار جديد' : 'Start a New Test'}
          </h3>
          <p className="text-xs text-gray-500">
            {isRtl ? 'خصّص جلستك وانطلق' : 'Customise your session and go'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleStart} className="space-y-4">
        {/* Exam type */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            {isRtl ? 'نوع الامتحان' : 'Exam Type'}
          </label>
          <div className="flex flex-wrap gap-2">
            {EXAM_TYPES.map((et) => (
              <button
                key={et}
                type="button"
                onClick={() => setExamType(et)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                  examType === et
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {et}
              </button>
            ))}
          </div>
        </div>

        {/* Count + difficulty row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              {isRtl ? 'عدد الأسئلة' : 'Questions'}
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              {isRtl ? 'المستوى' : 'Difficulty'}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {difficultyOpts.map((o) => (
                <option key={o.value} value={o.value}>
                  {isRtl ? o.labelAr : o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time limit */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            {isRtl ? 'الوقت المتاح (دقيقة)' : 'Time Limit (minutes)'}
          </label>
          <div className="flex gap-2">
            {[10, 20, 30, 45, 60].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTimeLimitMinutes(m)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  timeLimitMinutes === m
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Topic hint */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            {isRtl ? 'موضوع محدد (اختياري)' : 'Topic Focus (optional)'}
          </label>
          <input
            type="text"
            value={topicHint}
            onChange={(e) => setTopicHint(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder={isRtl ? 'مثال: المفردات، الفهم القرائي' : 'e.g. vocabulary, reading comprehension'}
          />
          {weakTopics.length > 0 && (
            <p className="mt-1.5 text-xs text-amber-600">
              {isRtl
                ? `سيركّز على نقاط ضعفك: ${weakTopics.slice(0, 2).join('، ')}`
                : `Will focus on your weak areas: ${weakTopics.slice(0, 2).join(', ')}`}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={loading}
        >
          {loading
            ? isRtl ? 'جارٍ توليد الأسئلة…' : 'Generating questions…'
            : isRtl ? 'ابدأ الاختبار' : 'Start Test'}
        </Button>
      </form>
    </div>
  )
}
