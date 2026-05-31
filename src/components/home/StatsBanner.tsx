'use client'

import { useState, useEffect, useRef } from 'react'
import { Users, LayoutGrid, Languages, UserCheck, type LucideIcon } from 'lucide-react'

interface StatsBannerProps {
  locale: 'en' | 'ar'
  stat1Value: string
  stat2Value: string
  stat3Value: string
  stat4Value: string
  stat1Label: string
  stat2Label: string
  stat3Label: string
  stat4Label: string
}

function parseValue(val: string): { num: number; prefix: string; suffix: string } {
  const match = val.match(/^([^0-9]*)([0-9,]+)(.*)$/)
  if (!match) return { num: 0, prefix: '', suffix: val }
  return {
    num: parseInt(match[2].replace(/,/g, ''), 10),
    prefix: match[1],
    suffix: match[3],
  }
}

function AnimatedStat({
  value,
  label,
  Icon,
  triggered,
  delay,
}: {
  value: string
  label: string
  Icon: LucideIcon
  triggered: boolean
  delay: number
}) {
  const { num, prefix, suffix } = parseValue(value)
  const [count, setCount] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!triggered || num === 0) return

    const startTime = performance.now()
    const duration = 1800

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * num))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCount(num)
      }
    }

    const timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [triggered, num, delay])

  const display = num > 0 ? `${prefix}${count.toLocaleString()}${suffix}` : value

  return (
    <div className="text-center">
      <div className="flex justify-center mb-3">
        <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-white/80" />
        </div>
      </div>
      <div className="text-3xl sm:text-4xl font-black text-white mb-1 tabular-nums">
        {display}
      </div>
      <div className="text-sm text-brand-200 font-medium">{label}</div>
    </div>
  )
}

export function StatsBanner({
  stat1Value,
  stat2Value,
  stat3Value,
  stat4Value,
  stat1Label,
  stat2Label,
  stat3Label,
  stat4Label,
}: StatsBannerProps) {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const stats: { value: string; label: string; Icon: LucideIcon; delay: number }[] = [
    { value: stat1Value, label: stat1Label, Icon: Users,      delay: 0   },
    { value: stat2Value, label: stat2Label, Icon: LayoutGrid, delay: 120 },
    { value: stat3Value, label: stat3Label, Icon: Languages,  delay: 240 },
    { value: stat4Value, label: stat4Label, Icon: UserCheck,  delay: 360 },
  ]

  return (
    <section
      ref={ref}
      className="bg-brand-500 py-10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              Icon={stat.Icon}
              triggered={triggered}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
