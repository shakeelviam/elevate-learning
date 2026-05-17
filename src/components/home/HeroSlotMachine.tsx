'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Target, MessageSquare, Globe, Trophy, type LucideIcon } from 'lucide-react'

interface SlotItem {
  Icon: LucideIcon
  title: string
  sub: string
}

const ITEMS: SlotItem[] = [
  { Icon: BookOpen,      title: 'IELTS Preparation', sub: 'Achieve Band 7+' },
  { Icon: Target,        title: 'TOEFL iBT',          sub: 'Score 100+' },
  { Icon: MessageSquare, title: 'English Fluency',     sub: 'Speak confidently' },
  { Icon: Globe,         title: 'Arabic & French',     sub: 'Native-level instructors' },
  { Icon: Trophy,        title: 'SAT & GMAT',          sub: 'Dream university' },
]

const ITEMS_AR: SlotItem[] = [
  { Icon: BookOpen,      title: 'الآيلتس',          sub: 'احصل على Band 7' },
  { Icon: Target,        title: 'التوفل iBT',        sub: 'تجاوز 100 نقطة' },
  { Icon: MessageSquare, title: 'الإنجليزية',        sub: 'تحدث بثقة' },
  { Icon: Globe,         title: 'العربية والفرنسية', sub: 'مدرسون على مستوى الناطقين' },
  { Icon: Trophy,        title: 'SAT و GMAT',        sub: 'جامعة أحلامك' },
]

export function HeroSlotMachine({ locale }: { locale: 'en' | 'ar' }) {
  const items = locale === 'ar' ? ITEMS_AR : ITEMS
  const [idx, setIdx] = useState(0)
  const [animating, setAnimating] = useState<'idle' | 'exit' | 'enter'>('idle')

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating('exit')
      setTimeout(() => {
        setIdx(i => (i + 1) % items.length)
        setAnimating('enter')
        setTimeout(() => setAnimating('idle'), 400)
      }, 350)
    }, 3000)
    return () => clearInterval(t)
  }, [items.length])

  const item = items[idx]
  const prev = items[(idx - 1 + items.length) % items.length]
  const PrevIcon = prev.Icon
  const CurrIcon = item.Icon

  const slideStyle = (which: 'current' | 'prev'): React.CSSProperties => {
    if (which === 'prev') {
      return {
        transform: animating === 'exit' ? 'translateY(-100%)' : 'translateY(0)',
        opacity: animating === 'exit' ? 0 : 1,
        transition: 'transform 350ms cubic-bezier(0.4,0,0.2,1), opacity 300ms ease',
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
      }
    }
    return {
      transform: animating === 'enter' ? 'translateY(0)' : animating === 'exit' ? 'translateY(100%)' : 'translateY(0)',
      opacity: animating === 'enter' || animating === 'idle' ? 1 : 0,
      transition: 'transform 400ms cubic-bezier(0.34,1.56,0.64,1), opacity 350ms ease',
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
    }
  }

  return (
    <div className="relative aspect-[4/3] w-full select-none">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-900 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative h-full" style={{ overflow: 'hidden' }}>
          <div style={slideStyle('prev')}>
            <PrevIcon className="h-12 w-12 text-white/70" strokeWidth={1.5} />
            <h3 className="text-white text-3xl sm:text-4xl font-black text-center px-6">{prev.title}</h3>
            <p className="text-brand-200 text-sm">{prev.sub}</p>
          </div>
          <div style={slideStyle('current')}>
            <CurrIcon className="h-12 w-12 text-white/70" strokeWidth={1.5} />
            <h3 className="text-white text-3xl sm:text-4xl font-black text-center px-6">{item.title}</h3>
            <p className="text-brand-200 text-sm">{item.sub}</p>
          </div>
        </div>

        <div className="absolute bottom-6 inset-x-6 flex items-center justify-between">
          <p className="text-brand-300 text-xs uppercase tracking-widest">
            {locale === 'ar' ? 'إليفيت ليرنينج' : 'Elevate Learning'}
          </p>
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === idx ? 'bg-white w-6' : 'bg-white/30 w-3'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
