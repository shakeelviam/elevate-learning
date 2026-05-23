import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import SignUpCard from './SignUpCard'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'إنشاء حساب' : 'Sign Up',
  }
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string; rest?: string[] }>
}) {
  const { locale } = await params

  const { userId } = await auth()
  if (userId) redirect(`/${locale}/dashboard`)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand mb-4">
            <span className="text-white text-2xl font-black">EL</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            {locale === 'ar' ? 'أنشئ حسابك' : 'Create your account'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {locale === 'ar'
              ? 'انضم إلى آلاف الطلاب في مركز إيليفيت'
              : 'Join thousands of students at Elevate'}
          </p>
        </div>
        <SignUpCard locale={locale} />
      </div>
    </div>
  )
}
