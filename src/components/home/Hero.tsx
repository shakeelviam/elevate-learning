import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SanitySiteSettings } from '@/types/sanity'
import { getLocaleText } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/imageUrl'

interface HeroProps {
  locale: 'en' | 'ar'
  settings: SanitySiteSettings | null
  ctaLabel: string
  ctaSecondaryLabel: string
}

const TRUST_BADGES_EN = ['IELTS Certified', '12+ Years Experience', 'Kuwait-Based']
const TRUST_BADGES_AR = ['شهادة IELTS', '+12 سنة خبرة', 'مقيم في الكويت']

export function Hero({ locale, settings, ctaLabel, ctaSecondaryLabel }: HeroProps) {
  const isRtl = locale === 'ar'
  const headline =
    getLocaleText(settings?.heroHeadline, locale) ||
    (isRtl ? 'ارتقِ بمهاراتك اللغوية' : 'Elevate Your Language Skills')
  const subheadline =
    getLocaleText(settings?.heroSubheadline, locale) ||
    (isRtl
      ? 'المعهد الرائد في الكويت لتعلم اللغات والتحضير للامتحانات.'
      : "Kuwait's leading institute for language learning and exam preparation.")

  const heroImageUrl = settings?.heroImage
    ? urlFor(settings.heroImage).width(1200).height(800).url()
    : null

  const badges = isRtl ? TRUST_BADGES_AR : TRUST_BADGES_EN

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      {/* Decorative blobs */}
      <div className="absolute top-20 start-1/4 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 end-1/4 h-80 w-80 rounded-full bg-gold-200/20 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text column */}
          <div className={`max-w-xl ${isRtl ? 'lg:order-2' : ''}`}>
            {/* Pre-headline pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700 mb-6 animate-fade-in">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              {isRtl ? '🇰🇼 الكويت — التميز في تعليم اللغات' : '🇰🇼 Kuwait — Excellence in Language Education'}
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] animate-fade-up ${isRtl ? 'text-right' : ''}`}>
              {isRtl ? (
                <>
                  <span className="gradient-text">{headline.split(' ')[0]} {headline.split(' ')[1]}</span>
                  <br />
                  {headline.split(' ').slice(2).join(' ')}
                </>
              ) : (
                <>
                  <span className="gradient-text">Elevate</span> Your
                  <br />
                  Language Skills
                </>
              )}
            </h1>

            <p className={`text-lg text-gray-600 mb-8 leading-relaxed animate-fade-up ${isRtl ? 'text-right' : ''}`} style={{ animationDelay: '0.1s' }}>
              {subheadline}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {badges.map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-brand-500 flex-shrink-0" />
                  {badge}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/courses" locale={locale}>
                <Button size="xl" className="group">
                  {ctaLabel}
                  <ArrowRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'flip-rtl' : ''}`} />
                </Button>
              </Link>
              <Link href="/contact" locale={locale}>
                <Button size="xl" variant="outline">
                  {ctaSecondaryLabel}
                </Button>
              </Link>
            </div>
          </div>

          {/* Image column */}
          <div className={`relative ${isRtl ? 'lg:order-1' : ''}`}>
            <div className="relative">
              {/* Main image card — book-flip from top-right corner */}
              <div className="animate-book-flip">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-brand-100 to-brand-200">
                {heroImageUrl ? (
                  <Image
                    src={heroImageUrl}
                    alt="Elevate Learning"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-400 to-brand-700">
                    <div className="text-center text-white p-8">
                      <div className="text-8xl font-black mb-4 opacity-20">EL</div>
                      <p className="text-xl font-bold opacity-60">
                        {isRtl ? 'إليفيت ليرنينج' : 'Elevate Learning'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              </div>{/* /animate-book-flip */}

              {/* Floating stats card */}
              <div className="absolute -bottom-6 -start-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <p className="text-xl font-black text-gray-900">8,000+</p>
                    <p className="text-xs text-gray-500">
                      {isRtl ? 'طالب تخرج' : 'Graduates'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating rating card */}
              <div className="absolute -top-4 -end-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-gold-400 text-lg">★</span>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">4.9/5</p>
                    <p className="text-xs text-gray-500">
                      {isRtl ? 'تقييم الطلاب' : 'Student Rating'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
