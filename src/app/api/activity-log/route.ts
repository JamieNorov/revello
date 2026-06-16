import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CATEGORY_MAP: Record<string, string> = {
  practice_growth: 'practice_growth',
  site_seo: 'site_seo',
  local_seo: 'local_seo',
  geo_llm: 'geo_llm',
  google_ads: 'google_ads',
  meta_ads: 'meta_ads',
}

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') ?? ''
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '50'), 200)
  const since = req.nextUrl.searchParams.get('since')
  const locationId = process.env.GHL_LOCATION_ID!

  try {
    const where: Record<string, unknown> = { locationId }
    if (category && CATEGORY_MAP[category]) where.category = category
    if (since) where.createdAt = { gt: new Date(since) }

    const raw = await prisma.activityEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const entries = raw.map(e => ({
      id: e.id,
      category: e.category,
      format: (e.payload as Record<string, unknown>)?.format ?? 'simple',
      headline: e.message,
      body: (e.payload as Record<string, unknown>)?.body,
      finding: (e.payload as Record<string, unknown>)?.finding,
      insight: (e.payload as Record<string, unknown>)?.insight,
      action: (e.payload as Record<string, unknown>)?.action,
      status: (e.payload as Record<string, unknown>)?.status ?? 'completed',
      platform: (e.payload as Record<string, unknown>)?.platform,
      campaignTag: (e.payload as Record<string, unknown>)?.campaignTag,
      timestamp: e.createdAt.toISOString(),
      createdAt: e.createdAt.toISOString(),
    }))

    return NextResponse.json({ entries, total: entries.length })
  } catch (e) {
    return NextResponse.json({ entries: [], error: (e as Error).message })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { category, message, format, finding, insight, action, platform, campaignTag, status } = body
    const locationId = body.locationId ?? process.env.GHL_LOCATION_ID!

    const event = await prisma.activityEvent.create({
      data: {
        type: category,
        category,
        message,
        locationId,
        payload: { format, finding, insight, action, platform, campaignTag, status: status ?? 'completed' },
      },
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
