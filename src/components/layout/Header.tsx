'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useUser, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react'
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
    label: 'Courses',
    href: '/courses',
    children: [
      { label: 'All Courses', href: '/courses' },
      { label: 'Exam Prep', href: '/courses?category=exam' },
      { label: 'Languages', href: '/courses?category=language' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

const DEFAULT_NAV_AR: NavItem[] = [
  { label: 'الرئيسية', href: '/' },
  {
    label: 'الدورات',
    href: '/courses',
    children: [
      { label: 'جميع الدورات', href: '/courses' },
      { label: 'تحضير الامتحانات', href: '/courses?category=exam' },
      { label: 'اللغات', href: '/courses?category=language' },
    ],
  },
  { label: 'من نحن', href: '/about' },
  { label: 'الأسئلة الشائعة', href: '/faq' },
  { label: 'تواصل معنا', href: '/contact' },
]

export function Header({ locale, settings }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navItems = settings?.navigation?.[locale] ?? (locale === 'ar' ? DEFAULT_NAV_AR : DEFAULT_NAV_EN)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const switchLocale = () => {
    router.replace(pathname, { locale: locale === 'en' ? 'ar' : 'en' })
    setMobileOpen(false)
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.split('?')[0])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-16" style={{ background: 'var(--forest)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" locale={locale} className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--white)' }}>
              elev8<span style={{ color: 'var(--coral)' }}>.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  locale={locale}
                  className={cn(
                    'flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                </Link>
                {item.children && (
                  <div className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50"
                    style={{ background: 'var(--white)', border: '1px solid var(--border)' }}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        locale={locale}
                        className="block px-4 py-2.5 text-sm transition-colors duration-100 first:rounded-t-lg last:rounded-b-lg"
                        style={{ color: 'var(--text)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--coral)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Arabic toggle */}
            <button
              onClick={switchLocale}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            >
              {locale === 'en' ? 'العربية' : 'English'}
            </button>

            {/* Auth */}
            <SignedIn>
              <Link
                href="/dashboard"
                locale={locale}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <LayoutDashboard className="h-4 w-4" />
              </Link>
              <UserButton afterSignOutUrl={`/${locale}`} />
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                locale={locale}
                className="hidden sm:inline-flex text-sm font-medium transition-colors px-3 py-1.5"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Sign In
              </Link>
            </SignedOut>

            {/* Enquire Now CTA */}
            <Link
              href="/contact"
              locale={locale}
              className="hidden sm:inline-flex px-4 py-1.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--coral)', color: 'var(--white)' }}
            >
              {locale === 'ar' ? 'استفسر الآن' : 'Enquire Now'}
            </Link>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 rounded-md transition-colors"
              style={{ color: 'rgba(255,255,255,0.8)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden flex flex-col"
          style={{ background: 'var(--forest)' }}
        >
          {/* Header row */}
          <div className="h-16 px-4 flex items-center justify-between">
            <span className="text-2xl font-bold" style={{ color: 'var(--white)' }}>
              elev8<span style={{ color: 'var(--coral)' }}>.</span>
            </span>
            <button onClick={() => setMobileOpen(false)} style={{ color: 'rgba(255,255,255,0.8)' }}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pt-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  locale={locale}
                  className="block px-4 py-3 rounded-md text-base font-medium transition-colors"
                  style={{ color: isActive(item.href) ? 'var(--coral)' : 'rgba(255,255,255,0.85)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ms-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        locale={locale}
                        className="block px-4 py-2 text-sm rounded-md"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 space-y-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <Link
                href="/contact"
                locale={locale}
                className="block w-full text-center px-4 py-3 rounded-md font-semibold"
                style={{ background: 'var(--coral)', color: 'var(--white)' }}
                onClick={() => setMobileOpen(false)}
              >
                {locale === 'ar' ? 'استفسر الآن' : 'Enquire Now'}
              </Link>
              <button
                onClick={switchLocale}
                className="block w-full text-center px-4 py-3 rounded-md text-sm font-medium"
                style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {locale === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}
