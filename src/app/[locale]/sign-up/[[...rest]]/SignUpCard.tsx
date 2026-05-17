'use client'

import { useState, useEffect } from 'react'
import { SignUp, useAuth } from '@clerk/nextjs'

interface SignUpCardProps {
  locale: string
}

export default function SignUpCard({ locale }: SignUpCardProps) {
  const [mounted, setMounted] = useState(false)
  const { isSignedIn } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isSignedIn) {
      window.location.href = `/${locale}/dashboard`
    }
  }, [isSignedIn, locale])

  if (!mounted) {
    return <div className="h-96 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse" />
  }

  return (
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
      forceRedirectUrl={`/${locale}/dashboard`}
      signInUrl={`/${locale}/sign-in`}
    />
  )
}
