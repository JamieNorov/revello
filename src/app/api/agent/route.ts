import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const APP    = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

const SYSTEM = `You are Revello, an autonomous AI growth agent for a dental practice.
You have direct access to the practice's CRM and can take real actions.
Be concise and action-oriented. Always report what you did with numbers.
When you execute an action, confirm it happened. Never ask unnecessary questions.`

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  { type: 'function', function: { name: 'get_influenced_production', description: 'Get total influenced production from won opportunities', parameters: { type: 'object', properties: {} } } },
  { type: 'function', function: { name: 'get_new_patients', description: 'Get new patients booked count', parameters: { type: 'object', properties: { calendarId: { type: 'string' } }, required: ['calendarId'] } } },
  { type: 'function', function: { name: 'find_schedule_gaps', description: 'Find open appointment slots', parameters: { type: 'object', properties: { calendarId: { type: 'string' }, daysAhead: { type: 'number' } }, required: ['calendarId'] } } },
  { type: 'function', function: { name: 'find_unscheduled_treatment', description: 'Find contacts with unscheduled treatment', parameters: { type: 'object', properties: { pipelineStageId: { type: 'string' } }, required: ['pipelineStageId'] } } },
  { type: 'function', function: { name: 'send_sms', description: 'Send SMS to a contact', parameters: { type: 'object', properties: { contactId: { type: 'string' }, message: { type: 'string' } }, required: ['contactId', 'message'] } } },
  { type: 'function', function: { name: 'book_appointment', description: 'Book an appointment', parameters: { type: 'object', properties: { calendarId: { type: 'string' }, contactId: { type: 'string' }, startTime: { type: 'string' }, endTime: { type: 'string' }, title: { type: 'string' } }, required: ['calendarId', 'contactId', 'startTime'] } } },
  { type: 'function', function: { name: 'trigger_workflow', description: 'Trigger a GHL workflow', parameters: { type: 'object', properties: { workflowId: { type: 'string' }, contactId: { type: 'string' } }, required: ['workflowId', 'contactId'] } } },
  { type: 'function', function: { name: 'get_agent_hours', description: 'Get hours saved by Revello', parameters: { type: 'object', properties: {} } } },
]

async function run(name: string, args: Record<string, unknown>): Promise<string> {
  try {
    const routes: Record<string, () => Promise<Response>> = {
      get_influenced_production: () => fetch(`${APP}/api/ghl/opportunities?mode=influenced`),
      get_new_patients:          () => fetch(`${APP}/api/ghl/appointments?mode=new-patients&calendarId=${args.calendarId}`),
      find_schedule_gaps:        () => { const d=args.daysAhead??7; const s=new Date().toISOString().split('T')[0]; const e=new Date(Date.now()+(d as number)*864e5).toISOString().split('T')[0]; return fetch(`${APP}/api/ghl/appointments?mode=free-slots&calendarId=${args.calendarId}&startDate=${s}&endDate=${e}`) },
      find_unscheduled_treatment:() => fetch(`${APP}/api/ghl/opportunities?mode=unscheduled&pipelineStageId=${args.pipelineStageId}`),
      send_sms:                  () => fetch(`${APP}/api/ghl/conversations`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(args) }),
      book_appointment:          () => fetch(`${APP}/api/ghl/appointments`,  { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(args) }),
      trigger_workflow:          () => fetch(`${APP}/api/ghl/workflows`,     { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(args) }),
      get_agent_hours:           () => fetch(`${APP}/api/ghl/conversations?mode=agent-hours`),
    }
    const res = await routes[name]?.()
    return JSON.stringify(await res?.json())
  } catch (e) {
    return JSON.stringify({ error: (e as Error).message })
  }
}

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json()

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM },
    ...history,
    { role: 'user', content: message },
  ]

  const enc = new TextEncoder()
  const stream = new ReadableStream({
    async start(ctrl) {
      const send = (text: string) =>
        ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ text })}\n\n`))

      let running = true
      while (running) {
        const resp = await openai.chat.completions.create({
          model: 'gpt-4o', messages, tools, tool_choice: 'auto', stream: false, max_tokens: 1000,
        })
        const msg = resp.choices[0].message
        messages.push(msg)

        if (msg.tool_calls?.length) {
          for (const tc of msg.tool_calls) {
            send(`\n⚡ ${tc.function.name.replace(/_/g,' ')}...\n`)
            const result = await run(tc.function.name, JSON.parse(tc.function.arguments || '{}'))
            messages.push({ role: 'tool', tool_call_id: tc.id, content: result })
          }
        } else {
          send(msg.content ?? '')
          running = false
        }
      }
      ctrl.enqueue(enc.encode('data: [DONE]\n\n'))
      ctrl.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  })
}
