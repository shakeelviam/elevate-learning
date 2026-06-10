export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Target,
  Users,
  Award,
  Clock,
  MessageSquare,
  Zap,
  CheckCircle,
} from 'lucide-react'
import { HeroAnimation } from '@/components/home/HeroAnimation'
import { StatsBanner } from '@/components/home/StatsBanner'
import { TestimonialsSlider } from '@/components/home/TestimonialsSlider'
import { HomeFAQ } from '@/components/home/HomeFAQ'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { CourseCard } from '@/components/courses/CourseCard'
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

// ── Why Elev8 feature items ────────────────────────────────────────────────────
const WHY_FEATURES_EN = [
  { icon: Award,        title: 'Expert Instructors',     body: 'Every teacher holds a CELTA, DELTA, or equivalent qualification with years of exam-prep experience.',    accent: 'var(--coral)' },
  { icon: Target,       title: 'Proven Results',         body: 'Our students consistently achieve band scores 0.5–1 higher than their initial prediction.',               accent: 'var(--rose)' },
  { icon: Users,        title: 'Small Class Sizes',      body: 'Classes capped at 8–12 students so every learner gets the attention they deserve.',                      accent: 'var(--forest)' },
  { icon: Clock,        title: 'Flexible Schedules',     body: 'Morning, evening, and weekend batches — designed around Kuwait\'s working and student life.',             accent: 'var(--coral)' },
  { icon: MessageSquare,title: 'Real Practice Environment','body': 'Timed mock tests, written feedback, and one-on-one speaking sessions every week.',                  accent: 'var(--rose)' },
  { icon: Zap,          title: 'Fast-Track Options',     body: 'Intensive 4-week crash courses available for students with an upcoming exam date.',                       accent: 'var(--forest)' },
]

