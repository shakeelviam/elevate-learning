'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { UserButton } from '@clerk/nextjs'
import ReactMarkdown from 'react-markdown'
import { Send, Plus, Trash2, Bot } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }
interface Conversation { id: string; title: string; messages: Message[] }

function newConvo(): Conversation {
  return { id: Date.now().toString(), title: 'New conversation', messages: [] }
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function ChatInterface({ userName }: { userName: string }) {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window === 'undefined') return [newConvo()]
    try {
      const saved = localStorage.getItem('elev8ai_convos')
      return saved ? JSON.parse(saved) : [newConvo()]
    } catch { return [newConvo()] }
  })
  const [activeId, setActiveId] = useState<string>(() => conversations[0].id)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const active = conversations.find(c => c.id === activeId) ?? conversations[0]

  useEffect(() => {
    localStorage.setItem('elev8ai_convos', JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active.messages, streaming])

  const updateActive = useCallback((updater: (c: Conversation) => Conversation) => {
    setConversations(prev => prev.map(c => c.id === activeId ? updater(c) : c))
  }, [activeId])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...active.messages, userMsg]

    updateActive(c => ({
      ...c,
      title: c.messages.length === 0 ? text.slice(0, 48) : c.title,
      messages: newMessages,
    }))

    setStreaming(true)
    abortRef.current = new AbortController()

    // Add empty assistant message
    updateActive(c => ({ ...c, messages: [...c.messages, userMsg, { role: 'assistant', content: '' }] }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortRef.current.signal,
      })
      if (!res.ok || !res.body) throw new Error('Request failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const snap = accumulated
        setConversations(prev => prev.map(c => {
          if (c.id !== activeId) return c
          const msgs = [...c.messages]
          msgs[msgs.length - 1] = { role: 'assistant', content: snap }
          return { ...c, messages: msgs }
        }))
      }
    } catch (e: unknown) {
      if ((e as Error).name !== 'AbortError') {
        setConversations(prev => prev.map(c => {
          if (c.id !== activeId) return c
          const msgs = [...c.messages]
          msgs[msgs.length - 1] = { role: 'assistant', content: '_Sorry, something went wrong. Please try again._' }
          return { ...c, messages: msgs }
        }))
      }
    } finally {
      setStreaming(false)
    }
  }, [input, streaming, active.messages, activeId, updateActive])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const newChat = () => {
    const c = newConvo()
    setConversations(prev => [c, ...prev])
    setActiveId(c.id)
  }

  const deleteConvo = (id: string) => {
    setConversations(prev => {
      const next = prev.filter(c => c.id !== id)
      if (next.length === 0) { const c = newConvo(); return [c] }
      return next
    })
    if (activeId === id) setActiveId(conversations.find(c => c.id !== id)?.id ?? conversations[0].id)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#2E80D8] flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm leading-none">Elev8 AI</p>
            <p className="text-white/60 text-[10px] mt-0.5">Internal Assistant</p>
          </div>
        </div>

        {/* New chat button */}
        <div className="px-3 py-3">
          <button
            onClick={newChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>

        {/* Conversation list */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 chat-scrollbar pb-4">
          {conversations.map(c => (
            <div
              key={c.id}
              className={cn(
                'group flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors',
                c.id === activeId ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
              onClick={() => setActiveId(c.id)}
            >
              <span className="flex-1 truncate">{c.title}</span>
              <button
                onClick={e => { e.stopPropagation(); deleteConvo(c.id) }}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-300 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <UserButton afterSignOutUrl="/sign-in" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{userName}</p>
            <p className="text-white/50 text-xs">Staff</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto chat-scrollbar">
          {active.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-6 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EBF4FF] flex items-center justify-center">
                <Bot className="w-8 h-8 text-[#2E80D8]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#1F6CBD]">How can I help?</h2>
                <p className="text-gray-400 text-sm mt-1 max-w-sm">
                  Ask me anything about curriculum, students, scheduling, exam strategies, or drafting communications.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 max-w-md w-full">
                {[
                  'Draft a reminder email to students about IELTS mock test',
                  'What are effective strategies for improving IELTS band 6 to 7?',
                  'Create a 4-week SAT study plan for a beginner',
                  'Summarise TOEFL iBT vs ITP differences for a parent enquiry',
                ].map(s => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); textareaRef.current?.focus() }}
                    className="text-left px-3 py-2.5 rounded-xl border border-[#EBF4FF] bg-[#F0F8FF] hover:border-[#6AAFF2] hover:bg-[#EBF4FF] text-xs text-gray-600 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {active.messages.map((msg, i) => (
                <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                  {/* Avatar */}
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold',
                    msg.role === 'user' ? 'bg-[#D4A03A] text-white' : 'bg-[#EBF4FF] text-[#2E80D8]'
                  )}>
                    {msg.role === 'user' ? userName.charAt(0).toUpperCase() : <Bot className="w-4 h-4" />}
                  </div>
                  {/* Bubble */}
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-[#2E80D8] text-white rounded-tr-sm'
                      : 'bg-[#F0F8FF] text-gray-800 rounded-tl-sm border border-[#EBF4FF]'
                  )}>
                    {msg.role === 'assistant' ? (
                      <div className={cn('prose-chat', streaming && i === active.messages.length - 1 && !msg.content ? 'typing-cursor' : streaming && i === active.messages.length - 1 ? 'typing-cursor' : '')}>
                        <ReactMarkdown>{msg.content || ' '}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 bg-white px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-[#F0F8FF] rounded-xl border border-[#EBF4FF] px-4 py-3 focus-within:border-[#6AAFF2] transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Message Elev8 AI…"
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-40 overflow-y-auto"
                style={{ minHeight: '24px' }}
                onInput={e => {
                  const t = e.currentTarget
                  t.style.height = 'auto'
                  t.style.height = t.scrollHeight + 'px'
                }}
              />
              <button
                onClick={streaming ? () => abortRef.current?.abort() : send}
                disabled={!input.trim() && !streaming}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                  streaming
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : input.trim()
                    ? 'bg-[#2E80D8] hover:bg-[#1F6CBD] text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                )}
              >
                {streaming ? (
                  <span className="w-3 h-3 bg-white rounded-sm" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-300 mt-2">
              Elev8 AI · Internal use only · Conversations are stored locally
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
