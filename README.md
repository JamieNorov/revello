# CaseFlow NOVA

> Agentic growth infrastructure for dental practices.

## Quick Start

```bash
# 1. Run setup
chmod +x setup.sh && ./setup.sh

# 2. Fill in your credentials
nano .env.local

# 3. Push database schema (needs DATABASE_URL set)
npm run db:push

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Credentials You Need

| Variable | Where to get it |
|----------|----------------|
| `GHL_PRIVATE_TOKEN` | GHL → Settings → Integrations → Private Integrations |
| `GHL_LOCATION_ID` | In your GHL URL: `/location/XXXXX/` |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) |
| `DATABASE_URL` | Supabase → Project → Settings → Database → URI |
| `META_APP_ID/SECRET` | [developers.facebook.com](https://developers.facebook.com) (free, for competitor tracker) |

## Register GHL Webhook

In GHL: Settings → Integrations → Webhooks → Add New

- **URL:** `https://your-domain.com/api/webhooks/ghl`
- **Events:** ContactCreate, OpportunityCreate, OpportunityStatusUpdate, AppointmentCreate, AppointmentUpdate, ContactTagUpdate, ConversationUnreadUpdate

## GHL Tags Convention

NOVA uses these tags in GHL to track what it influences:

- `nova-influenced` → applied to any opportunity NOVA touched
- `recovered-appointment` → no-shows that got rebooked
- `new-patient` → calendar events for new patient appointments

## API Routes

| Route | Purpose |
|-------|---------|
| `GET /api/ghl/opportunities?mode=influenced` | Influenced production total |
| `GET /api/ghl/opportunities?mode=recovered` | Recovered appointments |
| `GET /api/ghl/appointments?mode=new-patients` | New patients booked |
| `GET /api/ghl/conversations?mode=agent-hours` | Agent hours saved |
| `POST /api/ghl/conversations` | Send SMS |
| `POST /api/ghl/appointments` | Book appointment |
| `POST /api/ghl/workflows` | Trigger workflow |
| `POST /api/agent` | Ask NOVA (SSE stream) |
| `GET /api/morning-brief` | Get brief script |
| `GET /api/morning-brief?audio=1` | Stream MP3 audio |
| `GET /api/competitor?name=X&city=Y` | Competitor ad tracker |
| `POST /api/webhooks/ghl` | GHL webhook receiver |
| `GET /api/activity` | Activity feed events |

## Deploy to Vercel

```bash
npx vercel --prod
```

Add all env vars in Vercel Dashboard → Project → Settings → Environment Variables.
