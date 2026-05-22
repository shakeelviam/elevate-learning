'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ClipboardList, Plus, Trash2, Pencil, ChevronRight, ChevronLeft,
  Loader2, AlertCircle, CheckCircle2, BookOpen, X,
} from 'lucide-react'
import { cn } from '../../../lib/utils'

// ── Exam config ───────────────────────────────────────────────────────────────

const EXAM_TYPES = ['IELTS', 'TOEFL', 'OET', 'SAT', 'GRE', 'GMAT', 'PTE', 'GENERAL']

const EXAM_SECTIONS: Record<string, string[]> = {
  IELTS:   ['Reading (Academic)', 'Reading (General Training)', 'Listening'],
  TOEFL:   ['Reading', 'Listening'],
  OET:     ['Reading Part A', 'Reading Part B-C', 'Listening Part A', 'Listening Part B-C'],
  SAT:     ['Reading & Writing', 'Math'],
  GRE:     ['Verbal Reasoning', 'Quantitative Reasoning'],
  GMAT:    ['Verbal', 'Quantitative', 'Integrated Reasoning'],
  PTE:     ['Reading', 'Listening'],
  GENERAL: ['Mixed'],
}

// Exam types that have reading passages
const PASSAGE_EXAMS = new Set(['IELTS', 'TOEFL', 'OET', 'GMAT', 'PTE'])
// Exam types that support TFNG (True/False/Not Given)
const TFNG_EXAMS = new Set(['IELTS'])

// ── Types ─────────────────────────────────────────────────────────────────────

type QType = 'mcq' | 'tfng' | 'passage_mcq'

type Bank = {
  id: number
  name: string
  exam_type: string
  section: string | null
  description: string | null
  question_count: number
  created_at: string
}

type Question = {
  id: number
  bank_id: number
  question_type: QType
  passage: string | null
  passage_title: string | null
  question: string
  option_a: string | null
  option_b: string | null
  option_c: string | null
  option_d: string | null
  correct: string
  explanation: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  position: number
  created_at: string
}

const BLANK_QUESTION: Omit<Question, 'id' | 'bank_id' | 'created_at'> = {
  question_type: 'mcq',
  passage: null,
  passage_title: null,
  question: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct: 'A',
  explanation: '',
  topic: '',
  difficulty: 'medium',
  position: 0,
}

// ── Small UI helpers ──────────────────────────────────────────────────────────

function Badge({ label, color = 'gray' }: { label: string; color?: string }) {
  const map: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600',
    blue: 'bg-blue-50 text-blue-700',
    gold: 'bg-amber-50 text-amber-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-600',
  }
  return (
    <span className={cn('rounded px-1.5 py-0.5 text-[11px] font-semibold', map[color] ?? map.gray)}>
      {label}
    </span>
  )
}

function DifficultyPicker({
  value, onChange,
}: { value: string; onChange: (v: 'easy' | 'medium' | 'hard') => void }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {(['easy', 'medium', 'hard'] as const).map((d) => (
        <button
          key={d} type="button" onClick={() => onChange(d)}
          className={cn(
            'rounded-lg border py-1.5 text-xs font-semibold capitalize transition-all',
            value === d
              ? 'border-brand-400 bg-brand-50 text-brand-700'
              : 'border-gray-200 text-gray-400 hover:border-gray-300',
          )}
        >
          {d}
        </button>
      ))}
    </div>
  )
}

// ── Question form ─────────────────────────────────────────────────────────────

