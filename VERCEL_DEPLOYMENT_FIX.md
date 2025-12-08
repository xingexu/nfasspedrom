# Vercel Deployment Fix

## Critical Issue: SQLite Database

Your app is currently using **SQLite with a file-based database** (`file:./dev.db`), which **will NOT work on Vercel** because:

1. Vercel's serverless functions have a **read-only file system** (except `/tmp`)
2. SQLite requires a writable file system
3. Database files won't persist between deployments

## Solution: Switch to a Cloud Database

You need to migrate from SQLite to a cloud database. Here are your options:

### Option 1: PostgreSQL (Recommended)
1. Sign up for a free PostgreSQL database:
   - [Vercel Postgres](https://vercel.com/storage/postgres) (integrated with Vercel)
   - [Supabase](https://supabase.com) (free tier available)
   - [Neon](https://neon.tech) (free tier available)
   - [Railway](https://railway.app) (free tier available)

2. Update your `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Add `DATABASE_URL` environment variable in Vercel:
   - Go to: Project Settings → Environment Variables
   - Add: `DATABASE_URL` with your PostgreSQL connection string

4. Run migrations:
```bash
npx prisma migrate deploy
```

### Option 2: MySQL
Similar to PostgreSQL, but use `provider = "mysql"` in your schema.

## Immediate Fixes Applied

1. ✅ Fixed Prisma client singleton to work in production
2. ✅ Added proper error logging

## Next Steps

1. **Set up a cloud database** (see options above)
2. **Update your Prisma schema** to use the new database
3. **Add DATABASE_URL** to Vercel environment variables
4. **Run migrations** on Vercel (or use `prisma migrate deploy` in build command)
5. **Redeploy**

## Testing Locally

After switching to a cloud database, test locally:
```bash
# Set your DATABASE_URL
export DATABASE_URL="your-postgres-connection-string"

# Run migrations
npx prisma migrate dev

# Test the app
npm run dev
```

## Environment Variables Needed in Vercel

Make sure these are set in Vercel:
- `DATABASE_URL` - Your database connection string
- `JWT_SECRET` - Secret key for JWT tokens (if not set, it uses a default)
- `ADMIN_USERNAME` - (optional, has default)
- `ADMIN_PASSWORD` - (optional, has default)




