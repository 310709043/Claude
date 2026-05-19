# LowBatteryTown / FocusTown

> A pixel-art "focus city" web app — find your people, find your focus.

Production rebuild of the Claude Design handoff prototype, ported from Babel-standalone HTML/JSX to **Next.js 14 + TypeScript + Tailwind + Framer Motion**.

## Stack

- **Next.js 14** (App Router, static export-friendly)
- **TypeScript** strict
- **Framer Motion** for screen transitions + micro-interactions
- **Tailwind CSS** for utility classes (pixel UI is mostly inline-styled to preserve the prototype's pixel-precision)
- **next/font/google** for self-hosted retro fonts (Press Start 2P, Silkscreen, VT323, DotGothic16, Noto Sans TC)

## Run

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm start         # serve production
```

## Project layout

```
app/
  layout.tsx          # Fonts, ThemeProvider, ScanlineOverlay
  page.tsx            # SPA-style screen switcher with <AnimatePresence/>
  globals.css         # 3 visual directions (CSS vars) + shared @keyframes + retro utilities
components/
  ThemeProvider.tsx   # direction (neon/dusk/rain) + lang (zh/en/ko/ja) + scanlines
  ScanlineOverlay.tsx
  Splash.tsx          # Charge-up splash → shared-element morphs into Login logo
  pixel/              # PixelSprite, AnimatedSprite, StarField, ShootingStars, RainOverlay
  ui/                 # LogoImage, LangSwitcher, PixelWord, CoinIcon, TCoinBadge, CornerDeco
  town/               # Weather effects (Snow, Clouds, LightningFlash, Fog)
  screens/            # LoginScreen, PlaceholderScreen (others pending)
lib/
  pixel-engine.ts     # ASCII → canvas → memoized data URL
  sprites.ts          # AVATARS, WALKERS, CAT_WALK, TREE, BENCH, LAMP, drawSkyline, items
  buildings.ts        # 11 pixel-art buildings + placement metadata
  i18n.ts             # zh/en/ko/ja strings + tFor(lang) helper
  raf.ts              # RAF helper that pauses when tab is hidden + respects reduced-motion
public/
  logo.png            # LowBatteryTown wordmark logo
```

## Visual directions

Three full-app themes selected via `data-direction` on `<html>`:

- `neon` — deep purple night, magenta/cyan accents (default)
- `dusk` — warm rose / amber sundown
- `rain` — cool cyan synthwave with vertical rain

Switch them via the dev menu (when added) or by setting `localStorage.setItem('lbt.theme', '{"direction":"dusk"}')`.

## Animation philosophy

- **CSS `@keyframes`** for tight pixel-correct loops (blink, neon flicker, drift, caret-blink) — Framer's spring physics would smear pixel art.
- **Framer Motion** for higher-order motion: screen transitions, panel entrance, splash → logo shared-element morph, count-up tweens, hover springs.
- **Canvas + RAF** for ambient particles (stars, shooting stars, rain, snow, drifting clouds). All canvases pause when `document.hidden` is true and throttle to ~12 fps when `prefers-reduced-motion` is set.

## Performance

- No CDN scripts at runtime (zero `babel-standalone`).
- First Load JS for `/` is ~132 kB; screens are code-split via `next/dynamic`.
- Sprite data URLs are memoized at module scope (`lib/pixel-engine.ts`), so re-renders are free.

## Status

| Screen | Status |
|---|---|
| Login | ✅ Ported (high fidelity) |
| Character | 🚧 Placeholder |
| Town | 🚧 Placeholder |
| Solo Focus Room | 🚧 Placeholder |
| Buddy Room | 🚧 Placeholder |

## Adding sprites

Sprites are multi-line ASCII strings where each character is a pixel.
"." or " " = transparent.  Any other char is a palette key.

```ts
import { PixelSprite } from '@/components/pixel/PixelSprite';

const HEART = `
.RR.RR.
RRRRRRR
.RRRRR.
..RRR..
...R...
`;
<PixelSprite sprite={HEART} palette={{ R: '#ec4899' }} scale={4} glow="#ec4899" />
```

## Credits

Original design: Claude Design handoff (`focus-town-remix`).
Pixel art, palette, and string tables in `lib/sprites.ts` / `lib/buildings.ts` / `lib/i18n.ts` come from the prototype.
