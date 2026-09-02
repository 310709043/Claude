# TAIPBX 企業級 AI 一體機 — 電影級宣傳片

台灣大哥大企業服務 × TAIPBX 產品宣傳片，以 **React + Remotion** 全程式化生成。

| 項目 | 規格 |
|---|---|
| 解析度 | 3840×2160（4K UHD），另備 1920×1080 校稿版 |
| 畫面比例 | 16:9 |
| 幀率 | 60 fps |
| 總長度 | 7200 frames = **120.00 秒** |
| 輸出格式 | MP4（H.264，可選 H.265） |
| 投放場景 | 43 吋螢幕直接播放、展場循環播放 |

---

## 快速開始

```bash
npm install
npm run studio          # 開啟 Remotion Studio，可即時預覽與逐格檢視
```

## 輸出影片

```bash
npm run render          # 4K 母帶（H.264, CRF 16）→ out/TAIPBX-4K.mp4
npm run render:h265     # 4K H.265，檔案較小
npm run render:1080p    # 1080p 版本
npm run render:preview  # 低解析快速預覽（校稿用）
```

> **第一次執行**：Remotion 會自動下載官方 Chrome Headless Shell。若你的網路環境
> 無法下載，可設定環境變數指向本機 Chromium：
> `REMOTION_BROWSER_EXECUTABLE=/path/to/headless_shell npm run render`

---

## 分鏡結構（120 秒）

| # | 段落 | 時間 | 長度 | 攝影機 | 進入轉場 |
|---|---|---|---|---|---|
| 1 | **強烈開場 Hook** | 00:00–00:15.3 | 920f | 推鏡 pushIn | — |
| 2 | **化解三大關卡** | 00:15.3–00:47 | 1930f | 軌道 trackRight | 光刃橫掃 |
| 3 | **六大核心技術** | 00:47–01:19.2 | 1960f | 升降 craneUp | 機械百葉 |
| 4 | **五大產業賦能** | 01:19.2–01:42 | 1380f | 橫搖 panLeft | 光圈變焦 |
| 5 | **四大長期價值** | 01:42–01:56 | 855f | 推鏡 pushIn | 光刃反掃 |
| 6 | **結尾 CTA** | 01:56–02:00 | 305f | 推鏡 pushIn | 光圈變焦 |

### 各段內部節拍

- **第 1 段**：0.35s 提問鉤子 → 4.4s 品牌自深處浮現 → 8.6s 三支柱展開 → 10.6s 產品主張
- **第 2 段**：4s 標題卡 → 3 張卡各 8s（痛點冷色 → 光刃貫穿 → 解方暖橘）→ 4.2s 核心訴求
- **第 3 段**：3.5s 標題 → 6 項各 4.25s（左巨型數據 / 右技術說明，方向交替）→ 3.7s 六項匯聚
- **第 4 段**：3s 標題 → 5 項各 3.5s → 2.5s 五大產業並列
- **第 5 段**：2.75s 標題 → 2×2 網格漸次落位 → 定格呼吸
- **第 6 段**：主張句 → 品牌鎖定 → 行動呼籲 → 暖白光暈收束

---

## 專案結構（哪裡改什麼）

```
src/
├── theme.ts              ★ 色彩／字級／版面／後製強度 — 換品牌色只改這裡
├── content.ts            ★ 全部文案與數據 — 換文案只改這裡
├── timeline.ts           ★ 分鏡時間軸 — 改長度只改這裡，總長自動重算
├── audio.ts              ★ 音軌接口 + 配樂風格建議 + 音效對點表
├── anim.ts                 動態語彙（緩動曲線、進退場、彈簧、動態模糊）
├── fonts.tsx               本地字型載入與渲染阻擋
├── Film.tsx                主時間軸組裝（TransitionSeries）
├── Root.tsx                Composition 註冊（4K + 1080p）
├── components/
│   ├── Stage.tsx           設計座標舞台（1920×1080 → 自動縮放至 4K）
│   ├── CinematicGrade.tsx  電影後製：光暈／色調曲線／暗角／底片顆粒
│   ├── Camera.tsx          虛擬攝影機（推拉搖跟軌道升降 + 手持呼吸 + 淺景深）
│   ├── KineticText.tsx     文字動畫（逐字、遮罩揭示、光線掃過、數字滾動）
│   ├── Atoms.tsx           巨型序號／玻璃面板／段落標題／品牌鎖定／光暈徽章
│   ├── Icons.tsx           技術圖標（SVG 描邊繪製動畫）
│   └── BrandLogo.tsx     ★ 企業標誌（官方檔案 / 向量佔位雙軌）
├── transitions/index.tsx   自訂轉場：光刃橫掃 / 光圈變焦 / 機械百葉
└── scenes/S1–S6            六個段落
```

