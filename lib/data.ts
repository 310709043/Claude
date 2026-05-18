import type { Bi } from './i18n';

export const profile = {
  nameZh: '曾詳藝',
  nameEn: 'Eric Tang',
  title: {
    zh: '營運管理師 / 產品專案管理',
    en: 'Operations Manager · PM',
  } satisfies Bi,
  slogan: {
    zh: '享受從 0 到 1 的創新過程，熱衷挑戰創新目標。',
    en: 'I love the journey of building from 0 to 1.',
  } satisfies Bi,
  email: 'xiangyi10200@gmail.com',
  phone: '+886 938-296-829',
  location: { zh: '台北市 信義區', en: 'Xinyi, Taipei' } satisfies Bi,
  mbti: 'ENTJ',
  nationality: { zh: '馬來西亞籍', en: 'Malaysian' } satisfies Bi,
  photo: '/images/profile.jpg',
  currentRole: {
    zh: '崇越科技 營運管理師',
    en: 'Operations @ TOPCO',
  } satisfies Bi,
};

export const about = {
  paragraphs: [
    {
      zh: '我是 Eric，國立陽明交通大學經營管理研究所碩士，曾任崇越科技營運管理師，負責台灣、新加坡與越南子公司的營運與財務分析，定期產出損益報告、KPI 追蹤與預算差異分析，支援高階主管決策與營運策略調整。',
      en: 'I am Eric, an MBA graduate from National Yang Ming Chiao Tung University. As Operations Manager at TOPCO Scientific, I led P&L analysis, KPI tracking and budget variance reporting across Taiwan, Singapore, and Vietnam subsidiaries — supporting executives in strategic decisions.',
    } satisfies Bi,
    {
      zh: '透過 ERP 與 BI 系統整合數據，建立標準化管理機制，提升跨國數據一致性與決策效率。過去亦曾任 Data PM，負責需求分析、競品研究與產品開發藍圖規劃。',
      en: 'By integrating ERP and BI systems, I built standardized reporting that lifted cross-border data consistency and decision velocity. Earlier as a Data PM, I drove requirements, competitor analysis, and product roadmaps.',
    } satisfies Bi,
    {
      zh: '在工作中實際運用 AI 工具優化市場研究、簡報架構與文件產出流程，提高專案效率與決策品質。未來職涯目標為產品經理（PM）或商業分析（BA），參與從 0 到 1 的產品推進。',
      en: 'I actively use AI tools to streamline research, decks, and documentation — improving project velocity and decision quality. My next chapter: shipping 0-to-1 products as a PM or Business Analyst.',
    } satisfies Bi,
  ],
  highlights: [
    { label: { zh: '報表產出效率', en: 'Reporting efficiency' }, value: '+90%' },
    { label: { zh: '跨國子公司', en: 'Subsidiaries managed' }, value: '4' },
    { label: { zh: '數據一致性', en: 'Data consistency' }, value: '100%' },
    { label: { zh: '競賽獲獎', en: 'Awards' }, value: '5+' },
  ],
};

export const skills: { group: Bi; items: string[] }[] = [
  {
    group: { zh: '營運與商業分析', en: 'Operations & Business Analysis' },
    items: ['P&L', 'KPI Framework', 'ERP / BI', 'Budgeting', 'Cross-border Ops', 'Market Analysis'],
  },
  {
    group: { zh: '產品 / 專案管理', en: 'Product / Project Management' },
    items: ['Agile / Scrum', 'Requirements', 'Competitor Analysis', 'Roadmap', 'Jira', 'Monday'],
  },
  {
    group: { zh: 'AI 工具應用', en: 'AI Productivity' },
    items: ['ChatGPT', 'Claude', 'Gemini', 'Manus AI', 'Base44', 'Grok'],
  },
  {
    group: { zh: '數據與技術', en: 'Data & Tech' },
    items: ['Tableau', 'Power BI', 'SQL', 'Python', 'Excel', 'Vibe Coding'],
  },
  {
    group: { zh: '設計與生產力', en: 'Design & Productivity' },
    items: ['Figma', 'Canva', 'XMind', 'Shapr3D', 'CapCut', 'Draw.io'],
  },
];

