import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

// ── Tailwind merge helper ─────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Date formatting ───────────────────────────────────────────────────────────

export function formatDate(
  dateString: string,
  locale: 'en' | 'ar' = 'en',
  formatStr = 'PPP'
): string {
  try {
    const date = parseISO(dateString)
    return format(date, formatStr, {
      locale: locale === 'ar' ? ar : enUS,
    })
  } catch {
    return dateString
  }
}

// ── i18n text helpers ─────────────────────────────────────────────────────────

export function getLocaleText(
  obj: { en?: string; ar?: string } | undefined,
  locale: 'en' | 'ar',
  fallback = ''
): string {
  if (!obj) return fallback
  return obj[locale] ?? obj['en'] ?? obj['ar'] ?? fallback
}

export function getLocaleSlug(
  obj: { en?: { current: string }; ar?: { current: string } } | undefined,
  locale: 'en' | 'ar'
): string {
  if (!obj) return ''
  return (
    obj[locale]?.current ??
    obj['en']?.current ??
    obj['ar']?.current ??
    ''
  )
}

// ── Category / Level display ──────────────────────────────────────────────────

export function getCategoryLabel(
  category: string,
  locale: 'en' | 'ar'
): string {
  const map: Record<string, { en: string; ar: string }> = {
    language: { en: 'Language', ar: 'لغات' },
    exam: { en: 'Exam Prep', ar: 'تحضير امتحانات' },
  }
  return map[category]?.[locale] ?? category
}

export function getLevelLabel(level: string, locale: 'en' | 'ar'): string {
  const map: Record<string, { en: string; ar: string }> = {
    beginner: { en: 'Beginner', ar: 'مبتدئ' },
    intermediate: { en: 'Intermediate', ar: 'متوسط' },
    advanced: { en: 'Advanced', ar: 'متقدم' },
    all: { en: 'All Levels', ar: 'جميع المستويات' },
  }
  return map[level]?.[locale] ?? level
}

export function getLocationLabel(location: string, locale: 'en' | 'ar'): string {
  const map: Record<string, { en: string; ar: string }> = {
    physical: { en: 'In-Person', ar: 'حضوري' },
    online: { en: 'Online', ar: 'عبر الإنترنت' },
  }
  return map[location]?.[locale] ?? location
}

// ── Reading time ──────────────────────────────────────────────────────────────

export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// ── Price formatting ──────────────────────────────────────────────────────────

export function formatPrice(price: number, locale: 'en' | 'ar'): string {
  const formatted = price.toFixed(3)
  return locale === 'ar' ? `${formatted} د.ك` : `KWD ${formatted}`
}

// ── WhatsApp URL ──────────────────────────────────────────────────────────────

export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
