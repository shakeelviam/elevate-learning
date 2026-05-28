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
        label: 'Language Courses',
        href: '/courses?category=language',
        children: [
          { label: 'English',  href: '/courses?category=language&language=english' },
          { label: 'Arabic',   href: '/courses?category=language&language=arabic'  },
          { label: 'French',   href: '/courses?category=language&language=french'  },
          { label: 'German',   href: '/courses?category=language&language=german'  },
          { label: 'Spanish',  href: '/courses?category=language&language=spanish' },
        ],
      },
      {
        label: 'Test Prep',
        href: '/courses?category=exam',
        children: [
          { label: 'IELTS', href: '/courses?category=exam&examType=ielts' },
          { label: 'TOEFL', href: '/courses?category=exam&examType=toefl' },
          { label: 'OET',   href: '/courses?category=exam&examType=oet'   },
          { label: 'GMAT',  href: '/courses?category=exam&examType=gmat'  },
          { label: 'SAT',   href: '/courses?category=exam&examType=sat'   },
          { label: 'PTE',   href: '/courses?category=exam&examType=pte'   },
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
        label: 'دورات اللغات',
        href: '/courses?category=language',
        children: [
          { label: 'الإنجليزية', href: '/courses?category=language&language=english' },
          { label: 'العربية',    href: '/courses?category=language&language=arabic'  },
          { label: 'الفرنسية',   href: '/courses?category=language&language=french'  },
          { label: 'الألمانية',  href: '/courses?category=language&language=german'  },
          { label: 'الإسبانية', href: '/courses?category=language&language=spanish' },
        ],
      },
      {
        label: 'تحضير الامتحانات',
        href: '/courses?category=exam',
        children: [
          { label: 'IELTS', href: '/courses?category=exam&examType=ielts' },
          { label: 'TOEFL', href: '/courses?category=exam&examType=toefl' },
          { label: 'OET',   href: '/courses?category=exam&examType=oet'   },
          { label: 'GMAT',  href: '/courses?category=exam&examType=gmat'  },
          { label: 'SAT',   href: '/courses?category=exam&examType=sat'   },
          { label: 'PTE',   href: '/courses?category=exam&examType=pte'   },
        ],
      },
    ],
  },
  { label: 'من نحن', href: '/about' },
  { label: 'الأسئلة الشائعة', href: '/faq' },
  { label: 'تواصل معنا', href: '/contact' },
]

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

  const siteName =
    getLocaleText(settings?.siteName, locale) || 'Elevate Learning'

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
                      'relative flex items-center gap-1 px-3.5 py-2 text-sm font-bold rounded-lg transition-colors duration-150',
                      isActive(item.href)
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'
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
                      <span className="absolute bottom-1 inset-x-3 h-0.5 bg-brand-500 rounded-full" />
                    )}
                  </Link>

                  {/* Dropdown panel */}
                  {item.children && openMenu === item.href && (
                    <div
                      className={cn(
                        'absolute top-full mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-50',
                        locale === 'ar' ? 'right-0' : 'left-0',
                        item.children.some(c => c.children?.length)
                          ? 'min-w-[360px]'
                          : 'min-w-[200px]'
                      )}
                      onMouseEnter={() => handleMenuEnter(item.href)}
                      onMouseLeave={handleMenuLeave}
                    >
                      {item.children.some(c => c.children?.length) ? (
                        /* Two-column mega panel */
                        <div className="grid grid-cols-2 gap-0 px-2">
                          {item.children.map((group) => (
                            <div key={group.href} className="px-3">
                              <Link
                                href={group.href}
                                locale={locale}
                                className="block text-xs font-extrabold text-brand-600 uppercase tracking-wider mb-2 hover:text-brand-700"
                                onClick={() => setOpenMenu(null)}
                              >
                                {group.label}
                              </Link>
                              <div className="space-y-0.5">
                                {group.children?.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    locale={locale}
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                    onClick={() => setOpenMenu(null)}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-300 flex-shrink-0" />
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Single-column list */
                        item.children.map((child, idx) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            locale={locale}
                            className={cn(
                              'flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-colors',
                              idx === item.children!.length - 1 &&
                                'mt-1 border-t border-gray-100 text-brand-600 font-medium'
                            )}
                            onClick={() => setOpenMenu(null)}
                          >
                            {child.label}
                          </Link>
                        ))
                      )}
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
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
                title={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              >
                <Globe className="h-4 w-4" />
                <span>{locale === 'en' ? 'العربية' : 'English'}</span>
              </button>

              {/* Enquire Now — always visible */}
              <Link
                href="/contact"
                locale={locale}
                className="hidden sm:inline-flex px-4 py-1.5 text-sm font-semibold text-brand-900 bg-gradient-to-r from-gold-400 to-gold-500 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
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
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    locale={locale}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                    onClick={() => !item.children && setMobileOpen(false)}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </Link>
                  {/* Mobile sub-items */}
                  {item.children && (
                    <div className="mt-1 ms-4 space-y-2 border-s-2 border-brand-100 ps-3">
                      {item.children.map((group) =>
                        group.children?.length ? (
                          /* Group with children */
                          <div key={group.href}>
                            <p className="px-3 py-1 text-xs font-extrabold text-brand-600 uppercase tracking-wider">
                              {group.label}
                            </p>
                            {group.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                locale={locale}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                                onClick={() => setMobileOpen(false)}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-300 flex-shrink-0" />
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          /* Plain link */
                          <Link
                            key={group.href}
                            href={group.href}
                            locale={locale}
                            className="block px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {group.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}

              <hr className="my-4 border-gray-100" />

              {/* Enquire Now mobile */}
              <Link
                href="/contact"
                locale={locale}
                className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-brand-900 bg-gradient-to-r from-gold-400 to-gold-500"
                onClick={() => setMobileOpen(false)}
              >
                {locale === 'ar' ? 'استفسر الآن' : 'Enquire Now'}
              </Link>

              {/* Mobile language switcher */}
              <button
                onClick={() => { switchLocale(); setMobileOpen(false) }}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Globe className="h-4 w-4 text-gray-400" />
                {locale === 'en' ? 'العربية' : 'English'}
              </button>

              <SignedOut>
                <Link
                  href="/sign-in"
                  locale={locale}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/sign-up"
                  locale={locale}
                  className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('signUp')}
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  locale={locale}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
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
