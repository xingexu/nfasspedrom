# 🔧 Database Setup & Fix Guide

## ✅ Current Status

Your app is **already configured for PostgreSQL**! Here's what's set up:

- ✅ Prisma schema uses PostgreSQL
- ✅ Build script includes migrations
- ✅ Initial migration created
- ✅ Database health check endpoint created

## 🚨 What You Need to Do

### Step 1: Get a PostgreSQL Database

**Option A: Vercel Postgres (Easiest - Recommended)**

1. Go to: https://vercel.com/dashboard
2. Click on your project: **nfasspedrom** (or your project name)
3. Click **"Storage"** tab (left sidebar)
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Click **"Create"** (free tier is fine)
7. **Copy these two connection strings:**
   - `POSTGRES_PRISMA_URL` ← Use this for DATABASE_URL
   - `POSTGRES_URL_NON_POOLING` ← Use this for DIRECT_URL (optional)

**Option B: Supabase (Free Alternative)**

1. Go to: https://supabase.com
2. Sign up / Sign in
3. Click **"New Project"**
4. Fill in project details
5. Wait for project to create (~2 minutes)
6. Go to **Settings** → **Database**
7. Scroll to **Connection string** → **URI**
8. Copy the connection string
9. Replace `[PASSWORD]` with your actual database password

**Option C: Neon (Free Alternative)**

1. Go to: https://neon.tech
2. Sign up / Sign in
3. Create a new project
4. Copy the connection string from dashboard

### Step 2: Add Environment Variables in Vercel

1. Go to: **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Add these variables:**

   **Required:**
   ```
   DATABASE_URL = <your-postgres-connection-string>
   ```

   **Optional but Recommended:**
   ```
   DIRECT_URL = <non-pooling-connection-string> (if using Vercel Postgres)
   JWT_SECRET = <generate-with: openssl rand -base64 32>
   ADMIN_USERNAME = bigguy
   ADMIN_PASSWORD = !RY7!@gak
   ```

3. **Important:** Check all environments (Production, Preview, Development)

4. Click **"Save"** for each variable

### Step 3: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger deployment

The build will automatically:
- ✅ Generate Prisma Client
- ✅ Run database migrations
- ✅ Create your tables (Post, Image)

### Step 4: Verify Everything Works

1. **Check Database Health:**
   Visit: `https://nfast.vercel.app/api/health/db`
   
   You should see:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "tables": {
       "Post": true,
       "Image": true
     }
   }
   ```

2. **Try Logging In:**
   - Go to: https://nfast.vercel.app/login
   - Username: `bigguy`
   - Password: `!RY7!@gak`

3. **Check Vercel Logs:**
   - If there are errors, check **Deployments** → Latest → **Functions** tab

## 🔍 Troubleshooting

### "Can't reach database server"

**Causes:**
- DATABASE_URL not set in Vercel
- Connection string is incorrect
- Database doesn't allow connections

**Fix:**
1. Verify DATABASE_URL is set in Vercel (Settings → Environment Variables)
2. Check connection string format: `postgresql://user:password@host:port/database?sslmode=require`
3. Make sure you replaced `[PASSWORD]` if using Supabase
4. Verify database is running and accessible

### "Migration failed"

**Causes:**
- Database already has conflicting tables
- Connection string is wrong

**Fix:**
1. Check Vercel build logs for specific error
2. If database has old tables, you may need to reset:
   ```bash
   # WARNING: This deletes all data!
   npx prisma migrate reset
   ```

### "Invalid credentials" on login

**Causes:**
- ADMIN_USERNAME or ADMIN_PASSWORD not set correctly
- Cookie issues

**Fix:**
1. Verify environment variables in Vercel:
   - `ADMIN_USERNAME` = `bigguy`
   - `ADMIN_PASSWORD` = `!RY7!@gak`
2. Clear browser cookies for the site
3. Try logging in again

### Build succeeds but app doesn't work

**Check:**
1. Visit `/api/health/db` to see database status
2. Check Vercel function logs
3. Verify all environment variables are set

## 📋 Quick Checklist

- [ ] PostgreSQL database created (Vercel Postgres, Supabase, or Neon)
- [ ] DATABASE_URL added to Vercel environment variables
- [ ] JWT_SECRET added (optional but recommended)
- [ ] ADMIN_USERNAME and ADMIN_PASSWORD added (optional)
- [ ] Project redeployed
- [ ] Database health check passes (`/api/health/db`)
- [ ] Login works

## 🆘 Still Having Issues?

1. **Check Vercel Logs:**
   - Deployments → Latest → Functions → Click on a function

2. **Test Database Connection:**
   - Visit: `https://nfast.vercel.app/api/health/db`
   - This will show you exactly what's wrong

3. **Verify Environment Variables:**
   - Make sure they're set for **Production** environment
   - Check for typos (case-sensitive)
   - No extra spaces in values

## 📚 Resources

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase Docs](https://supabase.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)


