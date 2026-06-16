'use client'
import { useEffect, useState } from 'react'

export type FeedEntry = {
  id: string
  category: 'practice_growth' | 'site_seo' | 'local_seo' | 'geo_llm' | 'google_ads' | 'meta_ads'
  format: 'simple' | 'fia'
  headline: string
  body?: string
  finding?: string
  insight?: string
  action?: string
  status?: 'completed' | 'pending'
  platform?: 'google' | 'bing' | 'meta' | 'none'
  campaignTag?: string
  timestamp: string
  createdAt: string
}

const CATEGORY_LABELS: Record<string, string> = {
  practice_growth: 'PRACTICE GROWTH',
  site_seo: 'SITE SEO',
  local_seo: 'LOCAL SEO',
  geo_llm: 'GEO/LLM SEO',
  google_ads: 'GOOGLE ADS',
  meta_ads: 'META ADS',
}

const CATEGORY_COLORS: Record<string, string> = {
  practice_growth: '#7ee5c2',
  site_seo: '#c7a8ff',
  local_seo: '#7ee5c2',
  geo_llm: '#f0d567',
  google_ads: '#7ee5c2',
  meta_ads: '#ff7658',
}

const CategoryIcon = ({ cat }: { cat: string }) => {
  const icons: Record<string, JSX.Element> = {
    practice_growth: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
    site_seo: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    local_seo: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    geo_llm: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    google_ads: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.8 10H12v4h5.6C16.8 16.4 14.6 18 12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.6 4 1.5L19 4.5C17.1 2.9 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.5 0 10-4.5 10-10 0-.7-.1-1.3-.2-2z"/></svg>,
    meta_ads: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  }
  return icons[cat] ?? null
}

const PlatformIcon = ({ platform }: { platform?: string }) => {
  if (platform === 'google') return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21.8 10H12v4h5.6C16.8 16.4 14.6 18 12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.6 4 1.5L19 4.5C17.1 2.9 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.5 0 10-4.5 10-10 0-.7-.1-1.3-.2-2z" fill="#4285F4"/></svg>
  )
  if (platform === 'bing') return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 3l5 2v11l5-3-2-1 2-8z" fill="#008373"/></svg>
  )
  return null
}

