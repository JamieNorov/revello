'use client'
import { useState } from 'react'

const METRICS = [
  { label: 'Reach', value: '24,182' },
  { label: 'Impressions', value: '41,847' },
  { label: 'Leads', value: '29' },
  { label: 'Cost per Lead', value: '$48.20' },
]

export default function MetaAdsPage() {
  const [budget, setBudget] = useState(1500)
  const [approved, setApproved] = useState(false)
  const month = new Date().toLocaleString('default', { month: 'long' })
  const year = new Date().getFullYear()

  return (
    <div className="page-meta-ads">
      <div className="page-header">
        <div><h1>Meta Ads</h1><p>Revello AI surfaces campaign insights and optimizes your Meta campaigns in real time.</p></div>
        <button className="date-range-btn">This Month <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
      </div>

      <div className="metrics-row">
        {METRICS.map(m => (
          <div key={m.label} className="metric-card-sm">
            <div className="metric-card-label">{m.label}</div>
            <div className="metric-card-value">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="campaign-card">
        <div className="campaign-card-header">
          <div className="campaign-name">
            <strong>New Patient Promo — Charlotte</strong>
            <span className="campaign-badge" style={{ background: '#1877F220', color: '#1877F2' }}>Meta</span>
          </div>
          <div className="campaign-budget">
            <span><small>BUDGET</small><strong>${budget.toLocaleString()}.00</strong></span>
            <span><small>CPM</small><strong>$18.40</strong></span>
            <span><small>FREQUENCY</small><strong>1.7×</strong></span>
          </div>
        </div>
        <div className="campaign-metrics">
          {[{ l: 'Reach', v: '24,182' }, { l: 'Impressions', v: '41,847' }, { l: 'Link Clicks', v: '412' }, { l: 'Leads', v: '29' }, { l: 'CPL', v: '$48.20' }, { l: 'CTR', v: '0.99%' }].map(m => (
            <div key={m.l} className="camp-metric"><small>{m.l}</small><strong>{m.v}</strong></div>
          ))}
        </div>
        <div className="campaign-actions">
          <button className="btn-secondary">See Campaign</button>
          <button className="btn-primary" onClick={() => setApproved(true)}>{approved ? '✓ Approved' : `Approve ${month}'s Budget`}</button>
        </div>
      </div>

      <div className="section-collapsible">
        <div className="section-collapsible-header"><h3>Top Performing Ads</h3></div>
        <div className="meta-ad-previews">
          {['New Patient Special — $99 Exam & X-rays', 'Dental Implants Starting at $2,999', 'Invisalign Clear Aligners — Free Consult'].map((h, i) => (
            <div key={i} className="meta-preview-card">
              <div className="meta-preview-creative">
                <div className="meta-offer-badge">{h}</div>
              </div>
              <div className="meta-preview-copy">
                <strong>{h}</strong>
                <p>Limited slots available this month. Book your appointment now before they're gone.</p>
                <button className="meta-cta-btn">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-collapsible">
        <div className="section-collapsible-header"><h3>Budget & Forecasting</h3></div>
        <div className="budget-controls">
          <div className="budget-slider-section">
            <div className="budget-amount">${budget.toLocaleString()}<small>/mo</small></div>
            <input type="range" min={1500} max={10000} step={500} value={budget} onChange={e => setBudget(Number(e.target.value))} className="budget-slider" />
            <div className="budget-daily">≈ ${(budget / 30).toFixed(2)}/day</div>
            <button className="btn-approve-budget" onClick={() => setApproved(true)}>
              {approved ? '✓ Budget Approved' : `Approve ${month} ${year} Campaign`}
            </button>
          </div>
          <div className="forecast-panel">
            <div className="forecast-header">ESTIMATED FOR {month.toUpperCase()} (30 DAYS)</div>
            <div className="forecast-grid">
              <div className="forecast-item"><strong>{Math.round(budget * 16)}</strong><small>Reach</small></div>
              <div className="forecast-item"><strong>{Math.round(budget * 0.27)}</strong><small>Link Clicks</small></div>
              <div className="forecast-item"><strong>{Math.round(budget * 0.019)}</strong><small>Leads</small></div>
              <div className="forecast-item"><strong>${(budget / Math.round(budget * 0.019)).toFixed(0)}</strong><small>Est. CPL</small></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
