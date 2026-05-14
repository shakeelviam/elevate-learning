import { MetadataRoute } from 'next'
import { getCourseSlugs, getBlogSlugs } from '@/sanity/lib/queries'

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const locales = ['en', 'ar'] as const

function url(path: string): string {
  return `${appUrl}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  const staticPaths = ['', '/courses', '/blog', '/about', '/contact', '/faq']
  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: url(`/${locale}${path}`),
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: url(`/en${path}`),
            ar: url(`/ar${path}`),
          },
        },
      })
    }
  }

  // Dynamic course pages
  try {
    const courseSlugs = await getCourseSlugs()
    for (const item of courseSlugs) {
      const enSlug = item.slug?.en?.current
      const arSlug = item.slug?.ar?.current

      if (enSlug) {
        entries.push({
          url: url(`/en/courses/${enSlug}`),
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: {
              en: url(`/en/courses/${enSlug}`),
              ar: url(`/ar/courses/${arSlug ?? enSlug}`),
            },
          },
        })
      }
    }
  } catch (e) {
    console.warn('[sitemap] Could not fetch course slugs:', e)
  }

  // Dynamic blog pages
  try {
    const blogSlugs = await getBlogSlugs()
    for (const item of blogSlugs) {
      const enSlug = item.slug?.en?.current
      const arSlug = item.slug?.ar?.current

      if (enSlug) {
        entries.push({
          url: url(`/en/blog/${enSlug}`),
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: {
            languages: {
              en: url(`/en/blog/${enSlug}`),
              ar: url(`/ar/blog/${arSlug ?? enSlug}`),
            },
          },
        })
      }
    }
  } catch (e) {
    console.warn('[sitemap] Could not fetch blog slugs:', e)
  }

  return entries
}
