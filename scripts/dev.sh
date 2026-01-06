#!/bin/bash

# Development startup script with debugging

set -e

echo "🔍 Pre-flight checks..."
echo ""

# 1. Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
  fi
fi

if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  Warning: DATABASE_URL not set"
  echo "   App will run but database queries may fail"
else
  echo "✅ DATABASE_URL is set"
fi

# 2. Generate Prisma Client
echo ""
echo "📦 Generating Prisma Client..."
npx prisma generate

# 3. Clear Next.js cache for fresh start
echo ""
echo "🧹 Clearing Next.js cache..."
rm -rf .next

# 4. Start dev server
echo ""
echo "🚀 Starting development server..."
echo "   Open http://localhost:3000 in your browser"
echo ""

npm run dev
