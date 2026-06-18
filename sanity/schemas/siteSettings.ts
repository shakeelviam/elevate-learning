import { defineField, defineType } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — only one document of this type (create/delete hidden via desk structure)
  groups: [
    { name: 'branding', title: 'Branding', default: true },
    { name: 'hero', title: 'Hero Section' },
    { name: 'stats', title: 'Stats' },
    { name: 'homeSections', title: 'Home Sections' },
    { name: 'about', title: 'About Page' },
    { name: 'footer', title: 'Footer' },
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
        { name: 'ar', type: 'string', title: 'Arabic', initialValue: 'مركز إيليفيت للتعليم' },
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
      title: 'Hero Background Image (single)',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: 'Used as fallback if no carousel images are set.',
    }),

    defineField({
      name: 'heroImages',
      title: 'Hero Carousel Images',
      type: 'array',
      group: 'hero',
      description: 'Upload multiple images for the auto-rotating carousel. Upload real student photos here — Arabs, Indians, Filipinos, Nepali, Sri Lankan, etc.',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          {
            name: 'altText',
            title: 'Alt Text',
            type: 'object',
            fields: [
              { name: 'en', type: 'string', title: 'English' },
              { name: 'ar', type: 'string', title: 'Arabic' },
            ],
          },
        ],
      }],
      validation: (rule) => rule.max(8),
    }),

    defineField({
      name: 'heroPill',
      title: 'Hero Pre-headline Pill',
      type: 'object',
      group: 'hero',
      description: 'Small label above the headline (e.g. "Kuwait — Excellence in Language Education")',
      fields: [
        { name: 'en', type: 'string', title: 'English', initialValue: 'Kuwait — Excellence in Language Education' },
        { name: 'ar', type: 'string', title: 'Arabic', initialValue: 'الكويت — التميز في تعليم اللغات' },
      ],
    }),

    defineField({
      name: 'heroBadges',
      title: 'Hero Trust Badges',
      type: 'array',
      group: 'hero',
      description: 'Short trust indicators shown below the headline (e.g. "IELTS Certified", "12+ Years Experience")',
      of: [{
        type: 'object',
        fields: [
          { name: 'en', type: 'string', title: 'English' },
          { name: 'ar', type: 'string', title: 'Arabic' },
        ],
        preview: { select: { title: 'en', subtitle: 'ar' } },
      }],
    }),

    defineField({
      name: 'heroFloatingStats',
      title: 'Hero Floating Stats Card',
      type: 'object',
      group: 'hero',
      description: 'The small floating card on the bottom-left of the hero image.',
      fields: [
        { name: 'graduatesCount', type: 'string', title: 'Badge Value (English)', initialValue: 'NEW' },
        { name: 'graduatesCountAr', type: 'string', title: 'Badge Value (Arabic)', initialValue: 'جديد' },
        { name: 'graduatesLabelEn', type: 'string', title: 'Label (English)', initialValue: 'Now Enrolling First Cohort' },
        { name: 'graduatesLabelAr', type: 'string', title: 'Label (Arabic)', initialValue: 'التسجيل مفتوح للدفعة الأولى' },
        { name: 'rating', type: 'string', title: 'Star Rating', initialValue: '4.9/5' },
        { name: 'ratingLabelEn', type: 'string', title: 'Rating Label (English)', initialValue: 'Student Rating' },
        { name: 'ratingLabelAr', type: 'string', title: 'Rating Label (Arabic)', initialValue: 'تقييم الطلاب' },
      ],
    }),

    // ── Stats ─────────────────────────────────────────────────────────────
    defineField({
      name: 'stats',
      title: 'Statistics Banner',
      type: 'object',
      group: 'stats',
      description: 'Four stats shown in the navy banner below the hero. Each has an English value/label and Arabic value/label.',
      fields: [
        { name: 'stat1En', type: 'string', title: 'Stat 1 Value (EN)', initialValue: '5 Decades' },
        { name: 'stat1Ar', type: 'string', title: 'Stat 1 Value (AR)', initialValue: '٥ عقود' },
        { name: 'stat1LabelEn', type: 'string', title: 'Stat 1 Label (EN)', initialValue: 'Combined Experience' },
        { name: 'stat1LabelAr', type: 'string', title: 'Stat 1 Label (AR)', initialValue: 'خبرة متراكمة' },
        { name: 'stat2En', type: 'string', title: 'Stat 2 Value (EN)', initialValue: '15+ Programs' },
        { name: 'stat2Ar', type: 'string', title: 'Stat 2 Value (AR)', initialValue: '+١٥ برنامجًا' },
        { name: 'stat2LabelEn', type: 'string', title: 'Stat 2 Label (EN)', initialValue: 'Test Prep & Languages' },
        { name: 'stat2LabelAr', type: 'string', title: 'Stat 2 Label (AR)', initialValue: 'اختبارات ولغات' },
        { name: 'stat3En', type: 'string', title: 'Stat 3 Value (EN)', initialValue: '6+ Languages' },
        { name: 'stat3Ar', type: 'string', title: 'Stat 3 Value (AR)', initialValue: '+٦ لغات' },
        { name: 'stat3LabelEn', type: 'string', title: 'Stat 3 Label (EN)', initialValue: 'Beginner to Advanced' },
        { name: 'stat3LabelAr', type: 'string', title: 'Stat 3 Label (AR)', initialValue: 'من المبتدئ إلى المتقدم' },
        { name: 'stat4En', type: 'string', title: 'Stat 4 Value (EN)', initialValue: '1-on-1' },
        { name: 'stat4Ar', type: 'string', title: 'Stat 4 Value (AR)', initialValue: 'تدريس فردي' },
        { name: 'stat4LabelEn', type: 'string', title: 'Stat 4 Label (EN)', initialValue: 'Personalized Coaching' },
        { name: 'stat4LabelAr', type: 'string', title: 'Stat 4 Label (AR)', initialValue: 'تعليم مخصّص' },
      ],
    }),

    // ── Home Sections ─────────────────────────────────────────────────────
    defineField({
      name: 'welcomeBlock',
      title: 'Welcome Section',
      type: 'object',
      group: 'homeSections',
      description: 'Bold "Welcome" heading + paragraph shown below the stats banner.',
      fields: [
        { name: 'titleEn', type: 'string', title: 'Title (EN)', initialValue: 'Welcome' },
        { name: 'titleAr', type: 'string', title: 'Title (AR)', initialValue: 'مرحباً' },
        { name: 'bodyEn', type: 'text', title: 'Body (EN)', rows: 5 },
        { name: 'bodyAr', type: 'text', title: 'Body (AR)', rows: 5 },
      ],
    }),

    defineField({
      name: 'pathSection',
      title: '"Choose Your Path" Section',
      type: 'object',
      group: 'homeSections',
      fields: [
        { name: 'labelEn', type: 'string', title: 'Section Label (EN)', initialValue: 'What are you looking for?' },
        { name: 'labelAr', type: 'string', title: 'Section Label (AR)', initialValue: 'ما الذي تبحث عنه؟' },
        { name: 'titleEn', type: 'string', title: 'Title (EN)', initialValue: 'Choose your path' },
        { name: 'titleAr', type: 'string', title: 'Title (AR)', initialValue: 'اختر مسارك' },
        { name: 'examTitleEn', type: 'string', title: 'Exam Track Title (EN)', initialValue: 'Exam Preparation' },
        { name: 'examTitleAr', type: 'string', title: 'Exam Track Title (AR)', initialValue: 'التحضير للامتحانات' },
        { name: 'examDescEn', type: 'text', title: 'Exam Track Description (EN)', rows: 2, initialValue: 'IELTS · TOEFL · OET · GMAT · SAT — get the score you need.' },
        { name: 'examDescAr', type: 'text', title: 'Exam Track Description (AR)', rows: 2, initialValue: 'IELTS · TOEFL · OET · GMAT · SAT — احصل على الدرجة التي تحتاجها.' },
        { name: 'langTitleEn', type: 'string', title: 'Language Track Title (EN)', initialValue: 'Language Learning' },
        { name: 'langTitleAr', type: 'string', title: 'Language Track Title (AR)', initialValue: 'تعلّم لغة جديدة' },
        { name: 'langDescEn', type: 'text', title: 'Language Track Description (EN)', rows: 2, initialValue: 'English · Arabic · French · German — speak confidently from day one.' },
        { name: 'langDescAr', type: 'text', title: 'Language Track Description (AR)', rows: 2, initialValue: 'الإنجليزية · العربية · الفرنسية · الألمانية — تحدّث بثقة من اليوم الأول.' },
        { name: 'browseLabelEn', type: 'string', title: 'Browse Button (EN)', initialValue: 'Browse courses' },
        { name: 'browseLabelAr', type: 'string', title: 'Browse Button (AR)', initialValue: 'استعرض الدورات' },
      ],
    }),

    defineField({
      name: 'ctaBanner',
      title: 'CTA Banner Section',
      type: 'object',
      group: 'homeSections',
      description: 'The dark blue call-to-action section at the bottom of the home page.',
      fields: [
        { name: 'titleEn', type: 'string', title: 'Title (EN)', initialValue: 'Ready to Start Your Journey?' },
        { name: 'titleAr', type: 'string', title: 'Title (AR)', initialValue: 'هل أنت مستعد لبدء رحلتك؟' },
        { name: 'subtitleEn', type: 'text', title: 'Subtitle (EN)', rows: 2, initialValue: 'Join thousands of students from Kuwait and beyond. Enrol today and start speaking with confidence.' },
        { name: 'subtitleAr', type: 'text', title: 'Subtitle (AR)', rows: 2, initialValue: 'انضم إلى آلاف الطلاب من الكويت وخارجها. سجّل اليوم وابدأ التحدث بثقة.' },
        { name: 'buttonEn', type: 'string', title: 'Button Text (EN)', initialValue: 'Browse All Courses' },
        { name: 'buttonAr', type: 'string', title: 'Button Text (AR)', initialValue: 'تصفح جميع الدورات' },
      ],
    }),

    defineField({
      name: 'aiSection',
      title: 'Test Lab / AI Section',
      type: 'object',
      group: 'homeSections',
      description: 'The dark section promoting the Test Lab.',
      fields: [
        { name: 'pillEn', type: 'string', title: 'Pill Label (EN)', initialValue: 'NEW — Adaptive Practice Tests' },
        { name: 'pillAr', type: 'string', title: 'Pill Label (AR)', initialValue: 'جديد — مختبر الاختبارات التكيّفية' },
        { name: 'titleEn', type: 'string', title: 'Colored Title Part (EN)', initialValue: 'The Test Lab:' },
        { name: 'titleAr', type: 'string', title: 'Colored Title Part (AR)', initialValue: 'مختبر الاختبارات:' },
        { name: 'titleSuffixEn', type: 'string', title: 'Title Suffix (EN)', initialValue: 'Infinite Adaptive Practice' },
        { name: 'titleSuffixAr', type: 'string', title: 'Title Suffix (AR)', initialValue: 'تدريب تكيّفي لا نهاية له' },
        { name: 'descEn', type: 'text', title: 'Description (EN)', rows: 3, initialValue: 'A powerful test engine built for IELTS, TOEFL, and every major exam. New, copyright-safe questions every session — drawn from real study materials.' },
        { name: 'descAr', type: 'text', title: 'Description (AR)', rows: 3, initialValue: 'محرك اختبارات متطور مصمم خصيصاً لـ IELTS وTOEFL وسائر الامتحانات الدولية. أسئلة جديدة كل مرة، مستوحاة من المواد الأصلية.' },
        { name: 'examBadges', type: 'array', title: 'Exam Badges', of: [{ type: 'string' }], initialValue: ['IELTS', 'TOEFL', 'OET', 'GMAT', 'SAT', 'PTE'] },
        {
          name: 'features',
          title: 'Feature Bullets',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'en', type: 'string', title: 'English' },
              { name: 'ar', type: 'string', title: 'Arabic' },
              { name: 'icon', type: 'string', title: 'Icon name (lucide)', initialValue: 'Zap' },
            ],
            preview: { select: { title: 'en' } },
          }],
        },
        { name: 'contactTitleEn', type: 'string', title: 'Contact Box Title (EN)', initialValue: 'Interested in Test Lab access?' },
        { name: 'contactTitleAr', type: 'string', title: 'Contact Box Title (AR)', initialValue: 'هل أنت مهتم بالوصول إلى مختبر الاختبارات؟' },
        { name: 'contactDescEn', type: 'text', title: 'Contact Box Description (EN)', rows: 2, initialValue: "Test Lab is available to enrolled students only. Reach out to us and we'll get you set up with your credentials." },
        { name: 'contactDescAr', type: 'text', title: 'Contact Box Description (AR)', rows: 2, initialValue: 'يتوفر مختبر الاختبارات للطلاب المسجلين فقط. تواصل معنا للحصول على بياناتك وبدء التدريب.' },
        { name: 'contactButtonEn', type: 'string', title: 'Contact Button (EN)', initialValue: 'Contact Us for Access' },
        { name: 'contactButtonAr', type: 'string', title: 'Contact Button (AR)', initialValue: 'تواصل معنا' },
      ],
    }),

    // ── About ─────────────────────────────────────────────────────────────
    defineField({
      name: 'aboutHero',
      title: 'About Page Hero',
      type: 'object',
      group: 'about',
      fields: [
        { name: 'titleEn', type: 'string', title: 'Title (EN)', initialValue: 'About Elevate Learning' },
        { name: 'titleAr', type: 'string', title: 'Title (AR)', initialValue: 'عن مركز إيليفيت للتعليم' },
        { name: 'subtitleEn', type: 'text', title: 'Subtitle (EN)', rows: 2, initialValue: 'Empowering students across Kuwait and the Gulf since 2012.' },
        { name: 'subtitleAr', type: 'text', title: 'Subtitle (AR)', rows: 2, initialValue: 'نمكّن الطلاب في الكويت والخليج منذ عام 2012.' },
      ],
    }),

    defineField({
      name: 'ourValues',
      title: 'Our Values',
      type: 'array',
      group: 'about',
      description: 'Values cards shown on the About page.',
      of: [{
        type: 'object',
        fields: [
          { name: 'iconName', type: 'string', title: 'Icon name (lucide)', initialValue: 'Star' },
          { name: 'titleEn', type: 'string', title: 'Title (EN)' },
          { name: 'titleAr', type: 'string', title: 'Title (AR)' },
          { name: 'descEn', type: 'text', title: 'Description (EN)', rows: 2 },
          { name: 'descAr', type: 'text', title: 'Description (AR)', rows: 2 },
        ],
        preview: { select: { title: 'titleEn', subtitle: 'titleAr' } },
      }],
    }),

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

    // ── Footer ────────────────────────────────────────────────────────────
    defineField({
      name: 'footerDescription',
      title: 'Footer Description',
      type: 'object',
      group: 'footer',
      description: 'Short tagline shown under the logo in the footer.',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 2, initialValue: "Kuwait's leading institute for language learning and exam preparation." },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 2, initialValue: 'معهدك الرائد لتعلم اللغات والتحضير للامتحانات في الكويت.' },
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
                {
                  name: 'children',
                  type: 'array',
                  title: 'Sub-menu Groups',
                  of: [{
                    type: 'object',
                    name: 'navGroup',
                    fields: [
                      { name: 'label', type: 'string', title: 'Group Label' },
                      { name: 'href', type: 'string', title: 'Group Link' },
                      {
                        name: 'children',
                        type: 'array',
                        title: 'Items',
                        of: [{
                          type: 'object',
                          name: 'navChild',
                          fields: [
                            { name: 'label', type: 'string', title: 'Label' },
                            { name: 'href', type: 'string', title: 'Path' },
                          ],
                          preview: { select: { title: 'label', subtitle: 'href' } },
                        }],
                      },
                    ],
                    preview: { select: { title: 'label', subtitle: 'href' } },
                  }],
                },
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
                {
                  name: 'children',
                  type: 'array',
                  title: 'Sub-menu Groups',
                  of: [{
                    type: 'object',
                    name: 'navGroup',
                    fields: [
                      { name: 'label', type: 'string', title: 'Group Label' },
                      { name: 'href', type: 'string', title: 'Group Link' },
                      {
                        name: 'children',
                        type: 'array',
                        title: 'Items',
                        of: [{
                          type: 'object',
                          name: 'navChild',
                          fields: [
                            { name: 'label', type: 'string', title: 'Label' },
                            { name: 'href', type: 'string', title: 'Path' },
                          ],
                          preview: { select: { title: 'label', subtitle: 'href' } },
                        }],
                      },
                    ],
                    preview: { select: { title: 'label', subtitle: 'href' } },
                  }],
                },
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
