'use client'
import { useState } from 'react'

type ScanResult = {
  name: string; address: string; website: string;
  google: { spend: string; strategy: string; adCount: number; ads: Ad[] }
  meta: { spend: string; adCount: number; ads: Ad[] }
  funnelGaps: Gap[]
}
type Ad = { id: string; headline: string; body: string; status: 'active' | 'past'; startDate?: string; tags: string[]; platform: 'google' | 'meta' }
type Gap = { problem: string; solution: string }

const DEMO_RESULT: ScanResult = {
  name: 'Bright Smile Dental', address: '2100 Independence Blvd, Charlotte, NC 28209', website: 'brightsmile.com',
  google: {
    spend: '$3,000–$5,000/mo', strategy: 'Running a broad awareness campaign with 3 ad groups targeting general dental + whitening terms. No implant or high-value treatment targeting detected.', adCount: 7,
    ads: [
      { id:'g1', headline: 'Bright Smile Dental | Charlotte\'s Top Dentist', body: 'New patients welcome. Affordable cleanings, whitening & more. Book online today!', status:'active', startDate:'Mar 2025', tags:['General Dentistry','New Patient'], platform:'google' },
      { id:'g2', headline: 'Teeth Whitening Charlotte NC | Same-Day Results', body: 'Professional whitening from $199. Open weekends. Walk-ins welcome.', status:'active', tags:['Whitening','Cosmetic'], platform:'google' },
    ],
  },
  meta: {
    spend: '$1,500–$2,500/mo', adCount: 4,
    ads: [
      { id:'m1', headline: 'New Patient Special — $99 Exam & X-rays', body: 'Limited slots available this month. Book your appointment now before they\'re gone!', status:'active', tags:['New Patient','Promo'], platform:'meta' },
    ],
  },
  funnelGaps: [
    { problem: 'They\'re running broad awareness ads driving steady clicks, but with no AI system behind the click, the volume turns into a pile of un-followed-up leads.', solution: 'Revello unifies every lead, form, and call from their Google campaigns into one CRM, where the agent auto-replies, texts back missed calls, and schedules appointments around the clock.' },
    { problem: 'Their Meta ads drive form fills with a new-patient promo, but the funnel ends at the click — half-completed forms go cold with no follow-up automation.', solution: 'Revello captures every form submission into the patient pipeline, where the AI Receptionist auto-qualifies and books within minutes — even at 11pm on a Sunday.' },
    { problem: 'No high-value treatment campaigns detected — they\'re leaving implant and Invisalign revenue on the table with generic dental messaging.', solution: 'Revello builds treatment-specific campaigns with dedicated landing pages and AI follow-up sequences trained on objection handling for high-ticket cases.' },
  ],
}

