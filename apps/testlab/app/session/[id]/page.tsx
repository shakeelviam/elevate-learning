'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AlertCircle, FlaskConical } from 'lucide-react'
import Link from 'next/link'
import { TestInterface } from '../../../components/test-lab/TestInterface'
import { getStoredToken, getStoredSession, type SessionStartResponse } from '../../../lib/test-lab-api'
import { Button } from '../../../components/ui/button'

export default function SessionPage() {
  const params = useParams<{ id: string }>()
  const sessionId = Number(params.id)
  const [session, setSession] = useState<SessionStartResponse | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSession(getStoredSession(sessionId))
    setToken(getStoredToken())
  }, [sessionId])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-700 border-t-brand-400" />
      </div>
    )
  }

  if (!token || !session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-950 p-8 text-center">
        <FlaskConical className="h-10 w-10 text-brand-400" />
        <p className="text-white">Session data not found. Please start a new session.</p>
        <Link href="/exam">
          <Button className="bg-gold-500 hover:bg-gold-600 text-white">Start New Session</Button>
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
      token={token}
    />
  )
}
