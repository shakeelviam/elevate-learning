'use client'

import { useState, useEffect } from 'react'

const COURSES_EN = ['IELTS Preparation', 'TOEFL iBT', 'English Fluency', 'Arabic & French', 'SAT & GMAT']
const COURSES_AR = ['الآيلتس', 'التوفل iBT', 'الإنجليزية', 'العربية والفرنسية', 'SAT و GMAT']

const TYPE_SPEED = 60
const DELETE_SPEED = 35
const PAUSE_MS = 1800

export function HeroTypewriter({ locale }: { locale: 'en' | 'ar' }) {
  const courses = locale === 'ar' ? COURSES_AR : COURSES_EN
  const [courseIdx, setCourseIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const target = courses[courseIdx]

    if (!deleting && displayed.length < target.length) {
      const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), TYPE_SPEED)
      return () => clearTimeout(t)
    }

    if (!deleting && displayed.length === target.length) {
      const t = setTimeout(() => setDeleting(true), PAUSE_MS)
      return () => clearTimeout(t)
    }

    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), DELETE_SPEED)
      return () => clearTimeout(t)
    }

    if (deleting && displayed.length === 0) {
      setDeleting(false)
      setCourseIdx(i => (i + 1) % courses.length)
    }
  }, [displayed, deleting, courseIdx, courses])

  return (
    <div className="relative aspect-[4/3] w-full select-none">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-900 shadow-2xl flex flex-col justify-between p-8 sm:p-10">
        {/* Top label */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
          <p className="text-gold-200 text-xs uppercase tracking-widest">
            {locale === 'ar' ? 'إليفيت ليرنينج — الكويت' : 'Elevate Learning — Kuwait'}
          </p>
        </div>

        {/* Middle: typewriter */}
        <div>
          <p className="text-gold-300 text-sm mb-3">
            {locale === 'ar' ? 'أتقن' : 'Master'}
          </p>
          <h3 className="text-gold-300 font-black leading-tight mb-1" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', minHeight: '3.2em' }}>
            {displayed}
            <span className="inline-block w-[3px] h-[1em] bg-gold-400 ml-1 align-middle animate-pulse" />
          </h3>
          <p className="text-gold-200 text-sm leading-relaxed mt-4">
            {locale === 'ar'
              ? 'مع أفضل المدرسين في الكويت'
              : "with Kuwait's finest instructors"}
          </p>
        </div>

        {/* Bottom dots */}
        <div className="flex gap-1.5">
          {courses.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${i === courseIdx ? 'bg-gold-400 w-6' : 'bg-white/30 w-3'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
