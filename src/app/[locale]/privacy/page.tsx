import type { Metadata } from 'next'
import { Shield } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
    description:
      locale === 'ar'
        ? 'سياسة الخصوصية لمركز إيليفيت للتعليم'
        : 'Privacy Policy for Elevate Learning Institute',
  }
}

const enContent = {
  title: 'Privacy Policy',
  updated: 'Last updated: May 2026',
  sections: [
    {
      heading: '1. Who We Are',
      body: 'Elevate Learning ("we", "our", "us") is a language training institute based in Kuwait City, Kuwait. We operate the website elevate-learning.com and deliver language and exam preparation courses.',
    },
    {
      heading: '2. Information We Collect',
      body: `We collect information you provide directly to us:
• **Registration data**: Full name, email address, phone number, course and schedule preferences, and any optional message you include.
• **Account data**: When you create an account via Clerk, we store your email address, name, and profile picture as provided by you or your social login provider.
• **Contact form data**: Name, email, subject, and message submitted through our contact form.
• **Usage data**: Pages visited, device type, and browser information collected automatically for site performance monitoring.`,
    },
    {
      heading: '3. How We Use Your Information',
      body: `Your information is used solely to:
• Process and manage your course registration enquiries
• Contact you to confirm enrollment, share payment details, and provide course information
• Send you important service updates or schedule changes
• Respond to your contact form enquiries
• Improve our website and course offerings
We do not send marketing emails without your explicit consent.`,
    },
    {
      heading: '4. Data Processors We Use',
      body: `We use the following trusted third-party services as data processors:
• **Sanity.io** — Content Management System (CMS) that stores course, blog, and registration data on secure cloud infrastructure.
• **Clerk** — Authentication provider that handles account creation, sign-in, and session management.
• **Resend** — Email delivery service used to send registration confirmations and contact form replies.
All processors are contractually obligated to protect your data and process it only on our instructions.`,
    },
    {
      heading: '5. Data Retention',
      body: 'Registration enquiry data is retained for up to three (3) years to maintain accurate enrollment records and support follow-up enquiries. Account data is retained until you delete your account. Contact form data is deleted after six (6) months.',
    },
    {
      heading: '6. Your Rights',
      body: `You have the right to:
• **Access**: Request a copy of the personal data we hold about you.
• **Correction**: Request correction of inaccurate or incomplete data.
• **Deletion**: Request deletion of your data, subject to legal retention obligations.
• **Portability**: Receive your data in a structured, machine-readable format.
To exercise these rights, contact us at info@elev8-edu.com.`,
    },
    {
      heading: '7. Cookies',
      body: 'We use only essential cookies required for authentication (managed by Clerk) and basic site functionality. We do not use advertising or tracking cookies. You can manage cookies in your browser settings.',
    },
    {
      heading: '8. Data Security',
      body: 'All data is transmitted over encrypted HTTPS connections. Our data processors maintain industry-standard security measures including encryption at rest and regular security audits.',
    },
    {
      heading: '9. International Transfers',
      body: 'Our data processors may store data on servers outside Kuwait. All such transfers are governed by appropriate data protection agreements to ensure your data receives an equivalent level of protection.',
    },
    {
      heading: '10. Changes to This Policy',
      body: 'We may update this policy periodically. Material changes will be communicated via email to registered users or prominently displayed on our website. The "Last updated" date at the top reflects the most recent revision.',
    },
    {
      heading: '11. Contact Us',
      body: `For privacy-related enquiries or to exercise your rights:
**Elevate Learning**
Kuwait City, Kuwait
Email: info@elev8-edu.com
Phone: +965 2222 3333`,
    },
  ],
}

