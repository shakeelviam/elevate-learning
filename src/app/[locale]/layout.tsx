import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { ClerkProvider } from '@clerk/nextjs'
import { routing } from '@/i18n/routing'
import { getSiteSettings } from '@/sanity/lib/queries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { Toaster } from '@/components/ui/toaster'
import '../globals.css'

// Load fonts — using Google Fonts via CSS @import in globals.css
// so they work on VPS without next/font/google network dependency issues

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings()
  const siteName =
    settings?.siteName?.[locale as 'en' | 'ar'] ?? 'Elevate Learning'

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    ),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description:
      locale === 'ar'
        ? 'مركز إيليفيت للتعليم — التميز في تعليم اللغات والتحضير للامتحانات في الكويت'
        : 'Elevate Learning — Excellence in language education and exam preparation in Kuwait',
    alternates: {
      languages: {
        en: `${process.env.NEXT_PUBLIC_APP_URL}/en`,
        ar: `${process.env.NEXT_PUBLIC_APP_URL}/ar`,
      },
    },
    openGraph: {
      siteName,
      locale: locale === 'ar' ? 'ar_KW' : 'en_US',
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound()
  }

  const messages = await getMessages()
  const settings = await getSiteSettings()

  const isRtl = locale === 'ar'

  return (
    <html
      lang={locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={isRtl ? 'font-arabic' : ''}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Sora:wght@400;600;700;800&family=Noto+Kufi+Arabic:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <ClerkProvider
          signInUrl={`/${locale}/sign-in`}
          signUpUrl={`/${locale}/sign-up`}
          signInFallbackRedirectUrl={`/${locale}/dashboard`}
          signUpFallbackRedirectUrl={`/${locale}/dashboard`}
        >
          <NextIntlClientProvider messages={messages}>
            <div className="flex min-h-screen flex-col">
              <Header locale={locale as 'en' | 'ar'} settings={settings} />
              <main className="flex-1">{children}</main>
              <Footer locale={locale as 'en' | 'ar'} settings={settings} />
            </div>
            <WhatsAppButton
              locale={locale as 'en' | 'ar'}
              whatsapp={settings?.contactInfo?.whatsapp}
            />
            <Toaster />
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
