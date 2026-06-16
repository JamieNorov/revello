'use client'
import { useState, useRef } from 'react'

type Pin = { id: string; x: number; y: number; comment: string; status: 'open' | 'resolved' }

export default function WebsiteEditorPage() {
  const [pins, setPins] = useState<Pin[]>([])
  const [drafting, setDrafting] = useState<{ x: number; y: number } | null>(null)
  const [draft, setDraft] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    const rect = overlayRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setDrafting({ x, y })
    setDraft('')
  }

  const submitPin = () => {
    if (!drafting || !draft.trim()) return
    setPins(prev => [...prev, { id: String(Date.now()), x: drafting.x, y: drafting.y, comment: draft, status: 'open' }])
    setDrafting(null)
    setDraft('')
  }

  const resolvePin = (id: string) => setPins(prev => prev.map(p => p.id === id ? { ...p, status: 'resolved' } : p))

  return (
    <div className="page-website-editor">
      <div className="page-header">
        <div><h1>Website Editor</h1><p>Leave comments directly on your website — our team handles the rest.</p></div>
        <div className="page-header-right">
          <span className="editor-hint">Click anywhere on the page to leave a comment</span>
          <button className="btn-secondary">▷ Watch Tutorial</button>
        </div>
      </div>

      <div className="editor-sla-note">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        Most changes are handled within <strong>1–2 business hours</strong>.
      </div>

      <div className="website-preview-wrap">
        <div className="website-preview-toolbar">
          <div className="preview-url">🌐 northstardental.com</div>
          <span className="preview-pins-count">{pins.filter(p => p.status === 'open').length} open comments</span>
        </div>

        <div className="website-preview-frame" ref={overlayRef} onClick={handleClick}>
          <iframe
            src="about:blank"
            className="site-iframe"
            title="Website preview"
          />
          <div className="click-overlay">
            <div className="click-overlay-hint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l16 16"/><path d="M4 20L20 4"/></svg>
              Click anywhere to add a comment
            </div>
          </div>

          {pins.map((pin, i) => (
            <div key={pin.id} className={`comment-pin ${pin.status}`} style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
              <div className="pin-number">{i + 1}</div>
              <div className="pin-popup">
                <p>{pin.comment}</p>
                {pin.status === 'open' && (
                  <button className="pin-resolve" onClick={e => { e.stopPropagation(); resolvePin(pin.id) }}>Mark resolved</button>
                )}
              </div>
            </div>
          ))}

          {drafting && (
            <div className="comment-composer" style={{ left: `${drafting.x}%`, top: `${drafting.y}%` }}>
              <div className="composer-arrow"/>
              <textarea
                autoFocus
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Type your comment here..."
                rows={3}
                onClick={e => e.stopPropagation()}
              />
              <div className="composer-actions">
                <button className="btn-secondary btn-sm" onClick={e => { e.stopPropagation(); setDrafting(null) }}>Cancel</button>
                <button className="btn-primary btn-sm" onClick={e => { e.stopPropagation(); submitPin() }}>Add comment</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
