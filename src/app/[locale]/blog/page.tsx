import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getBlogPosts } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/imageUrl'
import { getLocaleText, getLocaleSlug, formatDate } from '@/lib/utils'

interface BlogPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'المدونة' : 'Blog',
  }
}

const POSTS_PER_PAGE = 6

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params
  const sp = await searchParams
  const loc = locale as 'en' | 'ar'
  const t = await getTranslations({ locale: loc })

  const page = Math.max(1, parseInt(sp.page ?? '1', 10))
  const { posts, total } = await getBlogPosts({ page, limit: POSTS_PER_PAGE })
  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
              {posts.map((post) => {
                const title = getLocaleText(post.title, loc, 'Untitled')
                const excerpt = getLocaleText(post.excerpt, loc)
                const slug = getLocaleSlug(post.slug, loc)
                const imageUrl = post.image
                  ? urlFor(post.image).width(600).height(340).url()
                  : null

                return (
                  <article
                    key={post._id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover shadow-sm group"
                  >
                    {/* Image */}
                    <Link href={`/blog/${slug}`} locale={loc}>
                      <div className="relative aspect-[16/9] bg-gradient-to-br from-brand-100 to-brand-200 overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-brand-300">
                            <span className="text-5xl font-black opacity-20">EL</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-5">
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.publishedAt, loc, 'PP')}
                          </span>
                        )}
                        {post.author && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${slug}`} locale={loc}>
                        <h2 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
                          {title}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      {excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                          {excerpt}
                        </p>
                      )}

                      <Link
                        href={`/blog/${slug}`}
                        locale={loc}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors"
                      >
                        {t('buttons.readMore')}
                        <ArrowRight className={`h-3.5 w-3.5 ${loc === 'ar' ? 'flip-rtl' : ''}`} />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                {page > 1 && (
                  <Link href={`/blog?page=${page - 1}`} locale={loc}>
                    <Button variant="outline" size="sm">
                      {loc === 'ar' ? 'السابق' : 'Previous'}
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-gray-500 px-4">
                  {t('blog.page', { current: page, total: totalPages })}
                </span>
                {page < totalPages && (
                  <Link href={`/blog?page=${page + 1}`} locale={loc}>
                    <Button variant="outline" size="sm">
                      {loc === 'ar' ? 'التالي' : 'Next'}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {t('blog.noPostsFound')}
            </h3>
            <p className="text-gray-500 text-sm">
              {loc === 'ar' ? 'ترقب مقالاتنا القادمة.' : 'Check back soon for new articles.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
