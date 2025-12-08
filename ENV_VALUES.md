# Environment Variables for Vercel

## Quick Copy-Paste Values

Use these values in your Vercel project settings:

### DATABASE_URL (Required)
```
prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19vbHF4QWpnYS1DbTJoUFRiOGdERUQiLCJhcGlfa2V5IjoiMDFLQlRKU0g5WDJIS1dIVFRSWjVCQkhRSE0iLCJ0ZW5hbnRfaWQiOiJlZTAwMDBhYmZmZDMwYmY2ZjNhOGRlMjFjMGUzM2JhOTQ4YThlMzRhY2UyZTZjMjg5OTIwOWU2NjRkYTEwYmUyIiwiaW50ZXJuYWxfc2VjcmV0IjoiMjljMGQzZDktY2E4Yi00OGZlLTgyZmItNjlmOThmNWRlZTQ1In0.ILCD4Nym7xV0ao2Y14bEVmiLwVYDMo_sHsnXvVsieEs
```

### DIRECT_URL (Optional - for migrations)
```
postgres://ee0000abffd30bf6f3a8de21c0e33ba948a8e34ace2e6c2899209e664da10be2:sk_olqxAjga-Cm2hPTb8gDED@db.prisma.io:5432/postgres?sslmode=require
```

### ADMIN_USERNAME
```
bigguy
```

### ADMIN_PASSWORD
```
!RY7!@gak
```

### JWT_SECRET
Generate one with: `openssl rand -base64 32`

Or use this (generate a new one for production):
```
[Generate a new one - run: openssl rand -base64 32]
```

## How to Add to Vercel

1. Go to: https://vercel.com/xinges-projects/nfast/settings/environment-variables

2. For each variable above:
   - Click "Add New"
   - Paste the value
   - Check all environments (Production, Preview, Development)
   - Click "Save"

3. Redeploy your application

## Automated Setup

Alternatively, run the script:
```bash
./add-vercel-env.sh
```

(Make sure you have Vercel CLI installed: `npm i -g vercel`)
