'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { UserButton, SignedIn } from '@clerk/nextjs'
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
    closeTimer.current = setTimeout(() => setActiveHref(null), 150)
  }
  const handlePanelEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  return (
    <div
      className={cn(
        'rounded-md shadow-xl py-2 z-50',
        level === 0 ? 'min-w-[190px]' : 'min-w-[230px]'
      )}
      style={{ background: 'var(--white)', border: '1px solid rgba(26,58,42,0.1)' }}
    >
      {items.map((item) => (
        <div
          key={item.href}
          className="relative"
          onMouseEnter={() => item.children ? handleEnter(item.href) : setActiveHref(null)}
          onMouseLeave={item.children ? handleLeave : undefined}
        >
          <Link
            href={item.href}
            locale={locale}
            className={cn(
              'flex items-center justify-between gap-4 px-4 py-2.5 text-sm font-semibold transition-colors duration-100',
            )}
            style={{ color: 'var(--text)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--forest)'
              e.currentTarget.style.color = 'var(--gold)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onClick={onClose}
          >
            <span>{item.label}</span>
            {item.children && (
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 flex-shrink-0 opacity-40',
                  locale === 'ar' && 'rotate-180'
                )}
              />
            )}
          </Link>

          {item.children && activeHref === item.href && (
            <div
              className={cn(
                'absolute top-0 z-50',
                locale === 'ar' ? 'right-full -mr-px' : 'left-full -ml-px'
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
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navItems = settings?.navigation?.[locale] ?? []

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const switchLocale = () => {
    const next = locale === 'en' ? 'ar' : 'en'
    router.replace(pathname, { locale: next })
  }

  const siteName = getLocaleText(settings?.siteName, locale) || 'Elevate Learning'

  const handleMenuEnter = (href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(href)
  }

  const handleMenuLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50" style={{ background: 'var(--forest)' }}>

        {/* ── Row 1: Logo + Utility ── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" locale={locale} className="flex items-center flex-shrink-0">
              <Image
                src="/elev8-logo.png"
                alt={siteName}
                width={1284}
                height={846}
                className="h-16 w-auto object-contain"
                priority
              />
            </Link>

            {/* Utility: language, enquire, auth — desktop */}
            <div className="flex items-center gap-2">
              <button
                onClick={switchLocale}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              >
                <Globe className="h-4 w-4" />
                <span>{locale === 'en' ? 'العربية' : 'English'}</span>
              </button>

              <Link
                href="/contact"
                locale={locale}
                className="hidden sm:inline-flex px-4 py-1.5 text-sm font-semibold rounded-md transition-opacity hover:opacity-90"
                style={{ background: 'var(--gold)', color: 'var(--forest)' }}
              >
                {locale === 'ar' ? 'استفسر الآن' : 'Enquire Now'}
              </Link>

              <SignedIn>
                <Link
                  href="/dashboard"
                  locale={locale}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t('dashboard')}
                </Link>
                <UserButton afterSignOutUrl={`/${locale}`} />
              </SignedIn>

              {/* Mobile toggle */}
              <button
                className="lg:hidden p-2 rounded-md"
                style={{ color: 'rgba(255,255,255,0.8)' }}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: '1px solid rgba(255,184,28,0.2)' }} />

        {/* ── Row 2: Desktop Nav — flush left ── */}
        <div className="hidden lg:block" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center h-11">
              {navItems.map((item) => (
                <div
                  key={item.href}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => item.children && handleMenuEnter(item.href)}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link
                    href={item.href}
                    locale={locale}
                    className="flex items-center gap-1 px-4 h-full text-sm font-medium transition-colors duration-150"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'var(--gold)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
                      e.currentTarget.style.background = 'transparent'
                    }}
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
                  </Link>

                  {item.children && openMenu === item.href && (
                    <div
                      className={cn(
                        'absolute top-full z-50',
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
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex flex-col" style={{ background: 'var(--forest)' }}>
          <div className="h-16 px-4 flex items-center justify-between">
            <Image
              src="/elev8-logo.png"
              alt={siteName}
              width={1284}
              height={846}
              className="h-14 w-auto object-contain"
            />
            <button onClick={() => setMobileOpen(false)} style={{ color: 'rgba(255,255,255,0.8)' }}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pt-2 space-y-1">
            <MobileNav items={navItems} locale={locale} onClose={() => setMobileOpen(false)} />

            <div className="pt-4 space-y-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <Link
                href="/contact"
                locale={locale}
                className="block w-full text-center px-4 py-3 rounded-md font-semibold"
                style={{ background: 'var(--gold)', color: 'var(--forest)' }}
                onClick={() => setMobileOpen(false)}
              >
                {locale === 'ar' ? 'استفسر الآن' : 'Enquire Now'}
              </Link>
              <button
                onClick={() => { switchLocale(); setMobileOpen(false) }}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-md text-sm font-medium"
                style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <Globe className="h-4 w-4" />
                {locale === 'en' ? 'العربية' : 'English'}
              </button>
              <SignedIn>
                <Link
                  href="/dashboard"
                  locale={locale}
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t('dashboard')}
                </Link>
              </SignedIn>
            </div>
          </nav>
        </div>
      )}

      {/* Spacer — h-16 (row1) + 1px (divider) + h-11 (row2) = 109px desktop, h-16 mobile */}
      <div className="h-16 lg:h-[109px]" />
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

  return (
    <>
      {items.map((item) => (
        <div key={item.href}>
          <div className="flex items-center">
            <Link
              href={item.href}
              locale={locale}
              className="flex-1 flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors"
              style={{ color: depth === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)' }}
              onClick={() => !item.children && onClose()}
            >
              {item.label}
            </Link>
            {item.children && (
              <button
                className="px-3 py-2.5 transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)' }}
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
            <div className="ms-4 border-s-2 ps-2 mt-0.5 mb-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <MobileNav items={item.children} locale={locale} onClose={onClose} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </>
  )
}
