import type { Metadata } from 'next'
import { TestLabHub } from '@/components/test-lab/TestLabHub'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ar' ? 'مختبر الاختبارات' : 'Test Lab',
    description:
      locale === 'ar'
        ? 'تدريب تكيّفي لا نهاية له مدعوم بالذكاء الاصطناعي المحلي'
        : 'Unlimited adaptive practice tests powered by local AI',
  }
}

export default async function TestLabPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <TestLabHub locale={locale as 'en' | 'ar'} />
}
