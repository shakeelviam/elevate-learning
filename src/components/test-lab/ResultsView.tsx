'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  RotateCcw,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import type { SessionResult } from '@/lib/test-lab-api'

interface ResultsViewProps {
  result: SessionResult
  locale: 'en' | 'ar'
}

function ScoreCircle({ pct, locale }: { pct: number; locale: 'en' | 'ar' }) {
  const isRtl = locale === 'ar'
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444'
  const label =
    pct >= 80
      ? isRtl ? 'ممتاز' : 'Excellent'
      : pct >= 60
        ? isRtl ? 'جيد' : 'Good'
        : isRtl ? 'تحتاج تدريباً' : 'Keep Practicing'

  const r = 52
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={140} height={140} className="-rotate-90">
          <circle cx={70} cy={70} r={r} fill="none" stroke="#e2e8f0" strokeWidth={10} />
          <circle
            cx={70}
            cy={70}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-gray-900">{pct.toFixed(0)}%</span>
        </div>
      </div>
      <span className="mt-1 text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  )
}

export function ResultsView({ result, locale }: ResultsViewProps) {
  const isRtl = locale === 'ar'
  const [expandedHash, setExpandedHash] = useState<string | null>(null)

  const timeTaken = result.finished_at && result.started_at
    ? Math.round(
        (new Date(result.finished_at).getTime() - new Date(result.started_at).getTime()) / 1000,
      )
    : null

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return isRtl ? `${m}د ${sec}ث` : `${m}m ${sec}s`
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── Score summary ────────────────────────────────────────────────── */}
      <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <ScoreCircle pct={result.score_pct} locale={locale} />

          <div className="flex-1 text-center sm:text-start">
            <div className="mb-1 flex items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                {result.exam_type}
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              {isRtl ? 'نتيجة جلستك' : 'Your Session Result'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRtl
                ? `أجبت على ${result.correct_count} من ${result.total_count} سؤالاً بشكل صحيح`
                : `${result.correct_count} of ${result.total_count} correct`}
            </p>

            {/* Stats row */}
            <div className="mt-4 flex flex-wrap justify-center gap-4 sm:justify-start">
              {timeTaken !== null && (
                <div className="text-center">
                  <p className="text-lg font-black text-gray-900">{formatDuration(timeTaken)}</p>
                  <p className="text-xs text-gray-400">{isRtl ? 'الوقت المستغرق' : 'Time taken'}</p>
                </div>
              )}
              <div className="text-center">
                <p className="text-lg font-black text-gray-900">{result.correct_count}</p>
                <p className="text-xs text-gray-400">{isRtl ? 'صحيح' : 'Correct'}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-gray-900">
                  {result.total_count - result.correct_count}
                </p>
                <p className="text-xs text-gray-400">{isRtl ? 'خطأ' : 'Incorrect'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weak topics updated */}
        {result.weak_topics_updated.length > 0 && (
          <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3">
            <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
            <p className="text-xs text-amber-700">
              {isRtl
                ? `تم تحديث مواضيع التدريب: ${result.weak_topics_updated.join('، ')}`
                : `Training profile updated for: ${result.weak_topics_updated.join(', ')}`}
            </p>
          </div>
        )}
      </div>

      {/* ── Question review ───────────────────────────────────────────────── */}
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
        {isRtl ? 'مراجعة الأسئلة' : 'Question Review'}
      </h2>

      <div className="space-y-3">
        {result.questions.map((q, i) => {
          const isExpanded = expandedHash === q.hash
          const toggle = () => setExpandedHash(isExpanded ? null : q.hash)

          return (
            <div
              key={q.hash}
              className={`rounded-2xl border transition-all ${
                q.was_correct
                  ? 'border-green-100 bg-green-50/50'
                  : 'border-red-100 bg-red-50/50'
              }`}
            >
              {/* Question header row */}
              <button
                onClick={toggle}
                className="flex w-full items-start gap-3 p-4 text-start"
              >
                {q.was_correct ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                )}
                <span className="flex-1 text-sm font-medium text-gray-800 leading-relaxed">
                  {i + 1}. {q.question}
                </span>
                <ChevronDown
                  className={`mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Expanded: options + explanation */}
              {isExpanded && (
                <div className="border-t border-current/10 px-4 pb-4 pt-3">
                  {/* Options grid */}
                  <div className="mb-4 space-y-2">
                    {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                      const isCorrect = letter === q.correct
                      const isChosen = letter === q.user_answer
                      return (
                        <div
                          key={letter}
                          className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs ${
                            isCorrect
                              ? 'border-green-300 bg-green-100 text-green-800'
                              : isChosen && !isCorrect
                                ? 'border-red-300 bg-red-100 text-red-700'
                                : 'border-gray-200 bg-white text-gray-600'
                          }`}
                        >
                          <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                            isCorrect
                              ? 'border-green-400 bg-green-500 text-white'
                              : isChosen
                                ? 'border-red-400 bg-red-400 text-white'
                                : 'border-gray-200'
                          }`}>
                            {letter}
                          </span>
                          <span className="flex-1">{q.options[letter]}</span>
                          {isCorrect && (
                            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {/* Explanation */}
                  {q.explanation && (
                    <div className="rounded-xl bg-white/80 px-4 py-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        {isRtl ? 'الشرح' : 'Explanation'}
                      </p>
                      <p className="text-xs leading-relaxed text-gray-700">{q.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── CTA buttons ───────────────────────────────────────────────────── */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/test-lab" locale={locale}>
          <Button variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {isRtl ? 'جلسة جديدة' : 'New Session'}
          </Button>
        </Link>
        <Link href="/test-lab" locale={locale}>
          <Button className="gap-2">
            <FlaskConical className="h-4 w-4" />
            {isRtl ? 'العودة للمختبر' : 'Back to Test Lab'}
          </Button>
        </Link>
      </div>
    </div>
  )
}
