import { Link } from '@/i18n/navigation'
import { ArrowRight, CheckCircle2, Sparkles, MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SanitySiteSettings } from '@/types/sanity'
import { getLocaleText } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/imageUrl'
import { HeroCarousel } from './HeroCarousel'

interface HeroProps {
  locale: 'en' | 'ar'
  settings: SanitySiteSettings | null
  ctaLabel: string
  ctaSecondaryLabel: string
}

const DEFAULT_BADGES_EN = ['IELTS Certified', '12+ Years Experience', 'Kuwait-Based']
const DEFAULT_BADGES_AR = ['شهادة IELTS', '+12 سنة خبرة', 'مقيم في الكويت']

const CAROUSEL_FALLBACK = [
  '/carousel/slide-4.jpg',
  '/carousel/slide-3.jpg',
  '/carousel/slide-2.jpg',
  '/carousel/slide-5.jpg',
  '/carousel/slide-6.jpg',
  '/carousel/slide-1.jpg',
]

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

  const pill = isRtl
    ? (settings?.heroPill?.ar ?? 'الكويت — التميز في تعليم اللغات')
    : (settings?.heroPill?.en ?? 'Kuwait — Excellence in Language Education')

  const badges = settings?.heroBadges && settings.heroBadges.length > 0
    ? settings.heroBadges.map((b) => (isRtl ? b.ar : b.en) ?? '')
    : (isRtl ? DEFAULT_BADGES_AR : DEFAULT_BADGES_EN)

  const floatStats = settings?.heroFloatingStats
  const graduatesCount = isRtl
    ? (floatStats?.graduatesCountAr ?? 'جديد')
    : (floatStats?.graduatesCount ?? 'NEW')
  const graduatesLabel = isRtl
    ? (floatStats?.graduatesLabelAr ?? 'التسجيل مفتوح للدفعة الأولى')
    : (floatStats?.graduatesLabelEn ?? 'Now Enrolling First Cohort')
  const rating = floatStats?.rating ?? '4.9/5'
  const ratingLabel = isRtl ? (floatStats?.ratingLabelAr ?? 'تقييم الطلاب') : (floatStats?.ratingLabelEn ?? 'Student Rating')

  // Build carousel images: prefer Sanity heroImages array, fall back to single heroImage, then local placeholders
  let carouselImages: string[] = []
  let carouselAlts: string[] = []

  if (settings?.heroImages && settings.heroImages.length > 0) {
    carouselImages = settings.heroImages.map((img) =>
      urlFor(img).width(1200).height(800).url()
    )
    carouselAlts = settings.heroImages.map((img) =>
      (isRtl ? img.altText?.ar : img.altText?.en) ?? 'Elevate Learning'
    )
  } else if (settings?.heroImage) {
    carouselImages = [urlFor(settings.heroImage).width(1200).height(800).url()]
    carouselAlts = ['Elevate Learning']
  } else {
    carouselImages = CAROUSEL_FALLBACK
    carouselAlts = CAROUSEL_FALLBACK.map(() => 'Elevate Learning students')
  }

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
              <MapPin className="h-3.5 w-3.5" />
              {pill}
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
              {/* Hero carousel */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <HeroCarousel images={carouselImages} alts={carouselAlts} />
              </div>

              {/* Floating graduates card */}
              <div className="absolute -bottom-6 -start-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-gray-900">{graduatesCount}</p>
                    <p className="text-xs text-gray-500">{graduatesLabel}</p>
                  </div>
                </div>
              </div>

              {/* Floating rating card */}
              <div className="absolute -top-4 -end-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{rating}</p>
                    <p className="text-xs text-gray-500">{ratingLabel}</p>
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
