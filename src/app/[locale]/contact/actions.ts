'use server'

import { contactSchema } from '@/lib/validations'
import { sendContactEmail } from '@/lib/email'
import { getSiteSettings } from '@/sanity/lib/queries'

export interface ContactActionState {
  success: boolean
  error?: string
}

// Simple in-memory rate limiter: 3 submissions per email per 10 minutes
const contactRateMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(key: string, limit = 3, windowMs = 600_000): boolean {
  const now = Date.now()
  const entry = contactRateMap.get(key)
  if (!entry || now > entry.resetAt) {
    contactRateMap.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }
  if (entry.count >= limit) return true
  entry.count++
  return false
}

export async function sendContactAction(
  _prev: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    locale: formData.get('locale') ?? 'en',
  }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.message?.[0] ?? 'Invalid form data',
    }
  }

  // Rate limit by email address
  if (isRateLimited(parsed.data.email)) {
    return {
      success: false,
      error:
        parsed.data.locale === 'ar'
          ? 'لقد أرسلت عدة رسائل مؤخراً. يرجى الانتظار قبل المحاولة مرة أخرى.'
          : 'You have sent several messages recently. Please wait before trying again.',
    }
  }

  try {
    const settings = await getSiteSettings()
    const instituteEmail =
      settings?.contactInfo?.email ?? 'info@elevate-learning.com'

    await sendContactEmail(
      {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        instituteEmail,
      },
      parsed.data.locale
    )

    return { success: true }
  } catch (err) {
    console.error('[Contact] Email send error:', err)
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
