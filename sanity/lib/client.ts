import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01'

/**
 * Read-only client — safe to use in server components and client components.
 * Uses CDN for fast reads. Does NOT require a token.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/**
 * Write client — ONLY use in server actions / API routes.
 * Requires SANITY_API_WRITE_TOKEN environment variable.
 * DO NOT expose this to the browser.
 */
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
