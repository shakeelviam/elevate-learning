'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Target, MessageSquare, Globe, Trophy, type LucideIcon } from 'lucide-react'

interface Card {
  Icon: LucideIcon
  title: string
  body: string
  color: string
}

const CARDS: Card[] = [
  { Icon: BookOpen,      title: 'IELTS Preparation', body: 'Achieve Band 7+ with expert coaching and real exam practice.',           color: 'from-brand-500 to-brand-800' },
  { Icon: Target,        title: 'TOEFL iBT',          body: 'Score 100+ with proven test-taking strategies and mock exams.',          color: 'from-brand-600 to-indigo-800' },
  { Icon: MessageSquare, title: 'English Fluency',     body: 'From beginner to advanced in 3 months — speak confidently.',             color: 'from-indigo-500 to-brand-800' },
  { Icon: Globe,         title: 'Arabic & French',     body: 'Expand your linguistic horizons with native-level instructors.',         color: 'from-brand-700 to-slate-800' },
  { Icon: Trophy,        title: 'SAT & GMAT',          body: 'Top percentile college prep — get into your dream university.',          color: 'from-slate-700 to-brand-900' },
]

const CARDS_AR: Card[] = [
  { Icon: BookOpen,      title: 'الآيلتس',          body: 'احصل على Band 7 أو أعلى مع تدريب متخصص واختبارات حقيقية.',        color: 'from-brand-500 to-brand-800' },
  { Icon: Target,        title: 'التوفل iBT',        body: 'تجاوز 100 نقطة باستراتيجيات مثبتة ونماذج اختبار واقعية.',         color: 'from-brand-600 to-indigo-800' },
  { Icon: MessageSquare, title: 'الإنجليزية',        body: 'من المبتدئ إلى المتقدم في 3 أشهر — تحدث بثقة من اليوم الأول.',    color: 'from-indigo-500 to-brand-800' },
  { Icon: Globe,         title: 'العربية والفرنسية', body: 'وسّع آفاقك اللغوية مع مدرسين على مستوى الناطقين الأصليين.',       color: 'from-brand-700 to-slate-800' },
  { Icon: Trophy,        title: 'SAT و GMAT',        body: 'احصل على أعلى درجات القبول الجامعي في الكويت والخارج.',           color: 'from-slate-700 to-brand-900' },
]

export function HeroCardStack({ locale }: { locale: 'en' | 'ar' }) {
  const cards = locale === 'ar' ? CARDS_AR : CARDS
  const [topIdx, setTopIdx] = useState(0)
  const [swiping, setSwiping] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setSwiping(true)
      setTimeout(() => {
        setTopIdx(i => (i + 1) % cards.length)
        setSwiping(false)
      }, 500)
    }, 3000)
    return () => clearInterval(t)
  }, [cards.length])

  const getCard = (offset: number) => cards[(topIdx + offset) % cards.length]
  const Top = getCard(0)
  const Next = getCard(1)

  return (
    <div className="relative aspect-[4/3] w-full select-none">
      {/* Card 3 — furthest back */}
      <div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-300 to-brand-600 shadow-lg"
        style={{ transform: 'scale(0.88) translateY(24px)', zIndex: 1 }}
      />
      {/* Card 2 — middle */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${Next.color} shadow-xl flex flex-col justify-between p-8`}
        style={{ transform: 'scale(0.94) translateY(12px)', zIndex: 2 }}
      >
        <Next.Icon className="h-9 w-9 text-white/60" strokeWidth={1.5} />
        <h3 className="text-white text-2xl font-black leading-tight">{Next.title}</h3>
      </div>
      {/* Card 1 — top/active */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${Top.color} shadow-2xl flex flex-col justify-between p-8`}
        style={{
          zIndex: 3,
          transform: swiping ? 'translateX(120%) rotate(20deg)' : 'translateX(0) rotate(0deg)',
          opacity: swiping ? 0 : 1,
          transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease',
        }}
      >
        <Top.Icon className="h-9 w-9 text-white/80" strokeWidth={1.5} />
        <div>
          <p className="text-brand-200 text-xs uppercase tracking-widest mb-2">
            {locale === 'ar' ? 'إليفيت ليرنينج' : 'Elevate Learning'}
          </p>
          <h3 className="text-white text-3xl sm:text-4xl font-black leading-tight mb-3">{Top.title}</h3>
          <p className="text-brand-100 text-sm leading-relaxed">{Top.body}</p>
        </div>
        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${i === topIdx ? 'bg-white w-6' : 'bg-white/30 w-3'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
