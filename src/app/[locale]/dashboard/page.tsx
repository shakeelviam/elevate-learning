import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import {
  GraduationCap,
  Calendar,
  BookOpen,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getRegistrationsByEmail } from '@/sanity/lib/queries'
import { getLocaleText, formatDate } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/imageUrl'
import Image from 'next/image'
import type { RegistrationStatus } from '@/types/sanity'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'لوحة التحكم' : 'Dashboard',
  }
}

function StatusBadge({
  status,
  locale,
}: {
  status: RegistrationStatus
  locale: 'en' | 'ar'
}) {
  const labels: Record<RegistrationStatus, { en: string; ar: string }> = {
    pending: { en: 'Pending', ar: 'في الانتظار' },
    confirmed: { en: 'Confirmed', ar: 'مؤكد' },
    cancelled: { en: 'Cancelled', ar: 'ملغى' },
    paid: { en: 'Paid', ar: 'مدفوع' },
  }

  const variants: Record<RegistrationStatus, 'warning' | 'success' | 'destructive' | 'default'> = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'destructive',
    paid: 'default',
  }

  return (
    <Badge variant={variants[status]}>
      {labels[status][locale]}
    </Badge>
  )
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as 'en' | 'ar'
  const t = await getTranslations({ locale: loc })

  // Get authenticated user
  const user = await currentUser()
  if (!user) {
    redirect(`/${loc}/sign-in`)
  }

  const email = user.emailAddresses[0]?.emailAddress ?? ''
  const name = user.firstName ?? user.username ?? email.split('@')[0]
  const registrations = await getRegistrationsByEmail(email)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                {t('dashboard.welcome', { name })}
              </h1>
              <p className="text-gray-500 mt-1 text-sm">{email}</p>
            </div>
            {user.imageUrl && (
              <Image
                src={user.imageUrl}
                alt={name}
                width={56}
                height={56}
                className="rounded-full ring-2 ring-brand-200 flex-shrink-0"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* LMS Coming Soon banner */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 end-0 h-32 w-32 rounded-full bg-white/10 translate-x-8 -translate-y-8" />
          <div className="relative flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">{t('dashboard.lmsComingSoon')}</h3>
              <p className="text-brand-100 text-sm leading-relaxed">
                {t('dashboard.lmsComingSoonDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Registrations */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {t('dashboard.myRegistrations')}
            </h2>
            <Badge variant="secondary">
              {registrations.length}
            </Badge>
          </div>

          {registrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 mb-4">
                <GraduationCap className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {t('dashboard.noRegistrations')}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {loc === 'ar'
                  ? 'تصفح دوراتنا وابدأ رحلتك التعليمية.'
                  : 'Browse our courses and start your learning journey.'}
              </p>
              <Link href="/courses" locale={loc}>
                <Button>{t('dashboard.browseCourses')}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((reg) => {
                const courseTitle = reg.course
                  ? getLocaleText(reg.course.title, loc, 'Unknown Course')
                  : 'Unknown Course'
                const courseSlug = reg.course?.slug?.en?.current ?? ''
                const courseImageUrl = reg.course?.image
                  ? urlFor(reg.course.image).width(160).height(100).url()
                  : null

                return (
                  <div
                    key={reg._id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Course image */}
                      <div className="relative h-20 w-28 rounded-xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-200 flex-shrink-0 hidden sm:block">
                        {courseImageUrl ? (
                          <Image
                            src={courseImageUrl}
                            alt={courseTitle}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-brand-300" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link
                            href={`/courses/${courseSlug}`}
                            locale={loc}
                            className="text-base font-bold text-gray-900 hover:text-brand-600 transition-colors line-clamp-1"
                          >
                            {courseTitle}
                          </Link>
                          <StatusBadge
                            status={reg.status}
                            locale={loc}
                          />
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
                          {reg.schedule?.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-brand-400" />
                              {formatDate(reg.schedule.startDate, loc, 'PP')}
                            </span>
                          )}
                          {reg.schedule?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-brand-400" />
                              {reg.schedule.location === 'online'
                                ? loc === 'ar' ? 'عبر الإنترنت' : 'Online'
                                : loc === 'ar' ? 'حضوري' : 'In-Person'}
                            </span>
                          )}
                          {reg.submittedAt && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="h-3.5 w-3.5" />
                              {t('dashboard.submittedOn', {
                                date: formatDate(reg.submittedAt, loc, 'PP'),
                              })}
                            </span>
                          )}
                        </div>

                        {reg.message && (
                          <p className="mt-2 text-xs text-gray-400 italic line-clamp-1">
                            "{reg.message}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Browse more */}
        <div className="text-center pt-4">
          <Link href="/courses" locale={loc}>
            <Button variant="outline" size="lg">
              <BookOpen className="h-4 w-4" />
              {t('dashboard.browseCourses')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
