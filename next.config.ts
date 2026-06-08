import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },

  transpilePackages: ['next-sanity', 'sanity', '@sanity/ui', '@sanity/icons', '@sanity/vision', '@sanity/document-internationalization'],

  // Ensure no edge-runtime-only APIs
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') ?? '',
      ].filter(Boolean),
    },
  },

  async headers() {
    return [
      {
        // Never cache HTML pages — ensures users always get the latest build
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      {
        // Static assets are content-hashed by Next.js — safe to cache forever
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
