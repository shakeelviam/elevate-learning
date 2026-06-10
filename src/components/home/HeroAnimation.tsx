'use client'

import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/i18n/navigation'

// ── Courses to animate through ─────────────────────────────────────────────────
const COURSES = [
  { name: 'IELTS Preparation', accent: '#E8593A' },
  { name: 'TOEFL iBT', accent: '#F43F5E' },
  { name: 'English Language', accent: '#1A3A2A' },
  { name: 'French Language', accent: '#E8593A' },
  { name: 'The Test Lab', accent: '#F43F5E' },
]

// ── SVG Archery Target ─────────────────────────────────────────────────────────
function TargetBoard() {
  const rings = [
    { r: 130, fill: '#fff', stroke: '#ccc' },
    { r: 117, fill: '#fff', stroke: '#ccc' },
    { r: 104, fill: '#000', stroke: '#555' },
    { r: 91,  fill: '#000', stroke: '#555' },
    { r: 78,  fill: '#4A90D9', stroke: '#3070b5' },
    { r: 65,  fill: '#4A90D9', stroke: '#3070b5' },
    { r: 52,  fill: '#E8593A', stroke: '#c03a1e' },
    { r: 39,  fill: '#E8593A', stroke: '#c03a1e' },
    { r: 26,  fill: '#FFD700', stroke: '#c8a800' },
    { r: 13,  fill: '#FFD700', stroke: '#c8a800' },
  ]
  return (
    <svg width="280" height="280" viewBox="0 0 280 280" className="drop-shadow-2xl">
      {/* Outer wood rim */}
      <circle cx="140" cy="140" r="138" fill="#8B6914" />
      <circle cx="140" cy="140" r="134" fill="#A0771A" />
      {/* Rings */}
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx="140"
          cy="140"
          r={ring.r}
          fill={ring.fill}
          stroke={ring.stroke}
          strokeWidth="0.5"
        />
      ))}
      {/* Cross-hairs */}
      <line x1="140" y1="10" x2="140" y2="270" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      <line x1="10" y1="140" x2="270" y2="140" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      {/* Bullseye dot */}
      <circle cx="140" cy="140" r="4" fill="#cc0000" />
    </svg>
  )
}

// ── SVG Arrow ──────────────────────────────────────────────────────────────────
function Arrow({ accentColor }: { accentColor: string }) {
  return (
    <svg width="28" height="240" viewBox="0 0 28 240" className="drop-shadow-lg">
      {/* Broadhead tip — point at y=0 */}
      <polygon points="14,0 4,22 14,18 24,22" fill="#8C8C8C" />
      <polygon points="14,0 4,22 14,14" fill="#B0B0B0" />
      {/* Shaft */}
      <rect x="12.5" y="20" width="3" height="180" fill="#C4A35A" />
      <rect x="13" y="20" width="2" height="180" fill="#D4B36A" />
      {/* Nock */}
      <rect x="11" y="198" width="6" height="8" rx="1" fill="#5C3D11" />
      {/* Fletching vanes */}
      <polygon points="14,206 6,200 6,228" fill={accentColor} opacity="0.9" />
      <polygon points="14,206 22,200 22,228" fill={accentColor} opacity="0.7" />
      <polygon points="14,206 14,200 8,232" fill={accentColor} opacity="0.5" />
    </svg>
  )
}

// ── Ripple effect ──────────────────────────────────────────────────────────────
function Ripple() {
  return (
    <motion.div
      className="absolute rounded-full border-2 pointer-events-none"
      style={{
        width: 40,
        height: 40,
        left: '50%',
        top: '50%',
        marginLeft: -20,
        marginTop: -20,
        borderColor: 'var(--coral)',
      }}
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ scale: 5, opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    />
  )
}

// ── Typing headline ────────────────────────────────────────────────────────────
const HEADLINE_PARTS = [
  { text: 'A new institute,\n', italic: false },
  { text: 'built on a ', italic: false },
  { text: 'lifetime', italic: true },
  { text: '\nof teaching.', italic: false },
]

const FULL_TEXT = HEADLINE_PARTS.map(p => p.text).join('')

function TypingHeadline({ locale }: { locale: 'en' | 'ar' }) {
  const [displayed, setDisplayed] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (displayed >= FULL_TEXT.length) { setDone(true); return }
    const t = setTimeout(() => setDisplayed(d => d + 1), 48)
    return () => clearTimeout(t)
  }, [displayed])

  // Render with italic styling for "lifetime"
  let cursor = 0
  const segments: ReactNode[] = []
  for (const [i, part] of HEADLINE_PARTS.entries()) {
    const visible = Math.max(0, Math.min(displayed - cursor, part.text.length))
    if (visible > 0) {
      const txt = part.text.slice(0, visible)
      segments.push(
        part.italic
          ? <em key={i} style={{ color: 'var(--coral-light)', fontStyle: 'italic', fontWeight: 300 }}>{txt}</em>
          : <span key={i}>{txt}</span>
      )
    }
    cursor += part.text.length
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="text-center"
    >
      {/* Eyebrow */}
      <p className="eyebrow justify-center mb-6" style={{ color: 'var(--coral)' }}>
        {locale === 'ar' ? 'معهد الكويت للغات المتميز' : "Kuwait's Premier Language Institute"}
      </p>

      {/* H1 */}
      <h1
        className="mb-6 whitespace-pre-line"
        style={{
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          color: 'var(--forest)',
        }}
      >
        {segments}
        {!done && <span className="cursor-blink" />}
      </h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: done ? 1 : 0, y: done ? 0 : 8 }}
        transition={{ delay: 0.3 }}
        className="text-sm mb-8"
        style={{ color: 'rgba(26,58,42,0.6)' }}
      >
        Salmiya, Kuwait · IELTS · TOEFL · Languages · Test Prep
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: done ? 1 : 0, y: done ? 0 : 8 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Link
          href="/courses"
          locale={locale}
          className="inline-flex items-center px-6 py-3 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--coral)', color: 'var(--white)' }}
        >
          {locale === 'ar' ? 'استعرض الدورات' : 'Explore Courses'}
        </Link>
        <Link
          href="/contact"
          locale={locale}
          className="inline-flex items-center px-6 py-3 rounded-md text-sm font-semibold border transition-colors hover:bg-forest/5"
          style={{ borderColor: 'var(--forest)', color: 'var(--forest)' }}
        >
          {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
        </Link>
      </motion.div>
    </motion.div>
  )
}

