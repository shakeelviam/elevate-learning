import { groq } from 'next-sanity'
import { sanityClient } from './client'
import type {
  SanityCourseSummary,
  SanityCourseDetail,
  SanityBlogPost,
  SanityBlogPostSummary,
  SanityTestimonial,
  SanityFaq,
  SanitySiteSettings,
  SanityRegistration,
  SanitySchedule,
} from '@/types/sanity'

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

// ── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return safeFetch(
    () => sanityClient.fetch(
      groq`*[_type == "siteSettings"][0]{
        siteName,
        logo,
        heroHeadline,
        heroSubheadline,
        heroImage,
        heroImages,
        heroPill,
        heroBadges,
        heroFloatingStats,
        stats,
        pathSection,
        ctaBanner,
        aiSection,
        aboutHero,
        ourValues,
        aboutText,
        footerDescription,
        contactInfo,
        socialLinks,
        navigation
      }`,
      {},
      { next: { revalidate: 60 } }
    ),
    null
  )
}

// ── Courses ──────────────────────────────────────────────────────────────────

export async function getAllCourses(params?: {
  category?: string
  level?: string
  search?: string
}): Promise<SanityCourseSummary[]> {
  const filters: string[] = ['_type == "course"']

  if (params?.category) {
    filters.push(`category == "${params.category}"`)
  }
  if (params?.level && params.level !== 'all') {
    filters.push(`level == "${params.level}"`)
  }

  const filterStr = filters.join(' && ')

  const courses = await safeFetch(
    () => sanityClient.fetch<SanityCourseSummary[]>(
      groq`*[${filterStr}]{
        _id,
        title,
        slug,
        category,
        level,
        duration,
        price,
        featured,
        image,
        "excerpt": description.en[0...1],
        "instructor": instructor->{ name, photo }
      } | order(featured desc, _createdAt desc)`,
      {},
      { next: { revalidate: 300 } }
    ),
    [] as SanityCourseSummary[]
  )

  if (params?.search) {
    const q = params.search.toLowerCase()
    return courses.filter(
      (c) =>
        c.title?.en?.toLowerCase().includes(q) ||
        c.title?.ar?.includes(params.search!)
    )
  }

  return courses
}

export async function getFeaturedCourses(limit = 6): Promise<SanityCourseSummary[]> {
  return safeFetch(
    () => sanityClient.fetch(
      groq`*[_type == "course"] | order(featured desc, _createdAt desc)[0...$limit]{
        _id,
        title,
        slug,
        category,
        level,
        duration,
        price,
        featured,
        image,
        "instructor": instructor->{ name, photo },
        "upcomingSchedule": *[_type == "schedule" && references(^._id) && startDate > now()][0]{
          startDate,
          location
        }
      }`,
      { limit: limit - 1 },
      { next: { revalidate: 300 } }
    ),
    [] as SanityCourseSummary[]
  )
}

export async function getCourseBySlug(
  slug: string,
  locale: 'en' | 'ar' = 'en'
): Promise<SanityCourseDetail | null> {
  return safeFetch(
    () => sanityClient.fetch(
      groq`*[_type == "course" && (slug.en.current == $slug || slug.ar.current == $slug)][0]{
        _id,
        title,
        slug,
        category,
        level,
        duration,
        price,
        description,
        syllabus,
        image,
        "instructor": instructor->{
          _id,
          name,
          photo,
          bio,
          specialties
        },
        "schedules": *[_type == "schedule" && references(^._id) && startDate > now()] | order(startDate asc){
          _id,
          startDate,
          endDate,
          days,
          time,
          location,
          locationDetails,
          capacity,
          enrolledCount
        }
      }`,
      { slug },
      { next: { revalidate: 60 } }
    ),
    null
  )
}

export async function getCourseSlugs(): Promise<Array<{ slug: { en: { current: string }; ar: { current: string } } }>> {
  return safeFetch(
    () => sanityClient.fetch(
      groq`*[_type == "course" && defined(slug.en.current)]{
        slug
      }`,
      {},
      { next: { revalidate: 3600 } }
    ),
    []
  )
}

// ── Schedules ────────────────────────────────────────────────────────────────