export const experiences: {
  company: Bi;
  url?: string;
  role: Bi;
  period: string;
  location: Bi;
  bullets: Bi[];
  tags: Bi[];
}[] = [
  {
    company: { zh: '崇越科技股份有限公司', en: 'TOPCO Scientific Co., Ltd.' },
    url: 'https://www.topco-global.com/',
    role: { zh: '營運管理師', en: 'Operations Management Specialist' },
    period: '2024/10 – 2026/03',
    location: { zh: '台北市內湖區', en: 'Neihu, Taipei' },
    bullets: [
      {
        zh: '管理台灣、新加坡、越南 4 家子公司之損益、庫存、費用與應收帳款分析，追蹤預實差異並優化報表流程，使產出效率提升 90%。',
        en: 'Owned P&L, inventory, expenses, and AR analysis across 4 subsidiaries in Taiwan/Singapore/Vietnam — boosted reporting throughput by 90%.',
      },
      {
        zh: '建立營收、毛利等核心 KPI 追蹤機制，整合 ERP 與 BI 系統數據，確保跨國營運資訊 100% 一致。',
        en: 'Built core KPI framework integrating ERP + BI, achieving 100% cross-border data consistency.',
      },
      {
        zh: '主導 4 家子公司年度 BP 與預算編列，推動內控稽核機制與集團共識營，協助 AI 專案執行。',
        en: 'Led annual BP and budgeting for 4 subsidiaries, drove internal-control audits, and supported group AI initiatives.',
      },
      {
        zh: '運用 AI 工具進行資料彙整與洞察分析，產出高品質決策簡報。',
        en: 'Used AI for data synthesis and produced high-impact executive decks.',
      },
    ],
    tags: [
      { zh: '營運分析', en: 'Ops Analysis' },
      { zh: 'KPI', en: 'KPI' },
      { zh: 'ERP/BI', en: 'ERP/BI' },
      { zh: '跨國管理', en: 'Cross-border' },
      { zh: 'AI', en: 'AI' },
    ],
  },
  {
    company: { zh: '域動行銷股份有限公司', en: 'ClickForce' },
    url: 'https://www.clickforce.com.tw/',
    role: { zh: '數據 PM Specialist', en: 'Data PM Specialist' },
    period: '2024/03 – 2024/06',
    location: { zh: '台北市松山區', en: 'Songshan, Taipei' },
    bullets: [
      {
        zh: '透過需求分析、競品分析與市場調查規劃整體開發藍圖，並實際執行。',
        en: 'Defined the product roadmap via requirements, competitor, and market analysis — then shipped it.',
      },
      {
        zh: '主導補助案於 3 個月內完成工研院與數位發展部之計畫書撰寫與提案。',
        en: 'Led grant proposals to ITRI and MODA, delivering full documentation in 3 months.',
      },
      {
        zh: '參與數據組敏捷管理與流程規劃，協助規劃 ADID 標籤種類。',
        en: 'Drove agile rituals for the data team and expanded the ADID taxonomy.',
      },
      {
        zh: '撰寫 BLS 受眾分析報告，協助客戶優化行銷成效。',
        en: 'Authored BLS audience reports that improved client campaign performance.',
      },
    ],
    tags: [
      { zh: 'Data PM', en: 'Data PM' },
      { zh: 'Agile', en: 'Agile' },
      { zh: '政府補助案', en: 'Govt. Grants' },
      { zh: '受眾分析', en: 'Audience' },
    ],
  },
  {
    company: { zh: 'Amber Group', en: 'Amber Group' },
    url: 'https://www.ambergroup.io/',
    role: { zh: '專案研究實習生', en: 'Project Research Intern' },
    period: '2022/09 – 2023/01',
    location: { zh: '遠距', en: 'Remote' },
    bullets: [
      {
        zh: '研究 NFT 與加密貨幣市場趨勢，整理產業動態與市場觀察報告。',
        en: 'Researched NFT and crypto trends; produced market and industry reports.',
      },
      {
        zh: '針對加密貨幣事件深入分析，探討項目崩盤始末與投資風險。',
        en: 'Deep-dives on crypto incidents, dissecting collapses and investment risks.',
      },
    ],
    tags: [
      { zh: 'NFT', en: 'NFT' },
      { zh: '加密貨幣', en: 'Crypto' },
      { zh: '市場研究', en: 'Research' },
    ],
  },
  {
    company: { zh: '北投輕行旅', en: 'Beitou Light Travel Hotel' },
    role: { zh: '儲備主管', en: 'Assistant Manager' },
    period: '2020/12 – 2021/09',
    location: { zh: '台北市北投區', en: 'Beitou, Taipei' },
    bullets: [
      {
        zh: '當班期間將平日與假日平均住房率提升至 80%–100%，疫情期間維持 60%–70%。',
        en: 'Lifted occupancy to 80–100% on shifts; held 60–70% through the pandemic.',
      },
      {
        zh: '管理 Booking、Funnow、AsiaYo 等多平台 OTA，優化長短期房價策略。',
        en: 'Managed Booking, Funnow, AsiaYo and optimized short/long-stay pricing.',
      },
      {
        zh: '當班期間 Google 評分維持 4.1 顆星。',
        en: 'Maintained a 4.1-star Google rating during my shifts.',
      },
    ],
    tags: [
      { zh: 'OTA', en: 'OTA' },
      { zh: '營運', en: 'Ops' },
      { zh: '客戶服務', en: 'Customer Service' },
    ],
  },
];

