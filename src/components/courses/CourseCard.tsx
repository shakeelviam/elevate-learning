import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Clock, TrendingUp, BookOpen, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SanityCourseSummary } from '@/types/sanity'
import {
  getLocaleText,
  getLocaleSlug,
  getCategoryLabel,
  getLevelLabel,
} from '@/lib/utils'
import { urlFor } from '@/sanity/lib/imageUrl'

interface CourseCardProps {
  course: SanityCourseSummary
  locale: 'en' | 'ar'
  viewDetailsLabel?: string
}

export function CourseCard({ course, locale, viewDetailsLabel }: CourseCardProps) {
  const title = getLocaleText(course.title, locale, 'Untitled Course')
  const slug = getLocaleSlug(course.slug, locale)
  const categoryLabel = getCategoryLabel(course.category, locale)
  const levelLabel = getLevelLabel(course.level, locale)
  const imageUrl = course.image
    ? urlFor(course.image).width(600).height(340).url()
    : null

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover shadow-sm">
      {/* Image */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-brand-100 to-brand-200 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-brand-300" />
          </div>
        )}
        {/* Category badge overlay */}
        <div className="absolute top-3 start-3">
          <Badge variant={course.category === 'language' ? 'language' : 'exam'}>
            {categoryLabel}
          </Badge>
        </div>
        {course.featured && (
          <div className="absolute top-3 end-3">
            <Badge variant="warning">
              <Star className="h-3 w-3 me-1" />
              {locale === 'ar' ? 'مميز' : 'Featured'}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <TrendingUp className="h-3 w-3" />
            {levelLabel}
          </span>
          {course.duration && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {course.duration}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
          {title}
        </h3>

        {/* Instructor */}
        {course.instructor?.name && (
          <p className="text-sm text-gray-500 mb-3">
            {locale === 'ar' ? 'المدرب: ' : 'Instructor: '}
            <span className="font-medium text-gray-700">{course.instructor.name}</span>
          </p>
        )}

        {/* Upcoming schedule indicator */}
        {course.upcomingSchedule && (
          <p className="text-xs text-green-600 font-medium mb-3 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
            {locale === 'ar' ? 'يبدأ قريباً' : 'Starting soon'}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-50">
          <Link href={`/courses/${slug}`} locale={locale}>
            <Button size="sm" variant="outline">
              {viewDetailsLabel ?? (locale === 'ar' ? 'عرض التفاصيل' : 'View Details')}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
