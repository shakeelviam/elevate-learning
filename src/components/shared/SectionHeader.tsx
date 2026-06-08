import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
  accentWord?: string
  darkMode?: boolean
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className,
  accentWord,
  darkMode = false,
}: SectionHeaderProps) {
  const renderedTitle = accentWord
    ? title.replace(
        accentWord,
        `<span class="gradient-text">${accentWord}</span>`
      )
    : title

  return (
    <div className={cn(centered && 'text-center', 'mb-12', className)}>
      <h2
        className={cn(
          'text-3xl sm:text-4xl font-bold mb-4',
          darkMode ? 'text-gold-300' : 'text-brand-900'
        )}
        dangerouslySetInnerHTML={{ __html: renderedTitle }}
      />
      {subtitle && (
        <p className={cn(
          'text-lg max-w-2xl mx-auto leading-relaxed',
          darkMode ? 'text-brand-200' : 'text-gray-500'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
