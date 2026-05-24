'use client'

import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'

interface HeroCarouselProps {
  images: string[]
  alts?: string[]
}

export function HeroCarousel({ images, alts = [] }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (paused || images.length <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next, images.length])

  if (images.length === 0) return null

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt={alts[i] ?? 'Elevate Learning students'}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
