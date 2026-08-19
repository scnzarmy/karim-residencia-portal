# Karim Residencia — Resident Portal

A full-stack residential community management portal built with **Next.js 14** + **Supabase**.

## Features
- 🏠 **Landing Page** — Elegant public-facing page
- 🔐 **Auth** — Email/password login, signup, forgot password, password reset
- 👤 **Resident Dashboard** — Maintenance requests, announcements, rules, profile
- 🏛️ **Committee Dashboard** — Manage requests, post notices, view residents
- 🛡️ **Role-based routing** — Residents and committee members see different dashboards
- 🗄️ **Supabase backend** — Already connected to your `karim-residencia` project

## Your Supabase Project
- **Project:** karim-residencia
- **URL:** https://luecgzvofxlhahpepbch.supabase.co
- ✅ **Database schema already applied** (profiles table + auth trigger)

## Setup & Deploy

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
The `.env.local` file is already configured with your Supabase credentials.  
For production, add these environment variables in your hosting platform:
```
NEXT_PUBLIC_SUPABASE_URL=https://luecgzvofxlhahpepbch.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key from Supabase dashboard>
```

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 4. Deploy to Vercel (recommended — FREE)
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project → Import your repo
3. Add the two environment variables above
4. Click Deploy ✅

## Pages
| Route | Description |
|---|---|
| `/` | Landing page |
| `/auth/login` | Sign in |
| `/auth/signup` | Create account |
| `/auth/forgot-password` | Request password reset |
| `/auth/reset-password` | Set new password (from email link) |
| `/dashboard` | Resident dashboard |
| `/committee` | Committee dashboard |

## Roles
- **resident** — Default role on signup. Accesses `/dashboard`
- **committee** — Special role. Select "Committee Member" on signup. Accesses `/committee`

## Supabase Auth Settings (important)
In your Supabase dashboard → Authentication → URL Configuration:
- **Site URL:** your deployed URL (e.g. `https://karim-residencia.vercel.app`)
- **Redirect URLs:** add `https://your-domain.com/auth/reset-password`

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Supabase (Auth + PostgreSQL)
- CSS Custom Properties (design system)
- Google Fonts (Playfair Display + DM Sans)
