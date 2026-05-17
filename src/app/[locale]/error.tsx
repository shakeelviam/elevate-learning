'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] === 'ar' ? 'ar' : 'en'
  const isAr = locale === 'ar'

  useEffect(() => {
    console.error('[Error boundary]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100 mb-6">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-3">
          {isAr ? 'حدث خطأ ما' : 'Something Went Wrong'}
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          {isAr
            ? 'واجهنا مشكلة غير متوقعة. يمكنك المحاولة مرة أخرى أو العودة للرئيسية.'
            : 'An unexpected error occurred. You can try again or return to the home page.'}
        </p>

        {error.digest && (
          <p className="text-xs text-gray-400 font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={reset}>
            <RefreshCw className="h-4 w-4" />
            {isAr ? 'حاول مرة أخرى' : 'Try Again'}
          </Button>
          <Link href="/" locale={locale}>
            <Button size="lg" variant="outline">
              {isAr ? 'العودة للرئيسية' : 'Go Back Home'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
