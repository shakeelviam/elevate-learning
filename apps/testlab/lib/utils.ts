import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function durationToExpiry(duration: string, customDays?: number): Date | null {
  const now = new Date()
  switch (duration) {
    case '1d':     return addDays(now, 1)
    case '3d':     return addDays(now, 3)
    case '1w':     return addDays(now, 7)
    case '1m':     return addDays(now, 30)
    case '1y':     return addDays(now, 365)
    case 'custom': return addDays(now, customDays ?? 1)
    case 'forever':
    default:       return null
  }
}

export function formatExpiry(expiresAt: Date | null): string {
  if (!expiresAt) return 'Never (free forever)'
  const diff = expiresAt.getTime() - Date.now()
  if (diff < 0) return 'Expired'
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days === 1) return `Expires in 1 day`
  if (days < 30) return `Expires in ${days} days`
  const months = Math.round(days / 30)
  return `Expires in ~${months} month${months === 1 ? '' : 's'}`
}
