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
        display: ['Space Grotesk', 'var(--font-display)', 'sans-serif'],
        arabic: ['var(--font-arabic)'],
      },
      colors: {
        brand: {
          50:  '#F0F8FF',
          100: '#EBF4FF',
          200: '#BAD9F9',
          300: '#89C0F5',
          400: '#6AAFF2',
          500: '#3D8EE8',
          600: '#2E80D8',
          700: '#1F6CBD',
          800: '#155AA0',
          900: '#0D4888',
          950: '#093A70',
        },
        gold: {
          50:  '#FEF9EE',
          100: '#FEF6E4',
          200: '#FDEAB8',
          300: '#FBD880',
          400: '#E8B84B',
          500: '#D4A03A',
          600: '#B88A30',
          700: '#8C6820',
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
