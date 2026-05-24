import { defineField, defineType } from 'sanity'

export const faqSchema = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic (العربية)' },
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 4 },
        { name: 'ar', type: 'text', title: 'Arabic (العربية)', rows: 4 },
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 99,
    }),

    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      description: 'If checked, this FAQ appears in the homepage FAQ section (shows up to 4)',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'question.en',
      subtitle: 'question.ar',
    },
    prepare({ title, subtitle }) {
      return { title: title || subtitle || 'FAQ Item' }
    },
  },

  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
