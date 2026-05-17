import { MetadataRoute } from 'next'

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://elevate-learning.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/',
          '/api/',
          '/en/dashboard/',
          '/ar/dashboard/',
          '/en/sign-in/',
          '/ar/sign-in/',
          '/en/sign-up/',
          '/ar/sign-up/',
        ],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  }
}
