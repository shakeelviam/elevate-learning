import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ChevronRight, BookOpen, GraduationCap } from 'lucide-react'
import { Hero } from '@/components/home/Hero'
import { StatsBanner } from '@/components/home/StatsBanner'
import { ElevateAISection } from '@/components/home/ElevateAISection'
import { TestimonialsSlider } from '@/components/home/TestimonialsSlider'
import { HomeFAQ } from '@/components/home/HomeFAQ'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { CourseCard } from '@/components/courses/CourseCard'
import { Button } from '@/components/ui/button'
import { getSiteSettings, getFeaturedCourses, getTestimonials } from '@/sanity/lib/queries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'الرئيسية' : 'Home',
    description:
      locale === 'ar'
        ? 'المعهد الرائد في الكويت لتعلم اللغات والتحضير للامتحانات'
        : "Kuwait's leading institute for language learning and exam preparation",
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as 'en' | 'ar'
  const t = await getTranslations({ locale: loc })

  const [settings, featuredCourses, testimonials] = await Promise.all([
    getSiteSettings(),
    getFeaturedCourses(6),
    getTestimonials(),
  ])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Hero
        locale={loc}
        settings={settings}
        ctaLabel={t('home.heroCta')}
        ctaSecondaryLabel={t('home.heroCtaSecondary')}
      />

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <StatsBanner
        locale={loc}
        yearsValue={t('home.statsYearsValue')}
        coursesValue={t('home.statsCoursesValue')}
        studentsValue={t('home.statsStudentsValue')}
        countriesValue={t('home.statsCountriesValue')}
        yearsLabel={t('home.statsYears')}
        coursesLabel={t('home.statsCourses')}
        studentsLabel={t('home.statsStudents')}
        countriesLabel={t('home.statsCountries')}
      />

      {/* ── Elevate AI ───────────────────────────────────────────────────── */}
      <ElevateAISection locale={loc} />

      {/* ── Segmentation ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-brand-600 uppercase tracking-widest mb-3">
            {loc === 'ar' ? 'ما الذي تبحث عنه؟' : "What are you looking for?"}
          </p>
          <h2 className="text-center text-3xl sm:text-4xl font-black text-gray-900 mb-10">
            {loc === 'ar' ? 'اختر مسارك' : 'Choose your path'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Track 1 — Exam Prep */}
            <Link href="/courses?category=exam" locale={loc} className="flex">
              <div className="group flex flex-col w-full rounded-2xl border-2 border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 hover:border-brand-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-md">
                  <GraduationCap className="h-7 w-7 text-brand-900" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  {loc === 'ar' ? 'التحضير للامتحانات' : 'Exam Preparation'}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                  {loc === 'ar'
                    ? 'IELTS · TOEFL · OET · GMAT · SAT — احصل على الدرجة التي تحتاجها.'
                    : 'IELTS · TOEFL · OET · GMAT · SAT — get the score you need.'}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all">
                  {loc === 'ar' ? 'استعرض الدورات' : 'Browse courses'}
                  <ArrowRight className={`h-4 w-4 ${loc === 'ar' ? 'rotate-180' : ''}`} />
                </span>
              </div>
            </Link>

            {/* Track 2 — Language Learning */}
            <Link href="/courses?category=language" locale={loc} className="flex">
              <div className="group flex flex-col w-full rounded-2xl border-2 border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 hover:border-brand-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 shadow-md">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  {loc === 'ar' ? 'تعلّم لغة جديدة' : 'Language Learning'}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                  {loc === 'ar'
                    ? 'الإنجليزية · العربية · الفرنسية · الألمانية — تحدّث بثقة من اليوم الأول.'
                    : 'English · Arabic · French · German — speak confidently from day one.'}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all">
                  {loc === 'ar' ? 'استعرض الدورات' : 'Browse courses'}
                  <ArrowRight className={`h-4 w-4 ${loc === 'ar' ? 'rotate-180' : ''}`} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Courses ─────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <SectionHeader
              title={t('home.featuredCoursesTitle')}
              subtitle={t('home.featuredCoursesSubtitle')}
              centered={false}
              className="mb-0"
            />
            <Link href="/courses" locale={loc}>
              <Button variant="ghost" size="sm" className="flex-shrink-0 hidden sm:flex">
                {t('buttons.viewAll')}
                <ChevronRight className={`h-4 w-4 ${loc === 'ar' ? 'flip-rtl' : ''}`} />
              </Button>
            </Link>
          </div>

          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  locale={loc}
                  viewDetailsLabel={t('buttons.viewDetails')}
                />
              ))}
            </div>
          ) : (
            /* Placeholder cards when Sanity is not yet populated */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="aspect-[16/9] skeleton" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 skeleton rounded w-1/3" />
                    <div className="h-5 skeleton rounded w-3/4" />
                    <div className="h-3 skeleton rounded w-1/2" />
                    <div className="h-9 skeleton rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile "View All" */}
          <div className="mt-8 text-center sm:hidden">
            <Link href="/courses" locale={loc}>
              <Button variant="outline">
                {t('buttons.viewAll')}
                <ArrowRight className={`h-4 w-4 ${loc === 'ar' ? 'flip-rtl' : ''}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t('home.testimonialsTitle')}
            subtitle={t('home.testimonialsSubtitle')}
          />
          <TestimonialsSlider testimonials={testimonials} locale={loc} />
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 section-pattern">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t('home.faqTitle')}
            subtitle={t('home.faqSubtitle')}
          />
          <HomeFAQ locale={loc} />
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 start-0 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 end-0 h-80 w-80 rounded-full bg-white/5 translate-x-1/2 translate-y-1/2" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-lg text-brand-100 mb-8 max-w-2xl mx-auto">
            {t('home.ctaSubtitle')}
          </p>
          <Link href="/courses" locale={loc}>
            <Button
              size="xl"
              className="bg-gradient-to-r from-gold-400 to-gold-500 text-brand-900 hover:opacity-90 shadow-xl"
            >
              {t('home.ctaButton')}
              <ArrowRight className={`h-5 w-5 ${loc === 'ar' ? 'flip-rtl' : ''}`} />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
