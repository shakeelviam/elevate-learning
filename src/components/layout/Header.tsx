'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useUser, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import {
  GraduationCap,
  Menu,
  X,
  Globe,
  ChevronDown,
  BookOpen,
  Home,
  Info,
  Mail,
  HelpCircle,
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
  { label: 'Courses', href: '/courses' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const DEFAULT_NAV_AR: NavItem[] = [
  { label: 'الرئيسية', href: '/' },
  { label: 'الدورات', href: '/courses' },
  { label: 'المدونة', href: '/blog' },
  { label: 'من نحن', href: '/about' },
  { label: 'تواصل معنا', href: '/contact' },
]

export function Header({ locale, settings }: HeaderProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
    return pathname.startsWith(href)
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
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" locale={locale} className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                {siteName}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  locale={locale}
                  className={cn(
                    'relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                    isActive(item.href)
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute bottom-1 inset-x-3 h-0.5 bg-brand-500 rounded-full" />
                  )}
                </Link>
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

              {/* Auth */}
              <SignedOut>
                <Link
                  href="/sign-in"
                  locale={locale}
                  className="hidden sm:inline-flex px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/sign-up"
                  locale={locale}
                  className="hidden sm:inline-flex px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-700 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                  {t('signUp')}
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
              'absolute top-16 bottom-0 w-72 bg-white shadow-xl overflow-y-auto',
              locale === 'ar' ? 'left-0' : 'right-0'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  locale={locale}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <hr className="my-4 border-gray-100" />

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
      <div className="h-16" />
    </>
  )
}
