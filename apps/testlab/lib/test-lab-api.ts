const API_BASE =
  process.env.NEXT_PUBLIC_TEST_LAB_API_URL ?? 'http://localhost:8000'

// ── Shared types ──────────────────────────────────────────────────────────────

export interface QuestionOptions { A: string; B: string; C: string; D: string }

export interface QuestionPublic {
  hash: string
  question: string
  options: QuestionOptions
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  position: number
}

export interface QuestionResult {
  hash: string
  question: string
  options: QuestionOptions
  correct: 'A' | 'B' | 'C' | 'D'
  user_answer: 'A' | 'B' | 'C' | 'D' | null
  was_correct: boolean
  explanation: string
  topic: string
  difficulty: string
}

export interface SessionStartResponse {
  session_id: number
  exam_type: string
  questions: QuestionPublic[]
  time_limit_minutes: number
  started_at: string
}

export interface SessionResult {
  session_id: number
  exam_type: string
  score_pct: number
  correct_count: number
  total_count: number
  started_at: string
  finished_at: string
  questions: QuestionResult[]
  weak_topics_updated: string[]
}

export interface SessionSummary {
  session_id: number
  exam_type: string
  score_pct: number | null
  total_q: number
  started_at: string
  finished_at: string | null
}

export interface WeakTopic {
  topic: string
  miss_count: number
  updated_at: string
}

export interface UserProfile {
  id: number
  username: string
  email: string
  created_at: string
  total_sessions: number
  completed_sessions: number
  avg_score: number | null
  top_weak_topics: WeakTopic[]
}

export interface StartSessionRequest {
  exam_type: string
  count: number
  difficulty: 'easy' | 'medium' | 'hard'
  weak_topics: string[]
  topic_hint: string
  time_limit_minutes: number
}

// ── Core fetch helper ─────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(String(err.detail ?? `HTTP ${res.status}`))
  }
  return res.json() as Promise<T>
}

// ── API client ────────────────────────────────────────────────────────────────

export const testLabApi = {
  startSession: (token: string, req: StartSessionRequest) =>
    apiFetch<SessionStartResponse>(
      '/sessions/start',
      { method: 'POST', body: JSON.stringify(req) },
      token,
    ),

  submitSession: (token: string, sessionId: number, answers: Record<string, string>) =>
    apiFetch<SessionResult>(
      `/sessions/${sessionId}/submit`,
      { method: 'POST', body: JSON.stringify({ answers }) },
      token,
    ),

  listSessions: (token: string) =>
    apiFetch<SessionSummary[]>('/sessions/', {}, token),

  getSessionResult: (token: string, sessionId: number) =>
    apiFetch<SessionResult>(`/sessions/${sessionId}/result`, {}, token),

  getProfile: (token: string) =>
    apiFetch<UserProfile>('/users/me', {}, token),

  getWeakTopics: (token: string) =>
    apiFetch<WeakTopic[]>('/users/me/weak-topics', {}, token),
}

// ── localStorage helpers ──────────────────────────────────────────────────────

const TOKEN_KEY = 'tl-fastapi-token'

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function storeSession(data: SessionStartResponse): void {
  localStorage.setItem(`tl-session-${data.session_id}`, JSON.stringify(data))
}

export function getStoredSession(sessionId: number): SessionStartResponse | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(`tl-session-${sessionId}`)
  return raw ? (JSON.parse(raw) as SessionStartResponse) : null
}

export function storeAnswers(sessionId: number, answers: Record<string, string>): void {
  localStorage.setItem(`tl-answers-${sessionId}`, JSON.stringify(answers))
}

export function getStoredAnswers(sessionId: number): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem(`tl-answers-${sessionId}`)
  return raw ? JSON.parse(raw) : {}
}
