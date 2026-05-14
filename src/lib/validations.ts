import { z } from 'zod'

// ── Phone validation (Kuwait: 8 digits, optionally starting with 965) ─────────

const kuwaitPhone = z
  .string()
  .min(1, 'Phone is required')
  .refine(
    (val) => {
      const digits = val.replace(/[\s\-\+\(\)]/g, '')
      // Accept 8 digits (local) or 96XXXXXXXX (11 digits with country code)
      return /^\d{8}$/.test(digits) || /^965\d{8}$/.test(digits)
    },
    { message: 'Phone number must be 8 digits' }
  )

// ── Registration Form ─────────────────────────────────────────────────────────

export const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: kuwaitPhone,
  courseId: z.string().min(1, 'Please select a course'),
  scheduleId: z.string().optional(),
  message: z.string().max(500, 'Message too long').optional(),
  locale: z.enum(['en', 'ar']).default('en'),
})

export type RegistrationFormData = z.infer<typeof registrationSchema>

// ── Contact Form ──────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200, 'Subject too long').optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message too long'),
  locale: z.enum(['en', 'ar']).default('en'),
})

export type ContactFormData = z.infer<typeof contactSchema>
