# Piratessafaris

Safari and tour booking app: React + Vite + Tailwind CSS + Supabase (Postgres, Auth), installable as a PWA.

## Setup
1. Install Node.js 18 or newer.
2. Create a free project at https://supabase.com.
3. In Supabase, open SQL Editor, paste the contents of `supabase/schema.sql` and run it. This creates the tables, row level security policies, triggers and sample packages.
4. In Project Settings > API, copy the Project URL and the anon public key.
5. Copy `.env.example` to `.env` and fill in the values (set `VITE_WHATSAPP` to your number with country code, no plus sign).
6. Install and run:
   ```
   npm install
   npm run dev
   ```
7. Open http://localhost:5173 and create an account.

## Create the admin user
Sign up in the app, then run this in the SQL Editor with your email:
```
update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
```
Sign out and back in. An Admin link appears in the header. For quick testing, disable email confirmation in Authentication > Providers > Email.

## Authentication URLs
In Authentication > URL Configuration set the Site URL to your deployed domain and add http://localhost:5173 as a redirect URL.

## Build and deploy
```
npm run build
```
Deploy the `dist` folder to Netlify, Vercel or Cloudflare Pages, adding the three environment variables. Single-page fallback to `index.html` is required (Netlify: add `/* /index.html 200` in `public/_redirects`; Vercel handles it automatically for Vite). The PWA needs HTTPS in production; users can install it from the browser menu or install prompt.

## Replacing images
Package images are URLs in `packages.image_url`. Edit them in the Supabase Table Editor to use your own photos.