const arContent = {
  title: 'سياسة الخصوصية',
  updated: 'آخر تحديث: مايو 2026',
  sections: [
    {
      heading: '1. من نحن',
      body: 'مركز إيليفيت للتعليم ("نحن"، "لنا") معهد تدريب لغوي مقره مدينة الكويت، الكويت. ندير موقع elev8-edu.com ونقدم دورات تعلم اللغات والتحضير للامتحانات.',
    },
    {
      heading: '2. المعلومات التي نجمعها',
      body: `نجمع المعلومات التي تزودنا بها مباشرةً:
• **بيانات التسجيل**: الاسم الكامل، البريد الإلكتروني، رقم الهاتف، تفضيلات الدورة والجدول الزمني، وأي رسالة اختيارية.
• **بيانات الحساب**: عند إنشاء حساب عبر Clerk، نحتفظ ببريدك الإلكتروني واسمك وصورة ملفك الشخصي.
• **بيانات نموذج التواصل**: الاسم والبريد الإلكتروني والموضوع والرسالة.
• **بيانات الاستخدام**: الصفحات المزارة ونوع الجهاز والمتصفح لأغراض تحسين الأداء.`,
    },
    {
      heading: '3. كيف نستخدم معلوماتك',
      body: `تُستخدم معلوماتك حصراً لـ:
• معالجة استفسارات التسجيل في الدورات وإدارتها
• التواصل معك لتأكيد التسجيل وتفاصيل الدفع ومعلومات الدورة
• إرسال تحديثات الخدمة أو تغييرات الجداول
• الرد على استفساراتك عبر نموذج التواصل
• تحسين موقعنا وعروض الدورات
لا نرسل رسائل تسويقية دون موافقتك الصريحة.`,
    },
    {
      heading: '4. مزودو الخدمات',
      body: `نستخدم الخدمات التالية كمعالجين للبيانات:
• **Sanity.io** — نظام إدارة المحتوى الذي يخزن بيانات الدورات والمدونة والتسجيلات.
• **Clerk** — مزود المصادقة لإدارة الحسابات وتسجيل الدخول.
• **Resend** — خدمة تسليم البريد الإلكتروني لإرسال التأكيدات.
جميع المعالجون ملزمون تعاقدياً بحماية بياناتك.`,
    },
    {
      heading: '5. الاحتفاظ بالبيانات',
      body: 'يتم الاحتفاظ ببيانات التسجيل لمدة ثلاث (3) سنوات. يتم حذف بيانات الحساب عند طلب الحذف. تُحذف بيانات نموذج التواصل بعد ستة (6) أشهر.',
    },
    {
      heading: '6. حقوقك',
      body: `يحق لك:
• **الوصول**: طلب نسخة من بياناتك الشخصية.
• **التصحيح**: طلب تصحيح البيانات غير الدقيقة.
• **الحذف**: طلب حذف بياناتك.
• **قابلية النقل**: استلام بياناتك بتنسيق منظم.
لممارسة هذه الحقوق، تواصل معنا على: info@elev8-edu.com`,
    },
    {
      heading: '7. ملفات تعريف الارتباط',
      body: 'نستخدم ملفات تعريف الارتباط الأساسية فقط المطلوبة للمصادقة (يديرها Clerk) ووظائف الموقع الأساسية. لا نستخدم ملفات تتبع إعلانية.',
    },
    {
      heading: '8. أمن البيانات',
      body: 'تُنقل جميع البيانات عبر اتصالات HTTPS مشفرة. يحافظ مزودو خدماتنا على تدابير أمنية بمعايير الصناعة.',
    },
    {
      heading: '9. التحويلات الدولية',
      body: 'قد يخزن مزودو خدماتنا البيانات على خوادم خارج الكويت. تخضع جميع هذه التحويلات لاتفاقيات حماية البيانات المناسبة.',
    },
    {
      heading: '10. التغييرات على هذه السياسة',
      body: 'قد نحدّث هذه السياسة دورياً. سيتم إخطار المستخدمين المسجلين بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار بارز على الموقع.',
    },
    {
      heading: '11. تواصل معنا',
      body: `لأي استفسارات تتعلق بالخصوصية:
**مركز إيليفيت للتعليم**
مدينة الكويت، الكويت
البريد الإلكتروني: info@elev8-edu.com
الهاتف: 3333 2222 965+`,
    },
  ],
}

export default async function PrivacyPage({
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
            <Shield className="h-7 w-7 text-brand-600" />
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
              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
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
