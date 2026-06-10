/**
 * Updates the siteSettings navigation to include the full language course hierarchy.
 * Structure: We Offer → Languages → European/World/English → Language → Beginner/Intermediate/Advanced
 * Run: node --env-file=.env.local scripts/update-nav-languages.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const levels_en = [
  { _key: 'lv-beg', label: 'Beginner (A1/A2)',     href: 'SLUG-beginner'     },
  { _key: 'lv-int', label: 'Intermediate (B1/B2)',  href: 'SLUG-intermediate' },
  { _key: 'lv-adv', label: 'Advanced (C1/C2)',      href: 'SLUG-advanced'     },
]
const levels_ar = [
  { _key: 'lv-beg', label: 'مستوى مبتدئ (A1/A2)',   href: 'SLUG-beginner'     },
  { _key: 'lv-int', label: 'مستوى متوسط (B1/B2)',    href: 'SLUG-intermediate' },
  { _key: 'lv-adv', label: 'مستوى متقدم (C1/C2)',    href: 'SLUG-advanced'     },
]

function langLevels_en(slug) {
  return levels_en.map(l => ({ ...l, _key: `${slug}-${l._key}`, href: `/courses/${slug}-${l.href.replace('SLUG-', '')}` }))
}
function langLevels_ar(slug) {
  return levels_ar.map(l => ({ ...l, _key: `${slug}-${l._key}`, href: `/courses/${slug}-${l.href.replace('SLUG-', '')}` }))
}

const NAV_EN = [
  { _key: 'home',    label: 'Home',       href: '/' },
  { _key: 'about',   label: 'Who Are We', href: '/about' },
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
            _key: 'european',
            label: 'European Languages',
            href: '/courses?category=language',
            children: [
              { _key: 'spanish',  label: 'Spanish',  href: '/courses?category=language&language=spanish',  children: langLevels_en('spanish')  },
              { _key: 'german',   label: 'German',   href: '/courses?category=language&language=german',   children: langLevels_en('german')   },
              { _key: 'french',   label: 'French',   href: '/courses?category=language&language=french',   children: langLevels_en('french')   },
              { _key: 'italian',  label: 'Italian',  href: '/courses?category=language&language=italian',  children: langLevels_en('italian')  },
              { _key: 'czech',    label: 'Czech',    href: '/courses?category=language&language=czech',    children: langLevels_en('czech')    },
            ],
          },
          {
            _key: 'world',
            label: 'World Languages',
            href: '/courses?category=language',
            children: [
              { _key: 'arabic',     label: 'Arabic',      href: '/courses?category=language&language=arabic',     children: langLevels_en('arabic')     },
              { _key: 'mandarin',   label: 'Mandarin',    href: '/courses?category=language&language=mandarin',   children: langLevels_en('mandarin')   },
              { _key: 'japanese',   label: 'Japanese',    href: '/courses?category=language&language=japanese',   children: langLevels_en('japanese')   },
              { _key: 'portuguese', label: 'Portuguese',  href: '/courses?category=language&language=portuguese', children: langLevels_en('portuguese') },
              { _key: 'turkish',    label: 'Turkish',     href: '/courses?category=language&language=turkish',    children: langLevels_en('turkish')    },
              { _key: 'korean',     label: 'Korean',      href: '/courses?category=language&language=korean',     children: langLevels_en('korean')     },
              { _key: 'russian',    label: 'Russian',     href: '/courses?category=language&language=russian',    children: langLevels_en('russian')    },
              { _key: 'hindi',      label: 'Hindi',       href: '/courses?category=language&language=hindi',      children: langLevels_en('hindi')      },
            ],
          },
          {
            _key: 'english-group',
            label: 'English',
            href: '/courses?category=language&language=english',
            children: [
              { _key: 'gen-en',  label: 'General English',  href: '/courses?category=language&language=english', children: langLevels_en('general-english')  },
              { _key: 'biz-en',  label: 'Business English', href: '/courses?category=language&language=english', children: langLevels_en('business-english') },
            ],
          },
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
              { _key: 'ielts-ac', label: 'IELTS Academic',          href: '/courses/ielts-academic'          },
              { _key: 'ielts-gt', label: 'IELTS General Training',   href: '/courses/ielts-general-training'  },
              { _key: 'ielts-uk', label: 'IELTS UKVI',               href: '/courses/ielts-ukvi'              },
            ],
          },
          {
            _key: 'toefl',
            label: 'TOEFL',
            href: '/courses?category=exam&examType=toefl',
            children: [
              { _key: 'toefl-ibt', label: 'TOEFL iBT', href: '/courses/toefl-ibt-preparation' },
              { _key: 'toefl-itp', label: 'TOEFL ITP', href: '/courses/toefl-itp'              },
            ],
          },
          { _key: 'sat',  label: 'SAT',  href: '/courses/sat-preparation'  },
          { _key: 'gre',  label: 'GRE',  href: '/courses/gre-preparation'  },
          { _key: 'act',  label: 'ACT',  href: '/courses/act-preparation'  },
          { _key: 'psat', label: 'PSAT', href: '/courses/psat-preparation' },
          { _key: 'oet',  label: 'OET',  href: '/courses?category=exam&examType=oet'  },
          { _key: 'pte',  label: 'PTE',  href: '/courses?category=exam&examType=pte'  },
          { _key: 'gmat', label: 'GMAT', href: '/courses?category=exam&examType=gmat' },
        ],
      },
    ],
  },
  { _key: 'faq',     label: 'FAQ',     href: '/faq'     },
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
            _key: 'european',
            label: 'اللغات الأوروبية',
            href: '/courses?category=language',
            children: [
              { _key: 'spanish',  label: 'الإسبانية', href: '/courses?category=language&language=spanish',  children: langLevels_ar('spanish')  },
              { _key: 'german',   label: 'الألمانية',  href: '/courses?category=language&language=german',   children: langLevels_ar('german')   },
              { _key: 'french',   label: 'الفرنسية',   href: '/courses?category=language&language=french',   children: langLevels_ar('french')   },
              { _key: 'italian',  label: 'الإيطالية',  href: '/courses?category=language&language=italian',  children: langLevels_ar('italian')  },
              { _key: 'czech',    label: 'التشيكية',   href: '/courses?category=language&language=czech',    children: langLevels_ar('czech')    },
            ],
          },
          {
            _key: 'world',
            label: 'لغات العالم',
            href: '/courses?category=language',
            children: [
              { _key: 'arabic',     label: 'العربية',    href: '/courses?category=language&language=arabic',     children: langLevels_ar('arabic')     },
              { _key: 'mandarin',   label: 'الماندرين',  href: '/courses?category=language&language=mandarin',   children: langLevels_ar('mandarin')   },
              { _key: 'japanese',   label: 'اليابانية',  href: '/courses?category=language&language=japanese',   children: langLevels_ar('japanese')   },
              { _key: 'portuguese', label: 'البرتغالية', href: '/courses?category=language&language=portuguese', children: langLevels_ar('portuguese') },
              { _key: 'turkish',    label: 'التركية',    href: '/courses?category=language&language=turkish',    children: langLevels_ar('turkish')    },
              { _key: 'korean',     label: 'الكورية',    href: '/courses?category=language&language=korean',     children: langLevels_ar('korean')     },
              { _key: 'russian',    label: 'الروسية',    href: '/courses?category=language&language=russian',    children: langLevels_ar('russian')    },
              { _key: 'hindi',      label: 'الهندية',    href: '/courses?category=language&language=hindi',      children: langLevels_ar('hindi')      },
            ],
          },
          {
            _key: 'english-group',
            label: 'الإنجليزية',
            href: '/courses?category=language&language=english',
            children: [
              { _key: 'gen-en',  label: 'الإنجليزية العامة',    href: '/courses?category=language&language=english', children: langLevels_ar('general-english')  },
              { _key: 'biz-en',  label: 'الإنجليزية للأعمال',   href: '/courses?category=language&language=english', children: langLevels_ar('business-english') },
            ],
          },
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
              { _key: 'ielts-ac', label: 'IELTS Academic',          href: '/courses/ielts-academic'          },
              { _key: 'ielts-gt', label: 'IELTS General Training',   href: '/courses/ielts-general-training'  },
              { _key: 'ielts-uk', label: 'IELTS UKVI',               href: '/courses/ielts-ukvi'              },
            ],
          },
          {
            _key: 'toefl',
            label: 'TOEFL',
            href: '/courses?category=exam&examType=toefl',
            children: [
              { _key: 'toefl-ibt', label: 'TOEFL iBT', href: '/courses/toefl-ibt-preparation' },
              { _key: 'toefl-itp', label: 'TOEFL ITP', href: '/courses/toefl-itp'              },
            ],
          },
          { _key: 'sat',  label: 'SAT',  href: '/courses/sat-preparation'  },
          { _key: 'gre',  label: 'GRE',  href: '/courses/gre-preparation'  },
          { _key: 'act',  label: 'ACT',  href: '/courses/act-preparation'  },
          { _key: 'psat', label: 'PSAT', href: '/courses/psat-preparation' },
          { _key: 'oet',  label: 'OET',  href: '/courses?category=exam&examType=oet'  },
          { _key: 'pte',  label: 'PTE',  href: '/courses?category=exam&examType=pte'  },
          { _key: 'gmat', label: 'GMAT', href: '/courses?category=exam&examType=gmat' },
        ],
      },
    ],
  },
  { _key: 'faq',     label: 'الأسئلة الشائعة', href: '/faq'     },
  { _key: 'contact', label: 'تواصل معنا',       href: '/contact' },
]

const doc = await client.fetch('*[_type == "siteSettings"][0]{ _id }')
if (!doc?._id) { console.error('No siteSettings found'); process.exit(1) }

await client.patch(doc._id).set({ 'navigation.en': NAV_EN, 'navigation.ar': NAV_AR }).commit()
console.log('Navigation updated successfully.')
