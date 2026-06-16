'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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

const STATUS_COLOR = { active: '#7ee5c2', partial: '#f59e0b', inactive: '#6b7280' }
const STATUS_LABEL = { active: 'Active', partial: 'Partially Live', inactive: 'Inactive' }

export default function WelcomePage() {
  const [activeCount, setActiveCount] = useState(0)
  const [practiceName] = useState('Northstar Dental')
  const [location] = useState('Charlotte, NC')

  useEffect(() => {
    setActiveCount(AGENTS.filter(a => a.status === 'active').length)
  }, [])

  return (
    <div className="page-welcome">
      <div className="welcome-hero">
        <div className="hero-left">
          <div className="active-agents-pill">
            <span className="pulse-dot green"/>
            {activeCount} ACTIVE AGENTS
          </div>
          <h1>Welcome back,<br />{practiceName} — {location}</h1>
          <p className="hero-sub">
            Revello AI is making changes across your campaigns, website, and search presence every week.
            Check the Activity Log to see exactly what was done and why.
          </p>
          <Link href="/dashboard/activity-log" className="btn-primary-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            View Activity Log
          </Link>
        </div>
        <div className="hero-right">
          <div className="insight-card">
            <div className="insight-card-label">INSIGHT</div>
            <h3>The 2030 Dental Practice Operating Model</h3>
            <p>Every practice will run on AI agents by 2030. Most won't start building until 2028. This guide explains the model yours is already running on and why the head start compounds.</p>
            <a href="#" className="insight-link">Read the guide →</a>
          </div>
        </div>
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
                    style={{ color: STATUS_COLOR[agent.status], background: `${STATUS_COLOR[agent.status]}18` }}
                  >
                    <span className="status-dot" style={{ background: STATUS_COLOR[agent.status] }}/>
                    {STATUS_LABEL[agent.status]}
                  </span>
                </div>
              </div>
              <ul className="agent-bullets">
                {agent.bullets.map(b => (
                  <li key={b}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7ee5c2" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
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
