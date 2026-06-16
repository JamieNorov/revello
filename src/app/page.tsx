'use client'
import { useState, useEffect, useRef } from 'react'
import { useMetrics } from '@/hooks/useMetrics'
import { useNova } from '@/hooks/useNova'

const fmt$ = (n: number) => '$' + Math.round(n).toLocaleString()
const fmtN = (n: number) => n.toLocaleString()

// Sparkline canvas renderer
function Sparkline({ points, className }: { points: number[]; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    const w = c.width = c.clientWidth * 2
    const h = c.height = c.clientHeight * 2
    const min = Math.min(...points), max = Math.max(...points)
    const xStep = w / (points.length - 1)
    const y = (v: number) => h - 8 - ((v - min) / (max - min)) * (h - 20)
    const color = className?.includes('sage') ? '#669b8c' : '#7ee5c2'
    ctx.beginPath()
    points.forEach((p, i) => i === 0 ? ctx.moveTo(0, y(p)) : ctx.lineTo(i * xStep, y(p)))
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath()
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, `${color}35`); g.addColorStop(1, `${color}00`)
    ctx.fillStyle = g; ctx.fill()
    ctx.beginPath()
    points.forEach((p, i) => i === 0 ? ctx.moveTo(0, y(p)) : ctx.lineTo(i * xStep, y(p)))
    ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.stroke()
  }, [points, className])
  return <canvas ref={ref} className={`sparkline${className ? ' ' + className : ''}`} />
}

