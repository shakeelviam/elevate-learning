import { courseSchema } from './course'
import { instructorSchema } from './instructor'
import { scheduleSchema } from './schedule'
import { blogSchema } from './blog'
import { testimonialSchema } from './testimonial'
import { faqSchema } from './faq'
import { siteSettingsSchema } from './siteSettings'
import { registrationSchema } from './registration'
import { teamMemberSchema } from './teamMember'

export const schemaTypes = [
  // Content types
  courseSchema,
  instructorSchema,
  scheduleSchema,
  blogSchema,
  testimonialSchema,
  faqSchema,
  teamMemberSchema,

  // Singletons
  siteSettingsSchema,

  // Operations
  registrationSchema,
]
