'use client'

import { useState } from 'react'
import { FlaskConical, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type TokenResponse, testLabApi } from '@/lib/test-lab-api'

interface TestLabAuthProps {
  onAuth: (resp: TokenResponse) => void
  locale: 'en' | 'ar'
}

type Tab = 'login' | 'register'

export function TestLabAuth({ onAuth, locale }: TestLabAuthProps) {
  const isRtl = locale === 'ar'
  const [tab, setTab] = useState<Tab>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login fields
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register fields
  const [regUsername, setRegUsername] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const resp = await testLabApi.login(loginUsername, loginPassword)
      onAuth(resp)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const resp = await testLabApi.register(regUsername, regEmail, regPassword)
      onAuth(resp)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Icon + heading */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg">
          <FlaskConical className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-black text-gray-900">
          {isRtl ? 'مختبر الاختبارات' : 'The Test Lab'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isRtl ? 'سجّل دخولك للبدء في التدريب التكيّفي' : 'Sign in to start adaptive practice'}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
        {(['login', 'register'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError('') }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              tab === t
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'login'
              ? isRtl ? 'تسجيل الدخول' : 'Sign In'
              : isRtl ? 'إنشاء حساب' : 'Create Account'}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Login form */}
      {tab === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isRtl ? 'اسم المستخدم' : 'Username'}
            </label>
            <input
              type="text"
              required
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder={isRtl ? 'اسم المستخدم' : 'your_username'}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isRtl ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" size="lg" isLoading={loading}>
            {isRtl ? 'تسجيل الدخول' : 'Sign In'}
          </Button>
        </form>
      )}

      {/* Register form */}
      {tab === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isRtl ? 'اسم المستخدم' : 'Username'}
            </label>
            <input
              type="text"
              required
              minLength={3}
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder={isRtl ? 'اختر اسم مستخدم' : 'choose_username'}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isRtl ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isRtl ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder={isRtl ? '8 أحرف على الأقل' : 'Min. 8 characters'}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" isLoading={loading}>
            {isRtl ? 'إنشاء الحساب' : 'Create Account'}
          </Button>
        </form>
      )}
    </div>
  )
}
