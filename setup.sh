#!/bin/bash
set -e

echo ""
echo "🦷 CaseFlow NOVA — Setup"
echo "========================"
echo ""

# Copy env
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✅ Created .env.local — fill in your keys before running the app"
else
  echo "ℹ️  .env.local already exists, skipping"
fi

# Install deps
echo ""
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo ""
echo "🗄️  Generating Prisma client..."
npx prisma generate

echo ""
echo "════════════════════════════════════════"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Fill in .env.local with your keys:"
echo "     - GHL_PRIVATE_TOKEN"
echo "     - GHL_LOCATION_ID"
echo "     - OPENAI_API_KEY"
echo "     - DATABASE_URL (from Supabase)"
echo ""
echo "  2. Push the database schema:"
echo "     npm run db:push"
echo ""
echo "  3. Register webhook in GHL:"
echo "     URL: https://your-domain.com/api/webhooks/ghl"
echo ""
echo "  4. Start the dev server:"
echo "     npm run dev"
echo ""
echo "  Then open: http://localhost:3000"
echo "════════════════════════════════════════"
echo ""
