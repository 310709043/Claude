# AICC 智能客服發展藍圖 — Remotion 介紹影片

以 [Remotion](https://remotion.dev) 製作的 1920×1080 / 30fps 介紹影片，內容取材自簡報
《客服中心智能客服發展藍圖》（台灣大哥大 企業服務 × 承暉資訊）。

全片約 **98 秒（2,930 frames）**，共九個段落。

| # | 段落 | 長度 | 對應原簡報 |
|---|------|------|-----------|
| 01 | 片頭標題 | 190f | p.1 封面 |
| 02 | 2002 → 2026 | 250f | p.3 公司介紹 |
| 03 | 三大核心產品解決方案 | 340f | p.5 |
| 04 | 現況與未來方向 | 340f | p.8 |
| 05 | 四階段推進藍圖 | 500f | p.9–12 |
| 06 | AICC 系統架構 | 430f | p.16–17 |
| 07 | 雲地混合架構 | 370f | p.20–21 |
| 08 | AI 應用擴充 | 370f | p.34 |
| 09 | 平台三支柱 ＋ 片尾 | 300f | p.34 |

段落之間以 20 frame 交叉淡入淡出銜接，因此總長 = 各段長度總和 − 8 × 20。

## 開發

```bash
npm install
npm run studio     # 開啟 Remotion Studio 即時預覽 / 逐格檢查
npm run render     # 輸出 out/aicc-intro.mp4（H.264, CRF 17）
npm run still      # 輸出 out/cover.png 單張封面
```

## 專案結構

```
src/
  index.ts            registerRoot
  Root.tsx            Composition 定義（時長由 Video.tsx 推導）
  Video.tsx           場景清單、轉場、章節列（改順序或長度只改這裡）
  content.ts          影片中所有文案，全部集中在此，便於校稿
  theme.ts            色票、字級、版面間距
  lib/
    fonts.ts          載入自架字型（含 delayRender）
    anim.ts           spring / 進場位移 / 場景淡入淡出等共用動畫
  components/
    Backdrop.tsx      橫跨全片、不隨場景切換的動態背景
    ui.tsx            Scene / Kicker / SplitHeading / Panel / Chip / HUD…
  scenes/S01…S09.tsx  各段落
public/fonts/         已裁切的 woff2 字型（Noto Sans TC + Sora）
scripts/build-fonts.py  重新產生上述字型
```

## 改文案

所有中文字串都在 `src/content.ts`。改完若**用到了新的字**，必須重新裁字型，
否則新字會 fallback 成系統字體：

```bash
python3 -m pip install fonttools brotli
python3 scripts/build-fonts.py
```

腳本會掃描 `src/` 內所有字元，向 Google Fonts 取回完整 TTF 後裁成僅含這些字的
woff2（4 個字重合計約 280 KB）。這麼做是為了避免 Google 的 CJK webfont 會被切成
上百個 unicode-range 分片 —— 那會讓每次 render 產生數百個網路請求。

## 設計說明

- 色票取自原簡報：台灣大哥大企業服務的橘 `#F57000`、內頁的赭紅 `#B5654A` 與
  金 `#C39A4E`，配深炭底色，維持簡報識別但更適合影片的深色調。
- 背景 `Backdrop` 位於 `TransitionSeries` 之外，所以場景是在同一個環境裡交叉淡入，
  而不是兩張不同底圖互相溶接。
- 字級、間距集中在 `theme.ts` 的 `type` / `layout`，避免各場景各自為政。
- 影片無配樂。若要加入，把音檔放進 `public/`，在 `Video.tsx` 加上
  `<Audio src={staticFile('bgm.mp3')} />` 即可。
