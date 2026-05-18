# Eric Tang — Personal Portfolio

A modern, free-to-host personal website built with **Next.js 14 + TypeScript + Tailwind CSS**, with **Supabase** for the contact form and one-click deploy on **Vercel**.

## ✨ Features

- ⚡ Next.js App Router + React Server Components
- 🎨 Dark theme with gradient accents, Framer Motion animations
- 📱 Fully responsive (mobile / tablet / desktop)
- 📝 All content driven by `lib/data.ts` — easy to edit
- 📨 Contact form ready for Supabase (graceful fallback before keys are set)
- 🚀 Free hosting: Vercel Hobby + Supabase Free tier

---

## 🛠 Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## 📁 Project structure

```
app/
  layout.tsx        # Root layout, fonts, metadata
  page.tsx          # Home page composition
  globals.css       # Tailwind + custom styles
components/         # Hero, About, Skills, Experience, Projects, Education, Contact, Nav, Footer
lib/
  data.ts           # All resume content — edit here
  supabase.ts       # Supabase client (lazy-initialized)
public/
  images/           # Put profile.jpg here
```

## ✏️ Editing content

Open `lib/data.ts` — every section reads from this single file (profile, about, skills, experience, projects, education, certifications, languages).

## 🖼 Profile photo

Put your headshot at `public/images/profile.jpg` (square ratio recommended, ≥ 600×600). If missing, the hero shows a graceful fallback initials.

## 📄 Resume PDF

Drop your resume at `public/EricTang_Resume.pdf` so the "下載履歷" button works.

---

## 🗄 Supabase setup (for contact form)

1. Create a free project at https://supabase.com
2. In SQL editor, run:

```sql
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Allow anonymous inserts"
  on public.messages for insert
  to anon
  with check (true);
```

3. Copy the project URL and `anon` public key from **Project Settings → API**.

4. Add to `.env.local` (and to Vercel env vars):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 🚀 Deploy to Vercel (free)

1. Push this repo to GitHub.
2. Go to https://vercel.com/new and import the repo.
3. Vercel auto-detects Next.js — keep defaults.
4. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables.
5. Deploy. Done.

A custom domain can be added under **Settings → Domains** (free `.vercel.app` subdomain works out of the box).

---

## 🪪 License

Personal portfolio of Eric Tang (曾詳藝). Code is free to fork as a template.
