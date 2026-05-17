import { FlipBook } from '@/components/home/FlipBook'
import { HeroCardStack } from '@/components/home/HeroCardStack'
import { HeroTypewriter } from '@/components/home/HeroTypewriter'
import { HeroSlotMachine } from '@/components/home/HeroSlotMachine'
import { HeroStatDashboard } from '@/components/home/HeroStatDashboard'

const variants = [
  { id: 'flip', label: 'Current — FlipBook', Component: FlipBook },
  { id: 'stack', label: 'Option A — Card Stack (Swipe)', Component: HeroCardStack },
  { id: 'type', label: 'Option B — Typewriter', Component: HeroTypewriter },
  { id: 'slot', label: 'Option C — Slot Machine', Component: HeroSlotMachine },
  { id: 'dash', label: 'Option D — Stat Dashboard', Component: HeroStatDashboard },
]

export default function DemoPage({ params }: { params: { locale: 'en' | 'ar' } }) {
  const locale = params.locale === 'ar' ? 'ar' : 'en'

  return (
    <main className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Hero Animation Variants</h1>
        <p className="text-gray-500 mb-10 text-sm">
          Viewing in <strong>{locale === 'ar' ? 'Arabic (RTL)' : 'English (LTR)'}</strong>.
          Switch:{' '}
          <a href="/en/demo" className="text-brand-600 underline">EN</a> /{' '}
          <a href="/ar/demo" className="text-brand-600 underline">AR</a>
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {variants.map(({ id, label, Component }) => (
            <div key={id} className="space-y-3">
              <p className="text-sm font-bold text-gray-700">{label}</p>
              <div className="w-full max-w-sm mx-auto">
                <Component locale={locale} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
