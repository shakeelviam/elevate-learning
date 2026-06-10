import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const docType = body._type as string | undefined

    // Revalidate all locale variants for every doc type change
    const locales = ['en', 'ar']

    if (docType === 'course') {
      for (const locale of locales) {
        revalidatePath(`/${locale}/courses`, 'page')
        revalidatePath(`/${locale}`, 'page')
      }
    } else if (docType === 'faq') {
      for (const locale of locales) {
        revalidatePath(`/${locale}/faq`, 'page')
        revalidatePath(`/${locale}`, 'page')
      }
    } else if (docType === 'blog') {
      for (const locale of locales) {
        revalidatePath(`/${locale}/blog`, 'page')
      }
    } else if (docType === 'teamMember') {
      for (const locale of locales) {
        revalidatePath(`/${locale}/about`, 'page')
      }
    } else {
      // siteSettings, testimonial, or unknown — revalidate every page in every locale
      for (const locale of locales) {
        revalidatePath(`/${locale}`, 'layout')
        revalidatePath(`/${locale}`, 'page')
        revalidatePath(`/${locale}/courses`, 'page')
        revalidatePath(`/${locale}/about`, 'page')
        revalidatePath(`/${locale}/contact`, 'page')
        revalidatePath(`/${locale}/faq`, 'page')
      }
    }

    return NextResponse.json({ revalidated: true, type: docType ?? 'all' })
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
