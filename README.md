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

## 📏 內衣尺碼計算器 `/bra-size`

同一個 Next.js 專案裡另外掛了一個獨立子站：**合身尺** — 女性內衣尺碼量測與換算工具。
啟動後開 http://localhost:3000/bra-size 即可使用（部署後就是 `你的網域/bra-size`）。

**功能**

- 輸入上胸圍、下胸圍（可選填俯身 90° 上胸圍），即時換算台／日、歐、法、英、美尺碼
- 姊妹尺碼建議、罩杯差顯示、公分／英吋單位切換
- 六步驟量法教學（含示意圖）、罩杯與底圍對照表、試穿合身檢查清單、常見問題
- 量測紀錄存在瀏覽器 `localStorage`，方便追蹤變化

**設計原則**

- 純前端計算，沒有 API、沒有分析追蹤，任何數字都不會離開使用者的裝置
- 內容定位為「選購內衣用」，站上明確標示不構成醫療建議

**程式位置**

```
lib/braSize.ts          # 尺碼換算核心邏輯（純函式）
components/bra/         # BraNav / BraHero / BraCalculator / MeasureGuide / SizeChart / FitCheck / Faq / BraFooter
app/bra-size/           # layout.tsx（SEO metadata、淺色主題）+ page.tsx
```

尺碼規則若要調整（例如換成某品牌自家的級距），改 `lib/braSize.ts` 裡的
`TW_CUPS` / `metricBand` / `chartBand` 幾個常數與函式即可，UI 不用動。

---

## 🪪 License

Personal portfolio of Eric Tang (曾詳藝). Code is free to fork as a template.
