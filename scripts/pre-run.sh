#!/bin/bash

# Pre-run script to ensure everything is set up before starting dev server

set -e

echo "🔍 Pre-run checks and setup..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set in environment"
  echo "   Checking for .env file..."
  
  if [ ! -f .env ]; then
    echo "❌ No .env file found!"
    echo "   Please create a .env file with DATABASE_URL"
    exit 1
  fi
  
  # Load .env file
  export $(cat .env | grep -v '^#' | xargs)
  
  if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in .env file"
    exit 1
  fi
fi

echo "✅ DATABASE_URL is set"

# Generate Prisma Client
echo ""
echo "📦 Generating Prisma Client..."
npx prisma generate

# Check if database is accessible
echo ""
echo "🔌 Checking database connection..."
if npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; then
  echo "✅ Database connection successful"
else
  echo "⚠️  Could not verify database connection (this might be okay if using Prisma Accelerate)"
fi

# Check if migrations are needed
echo ""
echo "🔄 Checking for pending migrations..."
MIGRATION_STATUS=$(npx prisma migrate status 2>&1 || true)

if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
  echo "✅ Database schema is up to date"
elif echo "$MIGRATION_STATUS" | grep -q "following migration have not yet been applied"; then
  echo "⚠️  Pending migrations detected"
  echo "   Run 'npm run db:migrate' or 'npx prisma migrate deploy' to apply them"
elif echo "$MIGRATION_STATUS" | grep -q "following migration have been applied"; then
  echo "✅ Migrations are applied"
else
  echo "⚠️  Could not determine migration status"
  echo "   This might be okay for development"
fi

echo ""
echo "✅ Pre-run checks complete!"
echo "   Starting dev server..."
