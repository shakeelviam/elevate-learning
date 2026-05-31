'use client'
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#2E80D8] mb-4">
          <span className="text-white font-black text-xl">E8</span>
        </div>
        <h1 className="text-2xl font-black text-[#1F6CBD]">Elev8 AI</h1>
        <p className="text-sm text-gray-500 mt-1">Staff & Management Portal</p>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full max-w-sm',
            card: 'shadow-lg border border-[#EBF4FF] rounded-xl',
            formButtonPrimary: 'bg-[#2E80D8] hover:opacity-90 rounded-md text-sm font-semibold',
            formFieldInput: 'rounded-md border-gray-200 text-sm',
            socialButtonsBlockButton: 'rounded-md border-gray-200 text-sm',
          },
        }}
        forceRedirectUrl="/chat"
      />
    </div>
  )
}