export async function getSchedulesByCourse(courseId: string): Promise<SanitySchedule[]> {
  return safeFetch(
    () => sanityClient.fetch(
      groq`*[_type == "schedule" && references($courseId) && startDate > now()] | order(startDate asc){
        _id,
        startDate,
        endDate,
        days,
        time,
        location,
        capacity,
        enrolledCount
      }`,
      { courseId },
      { next: { revalidate: 60 } }
    ),
    []
  )
}

// ── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(params?: {
  page?: number
  limit?: number
}): Promise<{ posts: SanityBlogPostSummary[]; total: number }> {
  const limit = params?.limit ?? 6
  const page = params?.page ?? 1
  const from = (page - 1) * limit
  const to = from + limit - 1

  const [posts, total] = await Promise.all([
    safeFetch(
      () => sanityClient.fetch<SanityBlogPostSummary[]>(
        groq`*[_type == "blog"] | order(publishedAt desc)[$from...$to]{
          _id,
          title,
          slug,
          publishedAt,
          author,
          excerpt,
          image
        }`,
        { from, to },
        { next: { revalidate: 300 } }
      ),
      [] as SanityBlogPostSummary[]
    ),
    safeFetch(
      () => sanityClient.fetch<number>(
        groq`count(*[_type == "blog"])`,
        {},
        { next: { revalidate: 300 } }
      ),
      0
    ),
  ])

  return { posts, total }
}

export async function getBlogPostBySlug(slug: string): Promise<SanityBlogPost | null> {
  return safeFetch(
    () => sanityClient.fetch(
      groq`*[_type == "blog" && (slug.en.current == $slug || slug.ar.current == $slug)][0]{
        _id,
        title,
        slug,
        publishedAt,
        author,
        excerpt,
        image,
        body
      }`,
      { slug },
      { next: { revalidate: 300 } }
    ),
    null
  )
}

export async function getBlogSlugs(): Promise<Array<{ slug: { en: { current: string }; ar?: { current: string } } }>> {
  return safeFetch(
    () => sanityClient.fetch(
      groq`*[_type == "blog" && defined(slug.en.current)]{
        slug
      }`,
      {},
      { next: { revalidate: 3600 } }
    ),
    []
  )
}

// ── FAQs ─────────────────────────────────────────────────────────────────────

export async function getFaqs(homepageOnly = false): Promise<SanityFaq[]> {
  const filter = homepageOnly
    ? '_type == "faq" && showOnHomepage == true'
    : '_type == "faq"'
  return safeFetch(
    () => sanityClient.fetch(
      groq`*[${filter}] | order(order asc)[0...50]{
        _id,
        question,
        answer,
        order,
        showOnHomepage
      }`,
      {},
      { next: { revalidate: 3600 } }
    ),
    []
  )
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<SanityTestimonial[]> {
  return safeFetch(
    () => sanityClient.fetch(
      groq`*[_type == "testimonial"] | order(_createdAt desc)[0...10]{
        _id,
        name,
        quote,
        course,
        avatar,
        rating
      }`,
      {},
      { next: { revalidate: 3600 } }
    ),
    []
  )
}

// ── Registrations ─────────────────────────────────────────────────────────────

export async function getRegistrationsByEmail(email: string): Promise<SanityRegistration[]> {
  return safeFetch(
    () => sanityClient.fetch(
      groq`*[_type == "registration" && email == $email] | order(submittedAt desc){
        _id,
        fullName,
        email,
        phone,
        status,
        submittedAt,
        message,
        "course": course->{ title, slug, image },
        "schedule": schedule->{ startDate, location, time }
      }`,
      { email },
      { next: { revalidate: 0 } }
    ),
    []
  )
}

// ── Team Members ──────────────────────────────────────────────────────────────

export interface SanityTeamMember {
  _id: string
  name: string
  role: { en?: string; ar?: string }
  photo?: import('../../src/types/sanity').SanityImage
  bio?: { en?: string; ar?: string }
  linkedin?: string
}

export async function getTeamMembers(): Promise<SanityTeamMember[]> {
  return safeFetch(
    () => sanityClient.fetch(
      groq`*[_type == "teamMember"] | order(order asc){
        _id,
        name,
        role,
        photo,
        bio,
        linkedin
      }`,
      {},
      { next: { revalidate: 3600 } }
    ),
    []
  )
}
