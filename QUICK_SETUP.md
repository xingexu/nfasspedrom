# Quick PostgreSQL Setup for Vercel

## Step-by-Step: Vercel Postgres (5 minutes)

### Step 1: Create Database in Vercel
1. Go to https://vercel.com/dashboard
2. Click on your project: **nfasspedrom**
3. Click **"Storage"** tab (left sidebar)
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Click **"Create"** (free tier is fine)

### Step 2: Copy Connection Strings
After creation, you'll see:
- `POSTGRES_PRISMA_URL` - Copy this one
- `POSTGRES_URL_NON_POOLING` - Copy this one too

### Step 3: Add to Environment Variables
1. In your project, go to **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Add these variables:

**Variable 1:**
- Key: `DATABASE_URL`
- Value: Paste `POSTGRES_PRISMA_URL` (the one you copied)
- Environment: Production, Preview, Development (check all)
- Click **"Save"**

**Variable 2 (Optional but recommended):**
- Key: `DIRECT_URL`
- Value: Paste `POSTGRES_URL_NON_POOLING`
- Environment: Production, Preview, Development (check all)
- Click **"Save"**

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click the **"..."** menu on latest deployment
3. Click **"Redeploy"**
4. Or just push a new commit to trigger deployment

### Step 5: Verify
After deployment completes:
1. Visit your site URL
2. Check if it loads (should work now!)
3. If errors, check **Deployments** → Latest → **Functions** tab for logs

## Alternative: Supabase (if Vercel Postgres doesn't work)

1. Go to https://supabase.com
2. Sign up / Sign in
3. Click **"New Project"**
4. Fill in:
   - Name: `nfass-blog`
   - Database Password: (create a strong password, save it!)
   - Region: Choose closest
5. Wait for project to create (~2 minutes)
6. Go to **Settings** → **Database**
7. Scroll to **Connection string** → **URI**
8. Copy the connection string (looks like: `postgresql://postgres:[PASSWORD]@...`)
9. Replace `[PASSWORD]` with your actual password
10. Add to Vercel as `DATABASE_URL` (same as Step 3 above)

## Troubleshooting

**"Can't reach database server"**
- Check connection string is correct
- Make sure you replaced `[PASSWORD]` if using Supabase
- Verify SSL mode: connection string should end with `?sslmode=require`

**"Migration failed"**
- Database should be empty on first setup
- Check Vercel build logs for specific error

**Still getting errors?**
- Check Vercel logs: Deployments → Latest → Functions
- Share the error message and I can help debug




