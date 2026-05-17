import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
import { Link } from '@/i18n/navigation'
import {
  GraduationCap,
  Calendar,
  BookOpen,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ChevronRight,
  User,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getRegistrationsByEmail } from '@/sanity/lib/queries'
import { getLocaleText, formatDate } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/imageUrl'
import Image from 'next/image'
import type { RegistrationStatus, SanityRegistration } from '@/types/sanity'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'لوحة التحكم' : 'Dashboard',
    robots: { index: false },
  }
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  RegistrationStatus,
  {
    label: { en: string; ar: string }
    variant: 'warning' | 'success' | 'destructive' | 'default'
    icon: typeof CheckCircle2
  }
> = {
  pending: {
    label: { en: 'Pending Review', ar: 'قيد المراجعة' },
    variant: 'warning',
    icon: AlertCircle,
  },
  confirmed: {
    label: { en: 'Confirmed', ar: 'مؤكد' },
    variant: 'success',
    icon: CheckCircle2,
  },
  paid: {
    label: { en: 'Paid & Confirmed', ar: 'مدفوع ومؤكد' },
    variant: 'success',
    icon: CheckCircle2,
  },
  cancelled: {
    label: { en: 'Cancelled', ar: 'ملغى' },
    variant: 'destructive',
    icon: AlertCircle,
  },
}

