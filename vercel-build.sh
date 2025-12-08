#!/bin/bash
# Build script for Vercel that handles Prisma Accelerate

set -e

echo "🔨 Building application..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Run migrations using DIRECT_URL if available, otherwise DATABASE_URL
if [ -n "$DIRECT_URL" ]; then
  echo "🔄 Running migrations with DIRECT_URL..."
  DATABASE_URL="$DIRECT_URL" npx prisma migrate deploy || npx prisma db push --skip-generate
else
  echo "🔄 Running migrations with DATABASE_URL..."
  npx prisma migrate deploy || npx prisma db push --skip-generate
fi

# Build Next.js
echo "🏗️ Building Next.js application..."
next build

echo "✅ Build complete!"
