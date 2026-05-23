import 'server-only'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const fromAddress = process.env.RESEND_FROM_ADDRESS ?? 'noreply@elev8-edu.com'

interface RegistrationEmailData {
  fullName: string
  email: string
  phone: string
  courseName: string
  scheduleDate?: string
  message?: string
  instituteEmail: string
}

interface ContactEmailData {
  name: string
  email: string
  subject?: string
  message: string
  instituteEmail: string
}

// ── HTML Templates ────────────────────────────────────────────────────────────

function baseEmailLayout(content: string, locale: 'en' | 'ar'): string {
  const isRtl = locale === 'ar'
  return `<!DOCTYPE html>
<html lang="${locale}" dir="${isRtl ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Elevate Learning</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f7fa; font-family: ${isRtl ? "'Segoe UI', Tahoma, Arial" : "'Inter', 'Helvetica Neue', Arial"}, sans-serif; direction: ${isRtl ? 'rtl' : 'ltr'}; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1B2A4A 0%, #253663 100%); padding: 32px 40px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 40px; }
    .body h2 { color: #1B2A4A; font-size: 20px; margin: 0 0 16px; }
    .body p { color: #374151; line-height: 1.7; margin: 0 0 12px; font-size: 15px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    .info-table td { padding: 10px 14px; font-size: 14px; border-bottom: 1px solid #e5e7eb; }
    .info-table td:first-child { color: #6b7280; font-weight: 500; width: 40%; }
    .info-table td:last-child { color: #111827; }
    .cta-btn { display: inline-block; background: #C9A84C; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 16px 0; }
    .footer { background: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { color: #9ca3af; font-size: 13px; margin: 4px 0; }
    .badge { display: inline-block; background: #F5E9C4; color: #1B2A4A; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isRtl ? 'مركز إيليفيت للتعليم' : 'Elevate Learning'}</h1>
      <p>${isRtl ? 'معهدك الرائد للتعليم اللغوي في الكويت' : 'Kuwait\'s Premier Language Institute'}</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>${isRtl ? '© 2024 مركز إيليفيت للتعليم · الكويت' : '© 2024 Elevate Learning · Kuwait'}</p>
      <p>${isRtl ? 'هذا البريد الإلكتروني أُرسل تلقائياً، يرجى عدم الرد عليه.' : 'This is an automated email. Please do not reply directly.'}</p>
    </div>
  </div>
</body>
</html>`
}

// ── Registration Templates ─────────────────────────────────────────────────────

function registrationStudentEmailEn(data: RegistrationEmailData): string {
  return baseEmailLayout(
    `<h2>Registration Received! 🎉</h2>
    <p>Dear <strong>${data.fullName}</strong>,</p>
    <p>Thank you for your interest in <strong>${data.courseName}</strong>. We've received your registration and our team will contact you within 24 hours with payment and confirmation details.</p>
    <table class="info-table">
      <tr><td>Course</td><td>${data.courseName}</td></tr>
      <tr><td>Start Date</td><td>${data.scheduleDate ?? 'To be confirmed'}</td></tr>
      <tr><td>Phone</td><td>${data.phone}</td></tr>
      <tr><td>Status</td><td><span class="badge">Pending Confirmation</span></td></tr>
    </table>
    <p>While you wait, feel free to browse our <a href="${process.env.NEXT_PUBLIC_APP_URL}/en/courses" style="color:#C9A84C">other courses</a> or contact us on WhatsApp for any questions.</p>`,
    'en'
  )
}

function registrationStudentEmailAr(data: RegistrationEmailData): string {
  return baseEmailLayout(
    `<h2>تم استلام تسجيلك! 🎉</h2>
    <p>عزيزي/عزيزتي <strong>${data.fullName}</strong>،</p>
    <p>شكراً لاهتمامك بدورة <strong>${data.courseName}</strong>. لقد استلمنا طلب تسجيلك وسيتواصل معك فريقنا خلال 24 ساعة بتفاصيل الدفع والتأكيد.</p>
    <table class="info-table">
      <tr><td>الدورة</td><td>${data.courseName}</td></tr>
      <tr><td>تاريخ البدء</td><td>${data.scheduleDate ?? 'سيتم التأكيد لاحقاً'}</td></tr>
      <tr><td>الهاتف</td><td>${data.phone}</td></tr>
      <tr><td>الحالة</td><td><span class="badge">في انتظار التأكيد</span></td></tr>
    </table>
    <p>في انتظار ذلك، يمكنك تصفح <a href="${process.env.NEXT_PUBLIC_APP_URL}/ar/courses" style="color:#C9A84C">دوراتنا الأخرى</a> أو التواصل معنا عبر واتساب لأي استفسار.</p>`,
    'ar'
  )
}

