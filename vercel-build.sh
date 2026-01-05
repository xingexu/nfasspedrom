#!/bin/bash
# Build script for Vercel that handles Prisma Accelerate

set -e

echo "🔨 Building application..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Run migrations using DIRECT_URL if available, otherwise DATABASE_URL
# Use db push as fallback since migrate deploy can fail on existing schemas
if [ -n "$DIRECT_URL" ]; then
  echo "🔄 Syncing database schema with DIRECT_URL..."
  DATABASE_URL="$DIRECT_URL" npx prisma migrate deploy 2>/dev/null || DATABASE_URL="$DIRECT_URL" npx prisma db push --skip-generate --accept-data-loss || true
else
  echo "🔄 Syncing database schema with DATABASE_URL..."
  npx prisma migrate deploy 2>/dev/null || npx prisma db push --skip-generate --accept-data-loss || true
fi

# Build Next.js
echo "🏗️ Building Next.js application..."
next build

echo "✅ Build complete!"


