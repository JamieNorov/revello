import { NextRequest, NextResponse } from 'next/server'
import { searchOpportunities, getPipelines } from '@/lib/ghl'

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('mode') ?? 'influenced'

  try {
    if (mode === 'pipelines') {
      return NextResponse.json(await getPipelines())
    }

    if (mode === 'influenced') {
      const data = await searchOpportunities({ status: 'won', tags: 'nova-influenced', limit: '200' }) as any
      const total = (data.opportunities ?? []).reduce((s: number, o: any) => s + (o.monetaryValue ?? 0), 0)
      return NextResponse.json({ influencedProduction: total, count: data.opportunities?.length ?? 0 })
    }

    if (mode === 'recovered') {
      const data = await searchOpportunities({ status: 'won', tags: 'recovered-appointment', limit: '200' }) as any
      const total = (data.opportunities ?? []).reduce((s: number, o: any) => s + (o.monetaryValue ?? 0), 0)
      return NextResponse.json({ recoveredProduction: total, count: data.opportunities?.length ?? 0 })
    }

    if (mode === 'unscheduled') {
      const stageId = req.nextUrl.searchParams.get('pipelineStageId') ?? ''
      return NextResponse.json(await searchOpportunities({ pipelineStageId: stageId, limit: '50' }))
    }

    return NextResponse.json({ error: 'Unknown mode' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
