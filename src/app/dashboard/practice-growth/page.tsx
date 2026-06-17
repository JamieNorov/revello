'use client'
import { useMetrics } from '@/hooks/useMetrics'
import ActivityFeed from '@/components/ActivityFeed'

const fmt$ = (n: number) => '$' + Math.round(n).toLocaleString()

export default function PracticeGrowthPage() {
  const { metrics, loading } = useMetrics()

  return (
    <div className="page-practice-growth">
      <div className="page-header">
        <div><h1>Practice Growth</h1><p>Real-time performance across all patient acquisition and retention channels.</p></div>
      </div>

      <div className="metrics-row">
        {[
          { label: 'Influenced Production', value: loading ? '...' : fmt$(metrics.influencedProduction), trend: '+18.4%', positive: true },
          { label: 'New Patients Booked', value: loading ? '...' : String(metrics.newPatientsBooked), trend: '+7 vs last month', positive: true },
          { label: 'Recovered Appointments', value: loading ? '...' : String(metrics.recoveredAppointments), trend: fmt$(metrics.recoveredProduction) + ' recovered', positive: true },
          { label: 'Agent Hours Saved', value: loading ? '...' : String(metrics.agentHoursSaved), trend: '+12.2 this week', positive: true },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-card-label">{m.label}</div>
            <div className="metric-card-value">{m.value}</div>
            <div className={`metric-card-trend ${m.positive ? 'positive' : ''}`}>{m.trend}</div>
          </div>
        ))}
      </div>

      <div className="section-collapsible">
        <div className="section-collapsible-header"><h3>Practice Growth Activity</h3></div>
        <ActivityFeed category="practice_growth" />
      </div>
    </div>
  )
}
