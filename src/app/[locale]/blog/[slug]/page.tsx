import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react'
import { PortableText } from '@/components/shared/PortableText'
import { Button } from '@/components/ui/button'
import { getBlogPostBySlug, getBlogSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/imageUrl'
import {
  getLocaleText,
  formatDate,
  estimateReadingTime,
} from '@/lib/utils'

interface BlogPostProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getBlogSlugs()
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

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  const title = getLocaleText(post.title, locale as 'en' | 'ar')
  const excerpt = getLocaleText(post.excerpt, locale as 'en' | 'ar')
  const imageUrl = post.image
    ? urlFor(post.image).width(1200).height(630).url()
    : undefined
  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: 'article',
      ...(post.publishedAt && { publishedTime: post.publishedAt }),
      ...(post.author && { authors: [post.author] }),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { locale, slug } = await params
  const loc = locale as 'en' | 'ar'
  const t = await getTranslations({ locale: loc })
  const isRtl = loc === 'ar'

  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const title = getLocaleText(post.title, loc, 'Untitled')
  const body = post.body?.[loc] ?? post.body?.en
  const imageUrl = post.image
    ? urlFor(post.image).width(1400).height(600).url()
    : null

  // Estimate reading time from excerpt
  const readingMins = body
    ? estimateReadingTime(JSON.stringify(body))
    : 3

  return (
    <article className="min-h-screen bg-white">
      {/* Cover image */}
      {imageUrl && (
        <div className="relative h-72 sm:h-[460px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link
          href="/blog"
          locale={loc}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors"
        >
          <ArrowLeft className={`h-4 w-4 ${isRtl ? 'flip-rtl' : ''}`} />
          {t('buttons.backToBlog')}
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand-400" />
              {formatDate(post.publishedAt, loc)}
            </span>
          )}
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-brand-400" />
              {post.author}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-brand-400" />
            {t('blog.readingTime', { minutes: readingMins })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
          {title}
        </h1>

        {/* Divider */}
        <div className="h-0.5 bg-gradient-to-r from-brand-400 to-transparent mb-8" />

        {/* Body */}
        {body ? (
          <PortableText value={body} />
        ) : (
          <p className="text-gray-500 italic">
            {loc === 'ar' ? 'المحتوى غير متوفر.' : 'Content not available.'}
          </p>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
          <Link href="/blog" locale={loc}>
            <Button variant="outline" size="sm">
              <ArrowLeft className={`h-4 w-4 ${isRtl ? 'flip-rtl' : ''}`} />
              {t('buttons.backToBlog')}
            </Button>
          </Link>
          <Link href="/courses" locale={loc}>
            <Button size="sm">
              {t('buttons.viewCourses')}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
