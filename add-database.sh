#!/bin/bash

# Script to add PostgreSQL database to Vercel
# Run this after creating the database in Vercel dashboard

echo "📦 Adding DATABASE_URL to Vercel..."
echo ""
echo "Please paste your POSTGRES_PRISMA_URL connection string:"
read -r DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL is required"
  exit 1
fi

echo ""
echo "Adding DATABASE_URL to Vercel..."
vercel env add DATABASE_URL production <<< "$DATABASE_URL"
vercel env add DATABASE_URL preview <<< "$DATABASE_URL"
vercel env add DATABASE_URL development <<< "$DATABASE_URL"

echo ""
echo "✅ DATABASE_URL added to all environments!"
echo ""
echo "Next steps:"
echo "1. Redeploy your project: vercel --prod"
echo "2. Or push to GitHub to trigger automatic deployment"






