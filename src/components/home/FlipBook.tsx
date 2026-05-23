'use client'

import { useState, useEffect } from 'react'

const PAGES_EN = [
  {
    label: '01 / 05',
    title: 'IELTS Preparation',
    body: 'Achieve Band 7+ with expert coaching and real exam practice.',
  },
  {
    label: '02 / 05',
    title: 'TOEFL iBT',
    body: 'Score 100+ with proven test-taking strategies and mock exams.',
  },
  {
    label: '03 / 05',
    title: 'English Fluency',
    body: 'From beginner to advanced in 3 months — speak confidently.',
  },
  {
    label: '04 / 05',
    title: 'Arabic & French',
    body: 'Expand your linguistic horizons with native-level instructors.',
  },
  {
    label: '05 / 05',
    title: 'SAT & GMAT',
    body: 'Top percentile college prep — get into your dream university.',
  },
]

const PAGES_AR = [
  {
    label: '٠١ / ٠٥',
    title: 'الآيلتس',
    body: 'احصل على Band 7 أو أعلى مع تدريب متخصص واختبارات حقيقية.',
  },
  {
    label: '٠٢ / ٠٥',
    title: 'التوفل iBT',
    body: 'تجاوز 100 نقطة باستراتيجيات مثبتة ونماذج اختبار واقعية.',
  },
  {
    label: '٠٣ / ٠٥',
    title: 'الإنجليزية',
    body: 'من المبتدئ إلى المتقدم في 3 أشهر — تحدث بثقة من اليوم الأول.',
  },
  {
    label: '٠٤ / ٠٥',
    title: 'العربية والفرنسية',
    body: 'وسّع آفاقك اللغوية مع مدرسين على مستوى الناطقين الأصليين.',
  },
  {
    label: '٠٥ / ٠٥',
    title: 'SAT و GMAT',
    body: 'احصل على أعلى درجات القبول الجامعي في الكويت والخارج.',
  },
]

type Phase = 'rest' | 'out' | 'in'

const HOLD_MS = 2400
const FLIP_MS = 380

export function FlipBook({ locale }: { locale: 'en' | 'ar' }) {
  const pages = locale === 'ar' ? PAGES_AR : PAGES_EN
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('rest')

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase('out')
      setTimeout(() => {
        setIdx(i => (i + 1) % pages.length)
        setPhase('in')
        setTimeout(() => setPhase('rest'), FLIP_MS)
      }, FLIP_MS)
    }, HOLD_MS + FLIP_MS * 2)

    return () => clearInterval(interval)
  }, [pages.length])

  const page = pages[idx]
  const animClass =
    phase === 'out' ? 'page-flip-out' :
    phase === 'in'  ? 'page-flip-in'  :
    ''

  return (
    <div className="relative aspect-[4/3] w-full select-none">
      {/* Stacked page shadows — give depth illusion */}
      <div className="absolute inset-0 rounded-3xl bg-brand-200 translate-x-3 translate-y-3" />
      <div className="absolute inset-0 rounded-3xl bg-brand-300 translate-x-1.5 translate-y-1.5" />

      {/* Active page */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-800 shadow-2xl flex flex-col justify-between p-8 ${animClass}`}
      >
        {/* Page counter */}
        <span className="text-brand-200 text-xs font-mono tracking-widest">{page.label}</span>

        {/* Text content */}
        <div>
          <p className="text-brand-200 text-xs uppercase tracking-widest mb-3">
            {locale === 'ar' ? 'مركز إيليفيت للتعليم' : 'Elevate Learning'}
          </p>
          <h3 className="text-white text-3xl sm:text-4xl font-black leading-tight mb-4">
            {page.title}
          </h3>
          <p className="text-brand-100 text-sm leading-relaxed">{page.body}</p>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-1.5">
          {pages.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === idx ? 'bg-white w-6' : 'bg-white/30 w-3'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
