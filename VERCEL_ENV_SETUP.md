# Vercel Environment Variables Setup

## Critical: Set These Environment Variables in Vercel

Your login credentials are not working because the environment variables need to be set in your Vercel project.

### Step-by-Step Instructions

1. **Go to your Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Select your project: `nfast`

2. **Open Environment Variables**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add the Following Variables**

   #### Required Variables:

   ```
   ADMIN_USERNAME=bigguy
   ADMIN_PASSWORD=!RY7!@gak
   JWT_SECRET=<generate-a-random-secret>
   ```

   #### Optional (if using a database):
   ```
   DATABASE_URL=<your-database-connection-string>
   ```

4. **Generate JWT_SECRET** (if not already set)
   
   Run this command locally to generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```
   
   Copy the output and use it as your `JWT_SECRET` value.

5. **Apply to All Environments**
   - Make sure to select **Production**, **Preview**, and **Development** for each variable
   - Click **Save**

6. **Redeploy Your Application**
   - After adding the variables, go to **Deployments**
   - Click the **⋯** (three dots) on your latest deployment
   - Select **Redeploy**
   - Or push a new commit to trigger a new deployment

### Default Credentials (if env vars not set)

If you don't set the environment variables, the app will use these defaults:
- **Username**: `bigguy`
- **Password**: `!RY7!@gak`

However, **it's recommended to set them explicitly** in Vercel to ensure consistency.

### Verify Setup

After redeploying, try logging in at:
- https://nfast.vercel.app/login

Use:
- Username: `bigguy` (or your custom ADMIN_USERNAME)
- Password: `!RY7!@gak` (or your custom ADMIN_PASSWORD)

### Troubleshooting

If login still doesn't work after setting environment variables:

1. **Check Vercel Function Logs**
   - Go to your deployment → **Functions** tab
   - Click on a function to see logs
   - Look for any error messages

2. **Verify Environment Variables**
   - Make sure variables are set for **Production** environment
   - Check for typos in variable names (case-sensitive)
   - Ensure no extra spaces in values

3. **Check Cookie Settings**
   - The app uses secure cookies in production
   - Make sure you're accessing via HTTPS (Vercel provides this automatically)

4. **Clear Browser Cookies**
   - Clear cookies for `nfast.vercel.app`
   - Try logging in again

### Security Note

⚠️ **Important**: Never commit `.env` files or expose credentials in your code. Always use environment variables in production.


