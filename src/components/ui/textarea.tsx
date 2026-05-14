import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-xl border bg-white px-4 py-2.5 text-sm',
            'placeholder:text-gray-400 resize-none',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-gray-200 hover:border-gray-300 focus:border-brand-400',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
