'use client'
import { useState } from 'react'

const STEPS = ['Platform', 'Objective', 'Budget', 'Creative', 'Launch']

export default function CampaignLauncherPage() {
  const [step, setStep] = useState(0)
  const [platform, setPlatform] = useState('')
  const [objective, setObjective] = useState('')
  const [budget, setBudget] = useState(1500)
  const [launched, setLaunched] = useState(false)

  return (
    <div className="page-campaign-launcher">
      <div className="page-header">
        <div><h1>Campaign Launcher</h1><p>Create and launch campaigns based on your local market data — powered by Revello AI.</p></div>
      </div>

      <div className="launcher-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`launcher-step${i === step ? ' active' : i < step ? ' done' : ''}`}>
            <div className="step-num">{i < step ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="launcher-body">
        {step === 0 && (
          <div className="launcher-step-content">
            <h2>Choose your platform</h2>
            <div className="platform-cards">
              {[{ id:'google', label:'Google Ads', sub:'Search campaigns — capture high-intent patients actively searching' },
                { id:'meta', label:'Meta Ads', sub:'Social campaigns — reach new patients on Facebook & Instagram' }].map(p => (
                <button key={p.id} className={`platform-card${platform === p.id ? ' selected' : ''}`} onClick={() => { setPlatform(p.id) }}>
                  <strong>{p.label}</strong><p>{p.sub}</p>
                </button>
              ))}
            </div>
            <button className="btn-primary" disabled={!platform} onClick={() => setStep(1)}>Continue →</button>
          </div>
        )}

        {step === 1 && (
          <div className="launcher-step-content">
            <h2>What's the campaign objective?</h2>
            <div className="objective-cards">
              {[{ id:'new-patient', label:'New Patient Acquisition', sub:'Drive new patient bookings from your local market' },
                { id:'treatment', label:'Treatment-Specific', sub:'Target high-value services: implants, Invisalign, whitening' },
                { id:'awareness', label:'Brand Awareness', sub:'Build visibility and recognition in your community' }].map(o => (
                <button key={o.id} className={`platform-card${objective === o.id ? ' selected' : ''}`} onClick={() => setObjective(o.id)}>
                  <strong>{o.label}</strong><p>{o.sub}</p>
                </button>
              ))}
            </div>
            <div className="step-nav">
              <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
              <button className="btn-primary" disabled={!objective} onClick={() => setStep(2)}>Continue →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="launcher-step-content">
            <h2>Set your monthly budget</h2>
            <p className="step-sub">Based on your local market, we recommend starting at $1,500–$3,000/mo for best results.</p>
            <div className="budget-amount">${budget.toLocaleString()}<small>/mo</small></div>
            <input type="range" min={1000} max={10000} step={500} value={budget} onChange={e => setBudget(Number(e.target.value))} className="budget-slider" />
            <div className="budget-projection">
              <div className="forecast-grid">
                <div className="forecast-item"><strong>{Math.round(budget * 0.85)}</strong><small>Est. Clicks</small></div>
                <div className="forecast-item"><strong>{Math.round(budget * 0.031)}</strong><small>Est. Leads</small></div>
                <div className="forecast-item"><strong>{Math.round(budget * 0.055)}</strong><small>Est. Calls</small></div>
              </div>
            </div>
            <div className="step-nav">
              <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" onClick={() => setStep(3)}>Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="launcher-step-content">
            <h2>AI-generated ad copy</h2>
            <p className="step-sub">Revello AI has written 3 ad variations based on your market and objective. Select the ones you want to test.</p>
            <div className="ad-copy-options">
              {['Charlotte\'s Top-Rated Dental Practice | Book Online Today',
                'New Patient Special — Exam, X-rays & Cleaning from $149',
                'Dental Implants Charlotte NC | Free Consultation This Month'].map((h, i) => (
                <div key={i} className="ad-copy-card">
                  <div className="ad-sponsored">Sponsored</div>
                  <div className="ad-headline">{h}</div>
                  <div className="ad-body">Trusted by thousands of Charlotte families. State-of-the-art technology. Insurance accepted. Book online in 60 seconds.</div>
                </div>
              ))}
            </div>
            <div className="step-nav">
              <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="btn-primary" onClick={() => setStep(4)}>Continue →</button>
            </div>
          </div>
        )}

        {step === 4 && !launched && (
          <div className="launcher-step-content">
            <h2>Ready to launch</h2>
            <div className="launch-summary">
              <div className="summary-row"><span>Platform</span><strong>{platform === 'google' ? 'Google Ads' : 'Meta Ads'}</strong></div>
              <div className="summary-row"><span>Objective</span><strong>{objective}</strong></div>
              <div className="summary-row"><span>Monthly Budget</span><strong>${budget.toLocaleString()}/mo</strong></div>
              <div className="summary-row"><span>Ad Variations</span><strong>3 variations</strong></div>
            </div>
            <button className="btn-launch" onClick={() => setLaunched(true)}>🚀 Launch Campaign</button>
          </div>
        )}

        {launched && (
          <div className="launch-success">
            <div className="launch-success-icon">🎉</div>
            <h2>Campaign Launched!</h2>
            <p>Your campaign has been submitted and will go live within 24 hours pending platform review. You'll see activity in your Activity Log once it starts running.</p>
          </div>
        )}
      </div>
    </div>
  )
}
