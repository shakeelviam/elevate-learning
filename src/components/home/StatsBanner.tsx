'use client'

import { useState, useEffect, useRef } from 'react'

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
  triggered,
  delay,
  showDivider,
}: {
  value: string
  label: string
  triggered: boolean
  delay: number
  showDivider: boolean
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
    <div className="relative flex flex-col items-center text-center py-6 px-4">
      {showDivider && (
        <div
          className="absolute inset-y-6 start-0 w-px hidden lg:block"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        />
      )}
      <div
        className="text-4xl sm:text-5xl font-bold mb-2 tabular-nums"
        style={{ color: 'var(--gold)', letterSpacing: '-0.02em' }}
      >
        {display}
      </div>
      <div
        className="text-xs font-medium uppercase tracking-widest"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        {label}
      </div>
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
        if (entry.isIntersecting) { setTriggered(true); observer.disconnect() }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const stats = [
    { value: stat1Value, label: stat1Label, delay: 0 },
    { value: stat2Value, label: stat2Label, delay: 120 },
    { value: stat3Value, label: stat3Label, delay: 240 },
    { value: stat4Value, label: stat4Label, delay: 360 },
  ]

  return (
    <section ref={ref} style={{ background: 'var(--forest-mid)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              triggered={triggered}
              delay={stat.delay}
              showDivider={i > 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
