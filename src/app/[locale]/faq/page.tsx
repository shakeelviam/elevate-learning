import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { getFaqs } from '@/sanity/lib/queries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ',
  }
}

const FALLBACK_EN = [
  { q: 'Which languages do you offer?', a: 'We offer English, Arabic, French, German, Spanish, and Chinese. Each program is available at beginner, intermediate, and advanced levels.' },
  { q: 'How are classes delivered?', a: 'We offer both in-person classes at our Kuwait City campus and live online sessions via Zoom. You can choose the format that fits your schedule.' },
  { q: 'Do you offer exam preparation courses?', a: 'Yes! We specialize in IELTS, TOEFL, OET, PTE, SAT, and GMAT preparation. Our courses include practice tests and one-on-one tutoring sessions.' },
  { q: 'What payment methods are accepted?', a: 'We accept KNET, credit/debit cards, and cash payments at our campus. Online payment through MyFatoorah will be available soon.' },
  { q: 'How large are the class sizes?', a: 'We keep our classes small — typically 8 to 12 students per group — to ensure personalized attention and maximum speaking practice time.' },
  { q: 'Do you offer corporate or group training?', a: 'Absolutely. We provide customized corporate language training programs for businesses of all sizes. Contact us for a tailored proposal.' },
  { q: 'Can I transfer to a different class or schedule?', a: 'Yes, transfers are available before the second week of class, subject to seat availability. Contact our admin team to arrange.' },
  { q: 'Do you provide certificates upon completion?', a: 'Yes, all students who complete a course receive a certificate of completion from Elevate Learning. These are widely recognized by employers and universities in Kuwait and the GCC.' },
]

const FALLBACK_AR = [
  { q: 'ما اللغات التي تقدمونها؟', a: 'نقدم اللغات الإنجليزية والعربية والفرنسية والألمانية والإسبانية والصينية. كل برنامج متاح على مستويات المبتدئين والمتوسطين والمتقدمين.' },
  { q: 'كيف تُقدَّم الدروس؟', a: 'نوفر دروساً حضورية في حرمنا بمدينة الكويت وجلسات مباشرة عبر الإنترنت عبر زووم. يمكنك اختيار الأسلوب الذي يناسب جدولك الزمني.' },
  { q: 'هل تقدمون دورات تحضيرية للامتحانات؟', a: 'نعم! نتخصص في التحضير لامتحانات IELTS وTOEFL وOET وPTE وSAT وGMAT. تشمل دوراتنا اختبارات تدريبية وجلسات تدريب فردية.' },
  { q: 'ما طرق الدفع المقبولة؟', a: 'نقبل كي-نت وبطاقات الائتمان والخصم والدفع النقدي في حرمنا. سيتوفر الدفع الإلكتروني عبر MyFatoorah قريباً.' },
  { q: 'ما حجم الفصول الدراسية؟', a: 'نحافظ على فصول صغيرة — عادةً من 8 إلى 12 طالباً — لضمان الاهتمام الشخصي وأقصى وقت لممارسة التحدث.' },
  { q: 'هل تقدمون تدريباً للشركات أو المجموعات؟', a: 'بالتأكيد. نوفر برامج تدريب لغوي مؤسسية مخصصة للشركات بجميع أحجامها. تواصل معنا للحصول على عرض مخصص.' },
  { q: 'هل يمكنني الانتقال إلى فصل أو جدول مختلف؟', a: 'نعم، يمكن الانتقال قبل الأسبوع الثاني من الدورة، وفقاً لتوفر المقاعد. تواصل مع فريق الإدارة للترتيب.' },
  { q: 'هل تقدمون شهادات عند الانتهاء؟', a: 'نعم، يحصل جميع الطلاب المتممين للدورة على شهادة إتمام من مركز إيليفيت للتعليم، معترف بها على نطاق واسع من قِبَل أصحاب العمل والجامعات في الكويت ودول الخليج.' },
]

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as 'en' | 'ar'
  const [t, sanityFaqs] = await Promise.all([
    getTranslations({ locale: loc }),
    getFaqs(),
  ])

  const faqs =
    sanityFaqs.length > 0
      ? sanityFaqs.map((f) => ({
          q: (loc === 'ar' ? f.question.ar : f.question.en) ?? '',
          a: (loc === 'ar' ? f.answer.ar : f.answer.en) ?? '',
        }))
      : loc === 'ar'
      ? FALLBACK_AR
      : FALLBACK_EN

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="hero-gradient border-b border-brand-100 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-lg text-gray-600">{t('faq.subtitle')}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions */}
        <div className="mt-12 bg-brand-50 rounded-2xl border border-brand-100 p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t('faq.stillHaveQuestions')}
          </h3>
          <p className="text-gray-500 mb-5">
            {loc === 'ar'
              ? 'فريقنا سعيد بمساعدتك على الإجابة على أي استفسار.'
              : 'Our team is happy to answer any question you may have.'}
          </p>
          <Link href="/contact" locale={loc}>
            <Button>
              {t('faq.contactUs')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
