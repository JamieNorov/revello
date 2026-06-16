'use client'
export default function WebsitePerformancePage() {
  const PAGES = [
    { rank: 1, name: 'Home', visits: 3821, change: '+12%', up: true },
    { rank: 2, name: 'Dental Implants', visits: 1204, change: '+34%', up: true },
    { rank: 3, name: 'Invisalign', visits: 987, change: '+18%', up: true },
    { rank: 4, name: 'New Patient Info', visits: 842, change: '+7%', up: true },
    { rank: 5, name: 'Contact / Book', visits: 731, change: '+22%', up: true },
    { rank: 6, name: 'Meet Dr. Johnson', visits: 612, change: '-3%', up: false },
    { rank: 7, name: 'Teeth Whitening', visits: 498, change: '+9%', up: true },
    { rank: 8, name: 'Emergency Dental', visits: 441, change: '+41%', up: true },
  ]
  const SOURCES = [
    { label: 'Organic Search', pct: 48, count: '4,182', color: '#7ee5c2' },
    { label: 'Direct', pct: 21, count: '1,831', color: '#4b9cf4' },
    { label: 'Paid Search', pct: 17, count: '1,481', color: '#c7a8ff' },
    { label: 'Paid Social', pct: 9, count: '785', color: '#ff7658' },
    { label: 'Organic Social', pct: 3, count: '261', color: '#f0d567' },
    { label: 'Other', pct: 2, count: '174', color: '#555d59' },
  ]
  return (
    <div className="page-website-perf">
      <div className="page-header">
        <div><h1>Website Performance</h1><p>Revello AI surfaces website insights and applies them to your marketing.</p></div>
        <div className="page-header-right">
          <span className="domain-badge">🌐 northstardental.com</span>
          <button className="date-range-btn">Year to Date <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
        </div>
      </div>

      <div className="section-collapsible">
        <div className="section-collapsible-header"><h3>Who's Visiting</h3></div>
        <div className="visitor-cards">
          {[{ seg: 'Women, 25–34', device: 'Mobile', interest: 'Health & Wellness', pct: 34, count: '2,961' },
            { seg: 'Women, 35–44', device: 'Mobile', interest: 'Family & Parenting', pct: 22, count: '1,917' },
            { seg: 'Men, 25–34', device: 'Desktop', interest: 'General Interest', pct: 18, count: '1,568' }].map(v => (
            <div key={v.seg} className="visitor-card">
              <div className="visitor-seg">{v.seg}</div>
              <div className="visitor-tags"><span>{v.device}</span><span>{v.interest}</span></div>
              <div className="visitor-pct">{v.pct}% of engaged visitors</div>
              <div className="visitor-count">{v.count} engaged</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-collapsible">
        <div className="section-collapsible-header"><h3>How They Find Your Practice</h3></div>
        <div className="source-list">
          {SOURCES.map(s => (
            <div key={s.label} className="source-row">
              <div className="source-bar-wrap"><div className="source-bar" style={{ width: `${s.pct}%`, background: s.color }}/></div>
              <span className="source-label">{s.label}</span>
              <span className="source-count">{s.count}</span>
              <span className="source-pct">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-collapsible">
        <div className="section-collapsible-header"><h3>Engagement Metrics</h3></div>
        <div className="metrics-row">
          {[
            { label: 'Engaged Visitors', value: '8,712', sub: '71% of 12,284 total' },
            { label: 'Engagement Rate', value: '71%', sub: '↑ Beating industry avg (58%)' },
            { label: 'Bounce Rate', value: '29%', sub: '↓ Below industry avg (42%)' },
            { label: 'Avg Events / Visit', value: '4.8', sub: 'Above average (3.2)' },
          ].map(m => (
            <div key={m.label} className="metric-card-sm">
              <div className="metric-card-label">{m.label}</div>
              <div className="metric-card-value">{m.value}</div>
              <div className="metric-card-sub" style={{ color: 'var(--teal)' }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-collapsible">
        <div className="section-collapsible-header"><h3>Most Visited Pages</h3></div>
        <div className="pages-list">
          {PAGES.map(p => (
            <div key={p.name} className="page-row">
              <span className="page-rank">#{p.rank}</span>
              <span className="page-name">{p.name}</span>
              <div className="page-bar-wrap"><div className="page-bar" style={{ width: `${(p.visits / 3821) * 100}%` }}/></div>
              <span className="page-visits">{p.visits.toLocaleString()}</span>
              <span className="page-change" style={{ color: p.up ? 'var(--teal)' : 'var(--coral)' }}>{p.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
