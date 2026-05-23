# Nocturne · 夜訊 — App 介紹 / 使用者流程影片 (Remotion)

A high-quality 9:16 (1080×1920) motion video introducing the **Nocturne · 夜訊**
prototype — a late-night *anonymous* social app (explicitly "not a dating app").
The video walks through the app's positioning, core features, and user flow, with
on-screen Traditional-Chinese captions and a generated deep-night ambient bed.

All screens are recreated in Remotion using the prototype's real design tokens
(colors, status tiers) and verbatim copy. Nothing is screen-captured.

## Story / scenes (~138s @ 30fps)

1. **Cold open** — brand + tagline「今晚，有人和你一樣醒著。」
2. **Positioning** —「這不是一個 dating app。」+ what it deliberately lacks
3. **選擇你的狀態** — the 5 intent tiers (s0–s4)
4. **地圖** — who's awake nearby, anonymous #IDs, distance rings
5. **輕量接觸** —「我也在」/ 文字 / 語音 / 今晚的一句話
6. **真人驗證** — phone + face liveness, nothing made public
7. **今晚的照片 · 雙向交換** — consent-gated photo exchange (the core feature)
8. **安全守護 / 緊急行動** — guardian, SOS long-press, 110/119/113
9. **隱私與資料** — what we don't collect vs. what we keep
10. **Premium & 點數** — NT$149/月, and what Premium deliberately can't buy
11. **夜的紀念回憶冊** — the private night journal
12. **Outro** —「今晚，你不孤單。」

Scene order/durations live in `src/timeline.ts`; design tokens in `src/theme.ts`.

## Develop / render

```bash
npm install
npm run gen:ambient   # writes public/ambient.wav (no external deps)
npm run studio        # interactive preview at localhost:3000
npm run render        # -> out/nocturne.mp4 (H.264, 1080x1920)
```

### Environment notes
- **Fonts** are loaded from the system fontconfig (Latin: Liberation Sans, CJK:
  WenQuanYi Zen Hei) so rendering works fully offline. See `src/fonts.ts`.
- **Browser**: the `studio` / `render` / `still` scripts pass
  `--browser-executable` pointing at a local Chromium *headless-shell*. Adjust
  that path for your machine, or remove the flag to let Remotion download its own
  Chrome Headless Shell.
- `out/`, `node_modules/`, and the generated `public/ambient.wav` are git-ignored.
