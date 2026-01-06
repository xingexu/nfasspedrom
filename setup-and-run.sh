#!/bin/bash

# Setup and Run Script for NFASS Blog
echo "🚀 Setting up NFASS Blog..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check npm/node installation."
    exit 1
fi

# Step 2: Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from env.example..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ Created .env file. Please update DATABASE_URL and JWT_SECRET in .env"
        echo "   For local development, you can use:"
        echo "   DATABASE_URL=\"postgresql://user:password@localhost:5432/dbname\""
    else
        echo "❌ env.example not found. Please create .env manually."
        exit 1
    fi
else
    echo "✅ .env file exists"
fi

# Step 3: Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "⚠️  Prisma generate failed. Continuing anyway..."
fi

# Step 4: Start development server
echo "🎉 Starting development server..."
echo "   Server will be available at: http://localhost:3000"
echo ""
npm run dev



