'use client'
import { useState, useEffect } from 'react'

const STAGES = [
  { id: 'new_lead', label: 'New Lead', color: '#60a5fa' },
  { id: 'contacted', label: 'Contacted', color: '#a78bfa' },
  { id: 'appt_scheduled', label: 'Appt Scheduled', color: '#7ee5c2' },
  { id: 'appt_completed', label: 'Appt Completed', color: '#34d399' },
  { id: 'treatment_presented', label: 'Treatment Presented', color: '#f59e0b' },
  { id: 'active_patient', label: 'Active Patient', color: '#10b981' },
  { id: 'recall_due', label: 'Recall Due', color: '#f97316' },
  { id: 'lost', label: 'Lost / No-Show', color: '#6b7280' },
]

const MOCK_LEADS = [
  { id:'1', name:'Sarah Mitchell', stage:'new_lead', source:'Google Ads', treatment:'Dental Implants', value:4800, time:'2h ago' },
  { id:'2', name:'James Rodriguez', stage:'contacted', source:'Meta Ads', treatment:'Invisalign', value:5500, time:'4h ago' },
  { id:'3', name:'Emily Chen', stage:'appt_scheduled', source:'Referral', treatment:'Crown', value:1200, time:'Yesterday' },
  { id:'4', name:'Marcus Thompson', stage:'appt_completed', source:'Google Organic', treatment:'Whitening', value:800, time:'2 days ago' },
  { id:'5', name:'Linda Park', stage:'treatment_presented', source:'Google Ads', treatment:'Full Arch Implants', value:28000, time:'3 days ago' },
  { id:'6', name:'Robert Davis', stage:'active_patient', source:'Referral', treatment:'Recall', value:350, time:'1 week ago' },
  { id:'7', name:'Anna Wilson', stage:'recall_due', source:'Existing', treatment:'Hygiene Recall', value:350, time:'6 months ago' },
  { id:'8', name:'Kevin Brown', stage:'new_lead', source:'Meta Ads', treatment:'Veneers', value:7200, time:'1h ago' },
]

const SOURCE_COLORS: Record<string, string> = {
  'Google Ads': '#4285F4', 'Meta Ads': '#1877F2', 'Referral': '#7ee5c2',
  'Google Organic': '#34d399', 'Existing': '#6b7280',
}

export default function CRMPage() {
  const [leads, setLeads] = useState(MOCK_LEADS)
  const [dragging, setDragging] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)

  const byStage = (stageId: string) => leads.filter(l => l.stage === stageId)

  const onDrop = (stageId: string) => {
    if (!dragging) return
    setLeads(prev => prev.map(l => l.id === dragging ? { ...l, stage: stageId } : l))
    setDragging(null)
    setOver(null)
  }

  const totalPipelineValue = leads.reduce((s, l) => s + (l.stage !== 'lost' ? l.value : 0), 0)

  return (
    <div className="page-crm">
      <div className="page-header">
        <div>
          <h1>Patient CRM</h1>
          <p>Your full patient pipeline — drag leads between stages or click to view details.</p>
        </div>
        <div className="page-header-right">
          <div className="pipeline-value-badge">
            Pipeline Value: <strong>${totalPipelineValue.toLocaleString()}</strong>
          </div>
          <button className="btn-primary">+ Add Lead</button>
        </div>
      </div>

      <div className="crm-board">
        {STAGES.map(stage => {
          const cards = byStage(stage.id)
          return (
            <div
              key={stage.id}
              className={`crm-column${over === stage.id ? ' drop-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setOver(stage.id) }}
              onDragLeave={() => setOver(null)}
              onDrop={() => onDrop(stage.id)}
            >
              <div className="crm-column-header" style={{ borderTop: `3px solid ${stage.color}` }}>
                <span className="col-label">{stage.label}</span>
                <span className="col-count" style={{ background: `${stage.color}20`, color: stage.color }}>{cards.length}</span>
              </div>
              <div className="crm-cards">
                {cards.map(lead => (
                  <div
                    key={lead.id}
                    className="crm-card"
                    draggable
                    onDragStart={() => setDragging(lead.id)}
                    onDragEnd={() => { setDragging(null); setOver(null) }}
                  >
                    <div className="crm-card-name">{lead.name}</div>
                    <div className="crm-card-treatment">{lead.treatment}</div>
                    <div className="crm-card-footer">
                      <span className="crm-source" style={{ color: SOURCE_COLORS[lead.source] ?? '#6b7280' }}>
                        {lead.source}
                      </span>
                      <span className="crm-value">${lead.value.toLocaleString()}</span>
                    </div>
                    <div className="crm-card-time">{lead.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
