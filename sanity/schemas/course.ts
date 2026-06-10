import { defineField, defineType } from 'sanity'

export const courseSchema = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'schedule', title: 'Schedule & Pricing' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // i18n title — handled by the internationalization plugin
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic (العربية)' },
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'en',
          type: 'slug',
          title: 'English Slug',
          options: {
            source: 'title.en',
            maxLength: 96,
          },
        },
        {
          name: 'ar',
          type: 'slug',
          title: 'Arabic Slug',
          options: {
            source: 'title.ar',
            maxLength: 96,
          },
        },
      ],
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Language Course', value: 'language' },
          { title: 'Exam Preparation', value: 'exam' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      group: 'content',
      description: 'Which language does this course teach?',
      hidden: ({ document }) => document?.category !== 'language',
      options: {
        list: [
          { title: 'English',    value: 'english'    },
          { title: 'Arabic',     value: 'arabic'     },
          { title: 'French',     value: 'french'     },
          { title: 'German',     value: 'german'     },
          { title: 'Spanish',    value: 'spanish'    },
          { title: 'Italian',    value: 'italian'    },
          { title: 'Czech',      value: 'czech'      },
          { title: 'Mandarin',   value: 'mandarin'   },
          { title: 'Japanese',   value: 'japanese'   },
          { title: 'Portuguese', value: 'portuguese' },
          { title: 'Turkish',    value: 'turkish'    },
          { title: 'Korean',     value: 'korean'     },
          { title: 'Russian',    value: 'russian'    },
          { title: 'Hindi',      value: 'hindi'      },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'examType',
      title: 'Exam Type',
      type: 'string',
      group: 'content',
      description: 'Which exam does this course prepare for?',
      hidden: ({ document }) => document?.category !== 'exam',
      options: {
        list: [
          { title: 'IELTS', value: 'ielts' },
          { title: 'TOEFL', value: 'toefl' },
          { title: 'OET', value: 'oet' },
          { title: 'GMAT', value: 'gmat' },
          { title: 'SAT', value: 'sat' },
          { title: 'PTE', value: 'pte' },
          { title: 'GRE', value: 'gre' },
          { title: 'ACT', value: 'act' },
          { title: 'PSAT', value: 'psat' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'examSubType',
      title: 'Exam Sub-Type',
      type: 'string',
      group: 'content',
      description: 'Variant of the exam (e.g. IELTS Academic, TOEFL iBT)',
      hidden: ({ document }) => !['ielts', 'toefl'].includes(document?.examType as string),
      options: {
        list: [
          { title: 'IELTS Academic', value: 'academic' },
          { title: 'IELTS General Training', value: 'general_training' },
          { title: 'IELTS UKVI', value: 'ukvi' },
          { title: 'TOEFL iBT', value: 'ibt' },
          { title: 'TOEFL ITP', value: 'itp' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'languageSubType',
      title: 'Language Sub-Type',
      type: 'string',
      group: 'content',
      description: 'Variant of the language course (e.g. Spoken English, Business English)',
      hidden: ({ document }) => document?.category !== 'language',
      options: {
        list: [
          { title: 'Spoken English', value: 'spoken' },
          { title: 'Business English', value: 'business' },
          { title: 'Academic English', value: 'academic' },
          { title: 'General / Conversational', value: 'general' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
          { title: 'All Levels', value: 'all' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      group: 'schedule',
      description: 'e.g. "8 weeks", "40 hours", "3 months"',
    }),

    defineField({
      name: 'description',
      title: 'Description (Rich Text)',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          type: 'array',
          title: 'English',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'Quote', value: 'blockquote' },
              ],
              marks: {
                decorators: [
                  { title: 'Strong', value: 'strong' },
                  { title: 'Emphasis', value: 'em' },
                ],
                annotations: [
                  {
                    type: 'object',
                    name: 'link',
                    fields: [{ name: 'href', type: 'url', title: 'URL' }],
                  },
                ],
              },
            },
          ],
        },
        {
          name: 'ar',
          type: 'array',
          title: 'Arabic (العربية)',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'Quote', value: 'blockquote' },
              ],
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'syllabus',
      title: 'Syllabus',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'module',
          title: 'Module',
          fields: [
            {
              name: 'moduleTitle',
              type: 'object',
              title: 'Module Title',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'ar', type: 'string', title: 'Arabic' },
              ],
            },
            {
              name: 'lessons',
              type: 'array',
              title: 'Lessons',
              of: [
                {
                  type: 'object',
                  name: 'lesson',
                  fields: [
                    { name: 'en', type: 'string', title: 'English' },
                    { name: 'ar', type: 'string', title: 'Arabic' },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'moduleTitle.en',
            },
          },
        },
      ],
    }),

    defineField({
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      group: 'content',
      to: [{ type: 'instructor' }],
    }),

    defineField({
      name: 'image',
      title: 'Course Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'object',
          title: 'Alt Text',
          fields: [
            { name: 'en', type: 'string', title: 'English' },
            { name: 'ar', type: 'string', title: 'Arabic' },
          ],
        },
      ],
    }),

    defineField({
      name: 'price',
      title: 'Price (KWD)',
      type: 'number',
      group: 'schedule',
      validation: (rule) => rule.min(0),
    }),

    defineField({
      name: 'featured',
      title: 'Featured on Home Page',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'title.en',
      subtitle: 'category',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled Course',
        subtitle: subtitle,
        media,
      }
    },
  },
})
