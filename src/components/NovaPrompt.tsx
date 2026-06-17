'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useNova } from '@/hooks/useNova'

const QUICK_ACTIONS = [
  { label: 'Show this week\'s wins', icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
  { label: 'What needs my approval?', icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  { label: 'Why did production drop?', icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> },
  { label: 'Plan next month\'s budget', icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
]

export default function NovaPrompt({ greeting, question, proof }: { greeting: string; question: string; proof?: string }) {
  const { messages, streaming, send } = useNova()
  const [input, setInput] = useState('')

  const submit = (text: string) => {
    if (!text.trim() || streaming) return
    send(text)
    setInput('')
  }

  const lastReply = [...messages].reverse().find(m => m.role === 'assistant')

  return (
    <section className="nova-hero">
      <div className="nova-status"><span/>NOVA is online</div>
      <p className="nova-greeting">{greeting}</p>
      <h2>{question}</h2>

      <form className="nova-inline-prompt" onSubmit={e => { e.preventDefault(); submit(input) }}>
        <span className="nova-prompt-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/></svg>
        </span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask NOVA anything about your practice..."
          disabled={streaming}
        />
        <button type="submit" aria-label="Send" disabled={streaming}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>

      <div className="nova-quick-actions" aria-label="Suggested NOVA actions">
        {QUICK_ACTIONS.map(a => (
          <button key={a.label} type="button" onClick={() => submit(a.label)}>{a.icon}{a.label}</button>
        ))}
      </div>

      <div className="nova-proof">
        {lastReply ? (
          <p>{streaming ? 'NOVA is thinking…' : <><strong>NOVA</strong> — {lastReply.content || '…'}</>}</p>
        ) : (
          <p>{proof}</p>
        )}
        <Link href="/dashboard/activity-log" className="secondary-button">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          View Activity Log
        </Link>
      </div>
    </section>
  )
}
