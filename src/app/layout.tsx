import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Elevate Learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Root layout — middleware handles the redirect to /en
  // This is a fallback
  return children
}
