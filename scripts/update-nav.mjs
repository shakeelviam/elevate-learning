import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production', // ALWAYS production
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
})

const NAV_EN = [
  { _key: 'home',  label: 'Home',        href: '/' },
  { _key: 'about', label: 'Who Are We',  href: '/about' },
  {
    _key: 'offer',
    label: 'We Offer',
    href: '/courses',
    children: [
      {
        _key: 'languages',
        label: 'Languages',
        href: '/courses?category=language',
        children: [
          {
            _key: 'english',
            label: 'English',
            href: '/courses?category=language&language=english',
            children: [
              { _key: 'spoken', label: 'Spoken English', href: '/courses/spoken-english' },
              { _key: 'business', label: 'Business English', href: '/courses/business-english-professional' },
            ],
          },
          {
            _key: 'arabic',
            label: 'Arabic',
            href: '/courses?category=language&language=arabic',
            children: [
              { _key: 'arabic-non', label: 'Arabic for Non-Native Speakers', href: '/courses/arabic-non-native-speakers' },
            ],
          },
          { _key: 'french', label: 'French', href: '/courses/french-beginners' },
          { _key: 'german', label: 'German', href: '/courses?category=language&language=german' },
          { _key: 'spanish', label: 'Spanish', href: '/courses?category=language&language=spanish' },
        ],
      },
      {
        _key: 'testprep',
        label: 'Test Prep',
        href: '/courses?category=exam',
        children: [
          {
            _key: 'ielts',
            label: 'IELTS',
            href: '/courses?category=exam&examType=ielts',
            children: [
              { _key: 'ielts-ac', label: 'IELTS Academic', href: '/courses/ielts-academic' },
              { _key: 'ielts-gt', label: 'IELTS General Training', href: '/courses/ielts-general-training' },
              { _key: 'ielts-uk', label: 'IELTS UKVI', href: '/courses/ielts-ukvi' },
            ],
          },
          {
            _key: 'toefl',
            label: 'TOEFL',
            href: '/courses?category=exam&examType=toefl',
            children: [
              { _key: 'toefl-ibt', label: 'TOEFL iBT', href: '/courses/toefl-ibt-preparation' },
              { _key: 'toefl-itp', label: 'TOEFL ITP', href: '/courses/toefl-itp' },
            ],
          },
          { _key: 'sat',  label: 'SAT',  href: '/courses/sat-preparation' },
          { _key: 'gre',  label: 'GRE',  href: '/courses/gre-preparation' },
          { _key: 'act',  label: 'ACT',  href: '/courses/act-preparation' },
          { _key: 'psat', label: 'PSAT', href: '/courses/psat-preparation' },
          { _key: 'oet',  label: 'OET',  href: '/courses?category=exam&examType=oet' },
          { _key: 'pte',  label: 'PTE',  href: '/courses?category=exam&examType=pte' },
          { _key: 'gmat', label: 'GMAT', href: '/courses?category=exam&examType=gmat' },
        ],
      },
    ],
  },
  { _key: 'faq',     label: 'FAQ',     href: '/faq' },
  { _key: 'contact', label: 'Contact', href: '/contact' },
]

const NAV_AR = [
  { _key: 'home',    label: 'الرئيسية',         href: '/' },
  { _key: 'about',   label: 'من نحن',            href: '/about' },
  {
    _key: 'offer',
    label: 'ما نقدمه',
    href: '/courses',
    children: [
      {
        _key: 'languages',
        label: 'اللغات',
        href: '/courses?category=language',
        children: [
          {
            _key: 'english',
            label: 'الإنجليزية',
            href: '/courses?category=language&language=english',
            children: [
              { _key: 'spoken', label: 'الإنجليزية المحادثة', href: '/courses/spoken-english' },
              { _key: 'business', label: 'الإنجليزية للأعمال', href: '/courses/business-english-professional' },
            ],
          },
          {
            _key: 'arabic',
            label: 'العربية',
            href: '/courses?category=language&language=arabic',
            children: [
              { _key: 'arabic-non', label: 'العربية لغير الناطقين بها', href: '/courses/arabic-non-native-speakers' },
            ],
          },
          { _key: 'french',  label: 'الفرنسية',  href: '/courses/french-beginners' },
          { _key: 'german',  label: 'الألمانية',  href: '/courses?category=language&language=german' },
          { _key: 'spanish', label: 'الإسبانية', href: '/courses?category=language&language=spanish' },
        ],
      },
      {
        _key: 'testprep',
        label: 'تحضير الامتحانات',
        href: '/courses?category=exam',
        children: [
          {
            _key: 'ielts',
            label: 'IELTS',
            href: '/courses?category=exam&examType=ielts',
            children: [
              { _key: 'ielts-ac', label: 'IELTS Academic', href: '/courses/ielts-academic' },
              { _key: 'ielts-gt', label: 'IELTS General Training', href: '/courses/ielts-general-training' },
              { _key: 'ielts-uk', label: 'IELTS UKVI', href: '/courses/ielts-ukvi' },
            ],
          },
          {
            _key: 'toefl',
            label: 'TOEFL',
            href: '/courses?category=exam&examType=toefl',
            children: [
              { _key: 'toefl-ibt', label: 'TOEFL iBT', href: '/courses/toefl-ibt-preparation' },
              { _key: 'toefl-itp', label: 'TOEFL ITP', href: '/courses/toefl-itp' },
            ],
          },
          { _key: 'sat',  label: 'SAT',  href: '/courses/sat-preparation' },
          { _key: 'gre',  label: 'GRE',  href: '/courses/gre-preparation' },
          { _key: 'act',  label: 'ACT',  href: '/courses/act-preparation' },
          { _key: 'psat', label: 'PSAT', href: '/courses/psat-preparation' },
          { _key: 'oet',  label: 'OET',  href: '/courses?category=exam&examType=oet' },
          { _key: 'pte',  label: 'PTE',  href: '/courses?category=exam&examType=pte' },
          { _key: 'gmat', label: 'GMAT', href: '/courses?category=exam&examType=gmat' },
        ],
      },
    ],
  },
  { _key: 'faq',     label: 'الأسئلة الشائعة', href: '/faq' },
  { _key: 'contact', label: 'تواصل معنا',       href: '/contact' },
]

// Find the siteSettings document
const doc = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`)
if (!doc?._id) {
  console.error('No siteSettings document found in production!')
  process.exit(1)
}

console.log('Updating navigation in production siteSettings:', doc._id)

await client
  .patch(doc._id)
  .set({
    'navigation.en': NAV_EN,
    'navigation.ar': NAV_AR,
  })
  .commit()

console.log('Navigation updated successfully in Sanity production.')
