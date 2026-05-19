/**
 * Sanity seed script — dummy courses + team members
 * Usage:  node --env-file=.env.local scripts/seed.mjs
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local to be the FULL token
 * (get it from sanity.io/manage → your project → API → Tokens)
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
let   token     = process.env.SANITY_API_WRITE_TOKEN

// Fall back to Sanity CLI user token when project token is absent/truncated
if (!token || token.endsWith('...')) {
  try {
    const cfg = JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8'))
    if (cfg.authToken) { token = cfg.authToken; console.log('Using Sanity CLI auth token.') }
  } catch {}
}

if (!projectId) { console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID'); process.exit(1) }
if (!token) {
  console.error('No auth token available. Get one from: https://sanity.io/manage → your project → API → Tokens')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, token })

// ── Courses ───────────────────────────────────────────────────────────────────

const courses = [
  {
    _type: 'course',
    _id: 'course-ielts-prep',
    title: { en: 'IELTS Preparation — Intensive', ar: 'التحضير للآيلتس — مكثف' },
    slug: { en: { current: 'ielts-preparation-intensive' }, ar: { current: 'ielts-preparation-intensive' } },
    category: 'exam',
    level: 'intermediate',
    duration: '8 weeks',
    price: 180,
    featured: true,
    description: {
      en: [
        {
          _type: 'block',
          _key: 'e1',
          style: 'normal',
          children: [{ _type: 'span', _key: 's1', text: 'Our most popular course. Covering all four IELTS bands — Reading, Writing, Listening, and Speaking — with timed practice tests every weekend. Suitable for band 5.5 targets and above.' }],
          markDefs: [],
        }
      ],
      ar: [
        {
          _type: 'block',
          _key: 'e1a',
          style: 'normal',
          children: [{ _type: 'span', _key: 's1a', text: 'دورتنا الأكثر شعبية. تغطي جميع مهارات الآيلتس الأربع — القراءة والكتابة والاستماع والتحدث — مع اختبارات تدريبية كل أسبوع. مناسبة لاستهداف باند 5.5 فما فوق.' }],
          markDefs: [],
        }
      ]
    },
  },
  {
    _type: 'course',
    _id: 'course-business-english',
    title: { en: 'Business English — Professional', ar: 'الإنجليزية للأعمال — مستوى احترافي' },
    slug: { en: { current: 'business-english-professional' }, ar: { current: 'business-english-professional' } },
    category: 'language',
    level: 'advanced',
    duration: '10 weeks',
    price: 150,
    featured: true,
    description: {
      en: [
        {
          _type: 'block',
          _key: 'e2',
          style: 'normal',
          children: [{ _type: 'span', _key: 's2', text: 'Designed for working professionals who want to communicate confidently in meetings, emails, and presentations. Covers business vocabulary, negotiations, and report writing.' }],
          markDefs: [],
        }
      ],
      ar: [
        {
          _type: 'block',
          _key: 'e2a',
          style: 'normal',
          children: [{ _type: 'span', _key: 's2a', text: 'مصممة للمحترفين الذين يرغبون في التواصل بثقة في الاجتماعات والبريد الإلكتروني والعروض التقديمية. تشمل المفردات التجارية والمفاوضات وكتابة التقارير.' }],
          markDefs: [],
        }
      ]
    },
  },
  {
    _type: 'course',
    _id: 'course-arabic-nonnative',
    title: { en: 'Arabic for Non-Native Speakers', ar: 'اللغة العربية لغير الناطقين بها' },
    slug: { en: { current: 'arabic-non-native-speakers' }, ar: { current: 'arabic-non-native-speakers' } },
    category: 'language',
    level: 'beginner',
    duration: '12 weeks',
    price: 120,
    featured: false,
    description: {
      en: [
        {
          _type: 'block',
          _key: 'e3',
          style: 'normal',
          children: [{ _type: 'span', _key: 's3', text: 'A gentle, practical introduction to Modern Standard Arabic and Gulf dialect. Perfect for expats living in Kuwait who want to connect with the local community and culture.' }],
          markDefs: [],
        }
      ],
      ar: [
        {
          _type: 'block',
          _key: 'e3a',
          style: 'normal',
          children: [{ _type: 'span', _key: 's3a', text: 'مقدمة عملية للغة العربية الفصحى ولهجة الخليج. مثالية للوافدين المقيمين في الكويت الراغبين في التواصل مع المجتمع المحلي.' }],
          markDefs: [],
        }
      ]
    },
  },
  {
    _type: 'course',
    _id: 'course-french-beginners',
    title: { en: 'French — Beginners', ar: 'الفرنسية — مستوى مبتدئ' },
    slug: { en: { current: 'french-beginners' }, ar: { current: 'french-beginners' } },
    category: 'language',
    level: 'beginner',
    duration: '10 weeks',
    price: 130,
    featured: false,
    description: {
      en: [
        {
          _type: 'block',
          _key: 'e4',
          style: 'normal',
          children: [{ _type: 'span', _key: 's4', text: 'Start your French journey from scratch. Learn to introduce yourself, order food, ask for directions, and hold simple conversations. Great for travel or expanding your language portfolio.' }],
          markDefs: [],
        }
      ],
      ar: [
        {
          _type: 'block',
          _key: 'e4a',
          style: 'normal',
          children: [{ _type: 'span', _key: 's4a', text: 'ابدأ رحلتك مع اللغة الفرنسية من الصفر. تعلم التعريف بنفسك وطلب الطعام والحفاظ على محادثات بسيطة.' }],
          markDefs: [],
        }
      ]
    },
  },
  {
    _type: 'course',
    _id: 'course-toefl-ibt',
    title: { en: 'TOEFL iBT Preparation', ar: 'التحضير لاختبار التوفل iBT' },
    slug: { en: { current: 'toefl-ibt-preparation' }, ar: { current: 'toefl-ibt-preparation' } },
    category: 'exam',
    level: 'intermediate',
    duration: '6 weeks',
    price: 160,
    featured: true,
    description: {
      en: [
        {
          _type: 'block',
          _key: 'e5',
          style: 'normal',
          children: [{ _type: 'span', _key: 's5', text: 'Focused preparation for the TOEFL iBT, covering integrated tasks, note-taking, and academic writing. Full-length practice exams included. Recommended for university admission applicants.' }],
          markDefs: [],
        }
      ],
      ar: [
        {
          _type: 'block',
          _key: 'e5a',
          style: 'normal',
          children: [{ _type: 'span', _key: 's5a', text: 'تحضير مركز لاختبار التوفل iBT يشمل المهام المتكاملة وتدوين الملاحظات والكتابة الأكاديمية. يتضمن اختبارات تدريبية كاملة.' }],
          markDefs: [],
        }
      ]
    },
  },
]

// ── Team Members ──────────────────────────────────────────────────────────────

const team = [
  {
    _type: 'teamMember',
    _id: 'team-moudhi-al-ajmi',
    name: 'Ms. Moudhi Al Ajmi',
    role: { en: 'Chairman & CEO', ar: 'رئيس مجلس الإدارة والرئيس التنفيذي' },
    bio: {
      en: 'Moudhi founded Elevate Learning in 2012 with a vision to make world-class language education accessible to every student in Kuwait. Under her leadership, the institute has grown to serve over 8,000 graduates across 30 nationalities.',
      ar: 'أسست مودهي إليفيت ليرنينج عام 2012 برؤية تجعل تعليم اللغات العالمي متاحاً لكل طالب في الكويت. في ظل قيادتها، نما المعهد ليخدم أكثر من 8000 خريج من 30 جنسية مختلفة.',
    },
    order: 1,
  },
  {
    _type: 'teamMember',
    _id: 'team-venus-coo',
    name: 'Ms. Venus',
    role: { en: 'Chief Operating Officer', ar: 'المدير التنفيذي للعمليات' },
    bio: {
      en: 'Venus oversees the day-to-day operations of Elevate Learning, ensuring every student experience runs smoothly — from enrollment to certification. She brings over 15 years of experience in educational management.',
      ar: 'تشرف فينوس على العمليات اليومية لإليفيت ليرنينج، وتضمن سلاسة كل تجربة طلابية — من التسجيل إلى الشهادة. تتمتع بأكثر من 15 عاماً من الخبرة في الإدارة التعليمية.',
    },
    order: 2,
  },
  {
    _type: 'teamMember',
    _id: 'team-isha-training',
    name: 'Ms. Isha',
    role: { en: 'Director of Training', ar: 'مديرة التدريب' },
    bio: {
      en: 'Isha leads curriculum development and instructor quality at Elevate Learning. A certified IELTS examiner and CELTA-qualified trainer, she ensures every course meets the highest international teaching standards.',
      ar: 'تقود إيشا تطوير المناهج وجودة المدربين في إليفيت ليرنينج. فاحصة آيلتس معتمدة ومدربة مؤهلة بشهادة CELTA، تضمن أن كل دورة تستوفي أعلى معايير التدريس الدولية.',
    },
    order: 3,
  },
]

// ── Run ───────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding Sanity...\n')

  // Upsert courses
  console.log('📚 Creating courses...')
  for (const doc of courses) {
    await client.createOrReplace(doc)
    console.log(`  ✓ ${doc.title.en}`)
  }

  // Upsert team members
  console.log('\n👥 Creating team members...')
  for (const doc of team) {
    await client.createOrReplace(doc)
    console.log(`  ✓ ${doc.name} — ${doc.role.en}`)
  }

  console.log('\n✅ Done! Open /studio to verify the data.')
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
