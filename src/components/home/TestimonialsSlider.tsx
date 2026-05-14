'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { SanityTestimonial } from '@/types/sanity'
import { getLocaleText } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/imageUrl'
import { cn } from '@/lib/utils'

interface TestimonialsSliderProps {
  testimonials: SanityTestimonial[]
  locale: 'en' | 'ar'
}

const FALLBACK_TESTIMONIALS_EN: SanityTestimonial[] = [
  {
    _id: '1',
    name: 'Sarah Al-Rashidi',
    quote: { en: 'Elevate Learning completely transformed my English skills. I went from intermediate to advanced in just 3 months. The instructors are incredibly patient and professional.' },
    course: 'Advanced English',
    rating: 5,
  },
  {
    _id: '2',
    name: 'Mohammed Al-Sabah',
    quote: { en: 'I passed my IELTS exam with a band score of 7.5 thanks to this institute. The exam prep course is structured brilliantly with tons of practice tests and personalized feedback.' },
    course: 'IELTS Preparation',
    rating: 5,
  },
  {
    _id: '3',
    name: 'Fatima Al-Mutairi',
    quote: { en: 'The French course here is fantastic. Small class sizes mean you get real practice time. I can now hold conversations in French after just 6 months!' },
    course: 'French Language',
    rating: 5,
  },
]

const FALLBACK_TESTIMONIALS_AR: SanityTestimonial[] = [
  {
    _id: '1',
    name: 'سارة الراشدي',
    quote: { ar: 'غيّر معهد إليفيت مهاراتي الإنجليزية بشكل كامل. انتقلت من المستوى المتوسط إلى المتقدم في 3 أشهر فقط. المدرسون صبورون ومحترفون للغاية.' },
    course: 'الإنجليزية المتقدمة',
    rating: 5,
  },
  {
    _id: '2',
    name: 'محمد الصباح',
    quote: { ar: 'اجتزت امتحان IELTS بدرجة 7.5 بفضل هذا المعهد. دورة التحضير للامتحان منظمة بشكل رائع مع الكثير من الاختبارات التدريبية والتغذية الراجعة الشخصية.' },
    course: 'تحضير IELTS',
    rating: 5,
  },
  {
    _id: '3',
    name: 'فاطمة المطيري',
    quote: { ar: 'دورة اللغة الفرنسية هنا رائعة. أحجام الفصول الصغيرة تعني وقت ممارسة حقيقياً. أستطيع الآن إجراء محادثات باللغة الفرنسية بعد 6 أشهر فقط!' },
    course: 'اللغة الفرنسية',
    rating: 5,
  },
]

export function TestimonialsSlider({ testimonials, locale }: TestimonialsSliderProps) {
  const isRtl = locale === 'ar'
  const items =
    testimonials.length > 0
      ? testimonials
      : isRtl
      ? FALLBACK_TESTIMONIALS_AR
      : FALLBACK_TESTIMONIALS_EN

  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, isPaused])

  const testimonial = items[current]
  const quote = getLocaleText(testimonial.quote, locale)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-3xl text-center px-4">
        {/* Quote mark */}
        <div className="text-8xl font-serif text-brand-200 leading-none mb-4 select-none">
          {isRtl ? '„' : '"'}
        </div>

        {/* Quote */}
        <blockquote className="text-xl sm:text-2xl font-medium text-gray-800 leading-relaxed mb-8 min-h-[80px]">
          {quote}
        </blockquote>

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-6">
          {Array.from({ length: testimonial.rating ?? 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center justify-center gap-4">
          {testimonial.avatar ? (
            <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-brand-200">
              <Image
                src={urlFor(testimonial.avatar).width(112).height(112).url()}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {testimonial.name.charAt(0)}
            </div>
          )}
          <div className="text-start">
            <p className="font-bold text-gray-900">{testimonial.name}</p>
            {testimonial.course && (
              <p className="text-sm text-gray-500">{testimonial.course}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={isRtl ? next : prev}
          className="p-2.5 rounded-full border border-gray-200 text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === current
                  ? 'w-6 h-2.5 bg-brand-500'
                  : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={isRtl ? prev : next}
          className="p-2.5 rounded-full border border-gray-200 text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
