import { NextRequest, NextResponse } from 'next/server'
import { getWorkflows, triggerWorkflow } from '@/lib/ghl'

export async function GET() {
  try { return NextResponse.json(await getWorkflows()) }
  catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const { workflowId, contactId } = await req.json()
    if (!workflowId || !contactId)
      return NextResponse.json({ error: 'workflowId and contactId required' }, { status: 400 })
    return NextResponse.json(await triggerWorkflow(workflowId, contactId))
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
