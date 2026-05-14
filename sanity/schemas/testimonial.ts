import { defineField, defineType } from 'sanity'

export const testimonialSchema = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Student Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 4 },
        { name: 'ar', type: 'text', title: 'Arabic (العربية)', rows: 4 },
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'course',
      title: 'Course Taken',
      type: 'string',
      description: 'e.g. "IELTS Preparation", "Business English"',
    }),

    defineField({
      name: 'avatar',
      title: 'Avatar / Photo',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      validation: (rule) => rule.min(1).max(5),
      initialValue: 5,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'course',
      media: 'avatar',
    },
  },
})
