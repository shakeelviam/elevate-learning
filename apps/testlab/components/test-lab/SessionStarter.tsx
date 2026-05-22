'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import { Button } from '../ui/button'
import { type StartSessionRequest, type SessionStartResponse, testLabApi, storeSession } from '../../lib/test-lab-api'

const EXAM_TYPES = ['IELTS', 'TOEFL', 'OET', 'GMAT', 'SAT', 'PTE', 'GENERAL']

interface SessionStarterProps {
  token: string
  onSessionStarted: (session: SessionStartResponse) => void
  weakTopics?: string[]
}

export function SessionStarter({ token, onSessionStarted, weakTopics = [] }: SessionStarterProps) {
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
      setError(err instanceof Error ? err.message : 'Failed to start session. Make sure Ollama is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50">
          <Zap className="h-5 w-5 text-gold-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Start a New Test</h3>
          <p className="text-xs text-gray-500">Customise your session and go</p>
        </div>
      </div>

      <form onSubmit={handleStart} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Exam Type</label>
          <select value={examType} onChange={(e) => setExamType(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
            {EXAM_TYPES.map((et) => <option key={et} value={et}>{et}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Questions</label>
            <input type="number" min={5} max={40} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Time (min)</label>
            <input type="number" min={5} max={120} value={timeLimitMinutes} onChange={(e) => setTimeLimitMinutes(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Difficulty</label>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as const).map((d) => (
              <button key={d} type="button" onClick={() => setDifficulty(d)} className={`rounded-xl border py-2 text-xs font-semibold capitalize transition-all ${difficulty === d ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Topic Focus (optional)</label>
          <input type="text" value={topicHint} onChange={(e) => setTopicHint(e.target.value)} placeholder="e.g. Reading comprehension" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <Button type="submit" isLoading={loading} size="lg" className="w-full">
          <Zap className="h-4 w-4" />
          {loading ? 'Generating questions…' : 'Start Session'}
        </Button>
      </form>
    </div>
  )
}
