'use client'

import { Link } from '@/i18n/navigation'
import { Instagram, Twitter, Facebook, Linkedin, Youtube, Phone, Mail, MapPin } from 'lucide-react'
import type { SanitySiteSettings } from '@/types/sanity'

interface FooterProps {
  locale: 'en' | 'ar'
  settings: SanitySiteSettings | null
}

export function Footer({ locale, settings }: FooterProps) {
  const year = new Date().getFullYear()
  const isRtl = locale === 'ar'
  const social = settings?.socialLinks ?? {}
  const phone = settings?.contactInfo?.phone
  const email = settings?.contactInfo?.email
  const address = settings?.contactInfo?.address?.[locale]

  const navLinks = locale === 'ar'
    ? [
        { label: 'الرئيسية', href: '/' },
        { label: 'الدورات', href: '/courses' },
        { label: 'من نحن', href: '/about' },
        { label: 'تواصل معنا', href: '/contact' },
        { label: 'الخصوصية', href: '/privacy' },
        { label: 'الشروط والأحكام', href: '/terms' },
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Courses', href: '/courses' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ]

  // Canonical exam order: GMAT, GRE, SAT, ACT, UCAT, PSAT, MCAT, IELTS, TOEFL, OET, CELPIP, PTE, IGCSE
  const EXAM_ORDER = ['gmat','gre','sat','act','ucat','psat','mcat','ielts','toefl','oet','celpip','pte','igcse']
  const programs = EXAM_ORDER.map(code => ({
    label: code.toUpperCase(),
    href: `/courses?category=exam&examType=${code}`,
  }))

  const socialIcons = [
    { icon: Instagram, href: social.instagram, label: 'Instagram' },
    { icon: Twitter, href: social.twitter, label: 'Twitter' },
    { icon: Facebook, href: social.facebook, label: 'Facebook' },
    { icon: Linkedin, href: social.linkedin, label: 'LinkedIn' },
    { icon: Youtube, href: social.youtube, label: 'YouTube' },
  ].filter(s => s.href)

  return (
    <footer style={{ background: 'var(--forest)', color: 'rgba(255,255,255,0.55)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <span className="text-2xl font-bold" style={{ color: 'var(--white)' }}>
                elev8<span style={{ color: 'var(--gold)' }}>.</span>
              </span>
              <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {locale === 'ar' ? 'مركز إيليفيت للتعليم' : "Kuwait's Premier Language Institute"}
              </p>
            </div>
            {socialIcons.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {socialIcons.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-[34px] w-[34px] flex items-center justify-center rounded-md transition-colors duration-150"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLElement).style.background = 'var(--gold)'
                      ;(e.currentTarget as HTMLElement).style.color = 'white'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
                      ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    locale={locale}
                    className="text-sm transition-colors duration-100"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-light)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              {locale === 'ar' ? 'البرامج' : 'Programs'}
            </h3>
            <ul className="space-y-2.5">
              {programs.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    locale={locale}
                    className="text-sm transition-colors duration-100"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-light)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              {locale === 'ar' ? 'تواصل معنا' : 'Contact'}
            </h3>
            <ul className="space-y-3">
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                  <span className="text-sm">{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                  <a href={`tel:${phone}`} className="text-sm transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-light)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                  <a href={`mailto:${email}`} className="text-sm transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-light)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}
        >
          <p>© {year} Elevate Learning Center. All rights reserved.</p>
          <p>
            Made with <span style={{ color: 'var(--gold-light)' }}>♥</span> in Kuwait
          </p>
        </div>
      </div>
    </footer>
  )
}
