'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AlertCircle, FlaskConical } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { TestInterface } from '@/components/test-lab/TestInterface'
import { useTestLabAuth } from '@/hooks/useTestLabAuth'
import { getStoredSession, type SessionStartResponse } from '@/lib/test-lab-api'
import { Button } from '@/components/ui/button'

export default function SessionPage() {
  const params = useParams<{ locale: string; id: string }>()
  const locale = (params.locale ?? 'en') as 'en' | 'ar'
  const sessionId = Number(params.id)
  const isRtl = locale === 'ar'

  const { token, isAuthed, loading: authLoading } = useTestLabAuth()
  const [session, setSession] = useState<SessionStartResponse | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSession(getStoredSession(sessionId))
  }, [sessionId])

  if (!mounted || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-700 border-t-brand-400" />
      </div>
    )
  }

  if (!isAuthed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-950 p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-white">
          {isRtl ? 'يجب تسجيل الدخول أولاً.' : 'You need to be signed in.'}
        </p>
        <Link href="/test-lab" locale={locale}>
          <Button variant="outline" className="border-brand-700 text-brand-200 hover:bg-brand-900">
            {isRtl ? 'الذهاب للمختبر' : 'Go to Test Lab'}
          </Button>
        </Link>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-950 p-8 text-center">
        <FlaskConical className="h-10 w-10 text-brand-400" />
        <p className="text-white">
          {isRtl ? 'لم يتم العثور على بيانات الجلسة.' : 'Session data not found.'}
        </p>
        <p className="text-sm text-brand-400">
          {isRtl
            ? 'ربما انتهت صلاحية الجلسة. ابدأ جلسة جديدة.'
            : 'The session may have expired. Start a new one.'}
        </p>
        <Link href="/test-lab" locale={locale}>
          <Button className="bg-gold-500 hover:bg-gold-600 !text-white">
            {isRtl ? 'بدء جلسة جديدة' : 'Start New Session'}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <TestInterface
      sessionId={session.session_id}
      examType={session.exam_type}
      questions={session.questions}
      timeLimitMinutes={session.time_limit_minutes}
      token={token!}
      locale={locale}
    />
  )
}
