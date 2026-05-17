import { Trophy, BookOpen, GraduationCap, Globe, type LucideIcon } from 'lucide-react'

interface StatsBannerProps {
  locale: 'en' | 'ar'
  yearsValue: string
  coursesValue: string
  studentsValue: string
  countriesValue: string
  yearsLabel: string
  coursesLabel: string
  studentsLabel: string
  countriesLabel: string
}

export function StatsBanner({
  locale,
  yearsValue,
  coursesValue,
  studentsValue,
  countriesValue,
  yearsLabel,
  coursesLabel,
  studentsLabel,
  countriesLabel,
}: StatsBannerProps) {
  const stats: { value: string; label: string; Icon: LucideIcon }[] = [
    { value: yearsValue, label: yearsLabel, Icon: Trophy },
    { value: coursesValue, label: coursesLabel, Icon: BookOpen },
    { value: studentsValue, label: studentsLabel, Icon: GraduationCap },
    { value: countriesValue, label: countriesLabel, Icon: Globe },
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
