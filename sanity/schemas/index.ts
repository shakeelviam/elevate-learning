import { courseSchema } from './course'
import { instructorSchema } from './instructor'
import { scheduleSchema } from './schedule'
import { blogSchema } from './blog'
import { testimonialSchema } from './testimonial'
import { siteSettingsSchema } from './siteSettings'
import { registrationSchema } from './registration'

export const schemaTypes = [
  // Content types
  courseSchema,
  instructorSchema,
  scheduleSchema,
  blogSchema,
  testimonialSchema,

  // Singletons
  siteSettingsSchema,

  // Operations
  registrationSchema,
]
