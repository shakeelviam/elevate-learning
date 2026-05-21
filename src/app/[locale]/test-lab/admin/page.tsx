'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AlertCircle, Lock } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { AdminPanel } from '@/components/test-lab/AdminPanel'
import { useTestLabAuth } from '@/hooks/useTestLabAuth'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  const params = useParams<{ locale: string }>()
  const locale = (params.locale ?? 'en') as 'en' | 'ar'
  const isRtl = locale === 'ar'

  const { token, user, isAuthed, loading } = useTestLabAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
      </div>
    )
  }

  if (!isAuthed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <Lock className="h-10 w-10 text-gray-300" />
        <p className="text-gray-700 font-medium">
          {isRtl ? 'يجب تسجيل الدخول للوصول إلى لوحة الإدارة.' : 'Sign in to access the admin panel.'}
        </p>
        <Link href="/test-lab" locale={locale}>
          <Button>{isRtl ? 'الذهاب للمختبر' : 'Go to Test Lab'}</Button>
        </Link>
      </div>
    )
  }

  if (!user?.is_admin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-gray-700 font-medium">
          {isRtl ? 'هذه الصفحة للمشرفين فقط.' : 'This page is restricted to admins only.'}
        </p>
        <p className="text-sm text-gray-400">
          {isRtl
            ? 'تواصل مع المشرف لطلب الصلاحيات.'
            : 'Ask an existing admin to grant you access, or use the create_admin CLI script.'}
        </p>
        <Link href="/test-lab" locale={locale}>
          <Button variant="outline">{isRtl ? 'العودة للمختبر' : 'Back to Test Lab'}</Button>
        </Link>
      </div>
    )
  }

  return <AdminPanel token={token!} locale={locale} />
}
