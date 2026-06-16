import { NextRequest, NextResponse } from 'next/server'

const META_TOKEN = process.env.META_APP_ID && process.env.META_APP_SECRET
  ? `${process.env.META_APP_ID}|${process.env.META_APP_SECRET}` : null

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name')
  const city = req.nextUrl.searchParams.get('city') ?? ''
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  if (!META_TOKEN) return NextResponse.json({ error: 'META_APP_ID and META_APP_SECRET required' }, { status: 503 })

  const query = city ? `${name} ${city}` : name
  const params = new URLSearchParams({
    search_terms: query, ad_type: 'ALL',
    ad_reached_countries: '["US"]',
    access_token: META_TOKEN,
    fields: 'id,page_name,ad_creative_body,ad_creative_link_caption,ad_snapshot_url,spend,impressions,ad_delivery_start_time',
    limit: '20',
  })

  try {
    const res  = await fetch(`https://graph.facebook.com/v19.0/ads_archive?${params}`)
    const data = await res.json() as { data: any[] }
    const ads  = data.data ?? []

    let spendLow = 0, spendHigh = 0
    for (const ad of ads) {
      spendLow  += parseInt(ad.spend?.lower_bound ?? '0', 10)
      spendHigh += parseInt(ad.spend?.upper_bound ?? '0', 10)
    }

    return NextResponse.json({
      isRunningAds: ads.length > 0,
      adCount: ads.length,
      estimatedSpend: {
        low: spendLow, high: spendHigh,
        label: ads.length > 0 ? `$${spendLow.toLocaleString()}–$${spendHigh.toLocaleString()}/mo est.` : 'No active ads',
      },
      creatives: ads.slice(0, 6).map((ad: any) => ({
        id: ad.id, pageName: ad.page_name, body: ad.ad_creative_body,
        snapshotUrl: ad.ad_snapshot_url, startDate: ad.ad_delivery_start_time,
      })),
      searchedFor: query,
    })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
