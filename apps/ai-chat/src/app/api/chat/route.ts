import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

const OLLAMA_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.1:8b'
const ALLOWED_ROLES = ['staff', 'admin', 'management']

const SYSTEM_PROMPT = `You are Elev8 AI, the intelligent internal assistant for Elevate Learning Center — a premium language and exam preparation institute in Kuwait led by Ms. Preeti Devadiga.

You assist staff and management with:
- Curriculum planning and course structure for IELTS, TOEFL, SAT, GRE, ACT, PSAT, OET, PTE, GMAT
- Student progress tracking and coaching strategies
- Administrative queries, scheduling, and operations
- Drafting communications, emails, and announcements
- Language teaching methodologies and best practices
- Exam tips, band score strategies, and study plans

Be professional, concise, and helpful. When relevant, reference Elevate Learning's offerings.`

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const role = (user.publicMetadata as Record<string, string>)?.role
  if (!ALLOWED_ROLES.includes(role ?? '')) {
    return new Response('Forbidden', { status: 403 })
  }

  const { messages } = await req.json() as { messages: { role: string; content: string }[] }

  const ollamaMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ]

  const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: ollamaMessages,
      stream: true,
      options: { temperature: 0.7, top_p: 0.9 },
    }),
  })

  if (!ollamaRes.ok || !ollamaRes.body) {
    return new Response('Ollama error', { status: 502 })
  }

  // Stream Ollama's NDJSON response as plain text chunks to the client
  const stream = new ReadableStream({
    async start(controller) {
      const reader = ollamaRes.body!.getReader()
      const decoder = new TextDecoder()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          for (const line of chunk.split('\n')) {
            if (!line.trim()) continue
            try {
              const data = JSON.parse(line)
              const token = data?.message?.content ?? ''
              if (token) controller.enqueue(new TextEncoder().encode(token))
              if (data?.done) { controller.close(); return }
            } catch { /* skip malformed line */ }
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Accel-Buffering': 'no',
    },
  })
}
