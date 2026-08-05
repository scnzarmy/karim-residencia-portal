# Karim Residencia — Setup & Deploy Guide

Follow these steps in order. Everything free-tier unless you buy a domain.

## 1. Create your Supabase project (database + accounts)

1. Go to https://supabase.com → sign up (free) → **New Project**.
2. Pick a name (e.g. `karim-residencia`), set a database password (save it somewhere), pick the region closest to Pakistan, and create the project. Wait ~2 minutes for it to spin up.
3. In the left sidebar, go to **SQL Editor** → **New query**.
4. Open `supabase/schema.sql` from this project, copy all of it, paste into the SQL editor, and click **Run**. This creates all tables and security rules.
5. In the left sidebar go to **Project Settings → API**. Copy:
   - **Project URL**
   - **anon public** key
   You'll need both in step 3 below.
6. Go to **Authentication → Providers** and make sure **Email** is enabled (it is by default). Also go to **Authentication → Settings** and turn **off** "Confirm email" for now, so accounts work immediately without email verification (you can turn it back on later once you've set up a sending domain).

## 2. Create your committee accounts

Since committee logins need to be secure, they're real accounts (not passwords hidden in the code). For each block:

1. In Supabase, go to **Authentication → Users → Add user**. Create one user per block, e.g. `committee-a@karimresidencia.com`, `committee-b@...`, `committee-c@...`, each with a strong password.
2. Go to **Table Editor → profiles → Insert row** for each one:
   - `id`: paste the user's UUID (copy from the Authentication → Users list)
   - `full_name`: e.g. "Block A Committee"
   - `role`: `committee`
   - `block_id`: `A`, `B`, or `C` (matching the account)
   - `approved`: `true`

Give each block's committee their email + password to log in with.

## 3. Push the code to GitHub

Open a terminal in this project folder and run:

```bash
git init
git add .
git commit -m "Initial commit — Karim Residencia"
```

Then on https://github.com, click **New repository**, name it `karim-residencia`, keep it empty (no README/gitignore), create it, and run the commands GitHub shows you under "…or push an existing repository from the command line" — they'll look like:

```bash
git remote add origin https://github.com/YOUR-USERNAME/karim-residencia.git
git branch -M main
git push -u origin main
```

## 4. Deploy on Vercel

1. Go to https://vercel.com → sign up with your GitHub account.
2. Click **Add New → Project**, select your `karim-residencia` repo, click **Import**.
3. Before deploying, expand **Environment Variables** and add:
   - `VITE_SUPABASE_URL` → paste your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` → paste your anon public key
4. Click **Deploy**. Vercel will build and give you a live `.vercel.app` link within a minute or two.

## 5. Connect your custom domain

1. In your Vercel project, go to **Settings → Domains**, type your domain, click **Add**.
2. Vercel shows you DNS records to add. Go to wherever you bought the domain (GoDaddy, Namecheap, etc.), open DNS settings, and add the records Vercel shows.
3. Wait 10 minutes–a few hours for DNS to update. Your site will then be live on your domain.

## 6. Local development (optional, to test before pushing)

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL/key
npm run dev
```

## What's already handled for you

- Bilingual EN/UR interface with automatic right-to-left layout for Urdu
- Resident registration → pending approval → committee approves → resident can log in
- Committee accounts scoped to their own block only (Block A committee never sees Block B data)
- Notices, news, live status, namaz timings, and complaints — all shared in real time via the database, not per-device storage
- Passwords and accounts secured through Supabase Auth — nothing sensitive sits in the visible code
- Community rules panel and a floating chatbot for common questions

If anything errors out at any step, copy the exact error message and send it over — that's the fastest way to fix it.
