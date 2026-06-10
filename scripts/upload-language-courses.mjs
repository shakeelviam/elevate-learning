/**
 * Uploads all language courses (45 documents) to Sanity production.
 * Run: node --env-file=.env.local scripts/upload-language-courses.mjs
 * Safe to re-run — checks existing slugs and skips duplicates.
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
})

let _k = 0
const key = () => `k${++_k}`

/** Convert plain text paragraphs into Sanity Portable Text blocks */
function pt(...paragraphs) {
  return paragraphs.map(text => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), marks: [], text }],
  }))
}

// ── Level metadata ─────────────────────────────────────────────────────────────

const LEVELS = [
  {
    value: 'beginner',
    slug: 'beginner',
    label_en: 'Beginner (A1/A2)',
    label_ar: 'مستوى مبتدئ (A1/A2)',
    note_en: 'A1/A2 — Basic command of the language.',
    note_ar: 'A1/A2 — إلمام أساسي باللغة.',
  },
  {
    value: 'intermediate',
    slug: 'intermediate',
    label_en: 'Intermediate (B1/B2)',
    label_ar: 'مستوى متوسط (B1/B2)',
    note_en: 'B1/B2 — Limited command of the language.',
    note_ar: 'B1/B2 — إلمام محدود باللغة.',
  },
  {
    value: 'advanced',
    slug: 'advanced',
    label_en: 'Advanced (C1/C2)',
    label_ar: 'مستوى متقدم (C1/C2)',
    note_en: 'C1/C2 — Effective command of the language.',
    note_ar: 'C1/C2 — إتقان فعّال للغة.',
  },
]

// ── Business English syllabus modules ─────────────────────────────────────────

const BE_SYLLABUS = [
  {
    en: 'Business Correspondence',
    ar: 'المراسلات التجارية',
    desc_en: 'Professional written communication — emails, letters, and memos. Creates your permanent professional image and ensures messages are understood instantly, saving time and preventing costly workplace errors.',
    desc_ar: 'التواصل الكتابي المهني من رسائل إلكترونية وخطابات ومذكرات. يرسّخ صورتك المهنية الدائمة ويضمن وصول رسائلك بوضوح تام، مما يوفر الوقت ويقي من الأخطاء المكلفة في بيئة العمل.',
  },
  {
    en: 'Business Writing',
    ar: 'الكتابة التجارية',
    desc_en: 'Proposals, reports, pitches, and summaries that drive strategic corporate decisions. Directly impacts your earning potential and professional influence beyond everyday correspondence.',
    desc_ar: 'المقترحات والتقارير وعروض المشاريع والملخصات التي تقود القرارات الاستراتيجية. تؤثر مباشرة على إمكاناتك الكسبية وتأثيرك المهني بما يتجاوز المراسلات اليومية.',
  },
  {
    en: 'Human Resources',
    ar: 'الموارد البشرية',
    desc_en: 'Tools to manage talent, shape workplace culture, and influence organizational productivity and legal safety. People are the most valuable asset of any business.',
    desc_ar: 'أدوات إدارة المواهب وتشكيل ثقافة بيئة العمل والتأثير في إنتاجية المنظمة وسلامتها القانونية. الناس هم أثمن أصول أي مؤسسة.',
  },
  {
    en: 'Negotiating',
    ar: 'التفاوض',
    desc_en: 'The essential life skill of getting what you want while maintaining positive relationships. Directly impacts your financial wealth, career trajectory, and daily peace of mind.',
    desc_ar: 'مهارة الحياة الجوهرية للحصول على ما تريد مع الحفاظ على علاقات إيجابية. تؤثر مباشرة على ثروتك المالية ومسارك المهني وراحتك اليومية.',
  },
  {
    en: 'Telephoning',
    ar: 'المحادثات الهاتفية',
    desc_en: 'The art of professional voice communication. Voice interactions carry emotional nuance and immediacy that text cannot replicate. Projects confidence and handles high-pressure situations instantly.',
    desc_ar: 'فن التواصل المهني الصوتي. تحمل المحادثات الهاتفية دقة عاطفية وفورية لا تستطيع الرسائل النصية محاكاتها. تعكس الثقة وتتعامل مع المواقف الضاغطة بشكل فوري.',
  },
  {
    en: 'Interview Skills',
    ar: 'مهارات المقابلات',
    desc_en: 'Qualification gets you the meeting, but interviewing gets you the job. Transforms a stressful interrogation into a confident presentation of your professional value.',
    desc_ar: 'المؤهلات تمنحك الاجتماع، لكن مهارات المقابلة تمنحك الوظيفة. تحوّل الاستجواب المُجهد إلى عرض تقديمي واثق لقيمتك المهنية.',
  },
  {
    en: 'Finance',
    ar: 'المالية',
    desc_en: 'Finance terminology within business communication bridges the gap between everyday language and fiscal reality, ensuring messages to stakeholders align with the company\'s bottom line.',
    desc_ar: 'مصطلحات المالية في التواصل التجاري تجسر الهوة بين اللغة اليومية والواقع المالي، لضمان توافق رسائلك للمساهمين مع أهداف الشركة.',
  },
  {
    en: 'Meetings',
    ar: 'الاجتماعات',
    desc_en: 'Mastering business meeting skills transforms how teams collaborate, drives organizational efficiency, and accelerates individual career trajectory.',
    desc_ar: 'إتقان مهارات الاجتماعات التجارية يغير أسلوب تعاون الفرق ويعزز كفاءة المنظمة ويسرّع المسار المهني الفردي.',
  },
  {
    en: 'Presentations',
    ar: 'العروض التقديمية',
    desc_en: 'Accelerates career growth, increases organizational influence, and ensures ideas turn into action. Allows you to command any room and drive strategic decisions.',
    desc_ar: 'تعجّل نمو مسيرتك المهنية وترفع نفوذك التنظيمي وتضمن تحول أفكارك إلى واقع. تمنحك القدرة على قيادة أي اجتماع ودفع القرارات الاستراتيجية.',
  },
  {
    en: 'Travel and Tourism',
    ar: 'السفر والسياحة',
    desc_en: 'Opens global career opportunities, optimizes corporate hospitality budgets, and enhances international client relationships. Ensures seamless, cost-effective logistics while maximizing commercial value.',
    desc_ar: 'يفتح فرص مهنية عالمية ويحسن ميزانيات الضيافة المؤسسية ويعزز العلاقات مع العملاء الدوليين. يضمن لوجستيات سلسة وفعالة من حيث التكلفة مع تعظيم القيمة التجارية.',
  },
]

