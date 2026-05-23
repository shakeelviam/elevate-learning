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

  const siteName = getLocaleText(settings?.siteName, locale) || 'Elevate Learning'
  const address = settings?.contactInfo?.address?.[locale] ?? 
    (locale === 'ar' ? 'مدينة الكويت، الكويت' : 'Kuwait City, Kuwait')
  const phone = settings?.contactInfo?.phone ?? '+965 2222 3333'
  const email = settings?.contactInfo?.email ?? 'info@elevate-learning.com'
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

  return (
    <footer className="bg-brand-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" locale={locale} className="inline-flex mb-4">
              <div className="rounded-xl bg-white px-3 py-2">
                <Image
                  src="/elev8.svg"
                  alt={siteName}
                  width={120}
                  height={44}
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              {locale === 'ar'
                ? 'معهدك الرائد لتعلم اللغات والتحضير للامتحانات في الكويت.'
                : "Kuwait's leading institute for language learning and exam preparation."}
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {/* Default socials if none set */}
              {!social.instagram && !social.twitter && !social.facebook && (
                <>
                  <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"><Instagram className="h-4 w-4" /></a>
                  <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"><Twitter className="h-4 w-4" /></a>
                  <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"><Facebook className="h-4 w-4" /></a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    locale={locale}
                    className="text-sm text-gray-400 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {locale === 'ar' ? 'البرامج' : 'Programs'}
            </h3>
            <ul className="space-y-2.5">
              {(locale === 'ar'
                ? ['الإنجليزية', 'العربية', 'الفرنسية', 'تحضير IELTS', 'تحضير TOEFL', 'تحضير GMAT']
                : ['English', 'Arabic', 'French', 'IELTS Prep', 'TOEFL Prep', 'GMAT Prep']
              ).map((prog) => (
                <li key={prog}>
                  <Link
                    href="/courses"
                    locale={locale}
                    className="text-sm text-gray-400 hover:text-gold-400 transition-colors"
                  >
                    {prog}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold-500 flex-shrink-0" />
                <a href={`tel:${phone}`} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold-500 flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            {t('common.copyright', { year })}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" locale={locale} className="hover:text-gray-300 transition-colors">
              {t('common.privacyPolicy')}
            </Link>
            <Link href="/terms" locale={locale} className="hover:text-gray-300 transition-colors">
              {t('common.terms')}
            </Link>
            <span>{t('common.madeIn')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