function groupByDate(entries: FeedEntry[]) {
  const groups: Record<string, FeedEntry[]> = {}
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  for (const e of entries) {
    const d = new Date(e.createdAt).toDateString()
    const label = d === today ? 'TODAY' : d === yesterday ? 'YESTERDAY'
      : new Date(e.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
    if (!groups[label]) groups[label] = []
    groups[label].push(e)
  }
  return groups
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function SimpleCard({ entry }: { entry: FeedEntry }) {
  const color = CATEGORY_COLORS[entry.category]
  return (
    <div className="feed-card feed-simple">
      <div className="feed-card-meta">
        <span className="feed-category" style={{ color }}>
          <CategoryIcon cat={entry.category} />
          {CATEGORY_LABELS[entry.category]}
        </span>
        <span className="feed-time">{timeAgo(entry.createdAt)}</span>
      </div>
      <p className="feed-headline">{entry.headline}</p>
      {entry.body && <p className="feed-body">{entry.body}</p>}
    </div>
  )
}

function FIACard({ entry }: { entry: FeedEntry }) {
  const color = CATEGORY_COLORS[entry.category]
  return (
    <div className="feed-card feed-fia">
      <div className="feed-card-meta">
        <div className="feed-meta-left">
          <span className="feed-time-inline">{new Date(entry.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          {entry.campaignTag && <span className="feed-campaign-tag">{entry.campaignTag}</span>}
          <span className="feed-category-tag" style={{ background: `${color}20`, color }}>
            <CategoryIcon cat={entry.category} />
            {CATEGORY_LABELS[entry.category]}
          </span>
          {entry.status === 'completed' && (
            <span className="feed-status-badge completed">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Completed
            </span>
          )}
        </div>
        <PlatformIcon platform={entry.platform} />
      </div>
      {entry.finding && <p className="feed-fia-line"><strong>Finding.</strong> {entry.finding}</p>}
      {entry.insight && <p className="feed-fia-line"><strong>Insight.</strong> {entry.insight}</p>}
      {entry.action && <p className="feed-fia-line"><strong>Action.</strong> {entry.action}</p>}
      {!entry.finding && entry.headline && <p className="feed-headline">{entry.headline}</p>}
      {!entry.finding && entry.body && <p className="feed-body">{entry.body}</p>}
    </div>
  )
}

const MOCK_ENTRIES: FeedEntry[] = [
  { id:'1', category:'practice_growth', format:'simple', headline:'1 new lead captured', body:'Captured 1 new lead from Google Ads — marked high intent.', timestamp:'4h ago', createdAt: new Date(Date.now()-4*3600000).toISOString() },
  { id:'2', category:'site_seo', format:'fia', headline:'Search profile reviewed', finding:'Your Google Business Profile receives strong engagement via mobile devices — calls and directions are your top actions.', insight:'Calls and direction requests from your listing convert into booked appointments at a higher rate than web visits.', action:'Reviewing your GBP service details, photos, and hours so every mobile touchpoint is optimized for conversion.', status:'completed', platform:'google', timestamp:'13h ago', createdAt: new Date(Date.now()-13*3600000).toISOString() },
  { id:'3', category:'local_seo', format:'fia', headline:'Local pack ranking improved', finding:'Your practice now appears in the top 3 local results for "dentist near me" in your primary service area.', insight:'Top-3 local pack placements drive 75%+ of local search clicks and appointment bookings.', action:'Monitoring ranking stability and expanding coverage to adjacent neighborhoods and high-value service terms.', status:'completed', platform:'google', timestamp:'1d ago', createdAt: new Date(Date.now()-26*3600000).toISOString() },
  { id:'4', category:'geo_llm', format:'fia', headline:'AI mention detected', finding:'ChatGPT named your practice when asked "best dentist in [your city]" — confirmed in 3 of 5 test queries.', insight:'AI search assistants are increasingly the first touchpoint for new patients researching local healthcare providers.', action:'Strengthening the structured data and authoritative citations that AI models pull from to ensure consistent recommendation.', status:'completed', platform:'none', timestamp:'2d ago', createdAt: new Date(Date.now()-48*3600000).toISOString() },
  { id:'5', category:'google_ads', format:'fia', headline:'Campaign optimized', finding:'Your "Implants" keyword group has a 12.4% CTR — 3× the dental industry average — driven by specific long-tail match terms.', insight:'High CTR on implant terms signals strong intent alignment; scaling budget here has a predictable return.', action:'Increased daily budget allocation to top implant keywords by 15% and added 4 new exact-match variants.', status:'completed', platform:'google', campaignTag:'Always-On Campaign', timestamp:'3d ago', createdAt: new Date(Date.now()-72*3600000).toISOString() },
  { id:'6', category:'practice_growth', format:'simple', headline:'Appointment booked via AI Receptionist', body:'Sarah M. booked a new patient consultation after after-hours SMS conversation. Implant inquiry — estimated case value $4,800.', timestamp:'3d ago', createdAt: new Date(Date.now()-74*3600000).toISOString() },
]

export default function ActivityFeed({ category, limit }: { category?: string; limit?: number }) {
  const [entries, setEntries] = useState<FeedEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const url = `/api/activity-log${category ? `?category=${category}` : ''}${limit ? `&limit=${limit}` : ''}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setEntries(data.entries?.length ? data.entries : MOCK_ENTRIES)
        } else {
          setEntries(MOCK_ENTRIES)
        }
      } catch {
        setEntries(MOCK_ENTRIES)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category, limit])

  if (loading) return <div className="feed-loading"><span className="pulse-dot"/><span>Loading activity...</span></div>

  const filtered = category ? entries.filter(e => e.category === category) : entries
  const groups = groupByDate(filtered)

  return (
    <div className="activity-feed">
      {Object.entries(groups).map(([date, items]) => (
        <div key={date} className="feed-group">
          <div className="feed-date-divider"><span>{date}</span></div>
          {items.map(e => e.format === 'fia' ? <FIACard key={e.id} entry={e} /> : <SimpleCard key={e.id} entry={e} />)}
        </div>
      ))}
      {filtered.length === 0 && (
        <div className="feed-empty">No activity yet for this category.</div>
      )}
    </div>
  )
}
