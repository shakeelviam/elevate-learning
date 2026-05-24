import { Users, LayoutGrid, Languages, UserCheck, type LucideIcon } from 'lucide-react'

interface StatsBannerProps {
  locale: 'en' | 'ar'
  stat1Value: string
  stat2Value: string
  stat3Value: string
  stat4Value: string
  stat1Label: string
  stat2Label: string
  stat3Label: string
  stat4Label: string
}

export function StatsBanner({
  stat1Value,
  stat2Value,
  stat3Value,
  stat4Value,
  stat1Label,
  stat2Label,
  stat3Label,
  stat4Label,
}: StatsBannerProps) {
  const stats: { value: string; label: string; Icon: LucideIcon }[] = [
    { value: stat1Value, label: stat1Label, Icon: Users },
    { value: stat2Value, label: stat2Label, Icon: LayoutGrid },
    { value: stat3Value, label: stat3Label, Icon: Languages },
    { value: stat4Value, label: stat4Label, Icon: UserCheck },
  ]

  return (
    <section className="bg-gradient-to-r from-brand-600 to-brand-800 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center mb-2">
                <stat.Icon className="h-7 w-7 text-white/70" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-brand-200 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
