'use client'

import { useState, useEffect, useRef } from 'react'
import { Star } from 'lucide-react'

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return value
}

const BARS_EN = [
  { label: 'IELTS', pct: 87, color: 'bg-brand-400' },
  { label: 'TOEFL', pct: 82, color: 'bg-indigo-400' },
  { label: 'SAT / GMAT', pct: 79, color: 'bg-gold-400' },
  { label: 'Languages', pct: 94, color: 'bg-emerald-400' },
]

const BARS_AR = [
  { label: 'الآيلتس', pct: 87, color: 'bg-brand-400' },
  { label: 'التوفل', pct: 82, color: 'bg-indigo-400' },
  { label: 'SAT / GMAT', pct: 79, color: 'bg-gold-400' },
  { label: 'اللغات', pct: 94, color: 'bg-emerald-400' },
]

function AnimatedBar({ pct, color }: { pct: number; color: string }) {
  const [width, setWidth] = useState(0)
  const ref = useRef(false)
  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const t = setTimeout(() => setWidth(pct), 200)
    return () => clearTimeout(t)
  }, [pct])
  return (
    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%`, transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
    </div>
  )
}

export function HeroStatDashboard({ locale }: { locale: 'en' | 'ar' }) {
  const bars = locale === 'ar' ? BARS_AR : BARS_EN
  const graduates = useCountUp(8000)
  const years = useCountUp(12)
  const rating = useCountUp(49)

  return (
    <div className="relative aspect-[4/3] w-full select-none">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-900 to-slate-900 shadow-2xl flex flex-col justify-between p-7">

        {/* Top row — big stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
            <p className="text-white text-2xl font-black">{graduates.toLocaleString()}+</p>
            <p className="text-brand-300 text-xs mt-0.5">{locale === 'ar' ? 'خريج' : 'Graduates'}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
            <p className="text-white text-2xl font-black">{years}+</p>
            <p className="text-brand-300 text-xs mt-0.5">{locale === 'ar' ? 'سنة خبرة' : 'Yrs Experience'}</p>
          </div>
          <div className="bg-gold-400/20 rounded-2xl p-3 text-center backdrop-blur-sm border border-gold-400/30">
            <p className="text-gold-300 text-2xl font-black">{(rating / 10).toFixed(1)}</p>
            <p className="text-gold-400/80 text-xs mt-0.5">
              <Star className="inline h-3 w-3 fill-gold-400 text-gold-400 mr-0.5" />
              {locale === 'ar' ? 'تقييم' : 'Rating'}
            </p>
          </div>
        </div>

        {/* Course pass-rate bars */}
        <div className="space-y-3">
          <p className="text-brand-300 text-xs uppercase tracking-widest">
            {locale === 'ar' ? 'نسب النجاح' : 'Pass Rates'}
          </p>
          {bars.map(b => (
            <div key={b.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-white text-xs font-semibold">{b.label}</span>
                <span className="text-brand-300 text-xs">{b.pct}%</span>
              </div>
              <AnimatedBar pct={b.pct} color={b.color} />
            </div>
          ))}
        </div>

        {/* Bottom: pulsing live indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold">
              {locale === 'ar' ? 'التسجيل مفتوح' : 'Enrollment Open'}
            </span>
          </div>
          <p className="text-brand-400 text-xs">
            {locale === 'ar' ? 'الكويت' : 'Kuwait'}
          </p>
        </div>

      </div>
    </div>
  )
}