const CHART_DATA = {
  '30D': { base: [31,38,42,45], agent: [47,61,72,88], labels: ['Week 1','Week 2','Week 3','Week 4'] },
  '90D': { base: [28,35,38], agent: [44,56,66], labels: ['Month 1','Month 2','Month 3'] },
  '12M': { base: [30,32,34,36,38,35,37,40,42,44,46,48], agent: [45,52,48,60,66,58,68,74,80,88,94,102], labels: ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'] },
}

export default function DashboardPage() {
  const { metrics, loading } = useMetrics()
  const { messages, streaming, send, clear } = useNova()
  const [commandOpen, setCommandOpen]   = useState(false)
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [chartRange, setChartRange]     = useState<'30D'|'90D'|'12M'>('30D')
  const [inlineInput, setInlineInput]   = useState('')
  const [commandInput, setCommandInput] = useState('')
  const [toast, setToast]               = useState(false)
  const [briefPlaying, setBriefPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const openCommand = (prompt = '') => {
    setCommandInput(prompt)
    setCommandOpen(true)
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inlineInput.trim()) { openCommand(inlineInput); setInlineInput('') }
  }

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commandInput.trim() || streaming) return
    const msg = commandInput.trim()
    setCommandInput('')
    await send(msg)
  }

  const approveAction = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2800)
  }

  const playBrief = async () => {
    if (briefPlaying) { audioRef.current?.pause(); setBriefPlaying(false); return }
    setBriefPlaying(true)
    try {
      const audio = new Audio('/api/morning-brief?audio=1')
      audioRef.current = audio
      audio.onended = () => setBriefPlaying(false)
      await audio.play()
    } catch { setBriefPlaying(false) }
  }

  const chart = CHART_DATA[chartRange]

  return (
    <div className="app-shell">
      {/* Sidebar overlay */}
      <div className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} id="sidebar">
        <div className="brand">
          <div className="brand-mark"><span/><span/><span/></div>
          <div><strong>Revello</strong></div>
          <button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <button className="practice-switcher">
          <img src="/assets/practice-suite.png" alt="" />
          <span><small>Practice</small><strong>Northstar Dental</strong></span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5 5 5-5"/><path d="M7 9l5-5 5 5"/></svg>
        </button>

        <nav>
          <p>Workspace</p>
          <a className="nav-link active" href="#overview">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            <span>Overview</span>
          </a>
          <a className="nav-link" href="#agents" style={{position:'relative'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            <span>Agent Command</span><b className="nav-badge">3</b>
          </a>
          <a className="nav-link" href="#pipeline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/></svg>
            <span>Patient Pipeline</span>
          </a>
          <a className="nav-link" href="#schedule">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <span>Schedule Intelligence</span>
          </a>
          <p>Growth</p>
          <a className="nav-link" href="#campaigns">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
            <span>Campaigns</span>
          </a>
          <a className="nav-link" href="#reputation">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>Reputation</span>
          </a>
          <a className="nav-link" href="#insights">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span>Growth Intelligence</span>
          </a>
        </nav>

        <div className="sidebar-foot">
          <div className="system-status">
            <span/>
            <div><strong>All systems active</strong><small>Last sync 2 min ago</small></div>
          </div>
          <button className="user-button">
            <span className="avatar">JM</span>
            <span><strong>Jamie Morgan</strong><small>Practice owner</small></span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main>
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-button" onClick={() => setSidebarOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <p>{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
              <h1>Growth overview</h1>
            </div>
          </div>
          <div className="top-actions">
            <button className="date-button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <span>Last 30 days</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <button className="icon-button notification-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span/>
            </button>
            <button className="primary-button" onClick={() => openCommand()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              Ask Revello
            </button>
          </div>
        </header>

        <div className="content">
          <div className="ambient-line" aria-hidden="true"/>

          {/* NOVA Hero */}
          <section className="nova-hero">
            <div className="nova-status"><span/>Revello is online</div>
            <p className="nova-greeting">Good afternoon, Jamie.</p>
            <h2>What should we grow today?</h2>

            <form className="nova-inline-prompt" onSubmit={handleInlineSubmit}>
              <span className="nova-prompt-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </span>
              <input
                type="text" value={inlineInput}
                onChange={e => setInlineInput(e.target.value)}
                placeholder="Ask Revello to fill gaps, reactivate patients, or analyze production..."
              />
              <button type="submit">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
              </button>
            </form>

            <div className="nova-quick-actions">
              {[
                { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/></svg>, label: 'Fill schedule gaps', prompt: "Fill next week's schedule gaps" },
                { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, label: 'Find unscheduled treatment', prompt: 'Find high-value unscheduled treatment' },
                { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, label: 'Review agent decisions', prompt: "Review today's agent decisions" },
                { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, label: 'Explain growth', prompt: "Explain this month's growth" },
              ].map(({ icon, label, prompt }) => (
                <button key={label} onClick={() => openCommand(prompt)}>{icon}{label}</button>
              ))}
            </div>

            <div className="nova-proof">
              <p>Your agents created <strong>{loading ? '...' : fmt$(metrics.influencedProduction)} in influenced production</strong> this month.</p>
              <button className="secondary-button" onClick={playBrief}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                {briefPlaying ? 'Playing...' : 'Play brief'}
              </button>
            </div>
          </section>

          {/* Metrics Grid */}
          <section className="metrics-grid">
            <article className="metric-card">
              <div className="metric-head">
                <span>Influenced production</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <strong>{loading ? '...' : fmt$(metrics.influencedProduction)}</strong>
              <div className="metric-foot positive">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                18.4% <span>vs previous period</span>
              </div>
              <Sparkline points={[9,12,11,16,15,19,18,24,22,28,31,36]} />
            </article>

            <article className="metric-card">
              <div className="metric-head">
                <span>New patients booked</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              </div>
              <strong>{loading ? '...' : fmtN(metrics.newPatientsBooked)}</strong>
              <div className="metric-foot positive">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                7 more <span>than last month</span>
              </div>
              <Sparkline points={[4,7,5,8,11,10,14,13,18,17,21,24]} className="sage" />
            </article>

            <article className="metric-card">
              <div className="metric-head">
                <span>Recovered appointments</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              </div>
              <strong>{loading ? '...' : fmtN(metrics.recoveredAppointments)}</strong>
              <div className="metric-foot"><span>{loading ? '...' : fmt$(metrics.recoveredProduction)} production recovered</span></div>
              <div className="mini-people">
                <span>AL</span><span>TB</span><span>MK</span><span>RS</span><span>+17</span>
              </div>
            </article>

            <article className="metric-card">
              <div className="metric-head">
                <span>Agent hours saved</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <strong>{loading ? '...' : metrics.agentHoursSaved}</strong>
              <div className="metric-foot positive">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                12.2 hrs <span>this week</span>
              </div>
              <div className="capacity">
                <div><span style={{width:`${metrics.agentCapacityPct || 78}%`}}/></div>
                <small>{metrics.agentCapacityPct || 78}% agent capacity</small>
              </div>
            </article>
          </section>

          {/* Dashboard Grid */}
          <section className="dashboard-grid">
            <article className="panel production-panel">
              <div className="panel-heading">
                <div><h3>Growth performance</h3><p>Production influenced by Revello agents</p></div>
                <div className="segmented">
                  {(['30D','90D','12M'] as const).map(r => (
                    <button key={r} className={chartRange===r?'active':''} onClick={()=>setChartRange(r)}>{r}</button>
                  ))}
                </div>
              </div>
              <div className="chart-summary">
                <div><span>Total influenced</span><strong>{loading ? '...' : fmt$(metrics.influencedProduction)}</strong></div>
                <div className="chart-legend">
                  <span><i className="legend-dot teal"/>Agent influenced</span>
                  <span><i className="legend-dot gray"/>Baseline</span>
                </div>
              </div>
              <div className="bar-chart">
                <div className="y-axis"><span>$20k</span><span>$15k</span><span>$10k</span><span>$5k</span><span>$0</span></div>
                <div className="chart-area">
                  <i/><i/><i/><i/><i/>
                  {chart.base.map((b, i) => (
                    <div key={i} className="bar-group">
                      <div className="bar base" style={{height:`${b}%`}}/>
                      <div className="bar agent" style={{height:`${chart.agent[i]}%`}}/>
                      <span>{chart.labels[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="panel agent-panel">
              <div className="panel-heading">
                <div><h3>Agent command</h3><p>Your autonomous growth team</p></div>
                <button className="text-button">
                  View all
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                </button>
              </div>
              <div className="agents-list">
                {[
                  { name:'Ava', role:'Lead Concierge', icon:'coral', stat:'14', label:'conversations', svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
                  { name:'Miles', role:'Schedule Optimizer', icon:'teal', stat:'3', label:'gaps filled', svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M12 14v4m-2-2h4"/></svg> },
                  { name:'Clara', role:'Patient Reactivation', icon:'gold', stat:'$8.4k', label:'recovered', svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg> },
                  { name:'Iris', role:'Reputation Manager', icon:'violet', stat:'4.9', label:'avg. rating', svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
                ].map(a => (
                  <button key={a.name} className="agent-row" onClick={() => openCommand(`Tell me about ${a.name}'s activity today`)}>
                    <span className={`agent-icon ${a.icon}`}>{a.svg}<b/></span>
                    <span><strong>{a.name}</strong><small>{a.role}</small></span>
                    <span className="agent-result"><strong>{a.stat}</strong><small>{a.label}</small></span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                ))}
              </div>
            </article>

            <article className="panel attention-panel">
              <div className="panel-heading">
                <div><h3>Needs your attention</h3><p>Decisions your agents cannot make alone</p></div>
                <span className="count-badge">2 open</span>
              </div>
              <div className="attention-list">
                <div className="attention-item">
                  <span className="priority high">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                  </span>
                  <div>
                    <div className="attention-title"><strong>Implant lead ready to book</strong><span>High intent</span></div>
                    <p>Ava qualified Sarah M. for a full-arch consultation and requested a financing call.</p>
                    <small>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      8 minutes ago
                    </small>
                  </div>
                  <div className="item-actions">
                    <button className="approve-button" onClick={approveAction}>Approve call</button>
                    <button className="icon-button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                    </button>
                  </div>
                </div>
                <div className="attention-item">
                  <span className="priority medium">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </span>
                  <div>
                    <div className="attention-title"><strong>Reactivation offer review</strong><span>Campaign</span></div>
                    <p>Clara drafted an offer for 186 overdue hygiene patients. Estimated value: $23,400.</p>
                    <small>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      42 minutes ago
                    </small>
                  </div>
                  <div className="item-actions">
                    <button className="approve-button" onClick={approveAction}>Review offer</button>
                    <button className="icon-button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <article className="panel pulse-panel">
              <div className="practice-image">
                <img src="/assets/practice-suite.png" alt="Northstar Dental treatment suite" />
                <div><span>Practice pulse</span><strong>Healthy</strong></div>
              </div>
              <div className="pulse-score">
                <div className="score-ring"><span>87</span><small>/100</small></div>
                <div><h3>Strong growth momentum</h3><p>Your highest leverage opportunity is filling hygiene openings next Tuesday.</p></div>
              </div>
              <div className="pulse-stats">
                <span><small>Chair utilization</small><strong>84%</strong></span>
                <span><small>Case acceptance</small><strong>71%</strong></span>
                <span><small>Call conversion</small><strong>62%</strong></span>
              </div>
            </article>
          </section>
        </div>
      </main>

      {/* Command Modal */}
      <div className={`command-panel${commandOpen ? ' open' : ''}`} aria-hidden={!commandOpen}>
        <div className="command-backdrop" onClick={() => setCommandOpen(false)}/>
        <div className="command-card">
          <div className="command-head">
            <div className="nova-orb">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div><small>Revello Intelligence</small><strong>What would you like to know?</strong></div>
            <button className="icon-button" onClick={() => { setCommandOpen(false); clear() }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {messages.length === 0 && (
            <div className="suggestions">
              {['Why did production increase this month?','Find the biggest schedule opportunity',"Summarize my agents' work today"].map(s => (
                <button key={s} onClick={() => { setCommandInput(s) }}>{s}</button>
              ))}
            </div>
          )}

          {messages.length > 0 && (
            <div style={{maxHeight:320,overflowY:'auto',margin:'16px 0',display:'flex',flexDirection:'column',gap:10}}>
              {messages.map((m,i) => (
                <div key={i} style={{
                  padding:'10px 13px',borderRadius:10,fontSize:12,lineHeight:1.5,
                  background: m.role==='user' ? 'rgba(126,229,194,.08)' : 'rgba(255,255,255,.04)',
                  border: `1px solid ${m.role==='user' ? 'rgba(126,229,194,.2)' : 'rgba(255,255,255,.07)'}`,
                  color: m.role==='user' ? 'var(--teal)' : '#f4f5f2',
                  alignSelf: m.role==='user' ? 'flex-end' : 'flex-start',
                  maxWidth:'88%', whiteSpace:'pre-wrap',
                }}>
                  {m.content || (streaming && i===messages.length-1 ? '...' : '')}
                </div>
              ))}
            </div>
          )}

          <form className="prompt-box" onSubmit={handleCommandSubmit}>
            <textarea
              ref={textareaRef} rows={2}
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              placeholder="Ask about your practice growth..."
              onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleCommandSubmit(e) } }}
            />
            <button type="submit" disabled={streaming}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
            </button>
          </form>
          <p>Revello analyzes your connected practice data. Verify clinical and financial decisions.</p>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast${toast ? ' show' : ''}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Action approved. Ava will place the call.</span>
      </div>
    </div>
  )
}
