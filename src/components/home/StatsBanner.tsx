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
  const stats = [
    { value: yearsValue, label: yearsLabel, emoji: '🏆' },
    { value: coursesValue, label: coursesLabel, emoji: '📚' },
    { value: studentsValue, label: studentsLabel, emoji: '🎓' },
    { value: countriesValue, label: countriesLabel, emoji: '🌍' },
  ]

  return (
    <section className="bg-gradient-to-r from-brand-600 to-brand-800 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl mb-1">{stat.emoji}</div>
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
