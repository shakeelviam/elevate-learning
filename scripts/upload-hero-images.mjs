import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { basename } from 'path'

// env vars passed via --env-file flag
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const IMAGE_PATHS = [
  '/home/shakeel/Downloads/drive-download-20260608T220343Z-3-001/hero1.jpg',
  '/home/shakeel/Downloads/drive-download-20260608T220343Z-3-001/hero2.jpg',
  '/home/shakeel/Downloads/drive-download-20260608T220343Z-3-001/hero3.jpg',
  '/home/shakeel/Downloads/drive-download-20260608T220343Z-3-001/hero4.jpg',
  '/home/shakeel/Downloads/drive-download-20260608T220343Z-3-001/hero5.jpg',
  '/home/shakeel/Downloads/drive-download-20260608T220343Z-3-001/hero6.jpg',
  '/home/shakeel/Downloads/drive-download-20260608T220343Z-3-001/hero7.jpg',
  '/home/shakeel/Downloads/drive-download-20260608T220343Z-3-001/hero8.jpg',
  '/home/shakeel/Downloads/drive-download-20260608T220343Z-3-001/hero9.jpg',
]

async function run() {
  // 1. Upload each image and collect asset references
  const imageRefs = []
  for (const imgPath of IMAGE_PATHS) {
    const name = basename(imgPath)
    console.log(`Uploading ${name}...`)
    const buffer = readFileSync(imgPath)
    const asset = await client.assets.upload('image', buffer, {
      filename: name,
      contentType: 'image/jpeg',
    })
    console.log(`  ✓ ${name} → ${asset._id}`)
    imageRefs.push({
      _type: 'image',
      _key: asset._id.replace('image-', '').replace(/-/g, '').slice(0, 12),
      asset: { _type: 'reference', _ref: asset._id },
    })
  }

  // 2. Find the siteSettings document
  const doc = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`)
  if (!doc?._id) {
    console.error('No siteSettings document found in Sanity.')
    process.exit(1)
  }
  console.log(`\nPatching siteSettings (${doc._id})...`)

  // 3. Replace heroImages array and clear legacy heroImage
  await client
    .patch(doc._id)
    .set({ heroImages: imageRefs })
    .unset(['heroImage'])
    .commit()

  console.log(`\n✅ Done — ${imageRefs.length} hero images set in Sanity.`)
}

run().catch((err) => { console.error(err); process.exit(1) })
