# TAIPBX Call Center — 介紹影片（Remotion）

以 `TAIPBX_CallCenter` 簡報為腳本，用 [Remotion](https://remotion.dev) 產製的
1920×1080 / 30fps 介紹影片，全長約 **81 秒**。

- 品牌：台灣大哥大（台灣大哥大 企業服務）標誌與品牌橘 `#FF7300`
- 背景：暖白／淺灰漸層畫布（**非黑底**），搭配品牌色柔光、細格線與紙質噪點
- 平台畫面：直接採用簡報中的 TAIPBX Call Center 實際操作截圖

## 快速開始

```bash
npm install
npm run dev      # 開啟 Remotion Studio 預覽
npm run render   # 輸出 out/taipbx-intro.mp4
```

單張預覽：

```bash
npx remotion still src/index.ts TaipbxIntro out/frame.png --frame=800
```

## 影片結構

| # | 場景 | 檔案 | 長度 |
|---|------|------|------|
| 1 | 品牌開場 | `src/scenes/S1Logo.tsx` | 108f |
| 2 | 標題：客服中心智能客服發展藍圖 | `src/scenes/S2Title.tsx` | 168f |
| 3 | 三大核心產品解決方案 | `src/scenes/S3Core.tsx` | 264f |
| 4 | 客服中心 現況與未來 | `src/scenes/S4NowFuture.tsx` | 246f |
| 5 | 四階段智能客服演進 | `src/scenes/S5Roadmap.tsx` | 396f |
| 6 | 平台介面巡覽（6 幅實機畫面＋動態標註） | `src/scenes/S6Platform.tsx` | 642f |
| 7 | 雲地混合架構 | `src/scenes/S7Hybrid.tsx` | 282f |
| 8 | Bot Gateway 全開放 · AI 應用擴充 | `src/scenes/S8Ai.tsx` | 264f |
| 9 | 結尾 | `src/scenes/S9Outro.tsx` | 186f |

場景之間重疊 14 格做交叉溶接，總長由 `src/Video.tsx` 的 `SCENES` 自動推算，
改動任一段長度不需手動重算時間軸。

## 目錄

```
src/
  Video.tsx          # 時間軸組裝、進度軸
  Root.tsx           # Composition 設定（1920×1080 / 30fps）
  theme.ts           # 色票、字體堆疊
  anim.ts            # 進場／退場、彈跳、包絡等動畫工具
  fonts.ts           # 本機字型載入（不依賴 render 時的網路）
  components/
    Backdrop.tsx     # 全片共用的淺色動態背景
    Brand.tsx        # 台灣大哥大標誌元件
    Layout.tsx       # Scene／Stage／Kicker／Card 版面元件
    Screen.tsx       # 產品截圖外框（含各截圖原生比例表）
    Callout.tsx      # 指向 UI 實際位置的動態標註
  scenes/            # 九個場景
  fontData.ts        # 由 scripts/embed-fonts.mjs 產生，勿手改
scripts/
  embed-fonts.mjs    # 將 public/fonts/*.woff2 內嵌成 data URI
public/
  brand/             # 標誌（自簡報母片萃取，去背後放大）
  ui/                # 平台操作截圖
  fonts/             # Noto Sans TC + Inter（已 subset 至本片用字）
```

## 素材來源與調整

- **標誌**：自簡報母片背景圖 (`image95/96.png`) 萃取。彩色球標去白底、
  以圓形遮罩重建 alpha；「台灣大哥大 企業服務」字樣以白字 alpha 轉為深色版本。
- **平台截圖**：取自簡報 P24–P33、P35，由 `scripts/rebrand-shots.py` 重新產生。
  依簡報自身的「調整注記」，截圖裡的舊廠商品牌一律置換：
  - 左上角品牌（Info360／Info／AICC-X）→ 以該列表頭色補平，改為台灣大標誌 + `TAIPBX`，
    並自動縮放至原廠商名稱佔用的寬度，不會蓋到旁邊的實際 UI。
  - 狀態列的「AICC-X 客服系統 — 就緒中」→ 改為「TAIPBX 客服系統 — 就緒中」。
    這串字在每個 build 落點不同，因此以文字段落切分自動定位，不寫死座標。
  若日後取得台灣大正式 Demo UI，直接替換 `public/ui/` 同名檔即可，版面無需更動。

- **動態標註**：簡報用紅框箭頭標出畫面上的重點，影片改成即時繪出——
  游標環落在被說明的控制項上、引線畫出、標籤最後到位。落點座標寫在
  `S6Platform.tsx` 的 `callouts`，刻意選在各截圖確實留白的區域，避免蓋住內容。

- **未使用的備用截圖**：`chat-inbound`、`customer-journey`、`outbound-preview`
  仍留在 `public/ui/` 與 `Screen.tsx` 的 `SHOTS` 目錄中，隨時可換進巡覽。
  （`customer-journey` 與 `customer-ivr` 其實是同一個畫面、只有日期不同，
  兩張併用會看起來像重複，因此巡覽改用 `service-record`。）
- **字型**：Noto Sans TC（繁中）與 Inter（拉丁／數字），已 subset 至本片實際用字。
  Remotion render 會同時開多個瀏覽器分頁，且把 `setTimeout` 接到時間軸而非真實時鐘，
  一旦有字型請求卡住便無從逾時、整個 render 會中斷；因此字型以 data URI
  內嵌（`src/fontData.ts`），render 期間完全不碰網路。
  更換字型後執行 `node scripts/embed-fonts.mjs` 重新產生。

## 待確認事項（沿用簡報注記）

- 主講人／團隊掛名以「台灣大哥大企業 AI 團隊」呈現，實際姓名待確認。
- `MyAgent`、`MCP Platform`、`AI Report` 等產品命名待確認正式名稱。
- 平台截圖建議後續替換為台灣大正式 Demo UI。
