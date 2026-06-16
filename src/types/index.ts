export interface Metrics {
  influencedProduction: number
  newPatientsBooked: number
  recoveredAppointments: number
  recoveredProduction: number
  agentHoursSaved: number
  agentCapacityPct: number
}

export interface Agent {
  id: string
  name: string
  role: string
  icon: string
  color: 'coral' | 'teal' | 'gold' | 'violet'
  stat: string
  statLabel: string
}

export interface AttentionItem {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium'
  priorityLabel: string
  time: string
  actionLabel: string
  iconType: string
}

export interface ActivityEvent {
  id: string
  type: string
  category: string
  message: string
  createdAt: string
}

export interface GHLWebhookPayload {
  type: string
  locationId?: string
  contact?: { id?: string; name?: string }
  opportunity?: { id?: string; name?: string; monetaryValue?: number; status?: string }
  appointment?: { id?: string; title?: string; startTime?: string }
  tags?: string[]
}
