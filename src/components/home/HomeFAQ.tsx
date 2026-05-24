'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { SanityFaq } from '@/types/sanity'

interface HomeFAQProps {
  locale: 'en' | 'ar'
  faqs?: SanityFaq[]
}

const FALLBACK_ITEMS = {
  en: [
    { q: 'Which languages do you offer?', a: 'We offer English, Arabic, French, German, Spanish, and Chinese at beginner, intermediate, and advanced levels.' },
    { q: 'Do you offer exam preparation courses?', a: 'Yes! We specialize in IELTS, TOEFL, OET, PTE, SAT, and GMAT preparation with practice tests and one-on-one tutoring.' },
    { q: 'How are classes delivered?', a: 'We offer both in-person classes at our Kuwait City campus and live online sessions via Zoom.' },
    { q: 'What payment methods are accepted?', a: 'We accept KNET, credit/debit cards, and cash payments at our campus.' },
  ],
  ar: [
    { q: 'ما اللغات التي تقدمونها؟', a: 'نقدم اللغات الإنجليزية والعربية والفرنسية والألمانية والإسبانية والصينية على مستويات المبتدئين والمتوسطين والمتقدمين.' },
    { q: 'هل تقدمون دورات تحضيرية للامتحانات؟', a: 'نعم! نتخصص في التحضير لامتحانات IELTS وTOEFL وOET وPTE وSAT وGMAT مع اختبارات تدريبية وجلسات فردية.' },
    { q: 'كيف تُقدَّم الدروس؟', a: 'نوفر دروساً حضورية في حرمنا بمدينة الكويت وجلسات مباشرة عبر الإنترنت عبر زووم.' },
    { q: 'ما طرق الدفع المقبولة؟', a: 'نقبل كي-نت وبطاقات الائتمان والخصم والدفع النقدي في حرمنا.' },
  ],
}

export function HomeFAQ({ locale, faqs }: HomeFAQProps) {
  const items =
    faqs && faqs.length > 0
      ? faqs
          .slice(0, 4)
          .map((f) => ({
            q: (locale === 'ar' ? f.question.ar : f.question.en) ?? '',
            a: (locale === 'ar' ? f.answer.ar : f.answer.en) ?? '',
          }))
      : FALLBACK_ITEMS[locale]

  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger>{faq.q}</AccordionTrigger>
          <AccordionContent>{faq.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
