import { NextRequest, NextResponse } from 'next/server'
import { getCalendarEvents, getFreeSlots, createAppointment, getCalendars } from '@/lib/ghl'

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('mode') ?? 'new-patients'
  const p = req.nextUrl.searchParams

  try {
    if (mode === 'calendars') return NextResponse.json(await getCalendars())

    if (mode === 'free-slots') {
      const calId = p.get('calendarId') ?? ''
      const start = p.get('startDate') ?? new Date().toISOString().split('T')[0]
      const end   = p.get('endDate') ?? start
      return NextResponse.json(await getFreeSlots(calId, start, end))
    }

    if (mode === 'new-patients') {
      const calId = p.get('calendarId') ?? ''
      const end   = p.get('endTime') ?? new Date().toISOString()
      const start = p.get('startTime') ?? new Date(Date.now() - 30 * 864e5).toISOString()
      const data  = await getCalendarEvents(calId, start, end) as any
      const newPts = (data.events ?? []).filter((e: any) =>
        e.tags?.includes('new-patient') || e.title?.toLowerCase().includes('new patient')
      )
      return NextResponse.json({ newPatientsBooked: newPts.length, events: newPts })
    }

    return NextResponse.json({ error: 'Unknown mode' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.calendarId || !body.contactId || !body.startTime)
      return NextResponse.json({ error: 'calendarId, contactId, startTime required' }, { status: 400 })
    return NextResponse.json(await createAppointment(body), { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
