/**
 * Every string in the video, transcribed from the source deck
 * 「客服中心智能客服發展藍圖」so the script can be proof-read in one place.
 */

export const cover = {
  kicker: '台灣大哥大 企業服務 × 承暉資訊',
  titleTop: '客服中心',
  titleBottom: '智能客服發展藍圖',
  latin: 'AI Contact Center · Roadmap 2026',
  speakers: '主講人｜Scott 施浩鈞 · Hayley 洪赫苡',
};

export const heritage = {
  from: 2002,
  to: 2026,
  left: '自 2002 年起，我們用科技連結企業與客戶',
  right: '邁向 2026，我們用 AI 重新定義全渠道智能客服',
  footer: '感謝客戶的信任與支持',
};

export const solutions = {
  title: '三大核心產品解決方案',
  items: [
    {
      no: '01',
      name: '全渠道智能交互平台',
      time: '3～6 個月',
      desc: '整合語音、Chat、WebCall、Video、Social Media 等全渠道，提供雲端、本地及混合雲部署，實現統一客戶視圖與無縫體驗。',
      tags: ['Voice', 'Chat', 'WebCall', 'Video', 'Social'],
    },
    {
      no: '02',
      name: '智慧服務與銷售一體化工作台',
      time: '1 年',
      desc: '融合智能自助服務與專人座席，透過 AI 即時輔助、智能話術推薦，提升座席效率與銷售轉化，實現服務與業績雙贏。',
      tags: ['AI 輔助', '話術推薦', '銷售轉化'],
    },
    {
      no: '03',
      name: '企業級 AI 中控與整合服務',
      time: '3～6 個月',
      desc: '整合 NLP、ASR、TTS 等 AI 技術，支援大模型 RAG 與企業系統集成，驅動業務全面智能化轉型，構建自主可控的 AI 體系。',
      tags: ['NLP', 'ASR', 'TTS', 'RAG'],
    },
  ],
};

export const nowNext = {
  title: '客服中心　現況與未來方向',
  headNow: '現在',
  headNext: '未來 ｜ 趨勢',
  rows: [
    {
      label: '聯絡管道',
      now: ['電話'],
      next: ['電話', 'Webcall', 'Chat', 'Social Media'],
    },
    {
      label: 'IVR 互動',
      now: ['IVR Flow', '語音導航'],
      next: ['語音機器人', '文字機器人', 'MCP 整合'],
    },
    {
      label: '專人服務',
      now: ['Skill-Based Routing', 'Group Routing', 'Multimedia Dashboard'],
      next: ['AI 路由', '提前警示', '即時警示'],
    },
    {
      label: '報表／覽板',
      now: ['報表平台', '智能質檢'],
      next: ['AI 報表產出', '即時質檢'],
    },
  ],
};

export const stages = [
  {
    step: '第一階',
    title: '多渠道互動進線',
    lead: '把每一條客戶進線，收攏成同一條服務動線',
    items: [
      {k: '電話', v: '語音進線基礎建設'},
      {k: 'Webcall', v: '網頁即時語音通話'},
      {k: 'Chat', v: '文字客服即時應答'},
      {k: 'Social Media', v: '社群訊息統一接入'},
    ],
  },
  {
    step: '第二階',
    title: 'IVR 與智能機器人互動',
    lead: '高頻、非標準化的需求，交給機器人先接手',
    items: [
      {k: 'IVR Flow', v: '客製化、彈性化按鍵選單'},
      {k: '語音導航', v: 'NLU 意圖識別，縮短等待'},
      {k: '語音／文字機器人', v: '整合為單一大腦'},
      {k: 'MCP 整合', v: '介接行內交易及服務'},
    ],
  },
  {
    step: '第三階',
    title: '專人服務與智能路由分發',
    lead: '結合 AI 預判，提升客服中心風險控管能力',
    items: [
      {k: 'Skill / Group Routing', v: '依技能與班別派話'},
      {k: 'AI 路由', v: '客戶畫像與情緒預測配對'},
      {k: '提前警示', v: '客訴風險、重點客戶預告'},
      {k: '即時警示', v: '敏感詞與人力調配告警'},
    ],
  },
  {
    step: '第四階',
    title: '數據決策與智能質檢',
    lead: '讓報表自己長出來，讓品質在通話中就被看見',
    items: [
      {k: 'AI 報表產出', v: '整合各渠道數據自動分析'},
      {k: '即時質檢', v: '通話中同步檢驗服務規範'},
      {k: '話術指引', v: '專員即時話術建議'},
      {k: '全量覆蓋', v: '免人工抽聽'},
    ],
  },
];

export const architecture = {
  title: 'AICC 系統架構',
  sub: '開放介接・不限品牌　｜　MRCPv2／WebSocket 皆可支援，免加購 Adapter',
  notes: ['E1 中繼線路', 'SBC 邊界控制', '語音機器人・多輪 IVR'],
};

export const hybrid = {
  title: 'AICC 雲地混合架構',
  sub: '通訊、錄音、核心資料留地端；AI、Chat、AGD 值機走雲端',
  onprem: {
    head: '地端 On-Premise',
    note: '通訊與核心系統不出地',
    items: [
      'AICC 話務平台　IVR／ACD 排隊・智能轉接',
      '即時語音 ASR・TTS　地端辨識與合成',
      '錄音　錄音檔留地端・法遵留存',
      '企業內部系統　AD・CRM・核心交易 DB',
    ],
    badge: '100% 留存不出地',
  },
  cloud: {
    head: '雲端 Cloud',
    note: 'AI 應用服務',
    items: [
      'Chat 服務主平台　對話路由・多渠道整合',
      'AGD 客服值機平台　Agent Desktop',
      'AI 平台　LLM・RAG・AI Agent',
      'GPU 算力・向量知識庫',
    ],
    badge: 'AI 彈性擴充',
  },
  flowUp: '① 文字上雲（PII 遮罩後）',
  flowDown: '② 文字回覆',
  boundary: '雲地邊界　專線／VPN 加密',
};

export const aiApps = {
  title: 'AI 應用擴充',
  sub: '選配模組，隨業務節奏逐步開啟',
  items: [
    {n: 'RAG 知識問答', d: '以貴行知識庫作答，可回溯來源'},
    {n: '語音機器人', d: '24／7 自助，分流簡單諮詢'},
    {n: 'AI 動態核身', d: '動態問答多因子驗證'},
    {n: '服務代碼勾選', d: '依對話自動標記，免人工判讀'},
    {n: '話術推薦', d: '即時推送 SOP 話術'},
    {n: '話後摘要', d: '自動生成通話重點'},
    {n: '智能質檢', d: '全量品質與合規自動審查'},
    {n: '情緒洞察', d: '即時偵測情緒，主管端預警'},
  ],
};

export const closing = {
  pillars: [
    {n: 'Bot Gateway', t: '統一 LLM 服務平台', d: 'GPT／Claude／地端 LLM 互換，換模型只動設定，不重做整合。'},
    {n: 'MCP Platform', t: '電文即服務', d: '既有電文以設定檔定義為業務場景，核身執行一次貫穿全程。'},
    {n: 'AI Report', t: '對話式分析', d: '自然語言提問直接得到答案與建議，既有報表範本可沿用。'},
  ],
  headline: '模型可換，體驗不換',
  lockupTop: 'AICC',
  lockupBottom: '智能語音客服平台',
  tagline: '用 AI 重新定義全渠道智能客服',
  signature: '台灣大哥大 企業服務 × 承暉資訊',
};
