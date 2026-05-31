'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      remove: (id: string) => void
    }
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

export function Turnstile({ onVerify, onError, onExpire }: TurnstileProps) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

  useEffect(() => {
    if (!siteKey) return

    const render = () => {
      if (!ref.current || widgetId.current) return
      widgetId.current = window.turnstile?.render(ref.current, {
        sitekey: siteKey,
        callback: onVerify,
        'error-callback': onError,
        'expired-callback': onExpire,
        theme: 'light',
        size: 'normal',
      }) ?? null
    }

    if (window.turnstile) {
      render()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.onload = render
    document.head.appendChild(script)

    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
    }
  }, [siteKey, onVerify, onError, onExpire])

  if (!siteKey) return null

  return <div ref={ref} className="mt-2" />
}
