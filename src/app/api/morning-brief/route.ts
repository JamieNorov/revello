import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const APP    = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const LOC    = process.env.GHL_LOCATION_ID!

async function getMetrics() {
  const [prod, appts, hours] = await Promise.allSettled([
    fetch(`${APP}/api/ghl/opportunities?mode=influenced`).then(r => r.json()),
    fetch(`${APP}/api/ghl/appointments?mode=new-patients`).then(r => r.json()),
    fetch(`${APP}/api/ghl/conversations?mode=agent-hours`).then(r => r.json()),
  ])
  return {
    production: prod.status === 'fulfilled' ? prod.value.influencedProduction ?? 0 : 0,
    newPatients: appts.status === 'fulfilled' ? appts.value.newPatientsBooked ?? 0 : 0,
    hoursSaved: hours.status === 'fulfilled' ? hours.value.hoursSaved ?? 0 : 0,
  }
}

export async function GET(req: NextRequest) {
  const wantAudio = req.nextUrl.searchParams.get('audio') === '1'
  const dateKey   = new Date().toISOString().split('T')[0]

  let brief = await prisma.morningBrief.findUnique({ where: { locationId_dateKey: { locationId: LOC, dateKey } } })

  if (!brief) {
    const m = await getMetrics()
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Write a 60-second spoken morning brief for Jamie, the practice owner.
Tone: confident, direct — like a high-performance business partner.
Date: ${today}
Metrics: Influenced Production $${m.production.toLocaleString()}, New Patients ${m.newPatients}, Agent Hours Saved ${m.hoursSaved}
Structure: 1) Headline with top metric 2) Two supporting metrics 3) One priority action today 4) Short motivating close.
Output ONLY the spoken text. No headers, no markdown.`
      }]
    })

    const script = completion.choices[0].message.content ?? 'Good morning. Your metrics are ready.'
    brief = await prisma.morningBrief.create({ data: { locationId: LOC, dateKey, script } })
  }

  if (!wantAudio) return NextResponse.json({ script: brief.script, dateKey })

  const audio = await openai.audio.speech.create({
    model: 'tts-1-hd', voice: 'onyx', input: brief.script,
    response_format: 'mp3', speed: 1.05,
  })

  return new Response(await audio.arrayBuffer(), {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `inline; filename="nova-brief-${dateKey}.mp3"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
