'use client'
import { useState } from 'react'
import ActivityFeed from '@/components/ActivityFeed'

const METRICS = [
  { label: 'Clicks', value: '1,284', icon: '👆' },
  { label: 'Impressions', value: '18,492', icon: '👁' },
  { label: 'Leads', value: '47', icon: '🎯' },
  { label: 'Phone Calls', value: '83', icon: '📞' },
]

const KEYWORDS = [
  { kw: 'dentist charlotte nc', match: 'exact', clicks: 312, impr: 4200, ctr: '7.4%', leads: 14, calls: 22 },
  { kw: 'dental implants charlotte', match: 'phrase', clicks: 198, impr: 2800, ctr: '7.1%', leads: 11, calls: 18 },
  { kw: 'invisalign near me', match: 'broad', clicks: 154, impr: 3100, ctr: '5.0%', leads: 6, calls: 9 },
  { kw: 'teeth whitening charlotte', match: 'phrase', clicks: 121, impr: 2200, ctr: '5.5%', leads: 4, calls: 7 },
  { kw: 'emergency dentist charlotte', match: 'exact', clicks: 98, impr: 980, ctr: '10.0%', leads: 8, calls: 14 },
  { kw: 'family dentist near me', match: 'broad', clicks: 87, impr: 2100, ctr: '4.1%', leads: 3, calls: 6 },
]

const MATCH_COLORS: Record<string, string> = { exact: '#7ee5c2', phrase: '#c7a8ff', broad: '#f0d567' }

