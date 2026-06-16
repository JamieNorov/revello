import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { GHLWebhookPayload } from '@/types'

function label(e: GHLWebhookPayload): string {
  switch (e.type) {
    case 'ContactCreate':           return `New contact: ${e.contact?.name ?? 'Unknown'}`
    case 'OpportunityCreate':       return `New opportunity: ${e.opportunity?.name} — $${e.opportunity?.monetaryValue ?? 0}`
    case 'OpportunityStatusUpdate': return `Opportunity → ${e.opportunity?.status}: ${e.opportunity?.name}`
    case 'AppointmentCreate':       return `Appointment booked: ${e.appointment?.title} at ${e.appointment?.startTime}`
    case 'AppointmentUpdate':       return `Appointment updated: ${e.appointment?.title}`
    case 'ContactTagUpdate':        return `Tags updated on ${e.contact?.name}: ${e.tags?.join(', ')}`
    case 'ConversationUnreadUpdate':return `New unread message`
    default:                        return `Event: ${e.type}`
  }
}

function category(type: string): string {
  if (type.startsWith('Appointment'))  return 'appointment'
  if (type.startsWith('Opportunity'))  return 'opportunity'
  if (type.startsWith('Conversation')) return 'message'
  return 'contact'
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  let event: GHLWebhookPayload
  try { event = JSON.parse(raw) }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  try {
    await prisma.activityEvent.create({
      data: {
        type: event.type,
        category: category(event.type),
        message: label(event),
        locationId: event.locationId ?? process.env.GHL_LOCATION_ID!,
        payload: event as object,
      },
    })
  } catch (e) {
    console.error('[webhook] db write failed:', e)
  }

  return NextResponse.json({ received: true })
}