// ── Language programs ──────────────────────────────────────────────────────────

const PROGRAMS = [
  // ── European Languages ───────────────────────────────────────────────────────
  {
    language: 'spanish',
    name_en: 'Spanish',
    name_ar: 'الإسبانية',
    desc_en: 'Spanish is a globally dominant language spoken by hundreds of millions of people — one of the most practical and rewarding skills you can acquire. It opens doors to over 500 million native speakers worldwide, significantly boosts your career opportunities, and allows you to travel across four continents with deeper cultural connection and confidence.',
    desc_ar: 'الإسبانية لغة مهيمنة على الصعيد العالمي يتحدث بها مئات الملايين. إنها واحدة من أكثر المهارات عملية وإثراءً التي يمكنك اكتسابها. تفتح لك أبواب التواصل مع أكثر من 500 مليون متحدث أصلي حول العالم، وتعزز فرصك المهنية بشكل ملحوظ، وتتيح لك السفر عبر أربع قارات بثقة ومعرفة ثقافية أعمق.',
  },
  {
    language: 'german',
    name_en: 'German',
    name_ar: 'الألمانية',
    desc_en: 'Learning German is a powerful professional and personal asset. It boosts your career in Europe\'s largest economy and opens doors to tuition-free world-class universities. Germany is home to some of the world\'s top institutions, where many publicly-funded universities waive fees for international students — opening thousands of undergraduate and graduate programmes.',
    desc_ar: 'تعلم اللغة الألمانية استثمار مهني وشخصي بامتياز. يعزز مسيرتك في أكبر اقتصادات أوروبا ويفتح الأبواب أمام جامعات عالمية المستوى بدون رسوم. ألمانيا موطن لبعض أرقى الجامعات في العالم، وكثير من مؤسساتها الممولة حكوميًا تعفي الطلاب الدوليين من الرسوم الدراسية، مما يفتح أمامك آلاف البرامج الجامعية والدراسات العليا.',
  },
  {
    language: 'french',
    name_en: 'French',
    name_ar: 'الفرنسية',
    desc_en: 'Learning French vastly expands your personal and professional horizons. It unlocks career opportunities in global business, opens doors to prestigious academic programmes, and enhances travel experiences. Additionally, it acts as a gateway to other languages and significantly boosts cognitive function.',
    desc_ar: 'تعلم اللغة الفرنسية يوسع آفاقك الشخصية والمهنية بشكل ملحوظ. يفتح لك فرصًا مهنية في عالم الأعمال الدولي ويتيح الانتساب إلى برامج أكاديمية مرموقة ويثري تجارب السفر. فضلًا عن ذلك، تمثل الفرنسية جسرًا نحو تعلم لغات أخرى وتعزز القدرات المعرفية.',
  },
  {
    language: 'italian',
    name_en: 'Italian',
    name_ar: 'الإيطالية',
    desc_en: 'Learning Italian offers a perfect blend of personal enrichment, career utility, and brain-boosting benefits. Whether it unlocks deeper travel experiences, enhances your professional reach, or connects you with a rich cultural heritage, Italian has a uniquely rewarding payoff.',
    desc_ar: 'يقدم تعلم اللغة الإيطالية مزيجًا مثاليًا من الإثراء الشخصي والفائدة المهنية وتحفيز القدرات المعرفية. سواء أكانت تفتح أمامك تجارب سفر أعمق، أم تعزز حضورك المهني، أم تربطك بإرث ثقافي غني، فإن الإيطالية تمنحك عائدًا مميزًا لا يضاهى.',
  },
  {
    language: 'czech',
    name_en: 'Czech',
    name_ar: 'التشيكية',
    desc_en: 'Learning Czech opens up unique personal, professional, and cultural opportunities in Central Europe. It is the official language of an economically vibrant country and serves as an excellent gateway to understanding other Slavic cultures.',
    desc_ar: 'تفتح اللغة التشيكية فرصًا شخصية ومهنية وثقافية فريدة في وسط أوروبا. إنها اللغة الرسمية لدولة نابضة بالحيوية الاقتصادية، وتمثل بوابة ممتازة للتعرف على الثقافات السلافية الأخرى.',
  },
  // ── World Languages ──────────────────────────────────────────────────────────
  {
    language: 'arabic',
    name_en: 'Arabic',
    name_ar: 'العربية',
    desc_en: 'Learning Arabic gives you a powerful advantage in today\'s global economy, culture, and cognitive development. It is one of the world\'s fastest-growing languages and a key asset for bridging international gaps. At Elev8, our highly qualified native-language trainer helps you practise real-world, spoken Arabic through natural dialogue.',
    desc_ar: 'يمنحك تعلم اللغة العربية ميزة قوية في الاقتصاد العالمي والمشهد الثقافي الراهن. إنها واحدة من أسرع اللغات نموًا في العالم ورصيد استراتيجي لردم الفجوات الدولية. في إيليفيت، يعمل معك مدرب لغة أصيل ومؤهل تأهيلًا عاليًا على تطوير مهارات التحدث بالعربية الحياتية من خلال الحوار الطبيعي.',
  },
  {
    language: 'mandarin',
    name_en: 'Mandarin',
    name_ar: 'الماندرين',
    desc_en: 'Learning Mandarin provides an unmatched strategic advantage in global business, personal networking, and cognitive enhancement. As the world\'s most spoken native language, it connects you directly to the world\'s second-largest economy.',
    desc_ar: 'يمنحك تعلم الماندرين ميزة استراتيجية لا مثيل لها في عالم الأعمال الدولي والتواصل الشخصي وتطوير القدرات المعرفية. بوصفها اللغة الأكثر تحدثًا من حيث المتحدثين الأصليين في العالم، تربطك مباشرة بثاني أكبر اقتصادات العالم.',
  },
  {
    language: 'japanese',
    name_en: 'Japanese',
    name_ar: 'اليابانية',
    desc_en: 'Learning Japanese opens doors to global career paths, deep cultural appreciation, and advanced cognitive development. As the language of the world\'s fourth-largest economy and a powerhouse of global pop culture, Japanese connects you to unique business, artistic, and technological landscapes.',
    desc_ar: 'تفتح اللغة اليابانية أمامك مسارات مهنية عالمية واهتمامًا ثقافيًا عميقًا وتطورًا معرفيًا متقدمًا. بوصفها لغة رابع أكبر اقتصادات العالم وقوة دافعة في الثقافة الشعبية العالمية، تربطك اليابانية ببيئات أعمال وفنون وتكنولوجيا فريدة.',
  },
  {
    language: 'portuguese',
    name_en: 'Portuguese',
    name_ar: 'البرتغالية',
    desc_en: 'Learning Portuguese connects you to a fast-growing global economy and a rich cultural heritage spanning four continents. As the ninth most spoken language in the world and the most spoken in the Southern Hemisphere, it offers rare professional advantages and acts as a gateway to other Romance languages.',
    desc_ar: 'تربطك اللغة البرتغالية باقتصاد عالمي سريع النمو وإرث ثقافي ثري يمتد عبر أربع قارات. بوصفها تاسع أكثر اللغات انتشارًا في العالم والأكثر تحدثًا في نصف الكرة الجنوبي، توفر مزايا مهنية نادرة وتشكل جسرًا نحو اللغات الرومانسية الأخرى.',
  },
  {
    language: 'turkish',
    name_en: 'Turkish',
    name_ar: 'التركية',
    desc_en: 'Learning Turkish connects you to a strategically vital geographic hub and a rich historical heritage linking Europe and Asia. As a language spoken by nearly 100 million people globally, it offers unique professional opportunities and a gateway to the broader Turkic world.',
    desc_ar: 'تربطك اللغة التركية بمركز جغرافي استراتيجي وإرث تاريخي ثري يجمع بين أوروبا وآسيا. بوصفها لغة يتحدثها قرابة 100 مليون شخص حول العالم، توفر فرصًا مهنية استثنائية وبوابة نحو عالم اللغات التركية الأوسع.',
  },
  {
    language: 'korean',
    name_en: 'Korean',
    name_ar: 'الكورية',
    desc_en: 'Learning Korean connects you to a global cultural powerhouse and the world\'s 14th-largest economy. As a language spoken by over 80 million people, it offers exceptional advantages in the modern job market, tech sectors, and entertainment industries.',
    desc_ar: 'تربطك اللغة الكورية بقوة ثقافية عالمية وأحد أكبر اقتصادات العالم. بوصفها لغة يتحدثها أكثر من 80 مليون شخص، توفر مزايا استثنائية في سوق العمل الحديث وقطاعات التكنولوجيا والصناعات الترفيهية.',
  },
  {
    language: 'russian',
    name_en: 'Russian',
    name_ar: 'الروسية',
    desc_en: 'Learning Russian connects you to a vast geopolitical landscape and a renowned cultural tradition spanning Eastern Europe and Northern Asia. As the most spoken native language in Europe and a primary language of international space exploration, it offers unique strategic and professional benefits.',
    desc_ar: 'تربطك اللغة الروسية بمشهد جيوسياسي واسع وتراث ثقافي عريق يمتد عبر شرق أوروبا وشمال آسيا. بوصفها أكثر اللغات الأوروبية انتشارًا وإحدى اللغات الأساسية في استكشاف الفضاء الدولي، تتميز بمزايا استراتيجية ومهنية فريدة.',
  },
  {
    language: 'hindi',
    name_en: 'Hindi',
    name_ar: 'الهندية',
    desc_en: 'Learning Hindi connects you to one of the world\'s fastest-growing economies and a vibrant, ancient cultural landscape. As the third most spoken language globally — with over 600 million speakers — Hindi offers unparalleled advantages in international business, tech, and cultural media.',
    desc_ar: 'تربطك اللغة الهندية بواحد من أسرع الاقتصادات نموًا في العالم ومشهد ثقافي نابض وقديم. بوصفها ثالث أكثر اللغات تحدثًا على مستوى العالم — إذ يتجاوز متحدثوها 600 مليون شخص — تتمتع بمزايا لا مثيل لها في مجالات الأعمال الدولية والتكنولوجيا ووسائل الإعلام الثقافية.',
  },
  // ── English ──────────────────────────────────────────────────────────────────
  {
    language: 'english',
    languageSubType: 'general',
    name_en: 'General English',
    name_ar: 'الإنجليزية العامة',
    desc_en: 'Designed to build everyday language proficiency for non-native speakers. Focuses on practical communication rather than specialised jargon, helping students use English confidently in social, travel, and casual workplace environments. Starting from the absolute beginner to more advanced levels, our aim is to develop your English and communication skills.',
    desc_ar: 'صُمم هذا البرنامج لتطوير الكفاءة اللغوية اليومية لدى غير الناطقين بالإنجليزية. يركز على التواصل العملي بدلًا من المصطلحات المتخصصة، ليساعد المتعلمين على استخدام الإنجليزية بثقة في السياقات الاجتماعية وأثناء السفر وفي بيئات العمل اليومية. يبدأ البرنامج من المستوى الصفري وصولًا إلى المستويات المتقدمة، ويهدف إلى تطوير مهاراتك في اللغة الإنجليزية والتواصل.',
  },
  {
    language: 'english',
    languageSubType: 'business',
    name_en: 'Business English',
    name_ar: 'الإنجليزية للأعمال',
    desc_en: 'Our Business English programmes help learners at all levels communicate effectively. Business English is the global language of trade — mastering it builds professional credibility, enables clear communication across cultures, and unlocks international career opportunities. Beyond conversation, it equips you with the language and skills to stand out in the corporate world.',
    desc_ar: 'تساعد برامج الإنجليزية للأعمال المتعلمين من جميع المستويات على التواصل بفاعلية. الإنجليزية للأعمال هي اللغة العالمية للتجارة — إتقانها يعزز مصداقيتك المهنية ويمكّنك من التواصل بوضوح عبر الثقافات ويفتح أمامك فرصًا وظيفية دولية. وبما يتجاوز المحادثة، تزودك بالمهارات اللغوية اللازمة للتميز في عالم الشركات.',
  },
]

