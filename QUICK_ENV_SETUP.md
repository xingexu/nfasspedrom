# ⚡ Quick Environment Setup for Vercel

## Your Database URLs

You have Prisma Accelerate set up! Here's how to add everything to Vercel:

## Step 1: Go to Vercel Environment Variables

**Direct Link:** https://vercel.com/xinges-projects/nfast/settings/environment-variables

Or navigate:
1. Go to: https://vercel.com/xinges-projects/nfast
2. Click **"Settings"** → **"Environment Variables"**

## Step 2: Add These Variables

### 1. DATABASE_URL (Required)
**Key:** `DATABASE_URL`  
**Value:**
```
prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19vbHF4QWpnYS1DbTJoUFRiOGdERUQiLCJhcGlfa2V5IjoiMDFLQlRKU0g5WDJIS1dIVFRSWjVCQkhRSE0iLCJ0ZW5hbnRfaWQiOiJlZTAwMDBhYmZmZDMwYmY2ZjNhOGRlMjFjMGUzM2JhOTQ4YThlMzRhY2UyZTZjMjg5OTIwOWU2NjRkYTEwYmUyIiwiaW50ZXJuYWxfc2VjcmV0IjoiMjljMGQzZDktY2E4Yi00OGZlLTgyZmItNjlmOThmNWRlZTQ1In0.ILCD4Nym7xV0ao2Y14bEVmiLwVYDMo_sHsnXvVsieEs
```
**Environments:** ✅ Production, ✅ Preview, ✅ Development

### 2. DIRECT_URL (Recommended for migrations)
**Key:** `DIRECT_URL`  
**Value:**
```
postgres://ee0000abffd30bf6f3a8de21c0e33ba948a8e34ace2e6c2899209e664da10be2:sk_olqxAjga-Cm2hPTb8gDED@db.prisma.io:5432/postgres?sslmode=require
```
**Environments:** ✅ Production, ✅ Preview, ✅ Development

### 3. ADMIN_USERNAME
**Key:** `ADMIN_USERNAME`  
**Value:** `bigguy`  
**Environments:** ✅ Production, ✅ Preview, ✅ Development

### 4. ADMIN_PASSWORD
**Key:** `ADMIN_PASSWORD`  
**Value:** `!RY7!@gak`  
**Environments:** ✅ Production, ✅ Preview, ✅ Development

### 5. JWT_SECRET
**Key:** `JWT_SECRET`  
**Value:** Generate one with:
```bash
openssl rand -base64 32
```
**Environments:** ✅ Production, ✅ Preview, ✅ Development

## Step 3: Redeploy

After adding all variables:

1. Go to **"Deployments"** tab
2. Click **"⋯"** on latest deployment
3. Click **"Redeploy"**

Or just push a new commit to trigger deployment.

## Step 4: Verify

1. **Check Database:** https://nfast.vercel.app/api/health/db
   - Should show: `"status": "ok"` and `"database": "connected"`

2. **Try Login:** https://nfast.vercel.app/login
   - Username: `bigguy`
   - Password: `!RY7!@gak`

## 🚀 Automated Setup (Alternative)

If you have Vercel CLI installed:

```bash
npm i -g vercel  # If not already installed
./add-vercel-env.sh
```

This will automatically add all environment variables to Vercel.

## ✅ Done!

Once you've added the variables and redeployed, your journal should be fully functional!


