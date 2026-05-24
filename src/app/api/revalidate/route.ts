import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const docType = body._type as string | undefined

    if (docType === 'course') {
      revalidatePath('/[locale]/courses', 'page')
    } else if (docType === 'faq') {
      revalidatePath('/[locale]/faq', 'page')
      revalidatePath('/[locale]', 'page')
    } else if (docType === 'blog') {
      revalidatePath('/[locale]/blog', 'page')
    } else if (docType === 'teamMember') {
      revalidatePath('/[locale]/about', 'page')
    } else {
      // siteSettings, testimonial, or unknown — revalidate everything
      revalidatePath('/', 'layout')
    }

    return NextResponse.json({ revalidated: true, type: docType ?? 'all' })
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
