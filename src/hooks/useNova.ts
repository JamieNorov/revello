'use client'
import { useState, useCallback } from 'react'

export interface Message { role: 'user' | 'assistant'; content: string }

export function useNova() {
  const [messages, setMessages]   = useState<Message[]>([])
  const [streaming, setStreaming] = useState(false)

  const send = useCallback(async (text: string) => {
    const history = messages.map(m => ({ role: m.role, content: m.content }))
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setStreaming(true)

    let reply = ''
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })

      const reader = res.body!.getReader()
      const dec    = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = dec.decode(value)
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const { text: t } = JSON.parse(data)
            reply += t
            setMessages(prev => {
              const next = [...prev]
              next[next.length - 1] = { role: 'assistant', content: reply }
              return next
            })
          } catch {}
        }
      }
    } finally {
      setStreaming(false)
    }
  }, [messages])

  const clear = () => setMessages([])

  return { messages, streaming, send, clear }
}
