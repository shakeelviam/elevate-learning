'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useUser, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Image from 'next/image'
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react'
import type { SanitySiteSettings, NavItem } from '@/types/sanity'
import { getLocaleText } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface HeaderProps {
  locale: 'en' | 'ar'
  settings: SanitySiteSettings | null
}

const DEFAULT_NAV_EN: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'We Offer',
    href: '/courses',
    children: [
      {
        label: 'Languages',
        href: '/courses?category=language',
        children: [
          {
            label: 'English',
            href: '/courses?category=language&language=english',
            children: [
              { label: 'Spoken English', href: '/courses/spoken-english' },
              { label: 'Business English', href: '/courses/business-english-professional' },
            ],
          },
          {
            label: 'Arabic',
            href: '/courses?category=language&language=arabic',
            children: [
              { label: 'Arabic for Non-Native Speakers', href: '/courses/arabic-non-native-speakers' },
            ],
          },
          { label: 'French', href: '/courses/french-beginners' },
          { label: 'German', href: '/courses?category=language&language=german' },
          { label: 'Spanish', href: '/courses?category=language&language=spanish' },
        ],
      },
      {
        label: 'Test Prep',
        href: '/courses?category=exam',
        children: [
          {
            label: 'IELTS',
            href: '/courses?category=exam&examType=ielts',
            children: [
              { label: 'IELTS Academic', href: '/courses/ielts-academic' },
              { label: 'IELTS General Training', href: '/courses/ielts-general-training' },
              { label: 'IELTS UKVI', href: '/courses/ielts-ukvi' },
            ],
          },
          {
            label: 'TOEFL',
            href: '/courses?category=exam&examType=toefl',
            children: [
              { label: 'TOEFL iBT', href: '/courses/toefl-ibt-preparation' },
              { label: 'TOEFL ITP', href: '/courses/toefl-itp' },
            ],
          },
          { label: 'SAT', href: '/courses/sat-preparation' },
          { label: 'GRE', href: '/courses/gre-preparation' },
          { label: 'ACT', href: '/courses/act-preparation' },
          { label: 'PSAT', href: '/courses/psat-preparation' },
          { label: 'OET', href: '/courses?category=exam&examType=oet' },
          { label: 'PTE', href: '/courses?category=exam&examType=pte' },
          { label: 'GMAT', href: '/courses?category=exam&examType=gmat' },
        ],
      },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

const DEFAULT_NAV_AR: NavItem[] = [
  { label: 'الرئيسية', href: '/' },
  {
    label: 'ما نقدمه',
    href: '/courses',
    children: [
      {
        label: 'اللغات',
        href: '/courses?category=language',
        children: [
          {
            label: 'الإنجليزية',
            href: '/courses?category=language&language=english',
            children: [
              { label: 'الإنجليزية المحادثة', href: '/courses/spoken-english' },
              { label: 'الإنجليزية للأعمال', href: '/courses/business-english-professional' },
            ],
          },
          {
            label: 'العربية',
            href: '/courses?category=language&language=arabic',
            children: [
              { label: 'العربية لغير الناطقين بها', href: '/courses/arabic-non-native-speakers' },
            ],
          },
          { label: 'الفرنسية', href: '/courses/french-beginners' },
          { label: 'الألمانية', href: '/courses?category=language&language=german' },
          { label: 'الإسبانية', href: '/courses?category=language&language=spanish' },
        ],
      },
      {
        label: 'تحضير الامتحانات',
        href: '/courses?category=exam',
        children: [
          {
            label: 'IELTS',
            href: '/courses?category=exam&examType=ielts',
            children: [
              { label: 'IELTS Academic', href: '/courses/ielts-academic' },
              { label: 'IELTS General Training', href: '/courses/ielts-general-training' },
              { label: 'IELTS UKVI', href: '/courses/ielts-ukvi' },
            ],
          },
          {
            label: 'TOEFL',
            href: '/courses?category=exam&examType=toefl',
            children: [
              { label: 'TOEFL iBT', href: '/courses/toefl-ibt-preparation' },
              { label: 'TOEFL ITP', href: '/courses/toefl-itp' },
            ],
          },
          { label: 'SAT', href: '/courses/sat-preparation' },
          { label: 'GRE', href: '/courses/gre-preparation' },
          { label: 'ACT', href: '/courses/act-preparation' },
          { label: 'PSAT', href: '/courses/psat-preparation' },
          { label: 'OET', href: '/courses?category=exam&examType=oet' },
          { label: 'PTE', href: '/courses?category=exam&examType=pte' },
          { label: 'GMAT', href: '/courses?category=exam&examType=gmat' },
        ],
      },
    ],
  },
  { label: 'من نحن', href: '/about' },
  { label: 'الأسئلة الشائعة', href: '/faq' },
  { label: 'تواصل معنا', href: '/contact' },
]

// ── Cascading flyout menu ─────────────────────────────────────────────────────

interface FlyoutMenuProps {
  items: NavItem[]
  locale: 'en' | 'ar'
  onClose: () => void
  level?: number
}

function FlyoutMenu({ items, locale, onClose, level = 0 }: FlyoutMenuProps) {
  const [activeHref, setActiveHref] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = (href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveHref(href)
  }
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setActiveHref(null), 100)
  }
  const handlePanelEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  return (
    <div
      className={cn(
        'bg-white rounded-md shadow-xl border border-gray-100 py-2 z-50 divide-y divide-gray-100',
        level === 0 ? 'min-w-[190px]' : 'min-w-[230px]'
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.href}
          className={cn('relative', idx > 0 && !items[idx - 1]?.children && 'first:pt-0')}
          onMouseEnter={() => item.children ? handleEnter(item.href) : setActiveHref(null)}
          onMouseLeave={item.children ? handleLeave : undefined}
        >
          <Link
            href={item.href}
            locale={locale}
            className={cn(
              'flex items-center justify-between gap-4 px-4 py-2.5 text-sm transition-colors duration-100',
              activeHref === item.href
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-brand-600',
              item.children && 'font-semibold'
            )}
            onClick={onClose}
          >
            <span>{item.label}</span>
            {item.children && (
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 flex-shrink-0 transition-colors duration-100',
                  activeHref === item.href ? 'text-brand-500' : 'text-gray-400',
                  locale === 'ar' && 'rotate-180'
                )}
              />
            )}
          </Link>

          {item.children && activeHref === item.href && (
            <div
              className={cn(
                'absolute top-0 z-50',
                locale === 'ar' ? 'right-full mr-1' : 'left-full ml-1'
              )}
              onMouseEnter={handlePanelEnter}
              onMouseLeave={handleLeave}
            >
              <FlyoutMenu
                items={item.children}
                locale={locale}
                onClose={onClose}
                level={level + 1}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Main Header ───────────────────────────────────────────────────────────────

export function Header({ locale, settings }: HeaderProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navItems =
    settings?.navigation?.[locale] ??
    (locale === 'ar' ? DEFAULT_NAV_AR : DEFAULT_NAV_EN)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const switchLocale = () => {
    const next = locale === 'en' ? 'ar' : 'en'
    router.replace(pathname, { locale: next })
  }

  const siteName = getLocaleText(settings?.siteName, locale) || 'Elevate Learning'

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href.split('?')[0])
  }

  const handleMenuEnter = (href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(href)
  }

  const handleMenuLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.08)]'
            : 'bg-white/80 backdrop-blur-sm'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" locale={locale} className="flex flex-col items-start flex-shrink-0">
              <Image
                src="/elev8.svg"
                alt={siteName}
                width={120}
                height={44}
                className="object-contain"
                priority
              />
              <span className="text-[11px] font-medium tracking-[0.22em] text-gold-500 leading-none mt-1">
                {locale === 'ar' ? 'مركز إيليفيت للتعليم' : 'LEARNING CENTER'}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.children && handleMenuEnter(item.href)}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link
                    href={item.href}
                    locale={locale}
                    className={cn(
                      'relative flex items-center gap-1 px-3.5 py-2 text-sm font-bold transition-colors duration-150',
                      isActive(item.href)
                        ? 'text-brand-600'
                        : 'text-gray-700 hover:text-brand-600'
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 transition-transform duration-200',
                          openMenu === item.href && 'rotate-180'
                        )}
                      />
                    )}
                    {isActive(item.href) && (
                      <span className="absolute bottom-0 inset-x-3 h-0.5 bg-brand-500 rounded-full" />
                    )}
                  </Link>

                  {/* Dropdown panel */}
                  {item.children && openMenu === item.href && (
                    <div
                      className={cn(
                        'absolute top-full mt-1 z-50',
                        locale === 'ar' ? 'right-0' : 'left-0'
                      )}
                      onMouseEnter={() => handleMenuEnter(item.href)}
                      onMouseLeave={handleMenuLeave}
                    >
                      <FlyoutMenu
                        items={item.children}
                        locale={locale}
                        onClose={() => setOpenMenu(null)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <button
                onClick={switchLocale}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
                title={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              >
                <Globe className="h-4 w-4" />
                <span>{locale === 'en' ? 'العربية' : 'English'}</span>
              </button>

              {/* Enquire Now */}
              <Link
                href="/contact"
                locale={locale}
                className="hidden sm:inline-flex px-4 py-1.5 text-sm font-semibold text-brand-900 bg-gradient-to-r from-gold-400 to-gold-500 rounded-md hover:opacity-90 transition-opacity shadow-sm"
              >
                {locale === 'ar' ? 'استفسر الآن' : 'Enquire Now'}
              </Link>

              {/* Auth */}
              <SignedOut>
                <Link
                  href="/sign-in"
                  locale={locale}
                  className="hidden sm:inline-flex px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors"
                >
                  {t('signIn')}
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  locale={locale}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t('dashboard')}
                </Link>
                <UserButton afterSignOutUrl={`/${locale}`} />
              </SignedIn>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5 text-gray-700" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu slide-over */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div
            className={cn(
              'absolute top-20 bottom-0 w-72 bg-white shadow-xl overflow-y-auto',
              locale === 'ar' ? 'left-0' : 'right-0'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-4 space-y-1">
              <MobileNav items={navItems} locale={locale} onClose={() => setMobileOpen(false)} />

              <hr className="my-4 border-gray-100" />

              <Link
                href="/contact"
                locale={locale}
                className="flex items-center justify-center px-4 py-3 rounded-md text-sm font-semibold text-brand-900 bg-gradient-to-r from-gold-400 to-gold-500"
                onClick={() => setMobileOpen(false)}
              >
                {locale === 'ar' ? 'استفسر الآن' : 'Enquire Now'}
              </Link>

              <button
                onClick={() => { switchLocale(); setMobileOpen(false) }}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Globe className="h-4 w-4 text-gray-400" />
                {locale === 'en' ? 'العربية' : 'English'}
              </button>

              <SignedOut>
                <Link
                  href="/sign-in"
                  locale={locale}
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/sign-up"
                  locale={locale}
                  className="flex items-center justify-center gap-3 px-4 py-3 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('signUp')}
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  locale={locale}
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 text-gray-400" />
                  {t('dashboard')}
                </Link>
              </SignedIn>
            </nav>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  )
}

// ── Mobile nav — recursive collapsible tree ───────────────────────────────────

function MobileNav({ items, locale, onClose, depth = 0 }: {
  items: NavItem[]
  locale: 'en' | 'ar'
  onClose: () => void
  depth?: number
}) {
  const [openHref, setOpenHref] = useState<string | null>(null)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href.split('?')[0])
  }

  return (
    <>
      {items.map((item) => (
        <div key={item.href}>
          <div className="flex items-center">
            <Link
              href={item.href}
              locale={locale}
              className={cn(
                'flex-1 flex items-center px-4 py-2.5 text-sm font-medium transition-colors',
                depth > 0 && 'ps-' + (4 + depth * 4),
                isActive(item.href) ? 'text-brand-600' : 'text-gray-700 hover:text-brand-600'
              )}
              onClick={() => !item.children && onClose()}
            >
              {item.label}
            </Link>
            {item.children && (
              <button
                className="px-3 py-2.5 text-gray-400 hover:text-brand-600 transition-colors"
                onClick={() => setOpenHref(openHref === item.href ? null : item.href)}
                aria-label={openHref === item.href ? 'Collapse' : 'Expand'}
              >
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform duration-200', openHref === item.href && 'rotate-180')}
                />
              </button>
            )}
          </div>

          {item.children && openHref === item.href && (
            <div className="ms-4 border-s-2 border-brand-100 ps-2 mt-0.5 mb-1">
              <MobileNav items={item.children} locale={locale} onClose={onClose} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </>
  )
}
