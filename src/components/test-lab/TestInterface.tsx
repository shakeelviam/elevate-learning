'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Send } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import {
  type QuestionPublic,
  type SessionResult,
  storeAnswers,
  getStoredAnswers,
  testLabApi,
} from '@/lib/test-lab-api'

interface TestInterfaceProps {
  sessionId: number
  examType: string
  questions: QuestionPublic[]
  timeLimitMinutes: number
  token: string
  locale: 'en' | 'ar'
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function TestInterface({
  sessionId,
  examType,
  questions,
  timeLimitMinutes,
  token,
  locale,
}: TestInterfaceProps) {
  const isRtl = locale === 'ar'
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(
    () => getStoredAnswers(sessionId),
  )
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const hasSubmitted = useRef(false)

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length

  // Persist answers on every change
  useEffect(() => {
    storeAnswers(sessionId, answers)
  }, [answers, sessionId])

  // Countdown timer
  const submitAnswers = useCallback(async (finalAnswers: Record<string, string>) => {
    if (hasSubmitted.current) return
    hasSubmitted.current = true
    setSubmitting(true)
    setSubmitError('')
    try {
      await testLabApi.submitSession(token, sessionId, finalAnswers)
      router.push(`/test-lab/result/${sessionId}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed')
      setSubmitting(false)
      hasSubmitted.current = false
    }
  }, [token, sessionId, router])

  useEffect(() => {
    if (timeLeft <= 0) {
      submitAnswers(answers)
      return
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [timeLeft, answers, submitAnswers])

  const selectOption = (hash: string, letter: string) => {
    setAnswers((prev) => ({ ...prev, [hash]: letter }))
  }

  const handleSubmit = () => {
    if (!allAnswered && !showConfirm) {
      setShowConfirm(true)
      return
    }
    submitAnswers(answers)
  }

  const timerDanger = timeLeft < 120

  return (
    <div className="flex min-h-screen flex-col bg-brand-950" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-brand-800 px-2.5 py-1 text-xs font-bold text-brand-300">
            {examType}
          </span>
          <span className="text-xs text-brand-400">
            {isRtl
              ? `السؤال ${currentIndex + 1} من ${questions.length}`
              : `Question ${currentIndex + 1} of ${questions.length}`}
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-bold tabular-nums transition-colors ${
            timerDanger
              ? 'animate-pulse border-red-500/50 bg-red-500/20 text-red-300'
              : 'border-brand-700 bg-brand-900 text-gold-400'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      <div className="h-1 bg-brand-900">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-gold-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:px-6">
        {/* Question */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-md bg-brand-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-300">
              {currentQuestion.difficulty}
            </span>
            {currentQuestion.topic && (
              <span className="text-xs text-brand-500">{currentQuestion.topic}</span>
            )}
          </div>
          <p className="text-lg font-medium leading-relaxed text-white sm:text-xl">
            {currentQuestion.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {OPTION_LABELS.map((letter) => {
            const text = currentQuestion.options[letter]
            const selected = answers[currentQuestion.hash] === letter
            return (
              <button
                key={letter}
                onClick={() => selectOption(currentQuestion.hash, letter)}
                className={`group flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-start transition-all duration-150 ${
                  selected
                    ? 'border-brand-400 bg-brand-500/20 shadow-[0_0_0_1px_rgba(13,139,232,0.4)]'
                    : 'border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]'
                }`}
              >
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-all ${
                    selected
                      ? 'border-brand-400 bg-brand-500 text-white'
                      : 'border-white/20 text-white/50 group-hover:border-white/40'
                  }`}
                >
                  {letter}
                </span>
                <span className={`text-sm leading-relaxed sm:text-base ${selected ? 'text-white' : 'text-white/75'}`}>
                  {text}
                </span>
              </button>
            )
          })}
        </div>
      </main>

      {/* ── Bottom navigation ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-4 py-4 sm:px-8">
        {/* Question grid */}
        <div className="mb-4 flex flex-wrap gap-1.5 justify-center">
          {questions.map((q, i) => (
            <button
              key={q.hash}
              onClick={() => setCurrentIndex(i)}
              className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                i === currentIndex
                  ? 'bg-brand-500 text-white ring-2 ring-brand-400 ring-offset-1 ring-offset-brand-950'
                  : answers[q.hash]
                    ? 'bg-brand-700 text-brand-200'
                    : 'bg-white/10 text-white/40 hover:bg-white/20'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {submitError}
          </div>
        )}

        {/* Unanswered warning */}
        {showConfirm && !allAnswered && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-2.5 text-sm text-gold-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {isRtl
              ? `${questions.length - answeredCount} سؤال لم تُجب عنه. هل أنت متأكد من الإرسال؟`
              : `${questions.length - answeredCount} unanswered. Submit anyway?`}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
            {isRtl ? 'السابق' : 'Prev'}
          </Button>

          <div className="flex-1" />

          {currentIndex < questions.length - 1 ? (
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
            >
              {isRtl ? 'التالي' : 'Next'}
              <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={submitting}
              className={allAnswered
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 !text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:opacity-90'
                : 'bg-brand-600 !text-white hover:bg-brand-500'}
            >
              <Send className="h-4 w-4" />
              {submitting
                ? isRtl ? 'جارٍ الإرسال…' : 'Submitting…'
                : allAnswered
                  ? isRtl ? 'إرسال الإجابات' : 'Submit Answers'
                  : showConfirm
                    ? isRtl ? 'إرسال على أي حال' : 'Submit Anyway'
                    : isRtl ? 'إنهاء' : 'Finish'}
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
