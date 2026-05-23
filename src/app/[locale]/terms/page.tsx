import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'الشروط والأحكام' : 'Terms of Service',
    description:
      locale === 'ar'
        ? 'الشروط والأحكام لمركز إيليفيت للتعليم'
        : 'Terms of Service for Elevate Learning Institute',
  }
}

const enContent = {
  title: 'Terms of Service',
  updated: 'Last updated: May 2026',
  sections: [
    {
      heading: '1. Acceptance of Terms',
      body: 'By accessing or using the Elevate Learning website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. These terms apply to all visitors, users, and course participants.',
    },
    {
      heading: '2. Description of Services',
      body: 'Elevate Learning provides language training and exam preparation courses in Kuwait. Our services include in-person and online courses, course registration management, and a student dashboard. Online course delivery is planned for a future phase.',
    },
    {
      heading: '3. Account Registration',
      body: 'Creating an account allows you to submit course registration enquiries and track your enrollment status. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate and complete information during registration.',
    },
    {
      heading: '4. Course Registration and Enrollment',
      body: `Submitting a registration form constitutes an enquiry, not a confirmed enrollment. Enrollment is confirmed only after:
• Our team contacts you to confirm availability
• Payment is received and verified

We reserve the right to decline any registration at our discretion, in which case any payment received will be fully refunded.`,
    },
    {
      heading: '5. Payment',
      body: `Course fees are payable in Kuwaiti Dinar (KWD). We currently accept:
• KNET (in-person or arranged via our team)
• Cash payment at our Kuwait City campus
• Bank transfer (arranged directly with our team)
Online payment integration is under development and will be available in a future update. Fees are payable before or on the course start date unless otherwise arranged.`,
    },
    {
      heading: '6. Cancellation and Refund Policy',
      body: `• Cancellation more than 7 days before the course start date: Full refund, less any transaction fees.
• Cancellation within 7 days of the course start date: 50% refund.
• No-shows or cancellation after the course has started: No refund.
• If Elevate Learning cancels a course: Full refund or credit toward a future course.
Refund requests must be submitted in writing to info@elev8-edu.com.`,
    },
    {
      heading: '7. Course Attendance and Conduct',
      body: 'Students are expected to attend scheduled sessions punctually, treat instructors and fellow students with respect, and refrain from any disruptive behaviour. Elevate Learning reserves the right to remove any student from a course without refund for serious misconduct.',
    },
    {
      heading: '8. Intellectual Property',
      body: 'All course materials, content, and resources provided by Elevate Learning are protected by intellectual property rights. You may use these materials for personal learning only. Reproduction, distribution, or commercial use of any course materials is strictly prohibited without our written consent.',
    },
    {
      heading: '9. Limitation of Liability',
      body: 'Elevate Learning shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our maximum liability for any claim arising under these terms shall not exceed the amount paid by you for the specific course in question.',
    },
    {
      heading: '10. Privacy',
      body: 'Your use of our services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.',
    },
    {
      heading: '11. Changes to Terms',
      body: 'We reserve the right to modify these Terms at any time. Material changes will be communicated via email or a prominent notice on our website. Continued use of our services after changes are posted constitutes your acceptance of the new terms.',
    },
    {
      heading: '12. Governing Law',
      body: 'These Terms are governed by the laws of the State of Kuwait. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Kuwait.',
    },
    {
      heading: '13. Contact',
      body: `For questions about these Terms:
**Elevate Learning**
Kuwait City, Kuwait
Email: info@elev8-edu.com
Phone: +965 2222 3333`,
    },
  ],
}

