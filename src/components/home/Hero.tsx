'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowRight, CheckCircle2, GraduationCap, Star, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SanitySiteSettings } from '@/types/sanity'
import { getLocaleText } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/imageUrl'
import { cn } from '@/lib/utils'

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
  const pill =
    getLocaleText(settings?.heroPill, locale) ||
    (isRtl ? 'الكويت — التميز في تعليم اللغات' : 'Kuwait — Excellence in Language Education')

  const rawBadges = settings?.heroBadges ?? []
  const badges =
    rawBadges.length > 0
      ? rawBadges.map((b) => getLocaleText(b, locale) ?? '').filter(Boolean)
      : isRtl ? TRUST_BADGES_AR : TRUST_BADGES_EN

  const carouselImages = (settings?.heroImages ?? []).filter(Boolean)
  const images =
    carouselImages.length > 0
      ? carouselImages
      : settings?.heroImage
      ? [settings.heroImage]
      : []

  const hasImages = images.length > 0

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), 5000)
    return () => clearInterval(timer)
  }, [images.length])

  const floatingStats = settings?.heroFloatingStats
  const graduatesLabel = isRtl
    ? (floatingStats?.graduatesCountAr ?? 'NEW')
    : (floatingStats?.graduatesCount ?? 'NEW')
  const graduatesDesc = isRtl
    ? (floatingStats?.graduatesLabelAr ?? 'التسجيل مفتوح')
    : (floatingStats?.graduatesLabelEn ?? 'Now Enrolling')
  const rating = floatingStats?.rating ?? '4.9/5'
  const ratingLabel = isRtl
    ? (floatingStats?.ratingLabelAr ?? 'تقييم الطلاب')
    : (floatingStats?.ratingLabelEn ?? 'Student Rating')

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background */}
      {hasImages ? (
        <>
          {images.map((img, i) => (
            <div
              key={i}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000',
                i === current ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Image
                src={urlFor(img).width(1920).height(1080).url()}
                alt=""
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}
          <div
            className={cn(
              'absolute inset-0',
              isRtl
                ? 'bg-gradient-to-l from-black/65 via-black/45 to-black/20'
                : 'bg-gradient-to-r from-black/65 via-black/45 to-black/20'
            )}
          />
        </>
      ) : (
        <>
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute top-20 start-1/4 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 end-1/4 h-80 w-80 rounded-full bg-gold-200/20 blur-3xl pointer-events-none" />
        </>
      )}

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className={cn('max-w-2xl', isRtl && 'ms-auto text-right')}>

          {/* Pill */}
          <div className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-6 animate-fade-in',
            hasImages
              ? 'bg-white/15 backdrop-blur-sm text-white border border-white/20'
              : 'bg-brand-100 text-brand-700'
          )}>
            <span className={cn('h-2 w-2 rounded-full animate-pulse', hasImages ? 'bg-gold-400' : 'bg-brand-500')} />
            <MapPin className="h-3.5 w-3.5" />
            {pill}
          </div>

          {/* Headline */}
          <h1 className={cn(
            'text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] animate-fade-up',
            hasImages ? 'text-white' : 'text-gray-900'
          )}>
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

          {/* Sub-headline */}
          <p
            className={cn(
              'text-lg mb-8 leading-relaxed animate-fade-up',
              hasImages ? 'text-white/85' : 'text-gray-600'
            )}
            style={{ animationDelay: '0.1s' }}
          >
            {subheadline}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            {badges.map((badge) => (
              <div key={badge} className={cn(
                'flex items-center gap-1.5 text-sm',
                hasImages ? 'text-white/90' : 'text-gray-700'
              )}>
                <CheckCircle2 className={cn('h-4 w-4 flex-shrink-0', hasImages ? 'text-gold-400' : 'text-brand-500')} />
                {badge}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/courses" locale={locale}>
              <Button size="xl" className="group">
                {ctaLabel}
                <ArrowRight className={cn('h-5 w-5 transition-transform group-hover:translate-x-1', isRtl && 'flip-rtl')} />
              </Button>
            </Link>
            <Link href="/contact" locale={locale}>
              <Button
                size="xl"
                variant="outline"
                className={cn(hasImages && 'border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60 hover:text-white')}
              >
                {ctaSecondaryLabel}
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating cards */}
        <div className={cn(
          'absolute bottom-12 flex flex-col sm:flex-row gap-3',
          isRtl ? 'right-4 sm:right-8' : 'left-4 sm:left-8'
        )}>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900">{graduatesLabel}</p>
                <p className="text-xs text-gray-500">{graduatesDesc}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
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

        {/* Carousel dots */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === current
                    ? 'w-6 h-2.5 bg-gold-400'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