function QuestionForm({
  examType,
  initial,
  onSave,
  onCancel,
  saving,
}: {
  examType: string
  initial: Omit<Question, 'id' | 'bank_id' | 'created_at'>
  onSave: (q: Omit<Question, 'id' | 'bank_id' | 'created_at'>) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }))

  const isTfng = form.question_type === 'tfng'
  const hasPassage = form.question_type === 'passage_mcq' || PASSAGE_EXAMS.has(examType)
  const showTfng = TFNG_EXAMS.has(examType)

  // Reset correct answer when switching type
  const handleTypeChange = (t: QType) => {
    setForm((f) => ({ ...f, question_type: t, correct: t === 'tfng' ? 'True' : 'A' }))
  }

  const valid = form.question.trim() &&
    (isTfng || (form.option_a && form.option_b && form.option_c && form.option_d))

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/30 p-5 space-y-4">
      {/* Type selector */}
      <div>
        <label className="label-xs">Question Type</label>
        <div className="flex gap-2 mt-1">
          {(['mcq', ...(hasPassage ? ['passage_mcq'] : []), ...(showTfng ? ['tfng'] : [])] as QType[]).map((t) => (
            <button
              key={t} type="button" onClick={() => handleTypeChange(t)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                form.question_type === t
                  ? 'border-brand-400 bg-brand-100 text-brand-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300',
              )}
            >
              {t === 'mcq' ? 'MCQ' : t === 'tfng' ? 'True/False/NG' : 'Passage + MCQ'}
            </button>
          ))}
        </div>
      </div>

      {/* Passage */}
      {(form.question_type === 'passage_mcq') && (
        <div className="space-y-2">
          <div>
            <label className="label-xs">Passage Title (optional)</label>
            <input
              value={form.passage_title ?? ''} onChange={(e) => set('passage_title', e.target.value || null)}
              className="input-sm mt-1" placeholder="e.g. The History of Coffee"
            />
          </div>
          <div>
            <label className="label-xs">Reading Passage</label>
            <textarea
              value={form.passage ?? ''} onChange={(e) => set('passage', e.target.value || null)}
              rows={5} className="input-sm mt-1 resize-y" placeholder="Paste the reading passage here…"
            />
          </div>
        </div>
      )}

      {/* Question stem */}
      <div>
        <label className="label-xs">Question *</label>
        <textarea
          value={form.question} onChange={(e) => set('question', e.target.value)}
          rows={3} className="input-sm mt-1 resize-y" placeholder="Type the question…"
        />
      </div>

      {/* MCQ options */}
      {!isTfng && (
        <div className="grid grid-cols-2 gap-3">
          {(['a', 'b', 'c', 'd'] as const).map((opt) => (
            <div key={opt}>
              <label className="label-xs">Option {opt.toUpperCase()} *</label>
              <input
                value={(form as Record<string, unknown>)[`option_${opt}`] as string ?? ''}
                onChange={(e) => set(`option_${opt}`, e.target.value)}
                className="input-sm mt-1" placeholder={`Option ${opt.toUpperCase()}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Correct answer */}
      <div>
        <label className="label-xs">Correct Answer *</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {(isTfng ? ['True', 'False', 'Not Given'] : ['A', 'B', 'C', 'D']).map((v) => (
            <button
              key={v} type="button" onClick={() => set('correct', v)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-bold transition-all',
                form.correct === v
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-400 hover:border-gray-300',
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation + meta */}
      <div>
        <label className="label-xs">Explanation</label>
        <textarea
          value={form.explanation} onChange={(e) => set('explanation', e.target.value)}
          rows={2} className="input-sm mt-1 resize-y" placeholder="Why is this the correct answer?"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-xs">Topic</label>
          <input
            value={form.topic} onChange={(e) => set('topic', e.target.value)}
            className="input-sm mt-1" placeholder="e.g. Reading Comprehension"
          />
        </div>
        <div>
          <label className="label-xs">Difficulty</label>
          <div className="mt-1">
            <DifficultyPicker value={form.difficulty} onChange={(v) => set('difficulty', v)} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button" onClick={() => onSave(form)} disabled={!valid || saving}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all',
            valid && !saving ? 'bg-brand-600 hover:bg-brand-700' : 'cursor-not-allowed bg-gray-300',
          )}
        >
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save Question
        </button>
        <button
          type="button" onClick={onCancel}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Question row ──────────────────────────────────────────────────────────────

function QuestionRow({
  q, examType, onEdit, onDelete,
}: { q: Question; examType: string; onEdit: () => void; onDelete: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const typeLabel = q.question_type === 'tfng' ? 'TFNG' : q.question_type === 'passage_mcq' ? 'Passage' : 'MCQ'
  const diffColor = q.difficulty === 'hard' ? 'red' : q.difficulty === 'easy' ? 'green' : 'gold'

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 shrink-0">
          <Badge label={typeLabel} color="blue" />
          <Badge label={q.difficulty} color={diffColor} />
          {q.topic && <Badge label={q.topic} />}
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button onClick={onEdit} className="rounded p-1 text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {confirmDelete ? (
            <>
              <button onClick={onDelete} className="rounded p-1 text-red-600 hover:bg-red-50 transition text-xs font-semibold">Yes</button>
              <button onClick={() => setConfirmDelete(false)} className="rounded p-1 text-gray-400 hover:bg-gray-50 transition text-xs">No</button>
            </>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="rounded p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      {q.passage_title && <p className="text-xs text-gray-400 italic">{q.passage_title}</p>}
      <p className="text-sm text-gray-800 leading-snug">{q.question}</p>
      {q.question_type !== 'tfng' && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-500">
          {(['a', 'b', 'c', 'd'] as const).map((opt) => {
            const val = (q as Record<string, unknown>)[`option_${opt}`] as string | null
            const isCorrect = q.correct === opt.toUpperCase()
            return val ? (
              <span key={opt} className={cn('flex gap-1', isCorrect && 'font-semibold text-green-700')}>
                <span>{opt.toUpperCase()}.</span>
                <span>{val}</span>
              </span>
            ) : null
          })}
        </div>
      )}
      {q.question_type === 'tfng' && (
        <span className="text-xs font-semibold text-green-700">Answer: {q.correct}</span>
      )}
    </div>
  )
}

// ── Main TestsTab ─────────────────────────────────────────────────────────────

export function TestsTab({ proxy }: { proxy: string }) {
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  // Selected bank + its questions
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(false)

  // Create bank form
  const [showBankForm, setShowBankForm] = useState(false)
  const [bankForm, setBankForm] = useState({ name: '', exam_type: 'IELTS', section: '', description: '' })
  const [bankSaving, setBankSaving] = useState(false)

  // Question add/edit
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [questionSaving, setQuestionSaving] = useState(false)

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  // ── API helpers ─────────────────────────────────────────────────────────────

  const apiFetch = useCallback(async (path: string, opts?: RequestInit) => {
    const res = await fetch(`${proxy}${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...opts?.headers },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail ?? `HTTP ${res.status}`)
    }
    return res.status === 204 ? null : res.json()
  }, [proxy])

  // ── Load banks ──────────────────────────────────────────────────────────────

  const loadBanks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/banks')
      setBanks(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load banks')
    } finally {
      setLoading(false)
    }
  }, [apiFetch])

  useEffect(() => { loadBanks() }, [loadBanks])

  // ── Select bank → load questions ────────────────────────────────────────────

  const selectBank = useCallback(async (bank: Bank) => {
    setSelectedBank(bank)
    setShowQuestionForm(false)
    setEditingQuestion(null)
    setQuestionsLoading(true)
    try {
      const data = await apiFetch(`/banks/${bank.id}`)
      setQuestions(data.questions)
    } catch {
      setQuestions([])
    } finally {
      setQuestionsLoading(false)
    }
  }, [apiFetch])

  // ── Create bank ─────────────────────────────────────────────────────────────

  const handleCreateBank = async () => {
    if (!bankForm.name.trim()) return
    setBankSaving(true)
    try {
      const body = {
        name: bankForm.name.trim(),
        exam_type: bankForm.exam_type,
        section: bankForm.section || null,
        description: bankForm.description || null,
      }
      const created = await apiFetch('/banks', { method: 'POST', body: JSON.stringify(body) })
      setBanks((b) => [...b, created])
      setBankForm({ name: '', exam_type: 'IELTS', section: '', description: '' })
      setShowBankForm(false)
      flash('Bank created')
      selectBank(created)
    } catch (e) {
      flash(e instanceof Error ? e.message : 'Failed to create bank')
    } finally {
      setBankSaving(false)
    }
  }

  // ── Delete bank ─────────────────────────────────────────────────────────────

  const handleDeleteBank = async (bank: Bank) => {
    if (!confirm(`Delete "${bank.name}" and all ${bank.question_count} questions?`)) return
    try {
      await apiFetch(`/banks/${bank.id}`, { method: 'DELETE' })
      setBanks((b) => b.filter((x) => x.id !== bank.id))
      if (selectedBank?.id === bank.id) { setSelectedBank(null); setQuestions([]) }
      flash('Bank deleted')
    } catch (e) {
      flash(e instanceof Error ? e.message : 'Failed to delete bank')
    }
  }

  // ── Save question (add or edit) ─────────────────────────────────────────────

  const handleSaveQuestion = async (form: Omit<Question, 'id' | 'bank_id' | 'created_at'>) => {
    if (!selectedBank) return
    setQuestionSaving(true)
    try {
      if (editingQuestion) {
        const updated = await apiFetch(`/questions/${editingQuestion.id}`, {
          method: 'PATCH', body: JSON.stringify(form),
        })
        setQuestions((qs) => qs.map((q) => (q.id === editingQuestion.id ? updated : q)))
        flash('Question updated')
      } else {
        const added = await apiFetch(`/banks/${selectedBank.id}/questions`, {
          method: 'POST', body: JSON.stringify(form),
        })
        setQuestions((qs) => [...qs, added])
        setBanks((bs) => bs.map((b) => b.id === selectedBank.id ? { ...b, question_count: b.question_count + 1 } : b))
        flash('Question added')
      }
      setShowQuestionForm(false)
      setEditingQuestion(null)
    } catch (e) {
      flash(e instanceof Error ? e.message : 'Failed to save question')
    } finally {
      setQuestionSaving(false)
    }
  }

  // ── Delete question ─────────────────────────────────────────────────────────

  const handleDeleteQuestion = async (q: Question) => {
    try {
      await apiFetch(`/questions/${q.id}`, { method: 'DELETE' })
      setQuestions((qs) => qs.filter((x) => x.id !== q.id))
      setBanks((bs) => bs.map((b) => b.id === selectedBank?.id ? { ...b, question_count: Math.max(0, b.question_count - 1) } : b))
      flash('Question deleted')
    } catch (e) {
      flash(e instanceof Error ? e.message : 'Failed to delete question')
    }
  }

  // ── Grouped banks by exam type ──────────────────────────────────────────────

  const grouped = banks.reduce<Record<string, Bank[]>>((acc, b) => {
    ;(acc[b.exam_type] ??= []).push(b)
    return acc
  }, {})

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          {toast}
        </div>
      )}

      <div className="flex gap-6">
        {/* ── Left: bank list ────────────────────────────────────────────── */}
        <div className="w-72 shrink-0 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">Question Banks</h3>
            <button
              onClick={() => setShowBankForm((v) => !v)}
              className="flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              New Bank
            </button>
          </div>

          {/* New bank form */}
          {showBankForm && (
            <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-4 space-y-3">
              <div>
                <label className="label-xs">Name *</label>
                <input
                  value={bankForm.name} onChange={(e) => setBankForm((f) => ({ ...f, name: e.target.value }))}
                  className="input-sm mt-1" placeholder="e.g. IELTS Reading Set 1"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateBank()}
                />
              </div>
              <div>
                <label className="label-xs">Exam Type</label>
                <select
                  value={bankForm.exam_type}
                  onChange={(e) => setBankForm((f) => ({ ...f, exam_type: e.target.value, section: '' }))}
                  className="input-sm mt-1"
                >
                  {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label-xs">Section</label>
                <select
                  value={bankForm.section}
                  onChange={(e) => setBankForm((f) => ({ ...f, section: e.target.value }))}
                  className="input-sm mt-1"
                >
                  <option value="">— none —</option>
                  {(EXAM_SECTIONS[bankForm.exam_type] ?? []).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-xs">Description</label>
                <input
                  value={bankForm.description}
                  onChange={(e) => setBankForm((f) => ({ ...f, description: e.target.value }))}
                  className="input-sm mt-1" placeholder="Optional note"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateBank} disabled={!bankForm.name.trim() || bankSaving}
                  className="flex-1 rounded-lg bg-brand-600 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50 transition"
                >
                  {bankSaving ? <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" /> : 'Create'}
                </button>
                <button
                  onClick={() => setShowBankForm(false)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Bank list */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          ) : banks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">No question banks yet.<br />Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(grouped).map(([examType, examBanks]) => (
                <div key={examType}>
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">{examType}</p>
                  <div className="space-y-1.5">
                    {examBanks.map((bank) => (
                      <div
                        key={bank.id}
                        onClick={() => selectBank(bank)}
                        className={cn(
                          'group flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 transition-all',
                          selectedBank?.id === bank.id
                            ? 'border-brand-300 bg-brand-50 shadow-sm'
                            : 'border-gray-100 bg-white hover:border-gray-200',
                        )}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">{bank.name}</p>
                          <p className="text-xs text-gray-400">
                            {bank.section ?? 'No section'} · {bank.question_count}Q
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteBank(bank) }}
                            className="hidden group-hover:flex rounded p-1 text-gray-300 hover:text-red-500 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <ChevronRight className={cn(
                            'h-4 w-4 text-gray-300 transition',
                            selectedBank?.id === bank.id && 'text-brand-400',
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: question editor ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {!selectedBank ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 text-center">
              <ClipboardList className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Select a bank on the left to view and edit questions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bank header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => { setSelectedBank(null); setQuestions([]) }} className="text-gray-400 hover:text-gray-600 transition">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedBank.name}</h3>
                    <p className="text-xs text-gray-400">
                      {selectedBank.exam_type}{selectedBank.section ? ` · ${selectedBank.section}` : ''} · {questions.length} questions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowQuestionForm(true); setEditingQuestion(null) }}
                  className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Question
                </button>
              </div>

              {/* Add/edit question form */}
              {(showQuestionForm || editingQuestion) && (
                <QuestionForm
                  examType={selectedBank.exam_type}
                  initial={editingQuestion
                    ? { ...editingQuestion }
                    : { ...BLANK_QUESTION, position: questions.length }}
                  onSave={handleSaveQuestion}
                  onCancel={() => { setShowQuestionForm(false); setEditingQuestion(null) }}
                  saving={questionSaving}
                />
              )}

              {/* Questions list */}
              {questionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : questions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
                  <p className="text-sm text-gray-400">No questions yet. Click <strong>Add Question</strong> to create the first one.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <div key={q.id} className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-400 mt-4">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <QuestionRow
                          q={q}
                          examType={selectedBank.exam_type}
                          onEdit={() => { setEditingQuestion(q); setShowQuestionForm(false) }}
                          onDelete={() => handleDeleteQuestion(q)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
