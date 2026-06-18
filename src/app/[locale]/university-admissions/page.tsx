export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'القبول الجامعي' : 'University Admissions',
  }
}

export default async function UniversityAdmissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as 'en' | 'ar'
  const isRtl = loc === 'ar'

  return (
    <section className="py-24" style={{ background: 'var(--cream)' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h1
          className="text-4xl sm:text-5xl font-bold mb-6"
          style={{ color: 'var(--forest)', letterSpacing: '-0.02em' }}
        >
          {isRtl ? 'القبول الجامعي' : 'University Admissions'}
        </h1>
        <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--muted)' }}>
          {isRtl
            ? 'تفاصيل خدمات القبول الجامعي قادمة قريباً. تواصل معنا لمعرفة المزيد.'
            : 'Details about our university admissions services are coming soon. Reach out to us to learn more.'}
        </p>
        <Link
          href="/contact"
          locale={loc}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--forest)', color: 'var(--white)' }}
        >
          {isRtl ? 'تواصل معنا' : 'Contact Us'}
          <ArrowRight className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    </section>
  )
}
