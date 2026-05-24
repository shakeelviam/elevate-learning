import type { PortableTextBlock } from '@portabletext/react'

// ── Shared ────────────────────────────────────────────────────────────────────

export interface I18nString {
  en?: string
  ar?: string
}

export interface I18nText {
  en?: string
  ar?: string
}

export interface I18nPortableText {
  en?: PortableTextBlock[]
  ar?: PortableTextBlock[]
}

export interface I18nSlug {
  en?: { current: string }
  ar?: { current: string }
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
  }
  alt?: I18nString
}

// ── Course ────────────────────────────────────────────────────────────────────

export interface SanityInstructorRef {
  _id: string
  name: string
  photo?: SanityImage
  bio?: I18nPortableText
  specialties?: string[]
}

export interface SanitySchedule {
  _id: string
  startDate: string
  endDate?: string
  days?: string[]
  time?: string
  location: 'physical' | 'online'
  locationDetails?: string
  capacity?: number
  enrolledCount?: number
}

export interface SanityCourseSummary {
  _id: string
  title: I18nString
  slug: I18nSlug
  category: 'language' | 'exam'
  level: 'beginner' | 'intermediate' | 'advanced' | 'all'
  duration?: string
  price?: number
  featured?: boolean
  image?: SanityImage
  instructor?: Pick<SanityInstructorRef, 'name' | 'photo'>
  upcomingSchedule?: Pick<SanitySchedule, 'startDate' | 'location'>
}

export interface SanityLesson {
  en?: string
  ar?: string
}

export interface SanityModule {
  moduleTitle: I18nString
  lessons?: SanityLesson[]
}

export interface SanityCourseDetail extends SanityCourseSummary {
  description?: I18nPortableText
  syllabus?: SanityModule[]
  instructor?: SanityInstructorRef
  schedules?: SanitySchedule[]
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export interface SanityBlogPostSummary {
  _id: string
  title: I18nString
  slug: I18nSlug
  publishedAt?: string
  author?: string
  excerpt?: I18nText
  image?: SanityImage
}

export interface SanityBlogPost extends SanityBlogPostSummary {
  body?: I18nPortableText
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

export interface SanityFaq {
  _id: string
  question: I18nString
  answer: I18nText
  order?: number
  showOnHomepage?: boolean
}

// ── Testimonial ───────────────────────────────────────────────────────────────

export interface SanityTestimonial {
  _id: string
  name: string
  quote: I18nText
  course?: string
  avatar?: SanityImage
  rating?: number
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
}

export interface SanitySiteSettings {
  siteName?: I18nString
  logo?: SanityImage
  heroHeadline?: I18nString
  heroSubheadline?: I18nText
  heroImage?: SanityImage
  stats?: {
    yearsValue?: string
    coursesValue?: string
    studentsValue?: string
    countriesValue?: string
  }
  aboutText?: I18nPortableText
  contactInfo?: {
    phone?: string
    whatsapp?: string
    email?: string
    address?: I18nText
  }
  socialLinks?: {
    instagram?: string
    twitter?: string
    facebook?: string
    linkedin?: string
    youtube?: string
  }
  navigation?: {
    en?: NavItem[]
    ar?: NavItem[]
  }
}

// ── Registration ──────────────────────────────────────────────────────────────

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'paid'

export interface SanityRegistration {
  _id: string
  fullName: string
  email: string
  phone?: string
  status: RegistrationStatus
  submittedAt?: string
  message?: string
  course?: {
    title: I18nString
    slug: I18nSlug
    image?: SanityImage
  }
  schedule?: {
    startDate?: string
    location?: string
    time?: string
  }
}

// ── API Payloads ──────────────────────────────────────────────────────────────

export interface RegistrationPayload {
  fullName: string
  email: string
  phone: string
  courseId: string
  scheduleId?: string
  message?: string
  locale: 'en' | 'ar'
}
