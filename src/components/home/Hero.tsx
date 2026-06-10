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

export function Hero({ locale, settings, ctaLabel, ctaSecondaryLabel }: HeroProps) {
  const isRtl = locale === 'ar'

  const headline = getLocaleText(settings?.heroHeadline, locale)
  const subheadline = getLocaleText(settings?.heroSubheadline, locale)
  const pill = getLocaleText(settings?.heroPill, locale)

  const badges = (settings?.heroBadges ?? [])
    .map((b) => getLocaleText(b, locale) ?? '')
    .filter(Boolean)

  const carouselImages = (settings?.heroImages ?? []).filter(Boolean)
  const images = carouselImages.length > 0
    ? carouselImages
    : settings?.heroImage ? [settings.heroImage] : []

  const hasImages = images.length > 0

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), 5000)
    return () => clearInterval(timer)
  }, [images.length])

  const floatingStats = settings?.heroFloatingStats
  const graduatesLabel = isRtl ? floatingStats?.graduatesCountAr : floatingStats?.graduatesCount
  const graduatesDesc = isRtl ? floatingStats?.graduatesLabelAr : floatingStats?.graduatesLabelEn
  const rating = floatingStats?.rating
  const ratingLabel = isRtl ? floatingStats?.ratingLabelAr : floatingStats?.ratingLabelEn

  const showEnrollingCard = !!(graduatesLabel || graduatesDesc)
  const showRatingCard = !!(rating || ratingLabel)

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
          <div className={cn(
            'absolute inset-0',
            isRtl
              ? 'bg-gradient-to-l from-black/40 via-black/20 to-transparent'
              : 'bg-gradient-to-r from-black/40 via-black/20 to-transparent'
          )} />
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
          {pill && (
            <div className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-6 animate-fade-in',
              hasImages
                ? 'bg-black/30 backdrop-blur-sm text-white border border-white/30'
                : 'bg-brand-100 text-brand-700'
            )}>
              <span className={cn('h-2 w-2 rounded-full animate-pulse', hasImages ? 'bg-gold-400' : 'bg-brand-500')} />
              <MapPin className="h-3.5 w-3.5" />
              {pill}
            </div>
          )}

          {/* Headline */}
          {headline && (
            <h1
              className={cn(
                'text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] animate-fade-up',
                !hasImages && 'text-brand-900'
              )}
              style={hasImages ? { color: 'var(--gold)', textShadow: '0 2px 12px rgba(0,0,0,0.85), 0 0 32px rgba(0,0,0,0.5)' } : undefined}
            >
              {headline}
            </h1>
          )}

          {/* Sub-headline */}
          {subheadline && (
            <p
              className={cn(
                'text-lg mb-8 leading-relaxed animate-fade-up',
                hasImages ? 'text-white' : 'text-gray-600'
              )}
              style={hasImages ? { textShadow: '0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' } : undefined}
            >
              {subheadline}
            </p>
          )}

          {/* Trust badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {badges.map((badge) => (
                <div
                  key={badge}
                  className={cn('flex items-center gap-1.5 text-sm font-semibold', hasImages ? 'text-white' : 'text-gray-700')}
                  style={hasImages ? { textShadow: '0 1px 6px rgba(0,0,0,0.9)' } : undefined}
                >
                  <CheckCircle2 className={cn('h-4 w-4 flex-shrink-0', hasImages ? 'text-gold-400' : 'text-brand-500')} />
                  {badge}
                </div>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/courses" locale={locale}>
              <Button
                size="xl"
                variant="outline"
                className={cn(
                  'group font-bold tracking-wide',
                  hasImages
                    ? 'border-gold-400 text-gold-300 bg-transparent hover:bg-gold-400/10 hover:border-gold-300'
                    : 'border-gold-500 text-gold-600 bg-transparent hover:bg-gold-50 hover:border-gold-600'
                )}
              >
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
        {(showEnrollingCard || showRatingCard) && (
          <div className={cn(
            'absolute bottom-12 flex flex-col sm:flex-row gap-3',
            isRtl ? 'right-4 sm:right-8' : 'left-4 sm:left-8'
          )}>
            {showEnrollingCard && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    {graduatesLabel && <p className="text-lg font-black text-gray-900">{graduatesLabel}</p>}
                    {graduatesDesc && <p className="text-xs text-gray-500">{graduatesDesc}</p>}
                  </div>
                </div>
              </div>
            )}
            {showRatingCard && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="h-4 w-4 text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                  <div>
                    {rating && <p className="text-sm font-bold text-gray-900">{rating}</p>}
                    {ratingLabel && <p className="text-xs text-gray-500">{ratingLabel}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-off-white to-transparent pointer-events-none" />
    </section>
  )
}