const WHY_FEATURES_AR = [
  { icon: Award,        title: 'مدرسون متخصصون',      body: 'كل مدرس يحمل شهادة CELTA أو DELTA أو ما يعادلها مع سنوات من خبرة التحضير للامتحانات.',   accent: 'var(--coral)' },
  { icon: Target,       title: 'نتائج مثبتة',         body: 'يحقق طلابنا باستمرار درجات أعلى بـ 0.5 إلى 1 من توقعاتهم الأولية.',                         accent: 'var(--rose)' },
  { icon: Users,        title: 'فصول صغيرة',          body: 'الفصول محدودة بـ 8-12 طالباً حتى يحصل كل متعلم على الاهتمام الذي يستحقه.',                  accent: 'var(--forest)' },
  { icon: Clock,        title: 'جداول مرنة',           body: 'دفعات صباحية ومسائية وفي عطلة نهاية الأسبوع - مصممة حول حياة العمل والدراسة في الكويت.',   accent: 'var(--coral)' },
  { icon: MessageSquare,title: 'بيئة تدريب حقيقية',  body: 'اختبارات تجريبية محددة المدة وتغذية راجعة مكتوبة وجلسات تحدث فردية كل أسبوع.',              accent: 'var(--rose)' },
  { icon: Zap,          title: 'خيارات مكثفة',         body: 'دورات مكثفة لمدة 4 أسابيع متاحة للطلاب الذين لديهم موعد امتحان قادم.',                       accent: 'var(--forest)' },
]

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
  const cta = settings?.ctaBanner
  const whyFeatures = loc === 'ar' ? WHY_FEATURES_AR : WHY_FEATURES_EN

  return (
    <>
      {/* ── Hero (Animated) ───────────────────────────────────────────────── */}
      <HeroAnimation locale={loc} />

      {/* ── Stats Bar ────────────────────────────────────────────────────── */}
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

      {/* ── Programs / Featured Courses ───────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--cream)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Eyebrow + heading */}
          <div className="mb-12">
            <p className="eyebrow mb-4">{loc === 'ar' ? 'برامجنا' : 'Our Programs'}</p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: 'var(--forest)', letterSpacing: '-0.02em' }}
              >
                {loc === 'ar' ? 'الدورات المميزة' : 'Featured Courses'}
              </h2>
              <Link
                href="/courses"
                locale={loc}
                className="flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ color: 'var(--coral)' }}
              >
                {loc === 'ar' ? 'عرض الكل' : 'View All'}
                <ArrowRight className={`h-4 w-4 ${loc === 'ar' ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>

          {/* Cards */}
          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
              {featuredCourses.map((course, i) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  locale={loc}
                  viewDetailsLabel={t('buttons.viewDetails')}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ borderTop: '4px solid var(--coral)' }}>
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
        </div>
      </section>

      {/* ── Test Lab ─────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--forest)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — copy */}
            <div>
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: 'var(--rose)', color: 'var(--white)' }}
              >
                {loc === 'ar' ? 'مختبر الاختبارات' : 'The Test Lab'}
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-5"
                style={{ color: 'var(--white)', letterSpacing: '-0.02em' }}
              >
                {loc === 'ar'
                  ? 'تدرّب كما لو كنت في\nالامتحان الحقيقي'
                  : "Practice Like It's the Real Exam"}
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {loc === 'ar'
                  ? 'مختبر الاختبارات الخاص بنا يضع الطلاب في ظروف امتحان حقيقية بالكامل — أوراق الإجابة الرسمية، وتوقيت صارم، وتعليقات مفصلة في غضون 48 ساعة.'
                  : 'Our dedicated test environment puts students under full exam conditions — official answer sheets, strict timing, and detailed feedback within 48 hours.'}
              </p>
              <ul className="space-y-3 mb-10">
                {(loc === 'ar'
                  ? ['ظروف امتحان IELTS / TOEFL المحاكاة', 'مراجعة متخصصة لأجزاء الكتابة والمحادثة', 'تقارير أداء مفصلة', 'تتبع التقدم بمرور الوقت']
                  : ['Simulated IELTS / TOEFL exam conditions', 'Expert marking for Writing & Speaking', 'Detailed performance reports', 'Progress tracking over time']
                ).map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--coral)' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/courses"
                locale={loc}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'var(--coral)', color: 'var(--white)' }}
              >
                {loc === 'ar' ? 'احجز اختبارك' : 'Book a Mock Test'}
                <ArrowRight className={`h-4 w-4 ${loc === 'ar' ? 'rotate-180' : ''}`} />
              </Link>
            </div>

            {/* Right — mock test card */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {loc === 'ar' ? 'اختبار تجريبي' : 'Mock Test'}
                  </p>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--white)' }}>IELTS Academic</h3>
                </div>
                <span
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(232,89,58,0.2)', color: 'var(--coral-light)' }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  {loc === 'ar' ? 'نشط' : 'Active'}
                </span>
              </div>

              {/* Progress bars */}
              {[
                { label: loc === 'ar' ? 'الاستماع' : 'Listening',  score: 7.5, max: 9 },
                { label: loc === 'ar' ? 'القراءة'  : 'Reading',    score: 7.0, max: 9 },
                { label: loc === 'ar' ? 'الكتابة'  : 'Writing',    score: 6.5, max: 9 },
                { label: loc === 'ar' ? 'المحادثة' : 'Speaking',   score: 7.0, max: 9 },
              ].map(({ label, score, max }) => (
                <div key={label} className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</span>
                    <span className="font-semibold tabular-nums" style={{ color: 'var(--coral-light)' }}>{score}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(score / max) * 100}%`,
                        background: 'var(--coral)',
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Overall band */}
              <div
                className="mt-6 p-4 rounded-xl flex items-center justify-between"
                style={{ background: 'rgba(232,89,58,0.12)', border: '1px solid rgba(232,89,58,0.2)' }}
              >
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {loc === 'ar' ? 'الدرجة الإجمالية المتوقعة' : 'Overall Band Score'}
                </span>
                <span className="text-3xl font-bold tabular-nums" style={{ color: 'var(--coral)' }}>7.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Elev8 ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">{loc === 'ar' ? 'لماذا إيليفيت' : 'Why Elev8'}</p>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-12"
            style={{ color: 'var(--forest)', letterSpacing: '-0.02em' }}
          >
            {loc === 'ar' ? 'ما يجعلنا مختلفين' : 'What Makes Us Different'}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyFeatures.map(({ icon: Icon, title, body, accent }) => (
              <div
                key={title}
                className="p-6 rounded-xl"
                style={{
                  borderLeft: `4px solid ${accent}`,
                  background: 'var(--cream)',
                }}
              >
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: accent + '18' }}
                >
                  <Icon className="h-5 w-5" style={{ color: accent }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--forest)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-20" style={{ background: 'var(--rose-pale)' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="eyebrow mb-4">{loc === 'ar' ? 'قصص النجاح' : 'Success Stories'}</p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-12"
              style={{ color: 'var(--forest)', letterSpacing: '-0.02em' }}
            >
              {loc === 'ar' ? 'ماذا يقول طلابنا' : 'What Our Students Say'}
            </h2>
            <TestimonialsSlider testimonials={testimonials} locale={loc} />
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="py-20 section-pattern" style={{ background: 'var(--cream)' }}>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="eyebrow mb-4">{loc === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-12"
              style={{ color: 'var(--forest)', letterSpacing: '-0.02em' }}
            >
              {loc === 'ar' ? 'أسئلة مكررة' : 'Common Questions'}
            </h2>
            <HomeFAQ locale={loc} faqs={faqs} />
          </div>
        </section>
      )}

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      {cta && (
        <section className="py-16" style={{ background: 'var(--coral)' }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            {(loc === 'ar' ? cta.titleAr : cta.titleEn) && (
              <h2
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: 'var(--white)', letterSpacing: '-0.02em' }}
              >
                {loc === 'ar' ? cta.titleAr : cta.titleEn}
              </h2>
            )}
            {(loc === 'ar' ? cta.subtitleAr : cta.subtitleEn) && (
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {loc === 'ar' ? cta.subtitleAr : cta.subtitleEn}
              </p>
            )}
            <Link
              href="/courses"
              locale={loc}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--white)', color: 'var(--coral)' }}
            >
              {(loc === 'ar' ? cta.buttonAr : cta.buttonEn) || t('home.ctaButton')}
              <ArrowRight className={`h-5 w-5 ${loc === 'ar' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