function StatusBadge({
  status,
  locale,
}: {
  status: RegistrationStatus
  locale: 'en' | 'ar'
}) {
  const cfg = STATUS_CONFIG[status]
  return (
    <Badge variant={cfg.variant} className="gap-1 shrink-0">
      <cfg.icon className="h-3 w-3" />
      {cfg.label[locale]}
    </Badge>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string
  value: number
  icon: typeof GraduationCap
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? 'bg-gradient-to-br from-brand-500 to-brand-700 border-brand-500 text-white'
          : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <p
          className={`text-xs font-semibold uppercase tracking-wide ${
            highlight ? 'text-brand-100' : 'text-gray-400'
          }`}
        >
          {label}
        </p>
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center ${
            highlight ? 'bg-white/20' : 'bg-brand-50'
          }`}
        >
          <Icon
            className={`h-4 w-4 ${highlight ? 'text-white' : 'text-brand-500'}`}
          />
        </div>
      </div>
      <p
        className={`text-3xl font-black ${
          highlight ? 'text-white' : 'text-gray-900'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

// ── Registration card ─────────────────────────────────────────────────────────

function RegistrationCard({
  reg,
  locale,
}: {
  reg: SanityRegistration
  locale: 'en' | 'ar'
}) {
  const isAr = locale === 'ar'
  const courseTitle = reg.course
    ? getLocaleText(reg.course.title, locale, isAr ? 'دورة غير معروفة' : 'Unknown Course')
    : (isAr ? 'دورة غير معروفة' : 'Unknown Course')
  const courseSlug = reg.course?.slug?.en?.current ?? ''
  const courseImageUrl = reg.course?.image
    ? urlFor(reg.course.image).width(224).height(140).url()
    : null
  const isCancelled = reg.status === 'cancelled'

  return (
    <div
      className={`bg-white rounded-2xl border p-5 shadow-sm transition-shadow ${
        isCancelled ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Course thumbnail */}
        <div className="relative h-[4.5rem] w-28 rounded-xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-200 flex-shrink-0 hidden sm:block">
          {courseImageUrl ? (
            <Image
              src={courseImageUrl}
              alt={courseTitle}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-brand-300" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            {courseSlug ? (
              <Link
                href={`/courses/${courseSlug}`}
                locale={locale}
                className="text-base font-bold text-gray-900 hover:text-brand-600 transition-colors line-clamp-1"
              >
                {courseTitle}
              </Link>
            ) : (
              <span className="text-base font-bold text-gray-900 line-clamp-1">
                {courseTitle}
              </span>
            )}
            <StatusBadge status={reg.status} locale={locale} />
          </div>

          {/* Schedule meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-500">
            {reg.schedule?.startDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                {formatDate(reg.schedule.startDate, locale, 'PP')}
              </span>
            )}
            {reg.schedule?.time && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                {reg.schedule.time}
              </span>
            )}
            {reg.schedule?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                {reg.schedule.location === 'online'
                  ? isAr ? 'عبر الإنترنت' : 'Online'
                  : isAr ? 'حضوري' : 'In-Person'}
              </span>
            )}
          </div>

          {/* Submission date */}
          {reg.submittedAt && (
            <p className="mt-2 text-xs text-gray-400">
              {isAr ? 'طُلب في' : 'Requested'}{' '}
              {formatDate(reg.submittedAt, locale, 'PP')}
            </p>
          )}

          {/* Student note */}
          {reg.message && (
            <p className="mt-2 text-xs text-gray-400 italic line-clamp-1">
              "{reg.message}"
            </p>
          )}
        </div>
      </div>

      {/* Pending guidance */}
      {reg.status === 'pending' && (
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>
            {isAr
              ? 'سيتواصل معك فريقنا خلال 24 ساعة لتأكيد تسجيلك وتفاصيل الدفع.'
              : 'Our team will contact you within 24 hours to confirm your spot and share payment details.'}
          </span>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as 'en' | 'ar'
  const isAr = loc === 'ar'
  const t = await getTranslations({ locale: loc })

  // Auth guard — reads JWT from headers, no network call to Clerk API
  const { userId } = await auth()
  if (!userId) redirect(`/${loc}/sign-in`)

  // Fetch user profile — never redirect on failure; userId alone proves authentication
  let user = null
  try {
    user = await currentUser()
  } catch (err) {
    console.error('[Dashboard] currentUser() failed:', err)
  }

  const email = user?.emailAddresses[0]?.emailAddress ?? ''
  const name = user
    ? ([user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || email.split('@')[0] || 'Student')
    : 'Student'

  const registrations = email ? await getRegistrationsByEmail(email) : []

  const active = registrations.filter((r) => r.status !== 'cancelled')
  const cancelled = registrations.filter((r) => r.status === 'cancelled')
  const pending = registrations.filter((r) => r.status === 'pending')
  const confirmed = registrations.filter((r) => r.status === 'confirmed' || r.status === 'paid')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Profile header ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={name}
                  width={56}
                  height={56}
                  unoptimized
                  className="rounded-full ring-2 ring-brand-200 shrink-0"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0">
                  <User className="h-7 w-7 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  {t('dashboard.welcome', { name })}
                </h1>
                <p className="text-gray-400 text-sm mt-0.5" dir="ltr">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── LMS coming soon ────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 end-0 h-40 w-40 rounded-full bg-white/10 translate-x-10 -translate-y-10 pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold mb-1">{t('dashboard.lmsComingSoon')}</h3>
              <p className="text-brand-100 text-sm leading-relaxed">
                {t('dashboard.lmsComingSoonDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            label={isAr ? 'إجمالي الطلبات' : 'Total'}
            value={registrations.length}
            icon={GraduationCap}
            highlight
          />
          <StatCard
            label={isAr ? 'مؤكدة' : 'Confirmed'}
            value={confirmed.length}
            icon={CheckCircle2}
          />
          <StatCard
            label={isAr ? 'قيد المراجعة' : 'Pending'}
            value={pending.length}
            icon={AlertCircle}
          />
        </div>

        {/* ── Active enrollments ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {isAr ? 'طلبات التسجيل النشطة' : 'Active Enrollments'}
            </h2>
            {active.length > 0 && (
              <Badge variant="secondary">{active.length}</Badge>
            )}
          </div>

          {active.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
                <GraduationCap className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                {t('dashboard.noRegistrations')}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {isAr
                  ? 'تصفح دوراتنا وابدأ رحلتك التعليمية.'
                  : 'Browse our courses and start your learning journey.'}
              </p>
              <Link href="/courses" locale={loc}>
                <Button>
                  <BookOpen className="h-4 w-4" />
                  {t('dashboard.browseCourses')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {active.map((reg) => (
                <RegistrationCard key={reg._id} reg={reg} locale={loc} />
              ))}
            </div>
          )}
        </section>

        {/* ── Cancelled (collapsed, shown only if any) ───────────────────── */}
        {cancelled.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-base font-semibold text-gray-500">
                {isAr ? 'الطلبات الملغاة' : 'Cancelled'}
              </h2>
              <Badge variant="secondary">{cancelled.length}</Badge>
            </div>
            <div className="space-y-3">
              {cancelled.map((reg) => (
                <RegistrationCard key={reg._id} reg={reg} locale={loc} />
              ))}
            </div>
          </section>
        )}

        {/* ── Bottom actions ─────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <Link href="/courses" locale={loc}>
            <div className="group flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {isAr ? 'تصفح الدورات' : 'Browse Courses'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isAr ? 'اكتشف برامجنا' : 'Discover our programs'}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-brand-400 transition-colors" />
            </div>
          </Link>

          <Link href="/contact" locale={loc}>
            <div className="group flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {isAr ? 'تواصل معنا' : 'Contact Support'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isAr ? 'نرد خلال يوم عمل' : 'We reply within 1 business day'}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-brand-400 transition-colors" />
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}
