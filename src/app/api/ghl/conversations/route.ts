import { NextRequest, NextResponse } from 'next/server'
import { searchConversations, sendMessage } from '@/lib/ghl'

const MINS_PER_MSG = 5

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('mode') ?? 'agent-hours'
  try {
    if (mode === 'agent-hours') {
      const data = await searchConversations({ assignedTo: 'AI', limit: '200' }) as any
      const count = data.total ?? data.conversations?.length ?? 0
      return NextResponse.json({
        aiMessageCount: count,
        hoursSaved: Math.round((count * MINS_PER_MSG / 60) * 10) / 10,
        agentCapacityPct: Math.min(100, Math.round((count / 80) * 100)),
      })
    }
    if (mode === 'unread') {
      const data = await searchConversations({ unreadOnly: 'true', limit: '50' }) as any
      return NextResponse.json({ unreadCount: data.total ?? data.conversations?.length ?? 0 })
    }
    return NextResponse.json({ error: 'Unknown mode' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { contactId, message } = await req.json()
    if (!contactId || !message)
      return NextResponse.json({ error: 'contactId and message required' }, { status: 400 })
    return NextResponse.json(await sendMessage(contactId, message), { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
