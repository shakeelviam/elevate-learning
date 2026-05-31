import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'Elev8 AI — Internal Assistant',
  description: 'Elev8 Learning Center internal AI assistant for staff and management.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="h-full bg-[#F0F8FF] antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