function registrationInstituteEmail(data: RegistrationEmailData): string {
  return baseEmailLayout(
    `<h2>New Registration — Action Required</h2>
    <p>A new course registration has been submitted. Please follow up within 24 hours.</p>
    <table class="info-table">
      <tr><td>Name</td><td>${data.fullName}</td></tr>
      <tr><td>Email</td><td>${data.email}</td></tr>
      <tr><td>Phone</td><td>${data.phone}</td></tr>
      <tr><td>Course</td><td>${data.courseName}</td></tr>
      <tr><td>Schedule</td><td>${data.scheduleDate ?? 'Not specified'}</td></tr>
      ${data.message ? `<tr><td>Message</td><td>${data.message}</td></tr>` : ''}
    </table>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/studio" class="cta-btn">View in Sanity Studio →</a>`,
    'en'
  )
}

// ── Contact Templates ─────────────────────────────────────────────────────────

function contactInstituteEmail(data: ContactEmailData): string {
  return baseEmailLayout(
    `<h2>New Contact Form Submission</h2>
    <table class="info-table">
      <tr><td>From</td><td>${data.name}</td></tr>
      <tr><td>Email</td><td>${data.email}</td></tr>
      ${data.subject ? `<tr><td>Subject</td><td>${data.subject}</td></tr>` : ''}
    </table>
    <p><strong>Message:</strong></p>
    <p style="background:#f9fafb;padding:16px;border-radius:8px;border-left:4px solid #C9A84C">${data.message}</p>`,
    'en'
  )
}

function contactConfirmationEmail(data: ContactEmailData, locale: 'en' | 'ar'): string {
  if (locale === 'ar') {
    return baseEmailLayout(
      `<h2>شكراً للتواصل معنا!</h2>
      <p>عزيزي/عزيزتي <strong>${data.name}</strong>،</p>
      <p>لقد استلمنا رسالتك وسنرد عليك خلال يوم عمل واحد.</p>
      <p style="background:#f0f7ff;padding:16px;border-radius:8px"><strong>رسالتك:</strong><br/>${data.message}</p>`,
      'ar'
    )
  }
  return baseEmailLayout(
    `<h2>We received your message!</h2>
    <p>Dear <strong>${data.name}</strong>,</p>
    <p>Thank you for reaching out to Elevate Learning. We'll get back to you within one business day.</p>
    <p style="background:#f0f7ff;padding:16px;border-radius:8px"><strong>Your message:</strong><br/>${data.message}</p>`,
    'en'
  )
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function sendRegistrationEmails(
  data: RegistrationEmailData,
  locale: 'en' | 'ar'
): Promise<void> {
  const studentHtml =
    locale === 'ar'
      ? registrationStudentEmailAr(data)
      : registrationStudentEmailEn(data)

  const studentSubject =
    locale === 'ar'
      ? `تم استلام تسجيلك في دورة ${data.courseName}`
      : `Registration Received – ${data.courseName}`

  await Promise.allSettled([
    // Student confirmation
    resend.emails.send({
      from: fromAddress,
      to: data.email,
      subject: studentSubject,
      html: studentHtml,
    }),
    // Institute notification
    resend.emails.send({
      from: fromAddress,
      to: data.instituteEmail,
      subject: `[New Registration] ${data.fullName} – ${data.courseName}`,
      html: registrationInstituteEmail(data),
    }),
  ])
}

export async function sendContactEmail(
  data: ContactEmailData,
  locale: 'en' | 'ar'
): Promise<void> {
  await Promise.allSettled([
    // Institute notification
    resend.emails.send({
      from: fromAddress,
      to: data.instituteEmail,
      subject: `[Contact] ${data.name} – ${data.subject ?? 'General Inquiry'}`,
      html: contactInstituteEmail(data),
    }),
    // Sender confirmation
    resend.emails.send({
      from: fromAddress,
      to: data.email,
      subject: locale === 'ar' ? 'شكراً للتواصل مع مركز إيليفيت للتعليم' : 'We received your message – Elevate Learning',
      html: contactConfirmationEmail(data, locale),
    }),
  ])
}