// ── Progress pips ──────────────────────────────────────────────────────────────
function Pips({ total, current, done }: { total: number; current: number; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          animate={{
            width: i === current && !done ? 44 : 28,
            background: i < current || done
              ? 'var(--coral)'
              : i === current
              ? 'var(--forest)'
              : 'rgba(26,58,42,0.15)',
          }}
          style={{ height: 3 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}

// ── Main HeroAnimation ─────────────────────────────────────────────────────────
type Phase = 'board' | 'badge' | 'arrow' | 'impact' | 'hold' | 'exit' | 'typing'

export function HeroAnimation({ locale }: { locale: 'en' | 'ar' }) {
  const [courseIdx, setCourseIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('board')
  const [showRipple, setShowRipple] = useState(false)
  const [tilt] = useState(() => (Math.random() - 0.5) * 4)

  const course = COURSES[courseIdx]

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>

    if (phase === 'board') {
      t = setTimeout(() => setPhase('badge'), 550 + 300)
    } else if (phase === 'badge') {
      t = setTimeout(() => setPhase('arrow'), 350)
    } else if (phase === 'arrow') {
      // Arrow drop = 200ms, impact at 180ms
      t = setTimeout(() => {
        setShowRipple(true)
        setPhase('impact')
      }, 180)
    } else if (phase === 'impact') {
      t = setTimeout(() => setPhase('hold'), 300)
    } else if (phase === 'hold') {
      t = setTimeout(() => setPhase('exit'), 600)
    } else if (phase === 'exit') {
      t = setTimeout(() => {
        setShowRipple(false)
        const next = courseIdx + 1
        if (next >= COURSES.length) {
          setPhase('typing')
        } else {
          setCourseIdx(next)
          setPhase('board')
        }
      }, 400 + 180)
    }

    return () => clearTimeout(t)
  }, [phase, courseIdx])

  const isTyping = phase === 'typing'

  // Arrow final position: tip lands at board center (140px from top of board svg)
  // Board height 280px, center at 140px from top
  // Arrow height 240px, tip at y=0
  // So arrow top = boardCenter - 0 = board's top + 140
  // We position arrow absolutely: top of arrow = center of board - tip distance = (280/2) - 0 = 140px from board top

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--cream)' }}>

      {/* Background blobs */}
      <div className="hero-blob" style={{ width: 500, height: 500, top: '-10%', left: '-5%', background: 'rgba(232,89,58,0.06)' }} />
      <div className="hero-blob" style={{ width: 400, height: 400, bottom: '-10%', right: '-5%', background: 'rgba(244,63,94,0.05)' }} />
      <div className="hero-blob" style={{ width: 300, height: 300, top: '40%', left: '60%', background: 'rgba(26,58,42,0.04)' }} />

      <AnimatePresence mode="wait">
        {!isTyping ? (
          <motion.div
            key="animation"
            className="flex flex-col items-center gap-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Course badge */}
            <AnimatePresence>
              {(phase === 'badge' || phase === 'arrow' || phase === 'impact' || phase === 'hold') && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                  style={{ background: 'var(--forest)', color: 'var(--white)' }}
                >
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: course.accent }} />
                  {course.name}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Board + arrow */}
            <div className="relative flex items-start justify-center" style={{ width: 280, height: 340 }}>
              {/* Target board */}
              <AnimatePresence>
                {phase !== 'exit' && (
                  <motion.div
                    key={`board-${courseIdx}`}
                    className="absolute top-0"
                    initial={{ scale: 0.5, y: -40, opacity: 0 }}
                    animate={
                      phase === 'impact'
                        ? { scale: 1, y: 0, opacity: 1, rotate: [0, -1.5, 1.5, 0] }
                        : { scale: 1, y: 0, opacity: 1, rotate: 0 }
                    }
                    exit={{ scale: 0.7, y: 30, opacity: 0 }}
                    transition={
                      phase === 'impact'
                        ? { duration: 0.3, times: [0, 0.25, 0.75, 1] }
                        : { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }
                    }
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  >
                    <TargetBoard />
                    {showRipple && <Ripple />}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Arrow — drops from above, tip lands at board center (140px from top) */}
              <AnimatePresence>
                {(phase === 'arrow' || phase === 'impact' || phase === 'hold') && (
                  <motion.div
                    key={`arrow-${courseIdx}`}
                    className="absolute"
                    style={{
                      left: '50%',
                      marginLeft: -14,
                      top: 140 - 240, // tip at center (140) minus arrow height (240) = -100
                      rotate: tilt,
                    }}
                    initial={{ y: -350 }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <Arrow accentColor={course.accent} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress pips */}
            <Pips total={COURSES.length} current={courseIdx} done={false} />
          </motion.div>
        ) : (
          <motion.div
            key="typing"
            className="w-full max-w-2xl px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            {/* All pips done */}
            <div className="flex justify-center mb-10">
              <Pips total={COURSES.length} current={COURSES.length} done={true} />
            </div>
            <TypingHeadline locale={locale} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
