# Supabase Setup Guide

## 1. Create Supabase Project
1. Go to https://supabase.com and create a new project
2. Save your **Project URL** and **anon key** from Settings → API

## 2. Run the Schema
1. In Supabase dashboard → SQL Editor → New query
2. Paste the contents of `schema.sql` and run it

## 3. Enable Auth Providers
Go to Authentication → Providers:
- **Email**: Enable (enabled by default)
- **Google**: Enable and add your OAuth credentials (from Google Cloud Console)
  - Authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

## 4. Enable Realtime
Go to Database → Replication → Supabase Realtime:
- Enable for: `messages`, `profiles`

## 5. Set Environment Variables
Create `.env.local` from `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 6. Daily Reset Cron (Optional)
In Supabase → Edge Functions or use pg_cron to call `reset_daily_focus()` at midnight:
```sql
select cron.schedule('reset-daily', '0 0 * * *', 'select reset_daily_focus();');
```

## Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.local`
4. Deploy! Vercel auto-detects Next.js
