'use client'
import { useState } from 'react'
import ActivityFeed from '@/components/ActivityFeed'

const CATEGORIES = [
  { key: '', label: 'All', count: 777 },
  { key: 'practice_growth', label: 'Practice Growth', count: 571 },
  { key: 'site_seo', label: 'Site SEO', count: 91 },
  { key: 'local_seo', label: 'Local SEO', count: 34 },
  { key: 'geo_llm', label: 'GEO/LLM SEO', count: 28 },
  { key: 'google_ads', label: 'Google Ads', count: 53 },
  { key: 'meta_ads', label: 'Meta Ads', count: 0 },
]

const DATE_RANGES = ['Today', 'This Week', 'This Month', 'Year to Date', 'Custom']

export default function ActivityLogPage() {
  const [activeCategory, setActiveCategory] = useState('')
  const [dateRange, setDateRange] = useState('Year to Date')
  const [showDateMenu, setShowDateMenu] = useState(false)

  const rangeLabel = dateRange === 'Year to Date'
    ? `Jan 1, ${new Date().getFullYear()} – ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : dateRange

  return (
    <div className="page-activity-log">
      <div className="page-header">
        <div>
          <h1>Activity Log</h1>
          <p>A real-time feed of what your AI agents are doing across all locations.</p>
        </div>
        <div className="page-header-right">
          <div className="date-picker-wrap">
            <button className="date-range-btn" onClick={() => setShowDateMenu(m => !m)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <strong>{dateRange}</strong>
              <span className="date-range-sub">{rangeLabel}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showDateMenu && (
              <div className="date-dropdown">
                {DATE_RANGES.map(r => (
                  <button key={r} className={dateRange === r ? 'active' : ''} onClick={() => { setDateRange(r); setShowDateMenu(false) }}>{r}</button>
                ))}
              </div>
            )}
          </div>
          <div className="location-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Northstar Dental — Charlotte, NC
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>

      <div className="activity-notice">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        AI optimization activity updates <strong>weekly on Mondays.</strong> Practice Growth updates <strong>every hour.</strong>
      </div>

      <div className="category-pills">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            className={`category-pill${activeCategory === c.key ? ' active' : ''}`}
            onClick={() => setActiveCategory(c.key)}
          >
            {c.label} <span className="pill-count">{c.count}</span>
          </button>
        ))}
      </div>

      <ActivityFeed category={activeCategory || undefined} />
    </div>
  )
}
