'use client'

import {
  ArrowRight,
  BrainCircuit,
  ChartBar,
  CheckCircle2,
  Clock,
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* ── Left: copy ──────────────────────────────────────────────────── */}
          <div className={isRtl ? 'lg:order-2' : ''}>
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
            <div className="rounded-2xl border border-brand-200 bg-white px-6 py-5 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-brand-700">{contactTitle}</p>
              <p className="mb-4 text-sm leading-relaxed text-gray-500">{contactDesc}</p>
              <a
                href="mailto:info@elev8-edu.com"
                className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(201,168,76,0.35)] hover:bg-gold-400 transition-colors"
              >
                {contactBtn}
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </a>
            </div>
          </div>

          {/* ── Right: mock question card ────────────────────────────────────── */}
          <div className={`flex justify-center ${isRtl ? 'lg:order-1' : ''}`}>
            <div className="relative w-full max-w-md">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/30 to-gold-500/20 blur-2xl" />

              {/* Card */}
              <div className="relative rounded-3xl border border-brand-100 bg-white p-6 shadow-xl">
                {/* Card header */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-brand-100 px-2.5 py-1 text-xs font-bold text-brand-600">
                      IELTS Reading
                    </span>
                    <span className="text-xs text-gray-400">
                      {isRtl ? 'السؤال 3 من 20' : 'Question 3 of 20'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-brand-200 px-2.5 py-1 text-xs font-semibold text-gold-500">
                    <Clock className="h-3 w-3" />
                    14:23
                  </div>
                </div>

                {/* Question text */}
                <p className="mb-5 text-sm leading-relaxed text-gray-700">
                  {isRtl
                    ? 'يشير النص إلى أن اعتماد الطاقة المتجددة يعتمد بشكل أساسي على...'
                    : 'The passage implies that the adoption of renewable energy depends primarily on which of the following factors?'}
                </p>

                {/* Options */}
                <div className="mb-5 space-y-2.5">
                  {[
                    { label: 'A', text: isRtl ? 'مدى توفر الموارد الطبيعية' : 'Availability of natural resources', selected: false },
                    { label: 'B', text: isRtl ? 'الإطار التشريعي والحوافز الحكومية' : 'Legislative frameworks and government incentives', selected: true },
                    { label: 'C', text: isRtl ? 'تقدم التكنولوجيا وحدها' : 'Technological advancement alone', selected: false },
                    { label: 'D', text: isRtl ? 'تفضيلات المستهلكين الأفراد' : 'Individual consumer preferences', selected: false },
                  ].map((opt) => (
                    <div
                      key={opt.label}
                      className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs transition-all ${
                        opt.selected
                          ? 'border-brand-400 bg-brand-50 text-brand-700'
                          : 'border-gray-200 bg-gray-50 text-gray-500'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                          opt.selected
                            ? 'border-brand-400 bg-brand-500 text-white'
                            : 'border-gray-300 text-gray-400'
                        }`}
                      >
                        {opt.label}
                      </span>
                      {opt.text}
                    </div>
                  ))}
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-brand-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                    {isRtl ? 'أسئلة جديدة · لا تكرار أبداً' : 'Fresh questions · Never repeated'}
                  </div>
                  <button className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-3 py-1.5 text-xs font-semibold text-brand-900 hover:opacity-90 transition-colors">
                    {isRtl ? 'التالي' : 'Next'}
                    <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
