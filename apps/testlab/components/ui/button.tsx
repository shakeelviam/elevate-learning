import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-white transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-gold-400 to-gold-500 text-brand-900 shadow-[0_4px_14px_rgba(201,168,76,0.35)] hover:opacity-90 active:scale-[0.98]',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        outline: 'border border-brand-200 bg-white text-brand-600 hover:bg-brand-50 hover:border-brand-300 shadow-sm',
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        gold: 'bg-gradient-to-r from-gold-400 to-gold-500 text-brand-900 shadow-sm hover:opacity-90 active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-8 rounded-lg px-3.5 text-xs',
        lg: 'h-12 rounded-xl px-7 text-base',
        xl: 'h-14 rounded-2xl px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
