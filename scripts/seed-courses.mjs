/**
 * Seed / update course documents in Sanity.
 * Run: node scripts/seed-courses.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const token = 'skw48mvALVm53MR68hOTaAc08L9Cx8meubNRsiobUUy6FEs4nWUErcdHWkN6amvFyqJpRxAzA6VA52UpY'

const client = createClient({
  projectId: '7vl4bc10',
  dataset: 'development',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

let _keyCounter = 0
function key() { return `k${++_keyCounter}` }

function h2(text) {
  return { _type: 'block', _key: key(), style: 'h2', children: [{ _type: 'span', _key: key(), text, marks: [] }], markDefs: [] }
}
function h3(text) {
  return { _type: 'block', _key: key(), style: 'h3', children: [{ _type: 'span', _key: key(), text, marks: [] }], markDefs: [] }
}
function p(text) {
  return { _type: 'block', _key: key(), style: 'normal', children: [{ _type: 'span', _key: key(), text, marks: [] }], markDefs: [] }
}
function bullet(text) {
  return { _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', _key: key(), text, marks: [] }], markDefs: [] }
}

// ── Course content ────────────────────────────────────────────────────────────

const ieltsAcademicContent = [
  h2('IELTS Academic – Designed for Future Scholars & Professionals'),
  h3('Advanced Academic Preparation'),
  p('Develop the skills required for university admissions, professional licensing, and international education pathways — guided by Ms. Preeti Devadiga, with over 15 years of IELTS training experience.'),
  h3('Strategic Skill Enhancement'),
  p('Build confidence in Academic Reading, Report Writing, Structured Essays, Advanced Listening, and Fluent Speaking through proven techniques refined over 15+ years of coaching.'),
  h3('Research & Analytical Training'),
  p('Learn how to interpret graphs, diagrams, academic articles, and complex question patterns effectively.'),
  h3('Personalized Learning Tracks'),
  p('Ideal for:'),
  bullet('University applicants'),
  bullet('Medical professionals'),
  bullet('Engineers & researchers'),
  bullet('Students planning overseas education'),
  h3('Intensive Practice Ecosystem'),
  p('Access updated mock exams, digital practice platforms, vocabulary builders, and examiner-style feedback.'),
  h3('Performance Evaluation System'),
  p('Receive detailed band analysis, error correction sessions, and score-improvement strategies after every mock test.'),
]

const ieltsGeneralContent = [
  h2('IELTS General Training – Practical English for Migration & Work'),
  h3('Real-Life Communication Focus'),
  p('Strengthen the practical English skills needed for work environments, migration procedures, and everyday communication abroad.'),
  h3('Workplace & Social English Training'),
  p('Master formal letters, workplace conversations, functional vocabulary, and task-based communication.'),
  h3('Flexible Learning Formats'),
  p('Choose from:'),
  bullet('Weekend batches'),
  bullet('Fast-track coaching'),
  bullet('One-to-one mentoring'),
  bullet('Online & hybrid classes'),
  h3('Ideal For'),
  bullet('Immigration applicants'),
  bullet('Working professionals'),
  bullet('Job seekers abroad'),
  bullet('Individuals relocating with families'),
  h3('Interactive Classroom Approach'),
  p('Learn through roleplays, speaking drills, listening labs, and practical writing exercises.'),
  h3('Exam-Oriented Preparation'),
  p('Practice with authentic General Training question patterns and timed simulations for maximum exam readiness.'),
]

const ieltsUKVIContent = [
  h2('IELTS UKVI – Secure English Test for UK Visas & Immigration'),
  h3('Specialized UKVI Exam Preparation'),
  p('Prepare specifically for the Secure English Language Test (SELT) approved by UK Visas and Immigration — with expert guidance from Ms. Preeti Devadiga.'),
  h3('UK Immigration & Study Pathways'),
  p('Suitable for:'),
  bullet('UK student visas'),
  bullet('Skilled worker visas'),
  bullet('Permanent residency applications'),
  bullet('Foundation and pre-sessional courses'),
  h3('Authentic UKVI Mock Tests'),
  p('Experience exam-style conditions with biometric-style procedures and full official format familiarity.'),
  h3('Targeted Speaking & Writing Guidance'),
  p('Focused coaching on fluency, coherence, pronunciation, and task achievement to UKVI standards.'),
  h3('Updated UKVI Resources'),
  p('Access current UKVI practice materials, structured study plans, and dedicated trainer support throughout your preparation.'),
]

const toeflIBTContent = [
  h2('TOEFL iBT – Internet-Based Test'),
  h3('Global English Proficiency for Academic Success'),
  p('Prepare for international university environments with integrated English skills designed for academic communication — trained by Ms. Preeti Devadiga, 15+ years of test prep expertise.'),
  h3('Integrated Skill Development'),
  p('Strengthen Reading, Listening, Speaking, and Writing through advanced strategies aligned with the official TOEFL iBT format.'),
  h3('Academic Communication Excellence'),
  p('Learn how to:'),
  bullet('Analyze lectures and academic discussions'),
  bullet('Summarize and paraphrase complex content'),
  bullet('Present structured spoken and written responses'),
  bullet('Build fluent, confident communication'),
  h3('Real Test Environment Simulations'),
  p('Practice with timed mock exams that replicate actual TOEFL iBT conditions and pressure.'),
  h3('Flexible Learning Models'),
  bullet('Fast-track TOEFL preparation'),
  bullet('Weekend batches'),
  bullet('One-to-one mentoring'),
  bullet('Online & hybrid programs'),
  h3('Best Suited For'),
  bullet('Students applying to international universities'),
  bullet('Scholarship applicants'),
  bullet('Graduate & postgraduate aspirants'),
  bullet('Professionals seeking global academic opportunities'),
  h3('Course Advantages'),
  bullet('Advanced academic vocabulary building'),
  bullet('Note-taking & active listening mastery'),
  bullet('Independent & integrated writing support'),
  bullet('Speaking fluency with guided drills and mock interviews'),
  bullet('Time management and high-score strategies'),
]

const toeflITPContent = [
  h2('TOEFL ITP – Institutional Testing Program'),
  h3('Important Note'),
  p('TOEFL ITP is an institutional test — not accepted for visa or international university applications — but widely used for internal placement, English benchmarking, and academic progression programs.'),
  h3('Structured English Skill Enhancement'),
  p('Prepare for institutional English proficiency requirements with focused grammar, listening, and reading training.'),
  h3('Foundation-Level Academic Preparation'),
  p('Build strong English fundamentals for higher studies, internal evaluations, or language advancement programs.'),
  h3('Grammar & Structure Development'),
  p('Strengthen:'),
  bullet('Sentence construction and grammar accuracy'),
  bullet('Vocabulary range and usage'),
  bullet('Reading comprehension techniques'),
  h3('Listening Accuracy Training'),
  p('Improve understanding of academic conversations, short talks, and spoken English through guided practice.'),
  h3('Reading Speed & Comprehension Skills'),
  p('Learn skimming, scanning, and critical reading strategies for faster, more accurate performance.'),
  h3('Best Suited For'),
  bullet('University foundation students'),
  bullet('Institutional placement candidates'),
  bullet('English language learners'),
  bullet('Students preparing for academic progression'),
  h3('Course Benefits'),
  bullet('Classroom-oriented, interactive learning'),
  bullet('Simplified test strategies and question pattern walkthroughs'),
  bullet('Step-by-step learning modules for gradual skill development'),
  bullet('Regular diagnostic assessments and trainer feedback'),
  bullet('Updated practice papers, vocabulary exercises, and grammar modules'),
]

const psatContent = [
  h2('PSAT Preparation Program'),
  h3('Early Preparation for Future Academic Success'),
  p('Give students a head start with Ms. Preeti Devadiga\'s structured PSAT coaching — building the verbal, mathematical, and analytical skills needed for SAT readiness and college preparation.'),
  h3('Smart Skill Development'),
  p('Strengthen Reading, Writing & Language, and Math through structured practice and strategic learning techniques.'),
  h3('Digital Exam Familiarity'),
  p('Gain confidence with adaptive digital testing, time management strategies, and question navigation skills.'),
  h3('Scholarship Awareness & Guidance'),
  p('Understand how PSAT scores contribute to scholarship opportunities like the National Merit Scholarship.'),
  h3('Best Suited For'),
  bullet('High school students preparing for SAT'),
  bullet('Students aiming for scholarship recognition'),
  bullet('Learners building strong academic foundations'),
  bullet('Students seeking early competitive exam exposure'),
  h3('Course Advantages'),
  bullet('Concept-based learning: grammar, vocabulary, algebra, data interpretation, logical reasoning'),
  bullet('Progressive practice with gradual difficulty increase'),
  bullet('Diagnostic assessments to identify strengths and gaps'),
  bullet('Interactive strategy workshops and guided problem-solving'),
  bullet('Academic readiness training for higher-level standardized testing'),
]

const satContent = [
  h2('SAT Preparation Program'),
  h3('Advanced Digital SAT Coaching for Global University Admissions'),
  p('Master the latest Digital SAT format under the guidance of Ms. Preeti Devadiga, whose 15+ years of test prep experience has helped students consistently achieve their target scores.'),
  h3('Strategic Score Improvement'),
  p('Learn adaptive testing strategies, time-saving methods, and high-scoring approaches used by top-performing students.'),
  h3('Advanced Analytical Skill Development'),
  p('Build critical thinking, evidence-based reading, grammar precision, and mathematical reasoning.'),
  h3('Data-Driven Performance Analysis'),
  p('Receive detailed score breakdowns, mock evaluations, and targeted improvement recommendations after each test.'),
  h3('Real Digital Exam Simulations'),
  p('Practice under realistic Digital SAT conditions to improve speed, accuracy, and confidence.'),
  h3('Best Suited For'),
  bullet('Students applying to international universities'),
  bullet('Scholarship aspirants'),
  bullet('Advanced high school students'),
  bullet('Students targeting competitive SAT scores'),
  h3('Course Advantages'),
  bullet('Adaptive digital practice aligned to the official format'),
  bullet('Reading & grammar mastery: comprehension, rhetorical analysis, vocabulary'),
  bullet('Advanced math: algebra, data analysis, geometry, higher-level reasoning'),
  bullet('Personalized coaching plans based on individual performance'),
  bullet('Intensive full-length mock test series with expert review'),
  bullet('University admissions guidance: score targets, timelines, and academic planning'),
]

const greContent = [
  h2('GRE Preparation Program'),
  h3('Graduate School Admission Test Coaching'),
  p('Prepare for the Graduate Record Examination with expert coaching from Ms. Preeti Devadiga, covering all sections of the GRE General Test for graduate and business school admissions.'),
  h3('Comprehensive GRE Skill Development'),
  p('Strengthen Verbal Reasoning, Quantitative Reasoning, and Analytical Writing through targeted strategies and practice.'),
  h3('Verbal Reasoning Mastery'),
  p('Build advanced vocabulary, text completion, sentence equivalence, and reading comprehension skills for the Verbal section.'),
  h3('Quantitative Reasoning Training'),
  p('Master arithmetic, algebra, geometry, and data analysis with smart problem-solving techniques.'),
  h3('Analytical Writing Excellence'),
  p('Develop structured argument analysis and issue essay writing skills to achieve top scores on the writing section.'),
  h3('Best Suited For'),
  bullet('Students applying to graduate programs'),
  bullet('Business school aspirants (MBA)'),
  bullet('Scholarship and fellowship applicants'),
  bullet('Professionals seeking academic advancement'),
  h3('Course Advantages'),
  bullet('Section-wise expert coaching with targeted practice'),
  bullet('Full-length GRE simulations under timed conditions'),
  bullet('Advanced vocabulary building and retention techniques'),
  bullet('Personalized score improvement strategies'),
  bullet('Detailed performance analysis after each mock test'),
]

const actContent = [
  h2('ACT Preparation Program'),
  h3('Performance-Focused Training for University Entrance Success'),
  p('Prepare for all four ACT sections — English, Mathematics, Reading, and Science — with structured, exam-focused coaching from Ms. Preeti Devadiga.'),
  h3('Speed & Accuracy Enhancement'),
  p('Develop faster problem-solving techniques and strong time management skills for high-pressure testing conditions.'),
  h3('Scientific & Analytical Reasoning'),
  p('Build interpretation skills for scientific passages, graphs, experiments, and data analysis questions.'),
  h3('Best Suited For'),
  bullet('Students applying to U.S. universities'),
  bullet('Learners strong in analytical and science reasoning'),
  bullet('Students seeking alternative standardized testing pathways'),
  bullet('Competitive university applicants'),
  h3('Course Advantages'),
  bullet('Section-wise expert coaching: English, Reading, Math, Science Reasoning'),
  bullet('High-speed testing techniques for rapid comprehension'),
  bullet('Science reasoning: charts, experiments, research summaries'),
  bullet('Personalized progress tracking with regular assessments and feedback'),
  bullet('Timed mock tests replicating official ACT conditions'),
  bullet('Updated study materials, digital practice modules, and strategy workshops'),
]

// ── Courses to create/update ──────────────────────────────────────────────────

const courses = [
  {
    _id: 'course-ielts-academic',
    _type: 'course',
    title: { en: 'IELTS Academic', ar: 'الآيلتس الأكاديمي' },
    slug: { en: { _type: 'slug', current: 'ielts-academic' }, ar: { _type: 'slug', current: 'ielts-academic' } },
    category: 'exam',
    examType: 'ielts',
    examSubType: 'academic',
    level: 'all',
    description: { en: ieltsAcademicContent },
  },
  {
    _id: 'course-ielts-general',
    _type: 'course',
    title: { en: 'IELTS General Training', ar: 'الآيلتس التدريب العام' },
    slug: { en: { _type: 'slug', current: 'ielts-general-training' }, ar: { _type: 'slug', current: 'ielts-general-training' } },
    category: 'exam',
    examType: 'ielts',
    examSubType: 'general_training',
    level: 'all',
    description: { en: ieltsGeneralContent },
  },
  {
    _id: 'course-ielts-ukvi',
    _type: 'course',
    title: { en: 'IELTS UKVI', ar: 'الآيلتس للتأشيرة البريطانية' },
    slug: { en: { _type: 'slug', current: 'ielts-ukvi' }, ar: { _type: 'slug', current: 'ielts-ukvi' } },
    category: 'exam',
    examType: 'ielts',
    examSubType: 'ukvi',
    level: 'all',
    description: { en: ieltsUKVIContent },
  },
  {
    _id: 'course-toefl-itp',
    _type: 'course',
    title: { en: 'TOEFL ITP', ar: 'التوفل ITP' },
    slug: { en: { _type: 'slug', current: 'toefl-itp' }, ar: { _type: 'slug', current: 'toefl-itp' } },
    category: 'exam',
    examType: 'toefl',
    examSubType: 'itp',
    level: 'all',
    description: { en: toeflITPContent },
  },
  {
    _id: 'course-psat',
    _type: 'course',
    title: { en: 'PSAT Preparation', ar: 'التحضير لاختبار PSAT' },
    slug: { en: { _type: 'slug', current: 'psat-preparation' }, ar: { _type: 'slug', current: 'psat-preparation' } },
    category: 'exam',
    examType: 'psat',
    level: 'all',
    description: { en: psatContent },
  },
  {
    _id: 'course-sat',
    _type: 'course',
    title: { en: 'SAT Preparation', ar: 'التحضير لاختبار SAT' },
    slug: { en: { _type: 'slug', current: 'sat-preparation' }, ar: { _type: 'slug', current: 'sat-preparation' } },
    category: 'exam',
    examType: 'sat',
    level: 'all',
    description: { en: satContent },
  },
  {
    _id: 'course-gre',
    _type: 'course',
    title: { en: 'GRE Preparation', ar: 'التحضير لاختبار GRE' },
    slug: { en: { _type: 'slug', current: 'gre-preparation' }, ar: { _type: 'slug', current: 'gre-preparation' } },
    category: 'exam',
    examType: 'gre',
    level: 'all',
    description: { en: greContent },
  },
  {
    _id: 'course-act',
    _type: 'course',
    title: { en: 'ACT Preparation', ar: 'التحضير لاختبار ACT' },
    slug: { en: { _type: 'slug', current: 'act-preparation' }, ar: { _type: 'slug', current: 'act-preparation' } },
    category: 'exam',
    examType: 'act',
    level: 'all',
    description: { en: actContent },
  },
  {
    _id: 'course-spoken-english',
    _type: 'course',
    title: { en: 'Spoken English', ar: 'الإنجليزية المحادثة' },
    slug: { en: { _type: 'slug', current: 'spoken-english' }, ar: { _type: 'slug', current: 'spoken-english' } },
    category: 'language',
    language: 'english',
    languageSubType: 'spoken',
    level: 'all',
  },
]

// Updates to existing courses
const updates = [
  { _id: 'course-toefl-ibt', examType: 'toefl', examSubType: 'ibt', description: { en: toeflIBTContent } },
  { _id: 'course-ielts-prep', examType: 'ielts' },
  { _id: 'course-business-english', language: 'english', languageSubType: 'business' },
  { _id: 'course-arabic-nonnative', language: 'arabic' },
  { _id: 'course-french-beginners', language: 'french' },
]

async function run() {
  console.log('Creating / upserting course documents...')
  for (const course of courses) {
    await client.createOrReplace(course)
    console.log(`  ✓ ${course.title.en}`)
  }

  console.log('\nPatching existing courses...')
  for (const { _id, ...patch } of updates) {
    await client.patch(_id).set(patch).commit()
    console.log(`  ✓ ${_id}`)
  }

  console.log('\nDone.')
}

run().catch(err => { console.error(err); process.exit(1) })
