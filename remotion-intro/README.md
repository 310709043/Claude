# TAIPBX Call Center — 介紹影片（Remotion）

以 `TAIPBX_CallCenter` 簡報為腳本，用 [Remotion](https://remotion.dev) 產製的
1920×1080 / 30fps 介紹影片，全長約 **76 秒**。

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
| 6 | 平台介面巡覽（6 幅實機畫面） | `src/scenes/S6Platform.tsx` | 486f |
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
  scenes/            # 九個場景
public/
  brand/             # 標誌（自簡報母片萃取，去背後放大）
  ui/                # 平台操作截圖
  fonts/             # Noto Sans TC + Inter（已 subset 至本片用字）
```

## 素材來源與調整

- **標誌**：自簡報母片背景圖 (`image95/96.png`) 萃取。彩色球標去白底、
  以圓形遮罩重建 alpha；「台灣大哥大 企業服務」字樣以白字 alpha 轉為深色版本。
- **平台截圖**：取自簡報 P24–P33、P35。依簡報自身的「調整注記」，
  截圖左上角的舊廠商品牌（Info360／Info／AICC-X）已用該列表頭色補平並改標 `TAIPBX`。
  若日後取得台灣大正式 Demo UI，直接替換 `public/ui/` 同名檔即可，版面無需更動。
- **字型**：Noto Sans TC（繁中）與 Inter（拉丁／數字），已 subset 至本片實際用字，
  四個字重合計約 500KB，內嵌於 `public/fonts/`，離線亦可 render。

## 待確認事項（沿用簡報注記）

- 主講人／團隊掛名以「台灣大哥大企業 AI 團隊」呈現，實際姓名待確認。
- `MyAgent`、`MCP Platform`、`AI Report` 等產品命名待確認正式名稱。
- 平台截圖建議後續替換為台灣大正式 Demo UI。