export const projects: {
  title: string;
  subtitle: Bi;
  description: Bi;
  role: Bi[];
  tags: string[];
  year: string;
  url?: string;
}[] = [
  {
    title: 'EmoTree',
    subtitle: {
      zh: 'RYLA 超越生成式 AI 領袖魅力 — 第三名 (2025)',
      en: 'RYLA — Beyond Generative AI Leadership · 3rd Place (2025)',
    },
    description: {
      zh: '結合 AI 對話、植物養成與日記功能的伴侶 App，支持情緒健康。AI 植物伴侶根據情緒互動生長，提供一鍵情緒日記與週報、引導式呼吸／正念練習。',
      en: 'A companion app blending AI dialogue, plant-growth and journaling for emotional wellness. The plant grows from your moods; one-tap journaling generates weekly reports; guided breathing and mindfulness included.',
    },
    role: [
      { zh: '產品概念發想 / POC 製作', en: 'Concept ideation & POC' },
      { zh: '商業模式與使用者流程規劃', en: 'Business model & user flow' },
    ],
    tags: ['AI', 'Mental Health', 'App'],
    year: '2025',
  },
  {
    title: 'Mirror Tech',
    subtitle: {
      zh: '飛捷第 17th 繁星寒訓營 — 第一名 (2023)',
      en: 'Flytech 17th Star Winter Camp · 1st Place (2023)',
    },
    description: {
      zh: '互動智能鏡面產品，整合 AIoT 與使用者介面，提供日常生活情境的智慧資訊呈現。',
      en: 'An interactive smart mirror integrating AIoT and UI for everyday ambient information.',
    },
    role: [
      { zh: '產品提案發想與流程規劃', en: 'Product ideation & flow' },
      { zh: '產品模型設計與使用者介面規劃', en: 'Prototype & UI design' },
    ],
    tags: ['IoT', 'UI/UX', 'Prototype'],
    year: '2023',
  },
  {
    title: 'NatBrane',
    subtitle: {
      zh: '李長榮教育基金會優秀獎學金 — 第一名 (2022)',
      en: 'LCY Foundation Scholarship · 1st Place (2022)',
    },
    description: {
      zh: '動物醫療噴霧產品，從品牌設計到行銷通路完整規劃，並以競賽影片呈現產品價值。',
      en: 'A veterinary spray product — end-to-end branding, marketing channels, and a competition film.',
    },
    role: [
      { zh: '產品與品牌設計', en: 'Product & brand design' },
      { zh: '行銷通路規劃', en: 'Marketing channels' },
      { zh: '競賽影片剪輯', en: 'Video editing' },
    ],
    tags: ['Branding', 'Marketing', 'Animal Health'],
    year: '2022',
  },
  {
    title: 'BIOICT',
    subtitle: {
      zh: '全國 BIODESIGN 創新競賽工作坊 — 季軍',
      en: 'National BIODESIGN Innovation Workshop · 3rd Place',
    },
    description: {
      zh: '跨領域生醫與資通訊整合創新提案，論文亦延伸研究台灣 BIOICT 產業之網路密度與創新策略。',
      en: 'Cross-disciplinary BioMed × ICT innovation proposal; extended into a thesis on network density and innovation strategy in Taiwan\'s BIOICT industry.',
    },
    role: [
      { zh: '競賽提案', en: 'Competition proposal' },
      { zh: '產業研究', en: 'Industry research' },
    ],
    tags: ['BIOICT', 'Innovation', 'Research'],
    year: '2023',
  },
];

