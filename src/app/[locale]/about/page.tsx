import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Award, Users, BookOpen, Globe } from 'lucide-react'
import { PortableText } from '@/components/shared/PortableText'
import { Button } from '@/components/ui/button'
import { getSiteSettings } from '@/sanity/lib/queries'
import { getLocaleText } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'من نحن' : 'About',
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as 'en' | 'ar'
  const t = await getTranslations({ locale: loc })
  const settings = await getSiteSettings()

  const aboutBody = settings?.aboutText?.[loc] ?? settings?.aboutText?.en

  const values = loc === 'ar'
    ? [
        { icon: Award, title: 'التميز', desc: 'نلتزم بأعلى معايير التعليم اللغوي.' },
        { icon: Users, title: 'المجتمع', desc: 'بيئة تعليمية داعمة ومتنوعة.' },
        { icon: BookOpen, title: 'المنهجية', desc: 'مناهج مصممة بعناية مع مدربين خبراء.' },
        { icon: Globe, title: 'الانفتاح', desc: 'نربط الطلاب بالعالم من خلال اللغة.' },
      ]
    : [
        { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards in language education.' },
        { icon: Users, title: 'Community', desc: 'A supportive, diverse learning environment where everyone belongs.' },
        { icon: BookOpen, title: 'Methodology', desc: 'Carefully designed curricula paired with expert instructors.' },
        { icon: Globe, title: 'Openness', desc: 'We connect students to the world through the power of language.' },
      ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-700 to-brand-900 py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-brand-200">{t('about.subtitle')}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {aboutBody ? (
          <PortableText value={aboutBody} className="text-lg" />
        ) : (
          /* Fallback content if Sanity not configured yet */
          <div className="prose-elevate text-lg space-y-4">
            {loc === 'ar' ? (
              <>
                <p>تأسس معهد إليفيت ليرنينج عام 2012 في مدينة الكويت بهدف تقديم أرقى برامج تعلم اللغات والتحضير للامتحانات في المنطقة.</p>
                <p>بدأنا بدورتين فقط وفريق من ثلاثة مدربين، وتطورنا اليوم لنصبح المعهد الأول في الكويت بأكثر من 40 دورة و8000 خريج من 30 جنسية مختلفة.</p>
                <p>نؤمن بأن اللغة هي جسر يربط الثقافات والمجتمعات. مهمتنا هي تزويد كل طالب بالمهارات والثقة اللازمة للنجاح في عالم متعدد اللغات.</p>
              </>
            ) : (
              <>
                <p>Elevate Learning was founded in 2012 in Kuwait City with a single mission: to provide the region's finest language learning and exam preparation programs.</p>
                <p>We started with just two courses and a team of three instructors. Today, we are Kuwait's leading institute with over 40 courses, 8,000+ graduates from 30+ nationalities.</p>
                <p>We believe language is the bridge between cultures and communities. Our mission is to equip every student with the skills and confidence to thrive in a multilingual world.</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
            {loc === 'ar' ? 'قيمنا' : 'Our Values'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 mb-4">
                  <Icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 text-center bg-white">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            {loc === 'ar' ? 'انضم إلى عائلة إليفيت' : 'Join the Elevate Family'}
          </h2>
          <p className="text-gray-500 mb-6">
            {loc === 'ar'
              ? 'ابدأ رحلتك اللغوية اليوم مع مدربينا الخبراء.'
              : 'Start your language journey today with our expert instructors.'}
          </p>
          <Link href="/courses" locale={loc}>
            <Button size="lg">
              {t('buttons.viewCourses')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
