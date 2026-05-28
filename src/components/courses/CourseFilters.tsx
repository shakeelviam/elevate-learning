'use client'

import { useCallback, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CourseFiltersProps {
  locale: 'en' | 'ar'
  currentCategory?: string
  currentLevel?: string
  currentSearch?: string
  currentLanguage?: string
  currentExamType?: string
}

const LANGUAGES = [
  { en: 'English', ar: 'الإنجليزية', value: 'english' },
  { en: 'Arabic',  ar: 'العربية',    value: 'arabic'  },
  { en: 'French',  ar: 'الفرنسية',   value: 'french'  },
  { en: 'German',  ar: 'الألمانية',  value: 'german'  },
  { en: 'Spanish', ar: 'الإسبانية',  value: 'spanish' },
]

const EXAM_TYPES = [
  { label: 'IELTS', value: 'ielts' },
  { label: 'TOEFL', value: 'toefl' },
  { label: 'OET',   value: 'oet'   },
  { label: 'GMAT',  value: 'gmat'  },
  { label: 'SAT',   value: 'sat'   },
  { label: 'PTE',   value: 'pte'   },
]

export function CourseFilters({
  locale,
  currentCategory,
  currentLevel,
  currentSearch,
  currentLanguage,
  currentExamType,
}: CourseFiltersProps) {
  const t = useTranslations('courses')
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const updateSearch = useCallback(
    (key: string, value: string | undefined) => {
      const url = new URL(pathname, window.location.origin)
      if (value && value !== 'all') {
        url.searchParams.set(key, value)
      } else {
        url.searchParams.delete(key)
      }
      startTransition(() => {
        router.replace(url.pathname + url.search)
      })
    },
    [pathname, router]
  )

  const handleCategoryChange = (val: string) => {
    const url = new URL(pathname, window.location.origin)
    if (val && val !== 'all') {
      url.searchParams.set('category', val)
    } else {
      url.searchParams.delete('category')
    }
    // Clear sub-filters when category changes
    url.searchParams.delete('language')
    url.searchParams.delete('examType')
    startTransition(() => router.replace(url.pathname + url.search))
  }

  const clearAll = () => {
    startTransition(() => {
      router.replace(pathname)
    })
  }

  const hasFilters = currentCategory || currentLevel || currentSearch || currentLanguage || currentExamType

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className={cn(
        'flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-wrap',
        locale === 'ar' ? 'sm:flex-row-reverse' : ''
      )}>
        {/* Search input */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className={cn(
            'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400',
            locale === 'ar' ? 'right-3' : 'left-3'
          )} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            defaultValue={currentSearch}
            className={cn(
              'w-full h-10 rounded-xl border border-gray-200 bg-white text-sm',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-400',
              'hover:border-gray-300 transition-colors',
              locale === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateSearch('search', (e.target as HTMLInputElement).value || undefined)
              }
            }}
            onChange={(e) => {
              if (!e.target.value) updateSearch('search', undefined)
            }}
          />
        </div>

        {/* Category filter */}
        <div className="w-full sm:w-44">
          <Select value={currentCategory ?? 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('allCategories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCategories')}</SelectItem>
              <SelectItem value="language">{t('language')}</SelectItem>
              <SelectItem value="exam">{t('examPrep')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language sub-filter (only when category=language) */}
        {currentCategory === 'language' && (
          <div className="w-full sm:w-44">
            <Select value={currentLanguage ?? 'all'} onValueChange={(v) => updateSearch('language', v)}>
              <SelectTrigger>
                <SelectValue placeholder={locale === 'ar' ? 'جميع اللغات' : 'All Languages'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === 'ar' ? 'جميع اللغات' : 'All Languages'}</SelectItem>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {locale === 'ar' ? l.ar : l.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Exam type sub-filter (only when category=exam) */}
        {currentCategory === 'exam' && (
          <div className="w-full sm:w-44">
            <Select value={currentExamType ?? 'all'} onValueChange={(v) => updateSearch('examType', v)}>
              <SelectTrigger>
                <SelectValue placeholder={locale === 'ar' ? 'جميع الامتحانات' : 'All Exams'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === 'ar' ? 'جميع الامتحانات' : 'All Exams'}</SelectItem>
                {EXAM_TYPES.map((e) => (
                  <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Level filter */}
        <div className="w-full sm:w-44">
          <Select value={currentLevel ?? 'all'} onValueChange={(val) => updateSearch('level', val)}>
            <SelectTrigger>
              <SelectValue placeholder={t('allLevels')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allLevels')}</SelectItem>
              <SelectItem value="beginner">{t('beginner')}</SelectItem>
              <SelectItem value="intermediate">{t('intermediate')}</SelectItem>
              <SelectItem value="advanced">{t('advanced')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="flex-shrink-0">
            <X className="h-4 w-4 me-1" />
            {locale === 'ar' ? 'مسح' : 'Clear'}
          </Button>
        )}

        {isPending && (
          <div className="flex-shrink-0 h-4 w-4 rounded-full border-2 border-brand-400 border-t-transparent animate-spin" />
        )}
      </div>
    </div>
  )
}