const arContent = {
  title: 'الشروط والأحكام',
  updated: 'آخر تحديث: مايو 2026',
  sections: [
    {
      heading: '1. قبول الشروط',
      body: 'باستخدام موقع مركز إيليفيت للتعليم وخدماتها، توافق على الالتزام بهذه الشروط والأحكام. إذا لم توافق، يرجى عدم استخدام خدماتنا. تسري هذه الشروط على جميع الزوار والمستخدمين والمشاركين في الدورات.',
    },
    {
      heading: '2. وصف الخدمات',
      body: 'يقدم مركز إيليفيت للتعليم دورات تدريب لغوي والتحضير للامتحانات في الكويت. تشمل خدماتنا الدورات الحضورية والإلكترونية، إدارة تسجيل الدورات، ولوحة تحكم الطالب. يُخطط لتسليم الدورات الإلكترونية في مرحلة مستقبلية.',
    },
    {
      heading: '3. إنشاء الحساب',
      body: 'يتيح لك إنشاء حساب تقديم استفسارات التسجيل في الدورات ومتابعة حالة قبولك. أنت مسؤول عن الحفاظ على سرية بيانات حسابك وعن جميع الأنشطة التي تحدث من خلاله.',
    },
    {
      heading: '4. تسجيل الدورات والالتحاق',
      body: `تقديم نموذج التسجيل يُعدّ استفساراً وليس تأكيداً للالتحاق. يُؤكَّد القبول فقط بعد:
• تواصل فريقنا معك لتأكيد توافر المقعد
• استلام الدفع والتحقق منه
نحتفظ بالحق في رفض أي تسجيل وفقاً لتقديرنا، وفي هذه الحالة سيُردّ أي دفع مستلم بالكامل.`,
    },
    {
      heading: '5. الدفع',
      body: `رسوم الدورات مستحقة الدفع بالدينار الكويتي (د.ك). نقبل حالياً:
• كي-نت (في المعهد أو عبر الترتيب مع فريقنا)
• الدفع النقدي في مقرنا بمدينة الكويت
• التحويل البنكي (يُرتَّب مباشرةً مع فريقنا)
يجري تطوير نظام الدفع الإلكتروني وسيكون متاحاً في تحديث مستقبلي.`,
    },
    {
      heading: '6. سياسة الإلغاء والاسترداد',
      body: `• الإلغاء قبل أكثر من 7 أيام من بداية الدورة: استرداد كامل مع خصم رسوم المعاملات.
• الإلغاء خلال 7 أيام من بداية الدورة: استرداد 50%.
• عدم الحضور أو الإلغاء بعد بدء الدورة: لا يوجد استرداد.
• في حال إلغاء مركز إيليفيت للتعليم للدورة: استرداد كامل أو رصيد لدورة مستقبلية.
يجب تقديم طلبات الاسترداد كتابياً إلى info@elev8-edu.com`,
    },
    {
      heading: '7. الحضور وقواعد السلوك',
      body: 'يُتوقع من الطلاب الحضور في الوقت المحدد واحترام المدربين والزملاء والامتناع عن أي سلوك مزعج. يحتفظ مركز إيليفيت للتعليم بالحق في إخراج أي طالب من الدورة دون استرداد في حالات سوء السلوك الجسيم.',
    },
    {
      heading: '8. الملكية الفكرية',
      body: 'جميع مواد الدورات والمحتوى والموارد التي يقدمها مركز إيليفيت للتعليم محمية بحقوق الملكية الفكرية. يمكنك استخدامها للتعلم الشخصي فقط. يُحظر نسخ أو توزيع أو الاستخدام التجاري لأي مواد دون موافقتنا الخطية.',
    },
    {
      heading: '9. تحديد المسؤولية',
      body: 'لن يكون مركز إيليفيت للتعليم مسؤولاً عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية ناجمة عن استخدامك لخدماتنا. لا تتجاوز مسؤوليتنا القصوى المبلغ المدفوع مقابل الدورة المعنية.',
    },
    {
      heading: '10. الخصوصية',
      body: 'يخضع استخدامك لخدماتنا أيضاً لسياسة الخصوصية المدرجة في هذه الشروط بالإحالة إليها.',
    },
    {
      heading: '11. تغييرات الشروط',
      body: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بالتغييرات الجوهرية. الاستمرار في استخدام خدماتنا بعد نشر التغييرات يُعدّ قبولاً للشروط الجديدة.',
    },
    {
      heading: '12. القانون المنظِّم',
      body: 'تخضع هذه الشروط لقوانين دولة الكويت. تختص محاكم الكويت بالنظر في أي نزاعات تنشأ عن هذه الشروط.',
    },
    {
      heading: '13. التواصل',
      body: `للاستفسارات حول هذه الشروط:
**مركز إيليفيت للتعليم**
مدينة الكويت، الكويت
البريد الإلكتروني: info@elev8-edu.com
الهاتف: 3333 2222 965+`,
    },
  ],
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isAr = locale === 'ar'
  const content = isAr ? arContent : enContent

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="hero-gradient border-b border-brand-100 py-16 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 mb-4">
            <FileText className="h-7 w-7 text-brand-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            {content.title}
          </h1>
          <p className="text-gray-500 text-sm">{content.updated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 space-y-10">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                {section.heading}
              </h2>
              <div className="text-gray-600 leading-relaxed text-sm">
                {section.body.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={i} className="font-semibold text-gray-800 mt-3 mb-1">
                        {line.slice(2, -2)}
                      </p>
                    )
                  }
                  if (line.startsWith('• **')) {
                    const [bold, ...rest] = line.slice(2).split('**: ')
                    return (
                      <p key={i} className="mt-1.5">
                        <span className="font-semibold text-gray-800">
                          {bold.slice(2)}:
                        </span>{' '}
                        {rest.join(': ')}
                      </p>
                    )
                  }
                  if (line.startsWith('• ')) {
                    return (
                      <p key={i} className="mt-1.5 ps-4">
                        {line}
                      </p>
                    )
                  }
                  return line ? <p key={i} className="mt-2">{line}</p> : null
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
