import { defineField, defineType } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — only one document of this type (create/delete hidden via desk structure)
  groups: [
    { name: 'branding', title: 'Branding', default: true },
    { name: 'hero', title: 'Hero Section' },
    { name: 'about', title: 'About' },
    { name: 'contact', title: 'Contact' },
    { name: 'social', title: 'Social Links' },
    { name: 'nav', title: 'Navigation' },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'object',
      group: 'branding',
      fields: [
        { name: 'en', type: 'string', title: 'English', initialValue: 'Elevate Learning' },
        { name: 'ar', type: 'string', title: 'Arabic', initialValue: 'إليفيت ليرنينج' },
      ],
    }),

    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'branding',
      options: { hotspot: true },
    }),

    // ── Hero ──────────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'object',
      group: 'hero',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
    }),

    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'object',
      group: 'hero',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 2 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 2 },
      ],
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),

    // ── About ─────────────────────────────────────────────────────────────
    defineField({
      name: 'aboutText',
      title: 'About Text',
      type: 'object',
      group: 'about',
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
          title: 'Arabic',
          of: [{ type: 'block' }],
        },
      ],
    }),

    // ── Contact ───────────────────────────────────────────────────────────
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      group: 'contact',
      fields: [
        { name: 'phone', type: 'string', title: 'Phone Number' },
        { name: 'whatsapp', type: 'string', title: 'WhatsApp Number (international, no +)' },
        { name: 'email', type: 'string', title: 'Email Address' },
        {
          name: 'address',
          type: 'object',
          title: 'Address',
          fields: [
            { name: 'en', type: 'text', title: 'English', rows: 2 },
            { name: 'ar', type: 'text', title: 'Arabic', rows: 2 },
          ],
        },
      ],
    }),

    // ── Social ────────────────────────────────────────────────────────────
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      group: 'social',
      fields: [
        { name: 'instagram', type: 'url', title: 'Instagram URL' },
        { name: 'twitter', type: 'url', title: 'X / Twitter URL' },
        { name: 'facebook', type: 'url', title: 'Facebook URL' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn URL' },
        { name: 'youtube', type: 'url', title: 'YouTube URL' },
      ],
    }),

    // ── Navigation ────────────────────────────────────────────────────────
    defineField({
      name: 'navigation',
      title: 'Navigation Links',
      type: 'object',
      group: 'nav',
      description: 'Define navigation items per locale. These override the default nav.',
      fields: [
        {
          name: 'en',
          type: 'array',
          title: 'English Navigation',
          of: [
            {
              type: 'object',
              name: 'navItem',
              fields: [
                { name: 'label', type: 'string', title: 'Label' },
                { name: 'href', type: 'string', title: 'Path (e.g. /courses)' },
              ],
              preview: { select: { title: 'label', subtitle: 'href' } },
            },
          ],
        },
        {
          name: 'ar',
          type: 'array',
          title: 'Arabic Navigation (العربية)',
          of: [
            {
              type: 'object',
              name: 'navItem',
              fields: [
                { name: 'label', type: 'string', title: 'Label' },
                { name: 'href', type: 'string', title: 'Path (e.g. /courses)' },
              ],
              preview: { select: { title: 'label', subtitle: 'href' } },
            },
          ],
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'siteName.en',
    },
    prepare({ title }) {
      return { title: title || 'Site Settings' }
    },
  },
})
