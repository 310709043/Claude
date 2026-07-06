# MyClaw AI — 90 秒企業產品宣傳影片

以 **React + TypeScript + Remotion** 打造的企業級產品發表會影片。
用於大型企業活動現場播放,搭配主持人語音 Demo(「龍蝦,分析這位客戶的需求。」)。

**核心訊息:Every Conversation is a Business Opportunity.**

## 快速開始

```bash
npm install

# 開啟 Remotion Studio 即時預覽
npm run dev

# 渲染完整影片(1920×1080 · 30fps · 90s)
npm run render
# → out/myclaw-promo.mp4
```

## 影片結構(90 秒 · 2700 frames @ 30fps)

| 時間 | 場景 | 內容 |
|---|---|---|
| 0–14s | 第一幕 Opening | Call Center / 門市 / 業務拜訪 / 視訊會議 / 客服中心 快切 → **Every Conversation Starts Here.** |
| 14–32s | 第二幕 Connect | TAIPBX 來電接聽 → MyVoca 即時逐字稿 → AI 需求辨識(Keyword Highlight) |
| 32–46s | 第三幕 Analyze | 龍蝦 AI 分析:Customer Intent / Pain Points / Buying Signals / Decision Maker / Opportunity Score / AI Confidence |
| 46–60s | 第四幕 Recommend | Next Best Offer 卡片:最適產品、推薦原因、成交機率、推薦話術、Follow-up 建議 |
| 60–73s | 第五幕 Capture | 建立 Lead → Assign Sales → Create Task → Follow-up → Pipeline Stage → CRM Sync |
| 73–82s | 第六幕 Insight | 主管 BI Dashboard:熱門需求、產業分析、成交率、Pipeline、高潛力客戶、AI Insights、Manager Suggestions |
| 82–90s | Ending | 資料流匯聚 → 龍蝦居中 → 台灣大哥大 × MyClaw Logo → **Every Conversation. Every Opportunity.** |

時間軸集中定義於 `src/theme.ts` 的 `SCENES`,調整秒數即可整段位移。

## 架構

```
src/
├── index.ts              # registerRoot
├── Root.tsx              # Composition 註冊
├── MyClawPromo.tsx       # 主時間軸(Sequence 編排)
├── theme.ts              # 色彩 / 字體 / Glassmorphism / 場景時間表
├── easings.ts            # 統一 Ease-In-Out 曲線與 progress helpers
├── components/           # 可重用 UI 元件
│   ├── GlassCard.tsx         # 玻璃擬態浮動卡片(spring 進場)
│   ├── AppWindow.tsx         # 企業軟體視窗外框 + StatusPill + SceneTitle
│   ├── ParticleBackground.tsx# 粒子 / 網格 / 品牌光源背景
│   ├── DataFlow.tsx          # 資料流光束(支援 converge 匯聚模式)
│   ├── CameraRig.tsx         # 電影運鏡(push-in / pan / drift)+ SceneFade
│   ├── LobsterAssistant.tsx  # 龍蝦 AI 吉祥物(idle / thinking / presenting)
│   ├── BrandLogos.tsx        # 台灣大哥大彩球 / MyClaw / TAIPBX / MyVoca / FloatingLogo
│   ├── VoiceWave.tsx         # 語音波形
│   ├── Transcript.tsx        # 逐字稿串流 + 關鍵字 Highlight 掃光
│   ├── AIThinking.tsx        # AI 神經球 + 推理過程 Log
│   ├── NumberCount.tsx       # 數字滾動 + ProgressBar
│   ├── KPIChart.tsx          # BarChart / LineChart / DonutChart
│   ├── DashboardCard.tsx     # BI Dashboard 磚
│   ├── OpportunityCard.tsx   # Next Best Offer 推薦卡
│   ├── LeadCard.tsx          # CRM Lead 卡(逐欄位生成)
│   ├── Pipeline.tsx          # 流程節點動畫(光點流動)
│   └── Tag.tsx               # KeywordChip / FieldRow
└── scenes/               # 七個場景
```

## 設計系統

- **色彩**:品牌橘 `#FF6B1A` 為主,黑 / 深灰 / 白為底,科技藍 `#3B9EFF` 少量點綴
- **動畫**:全部使用 `spring()` 與 `interpolate()` + 自訂 cubic-bezier ease-in-out,無生硬切換
- **風格**:Glassmorphism、Floating Cards、HUD、Number Count、Line Growth、Morph 收斂轉場、慢速運鏡與微漂移
