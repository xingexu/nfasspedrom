# 🔗 Vercel Database URL Setup Guide

## Quick Setup: Add DATABASE_URL to Your Vercel Project

### Step 1: Get Your Database Connection String

**Option A: Use Vercel Postgres (Recommended - Easiest)**

1. Go to your Vercel project: https://vercel.com/xinges-projects/nfast
2. Click on the **"Storage"** tab (left sidebar)
3. If you don't have a database yet:
   - Click **"Create Database"**
   - Select **"Postgres"**
   - Click **"Create"** (free tier is fine)
   - Wait for it to be created (~30 seconds)
4. Once created, you'll see connection strings:
   - **Copy `POSTGRES_PRISMA_URL`** - This is your `DATABASE_URL`
   - (Optional) Copy `POSTGRES_URL_NON_POOLING` for `DIRECT_URL`

**Option B: Use Supabase (Free Alternative)**

1. Go to: https://supabase.com
2. Sign up / Sign in
3. Click **"New Project"**
4. Fill in:
   - Name: `nfast-journal`
   - Database Password: (create a strong password, **save it!**)
   - Region: Choose closest to you
5. Wait for project to create (~2 minutes)
6. Go to **Settings** → **Database**
7. Scroll to **Connection string** → **URI**
8. Copy the connection string (looks like: `postgresql://postgres:[PASSWORD]@...`)
9. **Important:** Replace `[PASSWORD]` with your actual database password
10. Add `?sslmode=require` at the end if not present

**Option C: Use Neon (Free Alternative)**

1. Go to: https://neon.tech
2. Sign up / Sign in
3. Create a new project
4. Copy the connection string from the dashboard
5. Make sure it includes `?sslmode=require`

### Step 2: Add DATABASE_URL to Vercel

1. **Go to your Vercel project:**
   - Navigate to: https://vercel.com/xinges-projects/nfast
   - Or: https://vercel.com/dashboard → Select "nfast"

2. **Open Environment Variables:**
   - Click **"Settings"** tab (left sidebar)
   - Click **"Environment Variables"** (in the left menu)

3. **Add DATABASE_URL:**
   - Click **"Add New"** button
   - **Key:** `DATABASE_URL`
   - **Value:** Paste your PostgreSQL connection string (from Step 1)
   - **Environment:** Check all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **"Save"**

4. **Add Other Required Variables (if not already set):**
   
   **JWT_SECRET:**
   - Key: `JWT_SECRET`
   - Value: Generate with: `openssl rand -base64 32` (run in terminal)
   - Environment: All (Production, Preview, Development)
   
   **ADMIN_USERNAME:**
   - Key: `ADMIN_USERNAME`
   - Value: `bigguy`
   - Environment: All
   
   **ADMIN_PASSWORD:**
   - Key: `ADMIN_PASSWORD`
   - Value: `!RY7!@gak`
   - Environment: All

### Step 3: Redeploy Your Application

After adding environment variables, you **must redeploy** for them to take effect:

1. Go to **"Deployments"** tab
2. Find your latest deployment
3. Click the **"⋯"** (three dots) menu
4. Click **"Redeploy"**
5. Or simply push a new commit to trigger automatic deployment

### Step 4: Verify Everything Works

1. **Check Database Health:**
   - Visit: `https://nfast.vercel.app/api/health/db`
   - You should see:
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
   - If there are errors, go to **Deployments** → Latest → **Functions** tab
   - Click on any function to see detailed logs

## 🔍 Troubleshooting

### "DATABASE_URL environment variable is not set"

**Solution:**
- Make sure you added `DATABASE_URL` in Vercel Settings → Environment Variables
- Verify it's set for **Production** environment (not just Development)
- Redeploy after adding the variable

### "Can't reach database server"

**Causes:**
- Connection string is incorrect
- Database doesn't allow connections
- Missing SSL mode

**Solution:**
1. Verify connection string format: `postgresql://user:password@host:port/database?sslmode=require`
2. If using Supabase, make sure you replaced `[PASSWORD]` with actual password
3. Ensure connection string ends with `?sslmode=require`

### "Migration failed"

**Solution:**
1. Check Vercel build logs for specific error
2. Make sure database is accessible
3. Try running migrations manually (if you have database access)

### Build succeeds but app shows errors

**Check:**
1. Visit `/api/health/db` to see database status
2. Check Vercel function logs
3. Verify all environment variables are set correctly

## 📋 Checklist

Before deploying, make sure:

- [ ] PostgreSQL database created (Vercel Postgres, Supabase, or Neon)
- [ ] `DATABASE_URL` added to Vercel environment variables
- [ ] `DATABASE_URL` set for **Production** environment (and Preview/Development)
- [ ] `JWT_SECRET` added (optional but recommended)
- [ ] `ADMIN_USERNAME` and `ADMIN_PASSWORD` added (optional, has defaults)
- [ ] Project redeployed after adding variables
- [ ] Database health check passes (`/api/health/db`)
- [ ] Login works

## 🆘 Still Need Help?

1. **Check Vercel Logs:**
   - Deployments → Latest → Functions → Click on a function

2. **Test Database Connection:**
   - Visit: `https://nfast.vercel.app/api/health/db`
   - This will show you exactly what's wrong

3. **Verify Environment Variables:**
   - Settings → Environment Variables
   - Make sure they're set for **Production**
   - Check for typos (case-sensitive: `DATABASE_URL` not `database_url`)
   - No extra spaces in values

## 🔗 Direct Links

- **Your Vercel Project:** https://vercel.com/xinges-projects/nfast
- **Vercel Postgres Docs:** https://vercel.com/docs/storage/vercel-postgres
- **Supabase:** https://supabase.com
- **Neon:** https://neon.tech
