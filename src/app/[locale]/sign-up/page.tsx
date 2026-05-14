import { SignUp } from '@clerk/nextjs'
import type { Metadata } from 'next'

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
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

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
              ? 'انضم إلى آلاف الطلاب في إليفيت'
              : 'Join thousands of students at Elevate'}
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none border border-gray-200 rounded-2xl',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton:
                'border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50',
              formButtonPrimary:
                'bg-gradient-to-r from-brand-500 to-brand-700 hover:opacity-90 rounded-xl text-sm font-semibold',
              formFieldInput:
                'rounded-xl border-gray-200 text-sm focus:ring-2 focus:ring-brand-500',
              footerActionLink: 'text-brand-600 hover:text-brand-800',
            },
          }}
          redirectUrl={`/${locale}/dashboard`}
          signInUrl={`/${locale}/sign-in`}
        />
      </div>
    </div>
  )
}
