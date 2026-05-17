export const dynamic = 'force-dynamic'

export const metadata = {
  referrer: 'same-origin' as const,
  robots: 'noindex' as const,
}

export const viewport = {
  width: 'device-width' as const,
  initialScale: 1,
  viewportFit: 'cover' as const,
}

import StudioClient from './StudioClient'

export default function StudioPage() {
  return <StudioClient />
}
