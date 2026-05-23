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
} from 'lucide-react'

interface ElevateAISectionProps {
  locale: 'en' | 'ar'
}

const FEATURES_EN = [
  { icon: RefreshCw,   label: 'Fresh questions every session — never repeated' },
  { icon: BrainCircuit, label: 'Adapts in real-time to your weak areas' },
  { icon: Zap,         label: 'Instant explanations for every answer' },
  { icon: ChartBar,    label: 'Visual analytics track your progress over time' },
]

const FEATURES_AR = [
  { icon: RefreshCw,    label: 'أسئلة جديدة في كل جلسة — لا تكرار أبداً' },
  { icon: BrainCircuit, label: 'يتكيف تلقائياً مع نقاط ضعفك' },
  { icon: Zap,          label: 'شرح فوري لكل إجابة' },
  { icon: ChartBar,     label: 'تحليلات بصرية لتتبع تقدمك' },
]

const EXAM_BADGES = ['IELTS', 'TOEFL', 'OET', 'GMAT', 'SAT', 'PTE']

export function ElevateAISection({ locale }: ElevateAISectionProps) {
  const isRtl = locale === 'ar'
  const features = isRtl ? FEATURES_AR : FEATURES_EN

  return (
    <section
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative overflow-hidden bg-brand-950 py-24"
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
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-sm font-semibold text-gold-300">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              {isRtl ? 'جديد — مختبر الاختبارات التكيّفية' : 'NEW — Adaptive Practice Tests'}
            </div>

            <h2 className="mb-4 text-4xl font-black leading-[1.1] text-white sm:text-5xl">
              {isRtl ? (
                <>
                  <span className="text-gold-400">مختبر الاختبارات:</span>
                  <br />
                  تدريب تكيّفي لا نهاية له
                </>
              ) : (
                <>
                  <span className="text-gold-400">The Test Lab:</span>
                  <br />
                  Infinite Adaptive Practice
                </>
              )}
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-brand-200">
              {isRtl
                ? 'محرك اختبارات متطور مصمم خصيصاً لـ IELTS وTOEFL وسائر الامتحانات الدولية. أسئلة جديدة كل مرة، مستوحاة من المواد الأصلية.'
                : 'A powerful test engine built for IELTS, TOEFL, and every major exam. New, copyright-safe questions every session — drawn from real study materials.'}
            </p>

            {/* Feature list */}
            <ul className="mb-10 space-y-3">
              {features.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-brand-100">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-800">
                    <Icon className="h-3.5 w-3.5 text-brand-300" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            {/* Exam type badges */}
            <div className="mb-10 flex flex-wrap gap-2">
              {EXAM_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="rounded-lg border border-brand-700 bg-brand-900 px-3 py-1 text-xs font-bold tracking-widest text-brand-300"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Contact prompt */}
            <div className="rounded-2xl border border-brand-700 bg-brand-900/60 px-6 py-5">
              <p className="mb-3 text-sm font-semibold text-white">
                {isRtl ? 'هل أنت مهتم بالوصول إلى مختبر الاختبارات؟' : 'Interested in Test Lab access?'}
              </p>
              <p className="mb-4 text-sm leading-relaxed text-brand-300">
                {isRtl
                  ? 'يتوفر مختبر الاختبارات للطلاب المسجلين فقط. تواصل معنا للحصول على بياناتك وبدء التدريب.'
                  : 'Test Lab is available to enrolled students only. Reach out to us and we\'ll get you set up with your credentials.'}
              </p>
              <a
                href="mailto:info@elevatelearning.ae"
                className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:bg-gold-400 transition-colors"
              >
                {isRtl ? 'تواصل معنا' : 'Contact Us for Access'}
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
              <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-sm">
                {/* Card header */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-brand-700 px-2.5 py-1 text-xs font-bold text-brand-200">
                      IELTS Reading
                    </span>
                    <span className="text-xs text-brand-400">
                      {isRtl ? 'السؤال 3 من 20' : 'Question 3 of 20'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-brand-700 px-2.5 py-1 text-xs font-semibold text-gold-400">
                    <Clock className="h-3 w-3" />
                    14:23
                  </div>
                </div>

                {/* Question text */}
                <p className="mb-5 text-sm leading-relaxed text-white/90">
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
                          ? 'border-brand-400 bg-brand-500/20 text-white'
                          : 'border-white/10 bg-white/[0.04] text-white/60'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                          opt.selected
                            ? 'border-brand-400 bg-brand-500 text-white'
                            : 'border-white/20 text-white/40'
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
                  <div className="flex items-center gap-1.5 text-xs text-brand-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                    {isRtl ? 'أسئلة جديدة · لا تكرار أبداً' : 'Fresh questions · Never repeated'}
                  </div>
                  <button className="flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-500 transition-colors">
                    {isRtl ? 'التالي' : 'Next'}
                    <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Floating badge below card */}
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-700 bg-brand-900/80 px-4 py-1.5 text-xs text-brand-300 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  {isRtl
                    ? 'يعمل 100% على جهازك — خصوصيتك محفوظة'
                    : 'Runs 100% on your hardware — your data stays local'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
