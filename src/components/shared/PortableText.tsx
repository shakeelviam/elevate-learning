import { PortableText as PortableTextReact } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/imageUrl'
import { cn } from '@/lib/utils'

interface PortableTextProps {
  value: PortableTextBlock[] | undefined | null
  className?: string
}

const components = {
  types: {
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string; caption?: string } }) => {
      const imageUrl = urlFor(value).width(800).url()
      return (
        <figure className="my-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-900">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-900">{children}</h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-relaxed text-gray-600">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-6 border-s-4 border-brand-400 ps-5 italic text-gray-600 bg-brand-50 py-3 rounded-e-xl">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode
      value?: { href?: string; blank?: boolean }
    }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-brand-600 underline underline-offset-2 hover:text-brand-800 transition-colors"
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="my-4 list-disc ps-6 space-y-1.5 text-gray-600">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="my-4 list-decimal ps-6 space-y-1.5 text-gray-600">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
  },
}

export function PortableText({ value, className }: PortableTextProps) {
  if (!value) return null
  return (
    <div className={cn('prose-elevate', className)}>
      <PortableTextReact value={value} components={components as any} />
    </div>
  )
}
