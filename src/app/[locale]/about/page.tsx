import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Award, Users, BookOpen, Globe, Linkedin, Star, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { PortableText } from '@/components/shared/PortableText'
import { Button } from '@/components/ui/button'
import { getSiteSettings, getTeamMembers } from '@/sanity/lib/queries'
import { getLocaleText } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/imageUrl'

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
  const [settings, team] = await Promise.all([
    getSiteSettings(),
    getTeamMembers(),
  ])

  const aboutBody = settings?.aboutText?.[loc] ?? settings?.aboutText?.en

  const ICON_MAP: Record<string, LucideIcon> = { Award, Users, BookOpen, Globe, Star }

  const DEFAULT_VALUES = loc === 'ar'
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

  const values = settings?.ourValues && settings.ourValues.length > 0
    ? settings.ourValues.map((v) => ({
        icon: ICON_MAP[v.iconName ?? ''] ?? Star,
        title: (loc === 'ar' ? v.titleAr : v.titleEn) ?? '',
        desc: (loc === 'ar' ? v.descAr : v.descEn) ?? '',
      }))
    : DEFAULT_VALUES

  const aboutHeroTitle = loc === 'ar'
    ? (settings?.aboutHero?.titleAr ?? t('about.title'))
    : (settings?.aboutHero?.titleEn ?? t('about.title'))
  const aboutHeroSubtitle = loc === 'ar'
    ? (settings?.aboutHero?.subtitleAr ?? t('about.subtitle'))
    : (settings?.aboutHero?.subtitleEn ?? t('about.subtitle'))

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Header band */}
      <div className="bg-brand-600 py-8 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ color: 'var(--gold)' }}>
            {aboutHeroTitle}
          </h1>
          <p className="text-lg" style={{ color: 'var(--gold)' }}>{aboutHeroSubtitle}</p>
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
                <p>تأسس مركز إيليفيت للتعليم عام 2012 في مدينة الكويت بهدف تقديم أرقى برامج تعلم اللغات والتحضير للامتحانات في المنطقة.</p>
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
      <div className="bg-white py-16">
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

      {/* Team */}
      {team.length > 0 && (
        <div className="py-16 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                {loc === 'ar' ? 'فريقنا' : 'Meet Our Team'}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                {loc === 'ar'
                  ? 'الأشخاص الذين يجعلون مركز إيليفيت للتعليم استثنائياً'
                  : 'The people who make Elevate Learning exceptional'}
              </p>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-8 mx-auto ${
                team.length <= 2 ? 'max-w-3xl' : 'lg:grid-cols-3'
              }`}
            >
              {team.map((member) => {
                const role = loc === 'ar' ? member.role?.ar : member.role?.en
                const bio = loc === 'ar' ? member.bio?.ar : member.bio?.en
                const photoUrl = member.photo
                  ? urlFor(member.photo).width(400).height(400).url()
                  : null

                return (
                  <div
                    key={member._id}
                    className="group text-center"
                  >
                    {/* Photo */}
                    <div className="relative mx-auto mb-5 h-40 w-40 overflow-hidden rounded-full ring-4 ring-brand-100 group-hover:ring-brand-300 transition-all">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200">
                          <span className="text-4xl font-black text-brand-500">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                    {role && (
                      <p className="text-sm font-medium text-brand-600 mt-0.5">{role}</p>
                    )}
                    {bio && (
                      <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                        {bio}
                      </p>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-700 transition-colors"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="py-16 text-center bg-brand-50 border-t border-brand-100">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            {loc === 'ar' ? 'انضم إلى عائلة مركز إيليفيت' : 'Join the Elevate Family'}
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
