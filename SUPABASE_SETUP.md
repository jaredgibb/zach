# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in (or create account)
2. Click "New Project"
3. Fill in project details:
   - **Name**: `diversified-psych` (or your choice)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location (e.g., `us-east-1`)
4. Wait for project to be created (2-3 minutes)

## Step 2: Get API Credentials

1. In your Supabase project, click **"Settings"** → **"API"**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Open `.env.local` in the project root and update:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Execute Database Schema

1. In Supabase dashboard, click **"SQL Editor"** in left sidebar
2. Click **"+ New Query"**
3. Open the file `supabase-setup.sql` in the project root
4. Copy all the SQL code and paste into the SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter`)
   - You should see: `✓ Executed successfully` messages
   - The schema, tables, RLS policies, and sample data are now created

## Step 4: Verify Setup

1. Click **"Table Editor"** in left sidebar
2. You should see two tables:
   - ✅ `therapists` (6 sample records)
   - ✅ `services` (6 sample records)

3. Click each table to verify data was loaded correctly

## Step 5: Test Authorization

1. Go to **"Authentication"** → **"Users"** in sidebar
2. Click **"Invite"** (we'll use email/password method)
3. You can also manually test by visiting admin login at `http://localhost:3000/admin/login`

### For Manual Testing:
```
Email: admin@example.com
Password: TestPassword123!
```

4. On the **Sign Up** page, create an admin account
5. This account is now available in Supabase Authentication

## Step 6: Configure Email (Optional but Recommended)

For contact form emails:

1. Go to **"Email Templates"** in Supabase dashboard
2. Configure SMTP settings or use third-party service like SendGrid
3. Note: We recommend SendGrid for transactional emails

## Step 7: Set Up Storage Buckets (For Image Uploads)

1. Click **"Storage"** in left sidebar
2. Click **"+ New Bucket"**
   - Name: `therapist-images`
   - Check "Make it public"
   - Click "Create"
3. Repeat to create `service-images` bucket
4. In the bucket policy settings, add this for public access:

```json
{
  "public": true,
  "authenticated": true
}
```

## Step 8: Start Development Server

```bash
cd /workspaces/zach
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **Admin login**: http://localhost:3000/admin/login
- **Admin signup**: http://localhost:3000/admin/signup

## Testing the Admin Panel

1. Sign up for an admin account at `/admin/signup`
2. Log in at `/admin/login`
3. Go to dashboard at `/admin/dashboard`
4. Test therapist management:
   - Click "Manage Therapists"
   - Add new therapist
   - Edit existing therapist
   - Delete therapist (soft delete)
5. Test service management:
   - Click "Manage Services"
   - Add new service
   - Edit existing service
   - Delete service (soft delete)

## Testing Public Pages

1. Visit http://localhost:3000/therapists
   - Should display therapists from database
   - Click cards to see modal with full profile

2. Visit http://localhost:3000/services
   - Should display services from database
   - Click cards to see modal with full details

## Environment Variables Checklist

- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your public API key

## Troubleshooting

### "Cannot connect to Supabase" Error
- Check `.env.local` has correct credentials
- Verify Supabase project is active (not paused)
- Ensure your IP is not blocked

### "No table 'therapists'" Error
- Run `supabase-setup.sql` SQL script again
- Check SQL Editor for error messages
- Verify all SQL executed successfully

### "Authentication Failed"
- Check that public/auth mode is enabled on tables
- Verify RLS policies are in place
- Check Supabase Authentication settings

### Admin Can't Log In
- Verify user was created in Supabase Authentication → Users
- Check password is correct
- Try signing up for new account instead

## Production Deployment

Before deploying to production:

1. **Security**: Use environment-specific variables (don't expose anon key in public)
2. **RLS Policies**: Ensure all RLS policies are strict and tested
3. **Email Configuration**: Set up production email provider
4. **Backups**: Enable automated backups in Supabase
5. **Monitoring**: Enable Supabase monitoring and alerts
6. **SSL**: Verify HTTPS is enabled

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs
