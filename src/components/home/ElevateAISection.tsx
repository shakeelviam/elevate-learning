'use client'

import {
  ArrowRight,
  BrainCircuit,
  ChartBar,
  RefreshCw,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { SanitySiteSettings } from '@/types/sanity'

interface ElevateAISectionProps {
  locale: 'en' | 'ar'
  settings?: SanitySiteSettings | null
}

const ICON_MAP: Record<string, LucideIcon> = {
  RefreshCw, BrainCircuit, Zap, ChartBar, Sparkles, ArrowRight,
}

const DEFAULT_FEATURES_EN = [
  { icon: RefreshCw,    label: 'Fresh questions every session — never repeated' },
  { icon: BrainCircuit, label: 'Adapts in real-time to your weak areas' },
  { icon: Zap,          label: 'Instant explanations for every answer' },
  { icon: ChartBar,     label: 'Visual analytics track your progress over time' },
]

const DEFAULT_FEATURES_AR = [
  { icon: RefreshCw,    label: 'أسئلة جديدة في كل جلسة — لا تكرار أبداً' },
  { icon: BrainCircuit, label: 'يتكيف تلقائياً مع نقاط ضعفك' },
  { icon: Zap,          label: 'شرح فوري لكل إجابة' },
  { icon: ChartBar,     label: 'تحليلات بصرية لتتبع تقدمك' },
]

const DEFAULT_EXAM_BADGES = ['IELTS', 'TOEFL', 'OET', 'GMAT', 'SAT', 'PTE']

export function ElevateAISection({ locale, settings }: ElevateAISectionProps) {
  const isRtl = locale === 'ar'
  const ai = settings?.aiSection

  const pill = isRtl ? (ai?.pillAr ?? 'جديد — مختبر الاختبارات التكيّفية') : (ai?.pillEn ?? 'NEW — Adaptive Practice Tests')
  const titleColored = isRtl ? (ai?.titleAr ?? 'مختبر الاختبارات:') : (ai?.titleEn ?? 'The Test Lab:')
  const titleSuffix = isRtl ? (ai?.titleSuffixAr ?? 'تدريب تكيّفي لا نهاية له') : (ai?.titleSuffixEn ?? 'Infinite Adaptive Practice')
  const desc = isRtl
    ? (ai?.descAr ?? 'محرك اختبارات متطور مصمم خصيصاً لـ IELTS وTOEFL وسائر الامتحانات الدولية. أسئلة جديدة كل مرة، مستوحاة من المواد الأصلية.')
    : (ai?.descEn ?? 'A powerful test engine built for IELTS, TOEFL, and every major exam. New, copyright-safe questions every session — drawn from real study materials.')
  const examBadges = ai?.examBadges ?? DEFAULT_EXAM_BADGES
  const contactTitle = isRtl ? (ai?.contactTitleAr ?? 'هل أنت مهتم بالوصول إلى مختبر الاختبارات؟') : (ai?.contactTitleEn ?? 'Interested in Test Lab access?')
  const contactDesc = isRtl
    ? (ai?.contactDescAr ?? 'يتوفر مختبر الاختبارات للطلاب المسجلين فقط. تواصل معنا للحصول على بياناتك وبدء التدريب.')
    : (ai?.contactDescEn ?? "Test Lab is available to enrolled students only. Reach out to us and we'll get you set up with your credentials.")
  const contactBtn = isRtl ? (ai?.contactButtonAr ?? 'تواصل معنا') : (ai?.contactButtonEn ?? 'Contact Us for Access')

  const features = ai?.features && ai.features.length > 0
    ? ai.features.map((f) => ({
        icon: ICON_MAP[f.icon ?? ''] ?? Zap,
        label: (isRtl ? f.ar : f.en) ?? '',
      }))
    : (isRtl ? DEFAULT_FEATURES_AR : DEFAULT_FEATURES_EN)

  return (
    <section
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative overflow-hidden bg-brand-50 py-24"
    >
      {/* ── Background texture ──────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Decorative blobs ────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute -top-32 -start-32 h-[480px] w-[480px] rounded-full bg-brand-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -end-32 h-[400px] w-[400px] rounded-full bg-gold-500/15 blur-[100px]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div>
          <div>
            {/* Pill badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/50 bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-600">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              {pill}
            </div>

            <h2 className="mb-4 text-4xl font-black leading-[1.1] text-brand-700 sm:text-5xl">
              <span className="text-gold-500">{titleColored}</span>
              <br />
              {titleSuffix}
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-gray-600">{desc}</p>

            {/* Feature list */}
            <ul className="mb-10 space-y-3">
              {features.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100">
                    <Icon className="h-3.5 w-3.5 text-brand-500" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            {/* Exam type badges */}
            <div className="mb-10 flex flex-wrap gap-2">
              {examBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-lg border border-gold-400/40 bg-gold-50 px-3 py-1 text-xs font-bold tracking-widest text-gold-600"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Contact prompt */}
            <div
              className="rounded-2xl px-6 py-6 shadow-lg"
              style={{ background: 'var(--forest)', border: '2px solid var(--gold)' }}
            >
              <p className="mb-2 text-base font-bold" style={{ color: 'var(--gold)' }}>{contactTitle}</p>
              <p className="mb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{contactDesc}</p>
              <a
                href="mailto:info@elev8-edu.com"
                className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: 'var(--gold)', color: 'var(--forest)' }}
              >
                {contactBtn}
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
