import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
  accentWord?: string
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className,
  accentWord,
}: SectionHeaderProps) {
  // If accentWord is provided, wrap it in a gradient span
  const renderedTitle = accentWord
    ? title.replace(
        accentWord,
        `<span class="gradient-text">${accentWord}</span>`
      )
    : title

  return (
    <div className={cn(centered && 'text-center', 'mb-12', className)}>
      <h2
        className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        dangerouslySetInnerHTML={{ __html: renderedTitle }}
      />
      {subtitle && (
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