// ── Build course documents ─────────────────────────────────────────────────────

function buildSyllabus() {
  return BE_SYLLABUS.map(mod => ({
    _type: 'module',
    _key: key(),
    moduleTitle: { en: mod.en, ar: mod.ar },
    lessons: [{
      _type: 'lesson',
      _key: key(),
      en: mod.desc_en,
      ar: mod.desc_ar,
    }],
  }))
}

function buildCourses() {
  const courses = []
  for (const prog of PROGRAMS) {
    for (const level of LEVELS) {
      const slugBase = prog.languageSubType
        ? `${prog.languageSubType === 'general' ? 'general-english' : 'business-english'}-${level.slug}`
        : `${prog.language}-${level.slug}`

      const doc = {
        _type: 'course',
        title: {
          en: `${prog.name_en} — ${level.label_en}`,
          ar: `${prog.name_ar} — ${level.label_ar}`,
        },
        slug: {
          en: { _type: 'slug', current: slugBase },
          ar: { _type: 'slug', current: slugBase },
        },
        category: 'language',
        language: prog.language,
        level: level.value,
        featured: false,
        description: {
          en: pt(prog.desc_en, level.note_en),
          ar: pt(prog.desc_ar, level.note_ar),
        },
      }

      if (prog.languageSubType) doc.languageSubType = prog.languageSubType
      if (prog.languageSubType === 'business') doc.syllabus = buildSyllabus()

      courses.push(doc)
    }
  }
  return courses
}

// ── Main ───────────────────────────────────────────────────────────────────────

const existing = await client.fetch('*[_type == "course"]{ "slug": slug.en.current }')
const existingSlugs = new Set(existing.map(c => c.slug))

const courses = buildCourses()
let created = 0
let skipped = 0

for (const course of courses) {
  const slug = course.slug.en.current
  if (existingSlugs.has(slug)) {
    console.log(`  SKIP  ${slug}`)
    skipped++
    continue
  }
  await client.create(course)
  console.log(`  ✓     ${slug}`)
  created++
}

console.log(`\nDone. Created: ${created}  Skipped: ${skipped}`)
