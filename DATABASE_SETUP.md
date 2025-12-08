# PostgreSQL Database Setup Guide

## Quick Setup (Choose One)

### Option 1: Vercel Postgres (Recommended - Easiest)

1. **In Vercel Dashboard:**
   - Go to your project → Storage → Create Database → Postgres
   - Click "Create" (free tier available)
   - Copy the `POSTGRES_PRISMA_URL` connection string

2. **Add Environment Variable:**
   - Project Settings → Environment Variables
   - Add: `DATABASE_URL` = `POSTGRES_PRISMA_URL` (from step 1)
   - Add: `DIRECT_URL` = `POSTGRES_URL_NON_POOLING` (from step 1)

3. **Deploy:**
   - The build script will automatically run migrations
   - Or manually: `npx prisma migrate deploy`

### Option 2: Supabase (Free Tier)

1. **Sign up:** https://supabase.com
2. **Create a new project**
3. **Get connection string:**
   - Project Settings → Database → Connection string
   - Copy the "URI" connection string
4. **Add to Vercel:** `DATABASE_URL` = your connection string

### Option 3: Neon (Free Tier)

1. **Sign up:** https://neon.tech
2. **Create a new project**
3. **Get connection string:** Copy from dashboard
4. **Add to Vercel:** `DATABASE_URL` = your connection string

### Option 4: Railway (Free Tier)

1. **Sign up:** https://railway.app
2. **Create PostgreSQL database**
3. **Get connection string:** Copy from database settings
4. **Add to Vercel:** `DATABASE_URL` = your connection string

## Local Development Setup

1. **Create `.env` file:**
```bash
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
JWT_SECRET="your-secret-key-change-in-production"
ADMIN_USERNAME="pedrombasidj"
ADMIN_PASSWORD="bigguy !RY7!@gak"
```

2. **Run migrations:**
```bash
npm run db:migrate
```

3. **Start dev server:**
```bash
npm run dev
```

## Environment Variables for Vercel

Add these in **Vercel Dashboard → Project Settings → Environment Variables**:

- `DATABASE_URL` - Your PostgreSQL connection string (REQUIRED)
- `JWT_SECRET` - Random string for session encryption (optional, has default)
- `ADMIN_USERNAME` - Admin username (optional, has default)
- `ADMIN_PASSWORD` - Admin password (optional, has default)

## Migration Commands

```bash
# Create a new migration
npm run db:migrate

# Push schema changes without migration (dev only)
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Generate Prisma Client
npx prisma generate
```

## Troubleshooting

### "Can't reach database server"
- Check your `DATABASE_URL` is correct
- Ensure database allows connections from your IP
- Check SSL mode is set correctly (`?sslmode=require`)

### "Migration failed"
- Make sure database is empty or use `prisma migrate reset` (WARNING: deletes all data)
- Check connection string format

### "Prisma Client not generated"
- Run `npx prisma generate`
- Check `postinstall` script in package.json




