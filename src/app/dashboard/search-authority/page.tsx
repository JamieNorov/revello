'use client'
import { useState } from 'react'
import ActivityFeed from '@/components/ActivityFeed'

const TABS = ['Monthly Insights', 'Site SEO - Google', 'Site SEO - Bing', 'Local SEO', 'GEO/LLM SEO']

const POSITION_BUCKETS = [
  { label: 'Position 1–3', color: '#176b62', count: 12, keywords: ['dentist charlotte nc', 'dental implants charlotte', 'emergency dentist charlotte nc', 'family dentist charlotte'] },
  { label: 'Position 4–10', color: '#7770a9', count: 34, keywords: ['teeth whitening charlotte', 'invisalign charlotte', 'dental cleaning near me', 'pediatric dentist charlotte'] },
  { label: 'Position 11–20', color: '#c99842', count: 28, keywords: ['cosmetic dentist charlotte nc', 'dental veneers charlotte', 'full mouth restoration'] },
]

export default function SearchAuthorityPage() {
  const [activeTab, setActiveTab] = useState('Site SEO - Google')
  const [openBuckets, setOpenBuckets] = useState<Record<string, boolean>>({})

  const toggleBucket = (label: string) => setOpenBuckets(o => ({ ...o, [label]: !o[label] }))

  return (
    <div className="page-search">
      <div className="page-header">
        <div><h1>Search & Authority</h1><p>Revello AI surfaces search insights and acts on them to grow your visibility.</p></div>
        <div className="page-header-right">
          <button className="date-range-btn">Year to Date <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
        </div>
      </div>

      <div className="tab-row">
        {TABS.map(t => (
          <button key={t} className={`tab-btn${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {activeTab === 'Site SEO - Google' && (
        <div>
          <div className="seo-intro-grid">
            {[
              { title: 'Algorithm Monitoring', desc: 'Revello AI tracks every Google algorithm update and automatically audits your site for compliance so ranking drops are caught before they cost you patients.' },
              { title: 'On-Page Optimization', desc: 'Title tags, meta descriptions, header structure, and internal linking are continuously optimized based on what searchers in your market are actually typing.' },
              { title: 'Search Console Intelligence', desc: 'Revello reads your Google Search Console data daily to identify which pages are gaining or losing visibility and takes corrective action.' },
              { title: 'Technical SEO', desc: 'Page speed, Core Web Vitals, crawlability, and structured data are monitored and optimized automatically — no dev work required on your side.' },
            ].map(c => (
              <div key={c.title} className="seo-intro-card">
                <strong>{c.title}</strong>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="data-notice">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            Google Search Console data has a 48–72 hour processing delay. The most recent days will appear as data finalizes.
          </div>

          <div className="metrics-row">
            {[
              { label: 'Clicks', value: '3,847', sub: 'Last 90 days' },
              { label: 'Impressions', value: '82,341', sub: 'Last 90 days' },
              { label: 'CTR', value: '4.7%', sub: 'Last 90 days' },
              { label: 'Avg. Position', value: '8.2', sub: 'Last 90 days' },
            ].map(m => (
              <div key={m.label} className="metric-card-sm">
                <div className="metric-card-label">{m.label}</div>
                <div className="metric-card-value">{m.value}</div>
                <div className="metric-card-sub">{m.sub}</div>
              </div>
            ))}
          </div>

          <div className="section-collapsible">
            <div className="section-collapsible-header"><h3>Google Keyword Positions</h3></div>
            {POSITION_BUCKETS.map(b => (
              <div key={b.label} className="position-bucket">
                <button className="bucket-header" onClick={() => toggleBucket(b.label)}>
                  <span className="bucket-dot" style={{ background: b.color }}/>
                  <strong>{b.label}</strong>
                  <span className="bucket-count">{b.count} keywords</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: openBuckets[b.label] ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {openBuckets[b.label] && (
                  <div className="bucket-keywords">
                    {b.keywords.map(k => <span key={k} className="keyword-chip">{k}</span>)}
                    <span className="keyword-chip muted">+{b.count - b.keywords.length} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="section-collapsible">
            <div className="section-collapsible-header"><h3>Recent Activity</h3></div>
            <ActivityFeed category="site_seo" limit={5} />
          </div>
        </div>
      )}

      {activeTab === 'Local SEO' && (
        <div>
          <div className="metrics-row">
            {[
              { label: 'Profile Views', value: '2,841', sub: 'Last 90 days' },
              { label: 'Calls from Listing', value: '312', sub: 'Last 90 days' },
              { label: 'Direction Requests', value: '148', sub: 'Last 90 days' },
              { label: 'Website Clicks', value: '892', sub: 'Last 90 days' },
            ].map(m => (
              <div key={m.label} className="metric-card-sm">
                <div className="metric-card-label">{m.label}</div>
                <div className="metric-card-value">{m.value}</div>
                <div className="metric-card-sub">{m.sub}</div>
              </div>
            ))}
          </div>
          <ActivityFeed category="local_seo" />
        </div>
      )}

      {activeTab === 'GEO/LLM SEO' && (
        <div>
          <div className="geo-highlight">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <div>
              <strong>47 AI mentions this period</strong>
              <p>Your practice was cited as a source in AI-generated responses across ChatGPT, Gemini, and Perplexity.</p>
            </div>
          </div>

          <div className="geo-keywords">
            <div className="geo-keywords-header">
              <h3>Keywords Triggering Your Practice</h3>
              <span className="count-badge">56 keywords</span>
            </div>
            <div className="keyword-chips">
              {['best dentist charlotte nc', 'dental implants near me', 'charlotte dentist reviews', 'invisalign charlotte', 'emergency dentist open now charlotte', 'teeth whitening charlotte nc', 'family dentist charlotte nc', 'dental crown cost charlotte'].map(k => (
                <span key={k} className="keyword-chip">{k}</span>
              ))}
            </div>
          </div>

          <ActivityFeed category="geo_llm" />
        </div>
      )}

      {(activeTab === 'Site SEO - Bing' || activeTab === 'Monthly Insights') && (
        <div className="coming-soon-panel">
          <div className="coming-soon-icon">🔍</div>
          <h3>{activeTab}</h3>
          <p>Connect your {activeTab === 'Site SEO - Bing' ? 'Bing Webmaster Tools' : 'Google Search Console'} account to activate this section.</p>
          <button className="btn-primary">Connect Account</button>
        </div>
      )}
    </div>
  )
}