export default function GoogleAdsPage() {
  const [budget, setBudget] = useState(1500)
  const [billing, setBilling] = useState<'one-time' | 'auto'>('one-time')
  const [approved, setApproved] = useState(false)
  const [activeChart, setActiveChart] = useState<string[]>(['Clicks', 'Leads'])

  const month = new Date().toLocaleString('default', { month: 'long' })
  const year = new Date().getFullYear()

  const projected = {
    clicks: Math.round(budget * 0.85),
    calls: Math.round(budget * 0.055),
    leads: Math.round(budget * 0.031),
    visibility: Math.min(98, Math.round(budget / 30)),
  }

  return (
    <div className="page-google-ads">
      <div className="page-header">
        <div><h1>Google Ads</h1><p>Revello AI surfaces campaign insights and optimizes your Google Ads in real time.</p></div>
        <div className="page-header-right">
          <button className="date-range-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            This Month
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </div>

      <div className="metrics-row">
        {METRICS.map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-card-label">{m.label}</div>
            <div className="metric-card-value">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="chart-toggles">
        {['Clicks', 'Impressions', 'Leads', 'Phone Calls'].map(s => (
          <button key={s}
            className={`chart-toggle${activeChart.includes(s) ? ' active' : ''}`}
            onClick={() => setActiveChart(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
          >
            <span className="toggle-dot"/>
            {s}
          </button>
        ))}
      </div>

      <div className="chart-placeholder">
        <div className="chart-placeholder-inner">
          <div className="chart-bars">
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className="chart-bar-col">
                {activeChart.includes('Clicks') && <div className="chart-bar teal" style={{ height: `${30 + Math.sin(i * 0.5) * 20 + Math.random() * 15}%` }}/>}
                {activeChart.includes('Leads') && <div className="chart-bar violet" style={{ height: `${10 + Math.sin(i * 0.4) * 8 + Math.random() * 5}%` }}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Card */}
      <div className="campaign-card">
        <div className="campaign-card-header">
          <div className="campaign-name">
            <strong>Always-On Campaign (English)</strong>
            <span className="campaign-badge">Always-On</span>
            <span className="campaign-location">Charlotte, NC</span>
            <span className="campaign-tag">General Dental</span>
          </div>
          <div className="campaign-budget">
            <span><small>BUDGET</small><strong>${budget.toLocaleString()}.00</strong></span>
            <span><small>DAILY</small><strong>${(budget / 30).toFixed(2)}</strong></span>
            <span><small>SPENT</small><strong>$1,284.50</strong></span>
          </div>
        </div>
        <div className="campaign-metrics">
          {[
            { l: 'Clicks', v: '1,284' }, { l: 'Impressions', v: '18,492' },
            { l: 'CTR', v: '6.9%' }, { l: 'Leads', v: '47' },
            { l: 'Phone Calls', v: '83' }, { l: 'Total Conv.', v: '130' },
            { l: 'Imp. #1 %', v: '34.2%' },
          ].map(m => (
            <div key={m.l} className="camp-metric"><small>{m.l}</small><strong>{m.v}</strong></div>
          ))}
        </div>
        <div className="campaign-actions">
          <button className="btn-secondary">See Campaign</button>
          <button className="btn-primary" onClick={() => setApproved(true)}>{approved ? '✓ Approved' : `Approve ${month}'s Budget`}</button>
        </div>
      </div>

      {/* Keyword Table */}
      <div className="section-collapsible">
        <div className="section-collapsible-header">
          <h3>Keyword Performance <span className="count-badge">({KEYWORDS.length})</span></h3>
        </div>
        <div className="keyword-table-wrap">
          <table className="keyword-table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Clicks</th>
                <th>Impr.</th>
                <th>CTR ▼</th>
                <th>Leads</th>
                <th>Calls</th>
              </tr>
            </thead>
            <tbody>
              {KEYWORDS.map(k => (
                <tr key={k.kw}>
                  <td>
                    {k.kw}
                    <span className="match-tag" style={{ background: `${MATCH_COLORS[k.match]}20`, color: MATCH_COLORS[k.match] }}>{k.match}</span>
                  </td>
                  <td>{k.clicks}</td>
                  <td>{k.impr.toLocaleString()}</td>
                  <td>{k.ctr}</td>
                  <td>{k.leads}</td>
                  <td>{k.calls}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="totals-row">
                <td>Totals</td>
                <td>{KEYWORDS.reduce((s, k) => s + k.clicks, 0).toLocaleString()}</td>
                <td>{KEYWORDS.reduce((s, k) => s + k.impr, 0).toLocaleString()}</td>
                <td>—</td>
                <td>{KEYWORDS.reduce((s, k) => s + k.leads, 0)}</td>
                <td>{KEYWORDS.reduce((s, k) => s + k.calls, 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Budget & Forecasting */}
      <div className="section-collapsible">
        <div className="section-collapsible-header">
          <h3>Budget & Forecasting</h3>
        </div>
        <div className="budget-banner">
          <strong>Real-time campaign management</strong> — Most agencies check your campaigns once a week, send a report, and wait for approval before making changes. Revello monitors your campaign data continuously and applies optimizations the moment they are identified.
        </div>

        <div className="budget-activity">
          <ActivityFeed category="google_ads" limit={3} />
        </div>

        <div className="budget-controls">
          <div className="budget-slider-section">
            <div className="budget-amount">${budget.toLocaleString()}<small>/mo</small></div>
            <input type="range" min={1500} max={10000} step={500} value={budget} onChange={e => setBudget(Number(e.target.value))} className="budget-slider" />
            <div className="budget-daily">≈ ${(budget / 30).toFixed(2)}/day</div>
            <div className="billing-radio">
              <label className={billing === 'one-time' ? 'active' : ''}>
                <input type="radio" checked={billing === 'one-time'} onChange={() => setBilling('one-time')} />
                One-Time (this month only)
              </label>
              <label className={billing === 'auto' ? 'active' : ''}>
                <input type="radio" checked={billing === 'auto'} onChange={() => setBilling('auto')} />
                Auto-Bill (recurring monthly)
              </label>
            </div>
            <button className="btn-approve-budget" onClick={() => setApproved(true)}>
              {approved ? '✓ Budget Approved' : `Approve ${month} ${year} Campaign`}
            </button>
          </div>

          <div className="forecast-panel">
            <div className="forecast-header">ESTIMATED FOR {month.toUpperCase()} (30 DAYS)</div>
            <div className="forecast-grid">
              <div className="forecast-item"><strong>{projected.clicks.toLocaleString()}</strong><small>Clicks</small></div>
              <div className="forecast-item"><strong>{projected.calls}</strong><small>Phone Calls</small></div>
              <div className="forecast-item"><strong>{projected.leads}</strong><small>Leads (Forms)</small></div>
              <div className="forecast-item"><strong>{projected.visibility}%</strong><small>Ad Visibility</small></div>
            </div>
            <p className="forecast-note">Projections based on your historical cost-per-click and conversion rate for Charlotte, NC.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
