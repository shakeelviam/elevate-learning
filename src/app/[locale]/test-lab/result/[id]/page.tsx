'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AlertCircle, FlaskConical, Loader2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { ResultsView } from '@/components/test-lab/ResultsView'
import { useTestLabAuth } from '@/hooks/useTestLabAuth'
import { testLabApi, type SessionResult } from '@/lib/test-lab-api'
import { Button } from '@/components/ui/button'

export default function ResultPage() {
  const params = useParams<{ locale: string; id: string }>()
  const locale = (params.locale ?? 'en') as 'en' | 'ar'
  const sessionId = Number(params.id)
  const isRtl = locale === 'ar'

  const { token, isAuthed, loading: authLoading } = useTestLabAuth()
  const [result, setResult] = useState<SessionResult | null>(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!isAuthed || !token) {
      setFetching(false)
      return
    }
    testLabApi
      .getSessionResult(token, sessionId)
      .then(setResult)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load result'))
      .finally(() => setFetching(false))
  }, [authLoading, isAuthed, token, sessionId])

  if (authLoading || fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    )
  }

  if (!isAuthed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-gray-700">
          {isRtl ? 'يجب تسجيل الدخول لعرض النتائج.' : 'Sign in to view results.'}
        </p>
        <Link href="/test-lab" locale={locale}>
          <Button>{isRtl ? 'الذهاب للمختبر' : 'Go to Test Lab'}</Button>
        </Link>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <FlaskConical className="h-10 w-10 text-brand-400" />
        <p className="text-gray-700">
          {error || (isRtl ? 'لم يتم العثور على النتائج.' : 'Result not found.')}
        </p>
        <Link href="/test-lab" locale={locale}>
          <Button variant="outline">{isRtl ? 'العودة للمختبر' : 'Back to Test Lab'}</Button>
        </Link>
      </div>
    )
  }

  return <ResultsView result={result} locale={locale} />
}
