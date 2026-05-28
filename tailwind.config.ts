import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
        arabic: ['var(--font-arabic)'],
      },
      colors: {
        brand: {
          50:  '#EEF3FC',
          100: '#CCDAF8',
          200: '#99B5F0',
          300: '#6691E6',
          400: '#3D70D6',
          500: '#2C5FC4',
          600: '#1D4BA5',
          700: '#163A85',
          800: '#102D6B',
          900: '#0C2255',
          950: '#081744',
        },
        gold: {
          50:  '#FBF6E8',
          100: '#F5E9C4',
          200: '#EDCE87',
          300: '#E8C96B',
          400: '#D4B558',
          500: '#C9A84C',
          600: '#B08A38',
          700: '#8C6C28',
          800: '#6B5018',
          900: '#4A3610',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
