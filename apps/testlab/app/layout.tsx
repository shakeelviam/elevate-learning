import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Test Lab — Elevate Learning',
  description: 'Adaptive AI-powered exam practice',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
