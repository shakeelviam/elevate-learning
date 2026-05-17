'use client'
import { usePathname } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] === 'ar' ? 'ar' : 'en'
  const isAr = locale === 'ar'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 graphic */}
        <div className="relative mb-8">
          <div className="text-[9rem] font-black text-gray-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg">
              <Search className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-3">
          {isAr ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          {isAr
            ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
            : "The page you're looking for doesn't exist or has been moved."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" locale={locale}>
            <Button size="lg">
              <Home className="h-4 w-4" />
              {isAr ? 'العودة للرئيسية' : 'Go Back Home'}
            </Button>
          </Link>
          <Link href="/courses" locale={locale}>
            <Button size="lg" variant="outline">
              {isAr ? 'تصفح الدورات' : 'Browse Courses'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
