'use client'
import { useState, useEffect } from 'react'
import NovaPrompt from '@/components/NovaPrompt'
import { useMetrics } from '@/hooks/useMetrics'

const fmt$ = (n: number) => '$' + Math.round(n).toLocaleString()

const AGENTS = [
  {
    name: 'Practice Growth Agent',
    status: 'active' as const,
    icon: '🏥',
    bullets: [
      'Captures and tracks every form submission and patient call',
      'Identifies exactly which campaigns drive the most new patients',
      'Scores and prioritizes leads for your front desk automatically',
    ],
  },
  {
    name: 'AI Receptionist',
    status: 'active' as const,
    icon: '🤖',
    bullets: [
      'Answers inbound calls and texts 24/7 — never miss a new patient',
      'Books appointments directly into your calendar after-hours',
      'Sends missed-call text-backs within seconds automatically',
    ],
  },
  {
    name: 'Search & Authority Agent',
    status: 'active' as const,
    icon: '🔍',
    bullets: [
      'Monitors your Google visibility and fixes ranking drops',
      'Automatically highlights your practice in local search results',
      'Tracks how patients find you across Google Search, Maps, and AI answers',
    ],
  },
  {
    name: 'Google Ads Agent',
    status: 'partial' as const,
    icon: '📣',
    bullets: [
      'Rewrites ad copy based on what actually books appointments',
      'Adjusts your budget dynamically to reduce wasted spend',
      'Monitors keyword performance and pauses underperformers automatically',
    ],
  },
  {
    name: 'Patient Reactivation Agent',
    status: 'active' as const,
    icon: '🔄',
    bullets: [
      'Identifies overdue hygiene patients and reaches out automatically',
      'Runs personalized reactivation sequences via SMS and email',
      'Books recall appointments without requiring front desk involvement',
    ],
  },
  {
    name: 'Reputation Agent',
    status: 'active' as const,
    icon: '⭐',
    bullets: [
      'Sends review requests after every completed appointment',
      'Drafts and posts Google review responses in your brand voice',
      'Tracks your average rating trend and alerts you to negative reviews',
    ],
  },
]

const STATUS_EDGE = { active: '126, 229, 194', partial: '240, 213, 103', inactive: '105, 117, 114' }
const STATUS_LABEL = { active: 'Active', partial: 'Partially Live', inactive: 'Inactive' }

export default function WelcomePage() {
  const [activeCount, setActiveCount] = useState(0)
  const [practiceName] = useState('Northstar Dental')
  const [location] = useState('Charlotte, NC')
  const { metrics, loading } = useMetrics()

  useEffect(() => {
    setActiveCount(AGENTS.filter(a => a.status === 'active').length)
  }, [])

  return (
    <div className="page-welcome">
      <NovaPrompt
        greeting={`Good to see you, ${practiceName.split(' ')[0]}.`}
        question="What should we grow today?"
        proof={`${activeCount} agents active across ${practiceName} — ${location}.`}
      />

      <section className="metrics-grid">
        <article className="metric-card">
          <div className="metric-head">
            <span>Influenced production</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="18"/></svg>
          </div>
          <strong>{loading ? '…' : fmt$(metrics.influencedProduction)}</strong>
          <div className="metric-foot positive">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            18.4% <span>vs previous period</span>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-head">
            <span>New patients booked</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
          </div>
          <strong>{loading ? '…' : metrics.newPatientsBooked}</strong>
          <div className="metric-foot positive">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            7 more <span>than last month</span>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-head">
            <span>Recovered appointments</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
          </div>
          <strong>{loading ? '…' : metrics.recoveredAppointments}</strong>
          <div className="metric-foot"><span>{loading ? '…' : fmt$(metrics.recoveredProduction)} production recovered</span></div>
          <div className="mini-people" aria-label="Recently recovered patients">
            <span>SM</span><span>JD</span><span>EC</span><span>+2</span>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-head">
            <span>Agent hours saved</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 2v3"/><path d="M14 2v3"/><path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0"/><path d="M12 8v4l2.5 2.5"/></svg>
          </div>
          <strong>{loading ? '…' : metrics.agentHoursSaved}</strong>
          <div className="metric-foot positive">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            12.2 hrs <span>this week</span>
          </div>
          <div className="capacity">
            <div><span style={{ width: `${loading ? 0 : metrics.agentCapacityPct}%` }}/></div>
            <small>{loading ? '…' : metrics.agentCapacityPct}% agent capacity</small>
          </div>
        </article>
      </section>

      <div className="panel" style={{ padding: 19, marginBottom: 12 }}>
        <div className="panel-heading">
          <div>
            <h3 style={{ color: 'var(--gold)' }}>INSIGHT — The 2030 Dental Practice Operating Model</h3>
            <p style={{ marginTop: 8, maxWidth: 640 }}>Every practice will run on AI agents by 2030. Most won&apos;t start building until 2028. This guide explains the model yours is already running on and why the head start compounds.</p>
          </div>
        </div>
        <a href="#" className="text-button" style={{ marginTop: 14, display: 'inline-flex' }}>Read the guide
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </a>
      </div>

      <div className="agents-section">
        <div className="section-header">
          <h2>Agents</h2>
          <span className="live-badge">
            <span className="pulse-dot green"/>
            {activeCount} Live
          </span>
        </div>
        <div className="agents-grid">
          {AGENTS.map(agent => (
            <div key={agent.name} className="agent-card">
              <div className="agent-card-head">
                <div className="agent-icon-wrap">{agent.icon}</div>
                <div className="agent-info">
                  <strong>{agent.name}</strong>
                  <span
                    className="agent-status"
                    style={{ '--edge': STATUS_EDGE[agent.status] } as React.CSSProperties}
                  >
                    <span className="status-dot"/>
                    {STATUS_LABEL[agent.status]}
                  </span>
                </div>
              </div>
              <ul className="agent-bullets">
                {agent.bullets.map(b => (
                  <li key={b}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
