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

export interface TokenResponse {
  access_token: string
  token_type: string
  user_id: number
  username: string
  is_admin: boolean
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

export interface UploadResponse {
  filename: string
  chunks_added: number
  total_in_collection: number
  exam_type: string
  difficulty: string
}

export interface CollectionStats {
  collection_name: string
  total_chunks: number
  breakdown: Record<string, number>
}

export interface AdminUser {
  id: number
  username: string
  email: string
  is_admin: boolean
  created_at: string
  session_count: number
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

// ── Auth ──────────────────────────────────────────────────────────────────────

export const testLabApi = {
  register: (username: string, email: string, password: string) =>
    apiFetch<TokenResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  login: (username: string, password: string) =>
    apiFetch<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // ── Sessions ─────────────────────────────────────────────────────────────

  startSession: (token: string, req: StartSessionRequest) =>
    apiFetch<SessionStartResponse>(
      '/sessions/start',
      { method: 'POST', body: JSON.stringify(req) },
      token,
    ),

  submitSession: (
    token: string,
    sessionId: number,
    answers: Record<string, string>,
  ) =>
    apiFetch<SessionResult>(
      `/sessions/${sessionId}/submit`,
      { method: 'POST', body: JSON.stringify({ answers }) },
      token,
    ),

  listSessions: (token: string) =>
    apiFetch<SessionSummary[]>('/sessions/', {}, token),

  getSessionResult: (token: string, sessionId: number) =>
    apiFetch<SessionResult>(`/sessions/${sessionId}/result`, {}, token),

  // ── Users ─────────────────────────────────────────────────────────────────

  getProfile: (token: string) =>
    apiFetch<UserProfile>('/users/me', {}, token),

  getWeakTopics: (token: string) =>
    apiFetch<WeakTopic[]>('/users/me/weak-topics', {}, token),

  // ── Admin ─────────────────────────────────────────────────────────────────

  adminUploadPdf: (
    token: string,
    file: File,
    examType: string,
    difficulty: string,
    chunkSize = 600,
    chunkOverlap = 80,
  ): Promise<UploadResponse> => {
    const form = new FormData()
    form.append('file', file)
    form.append('exam_type', examType)
    form.append('difficulty', difficulty)
    form.append('chunk_size', String(chunkSize))
    form.append('chunk_overlap', String(chunkOverlap))
    // Use raw fetch — FormData must not have Content-Type set manually
    return fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(String(err.detail ?? `HTTP ${res.status}`))
      }
      return res.json() as Promise<UploadResponse>
    })
  },

  adminGetStats: (token: string) =>
    apiFetch<CollectionStats>('/admin/collection', {}, token),

  adminListUsers: (token: string) =>
    apiFetch<AdminUser[]>('/admin/users', {}, token),

  adminSetAdminStatus: (token: string, userId: number, isAdmin: boolean) =>
    apiFetch<{ user_id: number; username: string; is_admin: boolean }>(
      `/admin/users/${userId}/make-admin?is_admin=${isAdmin}`,
      { method: 'PATCH' },
      token,
    ),

  adminResetCollection: (token: string) =>
    apiFetch<{ message: string }>('/admin/collection/reset', { method: 'DELETE' }, token),
}

// ── localStorage helpers ──────────────────────────────────────────────────────

const TOKEN_KEY = 'test-lab-token'
const USER_KEY = 'test-lab-user'

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): TokenResponse | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as TokenResponse) : null
}

export function storeAuth(resp: TokenResponse): void {
  localStorage.setItem(TOKEN_KEY, resp.access_token)
  localStorage.setItem(USER_KEY, JSON.stringify(resp))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function storeSession(data: SessionStartResponse): void {
  localStorage.setItem(`test-lab-session-${data.session_id}`, JSON.stringify(data))
}

export function getStoredSession(sessionId: number): SessionStartResponse | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(`test-lab-session-${sessionId}`)
  return raw ? (JSON.parse(raw) as SessionStartResponse) : null
}

export function storeAnswers(sessionId: number, answers: Record<string, string>): void {
  localStorage.setItem(`test-lab-answers-${sessionId}`, JSON.stringify(answers))
}

export function getStoredAnswers(sessionId: number): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem(`test-lab-answers-${sessionId}`)
  return raw ? JSON.parse(raw) : {}
}
