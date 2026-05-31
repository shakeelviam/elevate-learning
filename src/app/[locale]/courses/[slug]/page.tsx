import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const dynamicParams = true
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Wifi,
  Building2,
  MessageSquare,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PortableText } from '@/components/shared/PortableText'
import { EnrollButton } from '@/components/courses/EnrollButton'
import { getCourseBySlug, getCourseSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/imageUrl'
import {
  getLocaleText,
  getCategoryLabel,
  getLevelLabel,
  getLocationLabel,
  formatDate,
  formatPrice,
} from '@/lib/utils'

interface CourseDetailProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getCourseSlugs()
  const params: { locale: string; slug: string }[] = []
  for (const item of slugs) {
    if (item.slug?.en?.current) {
      params.push({ locale: 'en', slug: item.slug.en.current })
      params.push({ locale: 'ar', slug: item.slug.en.current })
    }
    if (item.slug?.ar?.current) {
      params.push({ locale: 'ar', slug: item.slug.ar.current })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: CourseDetailProps): Promise<Metadata> {
  const { locale, slug } = await params
  const course = await getCourseBySlug(slug, locale as 'en' | 'ar')
  if (!course) return { title: 'Course Not Found' }

  const title = getLocaleText(course.title, locale as 'en' | 'ar')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const imageUrl = course.image
    ? urlFor(course.image).width(1200).height(630).url()
    : undefined

  return {
    title,
    openGraph: {
      title,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
    alternates: {
      languages: {
        en: `${appUrl}/en/courses/${course.slug?.en?.current ?? slug}`,
        ar: `${appUrl}/ar/courses/${course.slug?.ar?.current ?? slug}`,
      },
    },
  }
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const { locale, slug } = await params
  const loc = locale as 'en' | 'ar'
  const t = await getTranslations({ locale: loc })
  const isRtl = loc === 'ar'

  const course = await getCourseBySlug(slug, loc)
  if (!course) notFound()

  const title = getLocaleText(course.title, loc, 'Untitled Course')
  const description = course.description?.[loc] ?? course.description?.en
  const categoryLabel = getCategoryLabel(course.category, loc)
  const levelLabel = getLevelLabel(course.level, loc)
  const imageUrl = course.image
    ? urlFor(course.image).width(1400).height(700).url()
    : null
  const instructorPhotoUrl = course.instructor?.photo
    ? urlFor(course.instructor.photo).width(200).height(200).url()
    : null
  const price = course.price != null ? formatPrice(course.price, loc) : null

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // JSON-LD Course schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description: '',
    provider: {
      '@type': 'Organization',
      name: 'Elevate Learning',
      sameAs: appUrl,
    },
    ...(course.price != null && {
      offers: {
        '@type': 'Offer',
        price: course.price,
        priceCurrency: 'KWD',
      },
    }),
    ...(course.instructor?.name && {
      instructor: {
        '@type': 'Person',
        name: course.instructor.name,
      },
    }),
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero image */}
        <div className="relative h-72 sm:h-96 bg-gradient-to-br from-brand-700 to-brand-900 overflow-hidden">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover opacity-60"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/40 to-transparent" />

          {/* Back link */}
          <div className="absolute top-6 inset-x-0">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                href="/courses"
                locale={loc}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft className={`h-4 w-4 ${isRtl ? 'flip-rtl' : ''}`} />
                {t('buttons.backToCourses')}
              </Link>
            </div>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 inset-x-0 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant={course.category === 'language' ? 'language' : 'exam'}>
                  {categoryLabel}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {levelLabel}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                {title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Quick info bar */}
              <div className="flex flex-wrap gap-6 py-5 border-y border-gray-100 text-sm text-gray-600">
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-500" />
                    {course.duration}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand-500" />
                  {levelLabel}
                </div>
                {price && (
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    {price}
                  </div>
                )}
              </div>

              {/* Description */}
              {description && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('courses.description')}
                  </h2>
                  <PortableText value={description} />
                </section>
              )}

              {/* Syllabus */}
              {course.syllabus && course.syllabus.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('courses.syllabus')}
                  </h2>
                  <Accordion type="multiple" className="space-y-0">
                    {course.syllabus.map((module, i) => {
                      const modTitle =
                        getLocaleText(module.moduleTitle, loc) ||
                        `Module ${i + 1}`
                      return (
                        <AccordionItem key={i} value={`module-${i}`}>
                          <AccordionTrigger>
                            <span className="flex items-center gap-3">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex-shrink-0">
                                {i + 1}
                              </span>
                              {modTitle}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            {module.lessons && module.lessons.length > 0 && (
                              <ul className="space-y-2">
                                {module.lessons.map((lesson, j) => (
                                  <li
                                    key={j}
                                    className="flex items-start gap-2 text-gray-600"
                                  >
                                    <BookOpen className="h-4 w-4 text-brand-400 mt-0.5 flex-shrink-0" />
                                    {getLocaleText(lesson, loc) || `Lesson ${j + 1}`}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </section>
              )}

              {/* Instructor */}
              {course.instructor && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('courses.instructor')}
                  </h2>
                  <div className="flex items-start gap-5 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                    {instructorPhotoUrl ? (
                      <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={instructorPhotoUrl}
                          alt={course.instructor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
                        {course.instructor.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {course.instructor.name}
                      </h3>
                      {course.instructor.specialties && course.instructor.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {course.instructor.specialties.map((s) => (
                            <Badge key={s} variant="secondary" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {course.instructor.bio && (
                        <PortableText
                          value={
                            course.instructor.bio[loc] ??
                            course.instructor.bio.en
                          }
                          className="text-sm"
                        />
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Enroll card */}
              <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-lg p-6 space-y-5">
                {price && (
                  <div>
                    <p className="text-3xl font-black text-gray-900">{price}</p>
                    <p className="text-sm text-gray-400">{t('courses.perCourse')}</p>
                  </div>
                )}

                <EnrollButton
                  locale={loc}
                  courseId={course._id}
                  courseName={title}
                  schedules={course.schedules}
                  label={t('buttons.enrollNow')}
                  size="lg"
                />

                {/* Contact alternative */}
                <Link
                  href="/contact"
                  locale={loc}
                  className="w-full"
                >
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {loc === 'ar' ? 'تواصل معنا' : 'Ask a Question'}
                  </Button>
                </Link>

                {/* Course meta */}
                <div className="pt-4 border-t border-gray-100 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>{t('courses.level')}</span>
                    <span className="font-medium text-gray-900">{levelLabel}</span>
                  </div>
                  {course.duration && (
                    <div className="flex items-center justify-between text-gray-600">
                      <span>{t('courses.duration')}</span>
                      <span className="font-medium text-gray-900">{course.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-gray-600">
                    <span>{t('courses.category')}</span>
                    <span className="font-medium text-gray-900">{categoryLabel}</span>
                  </div>
                </div>
              </div>

              {/* Schedules */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t('courses.upcomingSchedules')}
                </h3>

                {course.schedules && course.schedules.length > 0 ? (
                  <div className="space-y-3">
                    {course.schedules.map((schedule) => (
                      <div
                        key={schedule._id}
                        className="p-4 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <div className="flex items-start gap-2.5">
                          {schedule.location === 'online' ? (
                            <Wifi className="h-4 w-4 text-brand-500 mt-0.5" />
                          ) : (
                            <Building2 className="h-4 w-4 text-brand-500 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {getLocationLabel(schedule.location, loc)}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(schedule.startDate, loc)}
                              {schedule.endDate &&
                                ` — ${formatDate(schedule.endDate, loc)}`}
                            </p>
                            {schedule.time && (
                              <p className="text-xs text-gray-500">{schedule.time}</p>
                            )}
                            {schedule.days && schedule.days.length > 0 && (
                              <p className="text-xs text-gray-500">
                                {schedule.days.join(', ')}
                              </p>
                            )}
                            {schedule.capacity != null && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {Math.max(
                                  0,
                                  schedule.capacity - (schedule.enrolledCount ?? 0)
                                )}{' '}
                                {loc === 'ar' ? 'مقاعد متاحة' : 'seats left'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">{t('courses.noSchedules')}</p>
                    <Link href="/contact" locale={loc}>
                      <Button variant="link" size="sm" className="mt-1">
                        {loc === 'ar' ? 'تواصل معنا' : 'Contact us'}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
