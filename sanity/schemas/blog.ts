import { defineField, defineType } from 'sanity'

export const blogSchema = defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Meta' },
  ],
  fields: [
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
      group: 'meta',
      fields: [
        {
          name: 'en',
          type: 'slug',
          title: 'English Slug',
          options: { source: 'title.en', maxLength: 96 },
        },
        {
          name: 'ar',
          type: 'slug',
          title: 'Arabic Slug',
          options: { source: 'title.ar', maxLength: 96 },
        },
      ],
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'meta',
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt / Summary',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'ar', type: 'text', title: 'Arabic (العربية)', rows: 3 },
      ],
    }),

    defineField({
      name: 'image',
      title: 'Cover Image',
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
      name: 'body',
      title: 'Body (Rich Text)',
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
                  { title: 'Code', value: 'code' },
                ],
                annotations: [
                  {
                    type: 'object',
                    name: 'link',
                    fields: [
                      { name: 'href', type: 'url', title: 'URL' },
                      {
                        name: 'blank',
                        type: 'boolean',
                        title: 'Open in new tab',
                        initialValue: false,
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                { name: 'alt', type: 'string', title: 'Alt Text' },
                { name: 'caption', type: 'string', title: 'Caption' },
              ],
            },
          ],
        },
        {
          name: 'ar',
          type: 'array',
          title: 'Arabic (العربية)',
          of: [
            { type: 'block' },
            {
              type: 'image',
              options: { hotspot: true },
            },
          ],
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title.en',
      subtitle: 'author',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled Post',
        subtitle: subtitle ? `by ${subtitle}` : '',
        media,
      }
    },
  },
})
