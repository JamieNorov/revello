// src/lib/ghl.ts
const BASE  = process.env.GHL_BASE_URL!
const TOKEN = process.env.GHL_PRIVATE_TOKEN!
export const LOC = process.env.GHL_LOCATION_ID!

const H = {
  Authorization: `Bearer ${TOKEN}`,
  Version: 'v3',
  'Content-Type': 'application/json',
}

async function ghl<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { ...H, ...init.headers } })
  if (!res.ok) throw new Error(`GHL ${res.status} ${path}: ${await res.text()}`)
  return res.json()
}

// Opportunities
export const searchOpportunities = (p: Record<string, string>) =>
  ghl(`/opportunities/search?${new URLSearchParams({ location_id: LOC, ...p })}`)

export const getPipelines = () =>
  ghl(`/opportunities/pipelines?locationId=${LOC}`)

// Calendars
export const getCalendarEvents = (calId: string, start: string, end: string) =>
  ghl(`/calendars/events?calendarId=${calId}&locationId=${LOC}&startTime=${start}&endTime=${end}`)

export const getFreeSlots = (calId: string, startDate: string, endDate: string) =>
  ghl(`/calendars/${calId}/free-slots?locationId=${LOC}&startDate=${startDate}&endDate=${endDate}`)

export const createAppointment = (data: Record<string, unknown>) =>
  ghl('/calendars/events/appointments', { method: 'POST', body: JSON.stringify({ locationId: LOC, ...data }) })

export const getCalendars = () =>
  ghl(`/calendars/?locationId=${LOC}`)

// Conversations
export const searchConversations = (p: Record<string, string>) =>
  ghl(`/conversations/search?${new URLSearchParams({ locationId: LOC, ...p })}`)

export const sendMessage = async (contactId: string, message: string) => {
  const c = await ghl<{ conversation: { id: string } }>('/conversations/', {
    method: 'POST',
    body: JSON.stringify({ locationId: LOC, contactId }),
  })
  return ghl('/conversations/messages', {
    method: 'POST',
    body: JSON.stringify({ type: 'SMS', conversationId: c.conversation.id, message }),
  })
}

// Workflows
export const getWorkflows = () => ghl(`/workflows/?locationId=${LOC}`)

export const triggerWorkflow = (workflowId: string, contactId: string) =>
  ghl(`/workflows/${workflowId}/subscribe`, {
    method: 'POST',
    body: JSON.stringify({ contactId, locationId: LOC }),
  })

// Contacts
export const searchContacts = (data: Record<string, unknown>) =>
  ghl('/contacts/search', { method: 'POST', body: JSON.stringify({ locationId: LOC, ...data }) })
