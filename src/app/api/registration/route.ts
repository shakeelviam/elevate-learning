import { NextRequest, NextResponse } from 'next/server'
import { registrationSchema } from '@/lib/validations'
import { sanityWriteClient } from '@/sanity/lib/client'
import { sanityClient } from '@/sanity/lib/client'
import { sendRegistrationEmails } from '@/lib/email'
import { getSiteSettings } from '@/sanity/lib/queries'
import { groq } from 'next-sanity'

/**
 * POST /api/registration
 *
 * Creates a registration document in Sanity and sends confirmation emails.
 *
 * === PHASE 2 HOOK (MyFatoorah Payment) ===
 * After successful Sanity write, you can:
 *   1. Call MyFatoorah's /v2/ExecutePayment endpoint
 *   2. Return the payment URL to the client
 *   3. On webhook receipt, update the registration status to 'paid'
 *
 * === PHASE 3 HOOK (LMS Enrollment) ===
 * After payment confirmation webhook:
 *   1. Call your LMS API to create the user and enroll them
 *   2. Store the LMS user ID in the registration document
 *   3. Set courseAccessGranted = true
 *
 * See sanity/schemas/registration.ts for the commented field definitions.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const parsed = registrationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form data',
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Fetch course title for email
    const course = await sanityClient.fetch<{
      title: { en?: string; ar?: string }
    } | null>(
      groq`*[_type == "course" && _id == $id][0]{ title }`,
      { id: data.courseId }
    )

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    const courseName =
      course.title?.[data.locale] ?? course.title?.en ?? 'Unknown Course'

    // Get schedule info if provided
    let scheduleDate: string | undefined
    if (data.scheduleId && data.scheduleId !== 'none') {
      const schedule = await sanityClient.fetch<{ startDate?: string } | null>(
        groq`*[_type == "schedule" && _id == $id][0]{ startDate }`,
        { id: data.scheduleId }
      )
      scheduleDate = schedule?.startDate
    }

    // Create registration in Sanity
    const registration = await sanityWriteClient.create({
      _type: 'registration',
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      course: { _type: 'reference', _ref: data.courseId },
      ...(data.scheduleId && data.scheduleId !== 'none' && {
        schedule: { _type: 'reference', _ref: data.scheduleId },
      }),
      message: data.message ?? '',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    })

    // Increment enrolled count on the schedule (best-effort, non-blocking)
    if (data.scheduleId && data.scheduleId !== 'none') {
      sanityWriteClient
        .patch(data.scheduleId)
        .inc({ enrolledCount: 1 })
        .commit()
        .catch(console.error)
    }

    // Send emails
    const settings = await getSiteSettings()
    const instituteEmail =
      settings?.contactInfo?.email ?? 'info@elevate-learning.com'

    await sendRegistrationEmails(
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        courseName,
        scheduleDate,
        message: data.message,
        instituteEmail,
      },
      data.locale
    )

    // === PHASE 2: Uncomment to initiate payment ===
    // const paymentResult = await initMyFatoorahPayment({
    //   amount: course.price,
    //   customerName: data.fullName,
    //   customerEmail: data.email,
    //   customerPhone: data.phone,
    //   registrationId: registration._id,
    //   locale: data.locale,
    // })
    // return NextResponse.json({ success: true, registrationId: registration._id, paymentUrl: paymentResult.url })

    return NextResponse.json({
      success: true,
      registrationId: registration._id,
      message:
        data.locale === 'ar'
          ? 'تم استلام تسجيلك. سيتواصل معك فريقنا قريباً.'
          : 'Registration received. Our team will contact you shortly.',
    })
  } catch (error) {
    console.error('[API] Registration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again.',
      },
      { status: 500 }
    )
  }
}