export const education: {
  school: Bi;
  url?: string;
  degree: Bi;
  period: string;
  detail: Bi;
  thesis?: Bi;
}[] = [
  {
    school: { zh: '國立陽明交通大學', en: 'National Yang Ming Chiao Tung University' },
    url: 'https://www.nycu.edu.tw/',
    degree: {
      zh: '經營管理研究所 碩士',
      en: 'M.S., International Business Management',
    },
    period: '2021/09 – 2023/08',
    detail: {
      zh: 'GPA：4.14 / 4.3｜課程助教｜論文指導教授助理',
      en: 'GPA: 4.14 / 4.3 · Teaching & Research Assistant',
    },
    thesis: {
      zh: '論文：網路密度與良好創新之策略與實踐 — 以台灣 BIOICT 產業為例',
      en: "Thesis: Network density and innovation strategies — Taiwan's BIOICT industry.",
    },
  },
  {
    school: { zh: '國立勤益科技大學', en: 'National Chin-Yi University of Technology' },
    url: 'https://www.ncut.edu.tw/',
    degree: { zh: '企業管理系 學士', en: 'B.A., Business Administration' },
    period: '2016/09 – 2020/07',
    detail: {
      zh: 'GPA：3.9 / 4.0｜每年優秀學生獎學金',
      en: 'GPA: 3.9 / 4.0 · Annual outstanding scholarship',
    },
  },
];

export const certifications: Bi[] = [
  { zh: 'Google Ads 搜尋廣告認證', en: 'Google Ads Search Certification' },
  { zh: 'Google Ads 影片廣告認證', en: 'Google Ads Video Certification' },
  { zh: 'Google Analytics 認證', en: 'Google Analytics Certification' },
  { zh: 'Microsoft AI-900', en: 'Microsoft AI-900' },
  { zh: 'ITS Python', en: 'ITS Python' },
  {
    zh: '2024 Google 數位人才探索計劃 — 數位行銷學程',
    en: '2024 Google Digital Talent Program — Digital Marketing',
  },
  {
    zh: '2024 Python 數據分析：從小白到高手 (Udemy)',
    en: '2024 Python Data Analysis (Udemy)',
  },
];

export const languages: { name: Bi; level: Bi }[] = [
  { name: { zh: '中文', en: 'Mandarin' }, level: { zh: '精通', en: 'Native' } },
  { name: { zh: '英文', en: 'English' }, level: { zh: '精通', en: 'Fluent' } },
  {
    name: { zh: '粵語', en: 'Cantonese' },
    level: { zh: '中上', en: 'Upper-Intermediate' },
  },
  {
    name: { zh: '馬來文', en: 'Bahasa Melayu' },
    level: { zh: '中上', en: 'Upper-Intermediate' },
  },
];
