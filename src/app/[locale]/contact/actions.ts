'use server'

import { contactSchema } from '@/lib/validations'
import { sendContactEmail } from '@/lib/email'
import { getSiteSettings } from '@/sanity/lib/queries'

export interface ContactActionState {
  success: boolean
  error?: string
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
