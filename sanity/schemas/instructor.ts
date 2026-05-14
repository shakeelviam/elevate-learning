import { defineField, defineType } from 'sanity'

export const instructorSchema = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
      ],
    }),

    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'array',
          title: 'English',
          of: [{ type: 'block' }],
        },
        {
          name: 'ar',
          type: 'array',
          title: 'Arabic (العربية)',
          of: [{ type: 'block' }],
        },
      ],
    }),

    defineField({
      name: 'specialties',
      title: 'Specialties',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'photo',
    },
  },
})
