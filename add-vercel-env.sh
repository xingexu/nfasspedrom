#!/bin/bash

# Script to add environment variables to Vercel
# Make sure you have Vercel CLI installed: npm i -g vercel

echo "🔧 Adding environment variables to Vercel..."
echo ""

# Prisma Accelerate URL (optimized for serverless)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19vbHF4QWpnYS1DbTJoUFRiOGdERUQiLCJhcGlfa2V5IjoiMDFLQlRKU0g5WDJIS1dIVFRSWjVCQkhRSE0iLCJ0ZW5hbnRfaWQiOiJlZTAwMDBhYmZmZDMwYmY2ZjNhOGRlMjFjMGUzM2JhOTQ4YThlMzRhY2UyZTZjMjg5OTIwOWU2NjRkYTEwYmUyIiwiaW50ZXJuYWxfc2VjcmV0IjoiMjljMGQzZDktY2E4Yi00OGZlLTgyZmItNjlmOThmNWRlZTQ1In0.ILCD4Nym7xV0ao2Y14bEVmiLwVYDMo_sHsnXvVsieEs"

# Direct Postgres URL (for migrations)
DIRECT_URL="postgres://ee0000abffd30bf6f3a8de21c0e33ba948a8e34ace2e6c2899209e664da10be2:sk_olqxAjga-Cm2hPTb8gDED@db.prisma.io:5432/postgres?sslmode=require"

# Generate JWT_SECRET if not set
if [ -z "$JWT_SECRET" ]; then
  JWT_SECRET=$(openssl rand -base64 32)
  echo "Generated JWT_SECRET: $JWT_SECRET"
fi

echo "Adding DATABASE_URL to Vercel..."
echo "$DATABASE_URL" | vercel env add DATABASE_URL production
echo "$DATABASE_URL" | vercel env add DATABASE_URL preview
echo "$DATABASE_URL" | vercel env add DATABASE_URL development

echo ""
echo "Adding DIRECT_URL to Vercel (for migrations)..."
echo "$DIRECT_URL" | vercel env add DIRECT_URL production
echo "$DIRECT_URL" | vercel env add DIRECT_URL preview
echo "$DIRECT_URL" | vercel env add DIRECT_URL development

echo ""
echo "Adding ADMIN_USERNAME to Vercel..."
echo "bigguy" | vercel env add ADMIN_USERNAME production
echo "bigguy" | vercel env add ADMIN_USERNAME preview
echo "bigguy" | vercel env add ADMIN_USERNAME development

echo ""
echo "Adding ADMIN_PASSWORD to Vercel..."
echo "!RY7!@gak" | vercel env add ADMIN_PASSWORD production
echo "!RY7!@gak" | vercel env add ADMIN_PASSWORD preview
echo "!RY7!@gak" | vercel env add ADMIN_PASSWORD development

echo ""
echo "Adding JWT_SECRET to Vercel..."
echo "$JWT_SECRET" | vercel env add JWT_SECRET production
echo "$JWT_SECRET" | vercel env add JWT_SECRET preview
echo "$JWT_SECRET" | vercel env add JWT_SECRET development

echo ""
echo "✅ All environment variables added!"
echo ""
echo "📋 Next steps:"
echo "1. Redeploy your application in Vercel"
echo "2. Check database health: https://nfast.vercel.app/api/health/db"
echo "3. Try logging in: https://nfast.vercel.app/login"