---

## 三件待你補上的素材

### 1. 官方 Logo（目前為向量佔位標記）

```
1. 把官方檔案放進  public/logo.svg   （SVG 最佳；PNG 需去背）
2. 打開 src/components/BrandLogo.tsx，把 useLogoFile 改成 true
```

在此之前，畫面會使用一個「多彩幾何切面圓形 + 台灣大哥大／企業服務」的向量佔位標記，
構圖、尺寸與動畫時間點皆已就位，換檔即完成，不需調整任何版面。

### 2. 配樂（目前為無聲版）

```
1. 把音檔放進  public/music.mp3
2. 打開 src/audio.ts，把 enabled 改成 true
3. 需要對第一個重拍時，調整 offsetInFrames
```

`src/audio.ts` 內含完整的**配樂風格建議**（類型、BPM、六段情緒結構、參考方向）
與 **17 個音效對點表（SFX cue）**，可直接交給音效師。

建議方向：Cinematic Corporate Tech / Modern Orchestral Hybrid，92–100 BPM，
避免帶人聲或旋律過強，以保留日後加中文旁白的空間。

### 3. 產品實拍或 3D 主機圖（選配）

目前第 1 段與第 3 段以純光影空間呈現。若有一體機的產品照或 3D 算圖，
放進 `public/` 後可在 `S1_Hook.tsx` / `S3_Capabilities.tsx` 加入 `<Img>` 圖層，
搭配既有的 `<Camera depth={...}>` 即可自然融入視差。

---

## 設計決策說明

**為什麼用深色母版，而不是品牌規範的淺色 `#F5F5F7`？**
品牌主色 `#FF6100` 是暖橘。在淺色底上，橘色只能「著色」；在深色底上，
橘色能夠「發光」——產生光暈、體積光、稜面高光與底片光暈（halation），
這是電影級質感與簡報錄影最根本的差別。全片刻意讓 `#FF6100` 成為畫面中
唯一的光源色，因此每一次品牌色出現都具有敘事重量。

官方淺色系統已完整保留在 `theme.ts` 的 `paletteLight`，日後若需白底版本可切換。

**43 吋螢幕可讀性**
正文最小字級為設計座標 25px＝4K 實際 50px。標題採 900 字重，
中文行高 1.9 以上，段落以手動斷行控制，避免中文在不當處折行。

**為什麼中文字型自帶在 `public/fonts/`？**
渲染完全離線、每次結果完全一致，不受 Google Fonts 可用性影響。
`scripts/sync-fonts.mjs` 會掃描原始碼實際用到的字元，只下載對應的
unicode-range 切片（目前 116 個檔、6.6 MB）。

> **改完文案後請執行 `npm run fonts:sync`**，確保新增的字有對應字型切片。
> 若想一次抓齊全部切片（約 25 MB，日後改任何字都不必再跑）：`npm run fonts:sync:all`

---

## 常見調整

| 想做的事 | 改哪裡 |
|---|---|
| 換品牌色 | `src/theme.ts` 的 `palette` |
| 換文案 / 增減項目 | `src/content.ts`（陣列長度會自動反映到畫面與進度指示器） |
| 調整某段長度 | `src/timeline.ts` 的 `SCENE`，總長自動重算 |
| 加快 / 放慢整體節奏 | `src/timeline.ts` 各 `*_BEATS` |
| 調整電影感強度 | `src/theme.ts` 的 `grade`（顆粒、暗角、光暈、色差） |
| 減弱攝影機晃動 | `<Camera handheld={0}>` |
| 換轉場 | `src/Film.tsx` 的 `presentation={...}` |
