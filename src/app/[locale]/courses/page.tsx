import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BookOpen } from 'lucide-react'
import { CourseCard } from '@/components/courses/CourseCard'
import { CourseFilters } from '@/components/courses/CourseFilters'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { getAllCourses } from '@/sanity/lib/queries'

interface CoursesPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    category?: string
    level?: string
    search?: string
  }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'الدورات' : 'Courses',
    description:
      locale === 'ar'
        ? 'تصفح جميع دوراتنا في اللغات والتحضير للامتحانات'
        : 'Browse all our language and exam preparation courses',
  }
}

export default async function CoursesPage({
  params,
  searchParams,
}: CoursesPageProps) {
  const { locale } = await params
  const sp = await searchParams
  const loc = locale as 'en' | 'ar'
  const t = await getTranslations({ locale: loc })

  const courses = await getAllCourses({
    category: sp.category,
    level: sp.level,
    search: sp.search,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="hero-gradient border-b border-brand-100 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            {t('courses.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            {t('courses.subtitle')}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="mb-8">
          <CourseFilters
            locale={loc}
            currentCategory={sp.category}
            currentLevel={sp.level}
            currentSearch={sp.search}
          />
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          {loc === 'ar'
            ? `${courses.length} دورة`
            : `${courses.length} course${courses.length !== 1 ? 's' : ''}`}
          {sp.search && ` ${loc === 'ar' ? 'لـ' : 'for'} "${sp.search}"`}
        </p>

        {/* Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                locale={loc}
                viewDetailsLabel={t('buttons.viewDetails')}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 mb-4">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {t('courses.noResults')}
            </h3>
            <p className="text-gray-500 text-sm">
              {loc === 'ar' ? 'جرّب تغيير الفلاتر أو البحث عن شيء آخر.' : 'Try adjusting your filters or search term.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