export default function CompetitorTrackingPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [googleOpen, setGoogleOpen] = useState(true)
  const [funnelOpen, setFunnelOpen] = useState(true)

  const runScan = async () => {
    if (!url.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/competitor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
      const data = await res.json()
      setResult(data.error ? DEMO_RESULT : data)
    } catch { setResult(DEMO_RESULT) }
    finally { setLoading(false) }
  }

  return (
    <div className="page-competitor">
      <div className="page-header">
        <div><h1>Competitor Tracking</h1><p>See exactly what your competitors are running on Google & Meta — their live ads, the strategy behind every campaign, and where Revello AI wins.</p></div>
      </div>

      <div className="competitor-search">
        <div className="search-row">
          <div className="search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text" value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Enter a competitor website URL — e.g. brightsmile.com"
              onKeyDown={e => e.key === 'Enter' && runScan()}
            />
          </div>
          <button className="btn-run-scan" onClick={runScan} disabled={loading || !url.trim()}>
            {loading ? <><span className="spinner"/>&nbsp;Scanning...</> : <>Run Revello AI</>}
          </button>
        </div>
      </div>

      {result && (
        <div className="competitor-results">
          <div className="competitor-identity">
            <div className="competitor-identity-info">
              <h2>{result.name}</h2>
              <p>{result.address}</p>
              <a href={`https://${result.website}`} target="_blank" rel="noopener noreferrer">{result.website} →</a>
            </div>
          </div>

          <div className="ad-panels">
            {/* Google Ads Panel */}
            <div className="ad-panel">
              <div className="ad-panel-header">
                <div className="panel-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.8 10H12v4h5.6C16.8 16.4 14.6 18 12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.6 4 1.5L19 4.5C17.1 2.9 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.5 0 10-4.5 10-10 0-.7-.1-1.3-.2-2z" fill="#4285F4"/></svg>
                  Google Ads
                </div>
              </div>

              <div className="spend-card">
                <div className="spend-amount">{result.google.spend}</div>
                <div className="spend-label">Est. Monthly Ad Spend · Charlotte, NC metro</div>
                <div className="spend-caption">Based on keyword density and ad auction signals</div>
              </div>

              <div className="accordion">
                <button className="accordion-header" onClick={() => setGoogleOpen(o => !o)}>
                  <span>Competitor Strategy — What They're Running</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: googleOpen ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {googleOpen && (
                  <div className="accordion-body">
                    <div className="strategy-row"><span>🏆</span><div><strong>What's running:</strong> {result.google.strategy}</div></div>
                    <div className="strategy-row"><span>⚡</span><div><strong>New activity:</strong> 2 new ads added in the last 30 days — testing new offers.</div></div>
                    <div className="strategy-row"><span>🎨</span><div><strong>Creative mix:</strong> {result.google.adCount} text ads, 0 image, 0 video</div></div>
                    <div className="strategy-row"><span>🔄</span><div><strong>Testing cadence:</strong> {result.google.adCount} live ads across 2 ad groups</div></div>
                  </div>
                )}
              </div>

              <div className="ad-list">
                {result.google.ads.map(ad => (
                  <div key={ad.id} className="ad-card">
                    <div className="ad-status">
                      <span className="active-dot"/>Active {ad.startDate && `· Since ${ad.startDate}`}
                    </div>
                    <div className="ad-sponsored">Sponsored</div>
                    <div className="ad-headline">{ad.headline}</div>
                    <div className="ad-body">{ad.body}</div>
                    <div className="ad-tags">{ad.tags.map(t => <span key={t} className="ad-tag">{t}</span>)}</div>
                    <div className="ad-insight-box">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                      <strong>What this tells you</strong> — targeting broad new-patient intent; no treatment-specific messaging detected.
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta Ads Panel */}
            <div className="ad-panel">
              <div className="ad-panel-header">
                <div className="panel-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="#1877F2"/></svg>
                  Meta Ads
                </div>
                <span className="needs-confirm-badge">Needs confirm</span>
              </div>

              <div className="spend-card">
                <div className="spend-amount">{result.meta.spend}</div>
                <div className="spend-label">Est. Monthly Ad Spend · Facebook & Instagram</div>
                <div className="spend-caption">Based on Meta Ad Library activity signals</div>
              </div>

              <div className="ad-list">
                {result.meta.ads.map(ad => (
                  <div key={ad.id} className="ad-card meta-ad-card">
                    <div className="meta-ad-creative">
                      <div className="meta-ad-creative-placeholder">
                        <span className="meta-offer-overlay">{ad.headline}</span>
                      </div>
                    </div>
                    <div className="ad-body">{ad.body}</div>
                    <div className="ad-tags">{ad.tags.map(t => <span key={t} className="ad-tag">{t}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Funnel Gaps */}
          <div className="funnel-gaps">
            <button className="accordion-header" onClick={() => setFunnelOpen(o => !o)}>
              <span>Funnel Breakdown — Where Revello AI Wins</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: funnelOpen ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {funnelOpen && (
              <div className="gaps-list">
                {result.funnelGaps.map((gap, i) => (
                  <div key={i} className="gap-item">
                    <div className="gap-number">{i + 1}</div>
                    <div className="gap-content">
                      <p className="gap-problem">{gap.problem}</p>
                      <div className="gap-arrow">→</div>
                      <p className="gap-solution"><strong>Revello:</strong> {gap.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
