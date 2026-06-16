'use client'
import { useEffect, useState, useCallback } from 'react'
import type { Metrics } from '@/types'

const DEFAULT: Metrics = {
  influencedProduction: 0,
  newPatientsBooked: 0,
  recoveredAppointments: 0,
  recoveredProduction: 0,
  agentHoursSaved: 0,
  agentCapacityPct: 0,
}

export function useMetrics(calendarId?: string) {
  const [metrics, setMetrics] = useState<Metrics>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const [prod, appts, recovered, hours] = await Promise.allSettled([
        fetch('/api/ghl/opportunities?mode=influenced').then(r => r.json()),
        calendarId ? fetch(`/api/ghl/appointments?mode=new-patients&calendarId=${calendarId}`).then(r => r.json()) : Promise.resolve({ newPatientsBooked: 0 }),
        fetch('/api/ghl/opportunities?mode=recovered').then(r => r.json()),
        fetch('/api/ghl/conversations?mode=agent-hours').then(r => r.json()),
      ])

      setMetrics({
        influencedProduction: prod.status === 'fulfilled' ? prod.value.influencedProduction ?? 0 : 0,
        newPatientsBooked:    appts.status === 'fulfilled' ? appts.value.newPatientsBooked ?? 0 : 0,
        recoveredAppointments:recovered.status === 'fulfilled' ? recovered.value.count ?? 0 : 0,
        recoveredProduction:  recovered.status === 'fulfilled' ? recovered.value.recoveredProduction ?? 0 : 0,
        agentHoursSaved:      hours.status === 'fulfilled' ? hours.value.hoursSaved ?? 0 : 0,
        agentCapacityPct:     hours.status === 'fulfilled' ? hours.value.agentCapacityPct ?? 0 : 0,
      })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [calendarId])

  useEffect(() => { fetch_() }, [fetch_])

  return { metrics, loading, error, refetch: fetch_ }
}
