'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { ResultsView } from '../../../components/test-lab/ResultsView'
import { testLabApi, getStoredToken, type SessionResult } from '../../../lib/test-lab-api'
import { Button } from '../../../components/ui/button'

export default function ResultPage() {
  const params = useParams<{ id: string }>()
  const sessionId = Number(params.id)
  const [result, setResult] = useState<SessionResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = getStoredToken()
    if (!token) { setError('Not authenticated'); setLoading(false); return }

    testLabApi.getSessionResult(token, sessionId)
      .then(setResult)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load result'))
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-gray-700">{error || 'Result not found.'}</p>
        <Link href="/exam"><Button variant="outline">Back to Test Lab</Button></Link>
      </div>
    )
  }

  return <ResultsView result={result} />
}
