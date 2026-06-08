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
import { getSiteSettings, getFeaturedCourses, getTestimonials, getFaqs } from '@/sanity/lib/queries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'الرئيسية' : 'Home',
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

  const [settings, featuredCourses, testimonials, faqs] = await Promise.all([
    getSiteSettings(),
    getFeaturedCourses(6),
    getTestimonials(),
    getFaqs(true),
  ])

  const stats = settings?.stats
  const path = settings?.pathSection
  const cta = settings?.ctaBanner

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
      {stats &&
        stats.stat1En && stats.stat2En && stats.stat3En && stats.stat4En &&
        stats.stat1LabelEn && stats.stat2LabelEn && stats.stat3LabelEn && stats.stat4LabelEn && (
        <StatsBanner
          locale={loc}
          stat1Value={(loc === 'ar' ? stats.stat1Ar : stats.stat1En) as string}
          stat2Value={(loc === 'ar' ? stats.stat2Ar : stats.stat2En) as string}
          stat3Value={(loc === 'ar' ? stats.stat3Ar : stats.stat3En) as string}
          stat4Value={(loc === 'ar' ? stats.stat4Ar : stats.stat4En) as string}
          stat1Label={(loc === 'ar' ? stats.stat1LabelAr : stats.stat1LabelEn) as string}
          stat2Label={(loc === 'ar' ? stats.stat2LabelAr : stats.stat2LabelEn) as string}
          stat3Label={(loc === 'ar' ? stats.stat3LabelAr : stats.stat3LabelEn) as string}
          stat4Label={(loc === 'ar' ? stats.stat4LabelAr : stats.stat4LabelEn) as string}
        />
      )}

      {/* ── Elevate AI ───────────────────────────────────────────────────── */}
      <ElevateAISection locale={loc} settings={settings} />

      {/* ── Segmentation ─────────────────────────────────────────────────── */}
      {path && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {(loc === 'ar' ? path.labelAr : path.labelEn) && (
              <p className="text-center text-sm font-semibold text-brand-600 uppercase tracking-widest mb-3">
                {loc === 'ar' ? path.labelAr : path.labelEn}
              </p>
            )}
            {(loc === 'ar' ? path.titleAr : path.titleEn) && (
              <h2 className="text-center text-3xl sm:text-4xl font-black text-gray-900 mb-10">
                {loc === 'ar' ? path.titleAr : path.titleEn}
              </h2>
            )}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Track 1 — Exam Prep */}
              <Link href="/courses?category=exam" locale={loc} className="flex">
                <div className="group flex flex-col w-full rounded-2xl border-2 border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 hover:border-brand-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-md">
                    <GraduationCap className="h-7 w-7 text-brand-900" />
                  </div>
                  {(loc === 'ar' ? path.examTitleAr : path.examTitleEn) && (
                    <h3 className="text-xl font-black text-gray-900 mb-2">
                      {loc === 'ar' ? path.examTitleAr : path.examTitleEn}
                    </h3>
                  )}
                  {(loc === 'ar' ? path.examDescAr : path.examDescEn) && (
                    <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                      {loc === 'ar' ? path.examDescAr : path.examDescEn}
                    </p>
                  )}
                  {(loc === 'ar' ? path.browseLabelAr : path.browseLabelEn) && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all">
                      {loc === 'ar' ? path.browseLabelAr : path.browseLabelEn}
                      <ArrowRight className={`h-4 w-4 ${loc === 'ar' ? 'rotate-180' : ''}`} />
                    </span>
                  )}
                </div>
              </Link>

              {/* Track 2 — Language Learning */}
              <Link href="/courses?category=language" locale={loc} className="flex">
                <div className="group flex flex-col w-full rounded-2xl border-2 border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 hover:border-brand-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 shadow-md">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  {(loc === 'ar' ? path.langTitleAr : path.langTitleEn) && (
                    <h3 className="text-xl font-black text-gray-900 mb-2">
                      {loc === 'ar' ? path.langTitleAr : path.langTitleEn}
                    </h3>
                  )}
                  {(loc === 'ar' ? path.langDescAr : path.langDescEn) && (
                    <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                      {loc === 'ar' ? path.langDescAr : path.langDescEn}
                    </p>
                  )}
                  {(loc === 'ar' ? path.browseLabelAr : path.browseLabelEn) && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all">
                      {loc === 'ar' ? path.browseLabelAr : path.browseLabelEn}
                      <ArrowRight className={`h-4 w-4 ${loc === 'ar' ? 'rotate-180' : ''}`} />
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

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
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={t('home.testimonialsTitle')}
              subtitle={t('home.testimonialsSubtitle')}
            />
            <TestimonialsSlider testimonials={testimonials} locale={loc} />
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="py-20 bg-gray-50 section-pattern">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={t('home.faqTitle')}
              subtitle={t('home.faqSubtitle')}
            />
            <HomeFAQ locale={loc} faqs={faqs} />
          </div>
        </section>
      )}

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      {cta && (
        <section className="py-12 bg-brand-600">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            {(loc === 'ar' ? cta.titleAr : cta.titleEn) && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                {loc === 'ar' ? cta.titleAr : cta.titleEn}
              </h2>
            )}
            {(loc === 'ar' ? cta.subtitleAr : cta.subtitleEn) && (
              <p className="text-lg text-brand-100 mb-8 max-w-2xl mx-auto">
                {loc === 'ar' ? cta.subtitleAr : cta.subtitleEn}
              </p>
            )}
            <Link href="/courses" locale={loc}>
              <Button
                size="xl"
                className="bg-gradient-to-r from-gold-400 to-gold-500 text-brand-900 hover:opacity-90 shadow-xl"
              >
                {(loc === 'ar' ? cta.buttonAr : cta.buttonEn) || t('home.ctaButton')}
                <ArrowRight className={`h-5 w-5 ${loc === 'ar' ? 'flip-rtl' : ''}`} />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
