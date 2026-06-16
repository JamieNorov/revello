import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const locationId = req.nextUrl.searchParams.get('locationId') ?? process.env.GHL_LOCATION_ID!
  const limit  = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '20'), 100)
  const since  = req.nextUrl.searchParams.get('since')

  try {
    const events = await prisma.activityEvent.findMany({
      where: {
        locationId,
        ...(since ? { createdAt: { gt: new Date(since) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return NextResponse.json({ events })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
