import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
} from 'lucide-react'
import type { SanitySiteSettings } from '@/types/sanity'
import { getLocaleText } from '@/lib/utils'

interface FooterProps {
  locale: 'en' | 'ar'
  settings: SanitySiteSettings | null
}

export function Footer({ locale, settings }: FooterProps) {
  const t = useTranslations()
  const year = new Date().getFullYear()

  const siteName = getLocaleText(settings?.siteName, locale)
  const footerDesc = settings?.footerDescription?.[locale]
  const address = settings?.contactInfo?.address?.[locale]
  const phone = settings?.contactInfo?.phone
  const email = settings?.contactInfo?.email
  const social = settings?.socialLinks ?? {}

  const navLinks = locale === 'ar'
    ? [
        { label: 'الرئيسية', href: '/' },
        { label: 'الدورات', href: '/courses' },
        { label: 'من نحن', href: '/about' },
        { label: 'الأسئلة الشائعة', href: '/faq' },
        { label: 'تواصل معنا', href: '/contact' },
        { label: 'الخصوصية', href: '/privacy' },
        { label: 'الشروط والأحكام', href: '/terms' },
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Courses', href: '/courses' },
        { label: 'About', href: '/about' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ]

  const hasSocial = !!(social.instagram || social.twitter || social.facebook || social.linkedin || social.youtube)

  return (
    <footer className="bg-brand-50 border-t border-brand-100 text-gray-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="inline-flex flex-col items-start mb-4">
              <Link href="/" locale={locale} className="inline-flex">
                <div className="rounded-xl bg-white px-3 py-2">
                  <Image
                    src="/elev8.svg"
                    alt={siteName ?? 'Elev8'}
                    width={120}
                    height={44}
                    className="object-contain"
                  />
                </div>
              </Link>
              {locale === 'ar' && (
                <span className="mt-2 text-[11px] font-semibold tracking-wide text-gray-300">
                  مركز إيليفيت للتعليم
                </span>
              )}
            </div>
            {footerDesc && (
              <p className="text-sm leading-relaxed text-gray-500 mb-6">{footerDesc}</p>
            )}
            {hasSocial && (
              <div className="flex gap-2">
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-brand-100 hover:bg-brand-200 text-brand-600 transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-brand-100 hover:bg-brand-200 text-brand-600 transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-brand-100 hover:bg-brand-200 text-brand-600 transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-brand-100 hover:bg-brand-200 text-brand-600 transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {social.youtube && (
                  <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-brand-100 hover:bg-brand-200 text-brand-600 transition-colors">
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-brand-700 font-semibold mb-4 text-sm uppercase tracking-wider">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    locale={locale}
                    className="text-sm text-gray-500 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs — links to courses page */}
          <div>
            <h3 className="text-brand-700 font-semibold mb-4 text-sm uppercase tracking-wider">
              {locale === 'ar' ? 'البرامج' : 'Programs'}
            </h3>
            <Link
              href="/courses"
              locale={locale}
              className="text-sm text-gray-500 hover:text-gold-500 transition-colors"
            >
              {locale === 'ar' ? 'استعرض جميع الدورات' : 'Browse All Courses'}
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-brand-700 font-semibold mb-4 text-sm uppercase tracking-wider">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact'}
            </h3>
            <ul className="space-y-3">
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-500">{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gold-500 flex-shrink-0" />
                  <a href={`tel:${phone}`} className="text-sm text-gray-500 hover:text-gold-500 transition-colors">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gold-500 flex-shrink-0" />
                  <a href={`mailto:${email}`} className="text-sm text-gray-500 hover:text-gold-500 transition-colors">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            {t('common.copyright', { year })}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" locale={locale} className="hover:text-brand-600 transition-colors">
              {t('common.privacyPolicy')}
            </Link>
            <Link href="/terms" locale={locale} className="hover:text-brand-600 transition-colors">
              {t('common.terms')}
            </Link>
            <span>{t('common.madeIn')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
