/**
 * ============================================================
 *  全片文案／數據 — 單一來源
 * ------------------------------------------------------------
 *  ★ 要換文案、改標題、調整項目數量，只改這個檔案。
 *    每個項目都有 `body`（螢幕用精煉版）與 `bodyFull`（簡報原文），
 *    方便日後在「廣告節奏」與「完整資訊」之間切換。
 * ============================================================
 */

export const brand = {
  name: 'TAIPBX',
  product: '企業級 AI 一體機',
  latin: 'ENTERPRISE AI APPLIANCE',
} as const;

/* ---------- 第 1 段：開場 Hook ---------- */
export const hook = {
  /** 3–5 秒抓住注意力的提問 */
  tease: '企業 AI，總是卡在最後一哩路。',
  title: brand.product,
  titleBrand: brand.name,
  pillars: ['100% 地端部署', '單機整合', 'AI 快速導入'],
  lead: '一台主機，開箱即用。',
  sub: '無需上雲、無需複雜整合，單機即可實現強大的 AI 應用，\n為企業構建安全可控、高效靈活的智能服務。',
} as const;

/* ---------- 第 2 段：三大關卡 ---------- */
export const barriersSection = {
  kicker: 'THE CHALLENGE',
  title: '化解企業 AI 導入的三大關卡',
  closing: '打破技術壁壘，讓企業 AI 從規劃走向落地不再遙不可及。',
} as const;

export const barriers = [
  {
    no: '01',
    theme: '雲地落差・資安合規',
    painLabel: '現況痛點',
    pain: '雲端 AI 落地成本高昂，\n個資外洩疑慮讓投入與效益難以對齊。',
    painFull:
      '企業對雲端 AI 充滿期待，但落地成本高昂，且存在個資外洩疑慮，導致投入與實際效益難以對齊。',
    solutionLabel: '一體機',
    solution: '100% 地端本地化',
    detail: '核心資料與運算完全保留企業內部，\n符合金融、政府等機構的最高資安標準。',
    detailFull:
      '核心資料與運算完全保留在企業內部，符合金融、政府等機構的最高資安標準，從根本上消除資料風險。',
  },
  {
    no: '02',
    theme: '架構兩難・靈活穩定',
    painLabel: '現況痛點',
    pain: '營運系統要求極穩定，AI 導入要求快迭代，\n傳統舊架構下兩者相互拉扯。',
    painFull:
      '營運系統要求極高穩定性，而 AI 導入需要快速迭代測試，傳統舊架構下兩者相互拉扯，難以平衡。',
    solutionLabel: '一體機',
    solution: '容器化微服務',
    detail: '獨立模組化設計，創新功能快速迭代上線，\n不影響現有客服營運的穩定性。',
    detailFull:
      '採用獨立模組化設計，創新功能快速迭代上線，不影響現有客服營運的穩定性，實現穩定與創新並行。',
  },
  {
    no: '03',
    theme: '整合困境・快速上線',
    painLabel: '現況痛點',
    pain: '舊有 IVR／CTI 難以支撐 AI 的即時資料流，\n系統整合動輒需 1–2 年才能落地。',
    painFull:
      '舊有 IVR／CTI 系統難以支撐 AI 的即時資料流與互動需求，系統整合耗時費力，動輒需 1–2 年才能落地。',
    solutionLabel: '一體機',
    solution: '開箱即用',
    detail: '內建完整話務與 AI 應用，省去漫長整合期，\n實現快速部署與價值交付。',
    detailFull:
      '內建完整話務與 AI 應用，無需複雜的舊系統改造，徹底省去漫長整合期，實現快速部署與價值交付。',
  },
] as const;

/* ---------- 第 3 段：六大核心技術 ---------- */
export const capabilitiesSection = {
  kicker: 'CORE TECHNOLOGY',
  title: '六大核心技術能力',
  subtitle: '驅動架構與智能升級',
} as const;

export const capabilities = [
  {
    no: '01',
    title: '地端安全合規',
    body: '核心資料與運算完全保留企業內部，\n符合最高等級資安與個資保護標準。',
    bodyFull:
      '核心資料與運算完全保留企業內部，符合最高等級資安與個資保護標準，確保資料絕對隱私與安全。',
    /** 巨型視覺焦點：可為數據、單位或符號 */
    figure: '100%',
    figureLabel: '資料留在企業內部',
    icon: 'shield',
  },
  {
    no: '02',
    title: 'VME 物理隔離機制',
    body: '多台獨立虛擬機，話務、語音處理與 AI 節點\n完全隔離，確保系統運行互不干擾。',
    bodyFull:
      '建立多台獨立虛擬機，實現話務、語音處理與 AI 工作節點的完全隔離，確保系統運行互不干擾、穩定可靠。',
    figure: 'VME',
    figureLabel: '物理級隔離',
    icon: 'layers',
  },
  {
    no: '03',
    title: '微服務開箱極速整合',
    body: '全系統採用 Docker 容器化部署，\n1–2 年的漫長建置週期大幅壓縮，開箱即用。',
    bodyFull:
      '全系統採用 Docker 容器化部署，打破傳統建設模式，將 1–2 年的漫長建置週期大幅壓縮，實現開箱即用。',
    figure: '1–2年',
    figureLabel: '建置週期壓縮',
    icon: 'container',
  },
  {
    no: '04',
    title: 'GPU 算力分流',
    body: '搭載 NVIDIA 旗艦級運算晶片，語音處理與\n模型推論獨立平行，對話流暢、回應零延遲。',
    bodyFull:
      '搭載 NVIDIA 旗艦級運算晶片，語音處理與 AI 模型推論任務獨立平行處理，保障對話流暢不卡頓、回應零延遲。',
    figure: '0',
    figureLabel: '延遲感知',
    icon: 'chip',
  },
  {
    no: '05',
    title: '精準 RAG 檢索生成',
    body: '內建企業專屬知識庫檢索增強機制，抑制 AI 幻覺，\n輸出貼合業務場景的專業應答。',
    bodyFull:
      '內建企業專屬知識庫檢索增強（RAG）機制，有效抑制 AI 幻覺問題，輸出精準、貼合業務場景的專業應答。',
    figure: 'RAG',
    figureLabel: '防幻覺機制',
    icon: 'search',
  },
  {
    no: '06',
    title: '彈性擴充無縫接軌',
    body: '主機支援靈活擴充至 4 張高階 GPU，\nAI 算力升級與客服席次擴容均可無縫接軌。',
    bodyFull:
      '主機支援靈活擴充至 4 張高階 GPU，無論是 AI 算力升級還是客服席次擴容，均可快速無縫擴充，配合業務成長。',
    figure: '×4',
    figureLabel: '高階 GPU 擴充',
    icon: 'expand',
  },
] as const;

/* ---------- 第 4 段：五大產業 ---------- */
export const industriesSection = {
  kicker: 'INDUSTRY COVERAGE',
  title: '橫跨五大產業的全場景 AI 賦能',
} as const;

export const industries = [
  {
    no: '01',
    name: '金融壽險',
    latin: 'FINANCE & INSURANCE',
    points: ['理專話術智能輔助', '個資去識別化', '智能品檢控管合規', '理賠文件自動摘要'],
    bodyFull:
      '理專話術智能輔助提升服務專業度，個資去識別化保障隱私安全；智能品檢嚴控合規風險，理賠文件自動摘要，大幅縮短理賠週期。',
  },
  {
    no: '02',
    name: '政府公部門',
    latin: 'PUBLIC SECTOR',
    points: ['法規文件智能比對', '申辦流程智能導航', 'SOP 知識庫即時問答', '數位化政務體驗'],
    bodyFull:
      '法規文件智能比對減少人工稽查錯誤，民眾申辦流程智能導航簡化辦事步驟；SOP 知識庫即時問答，打造高效便捷的數位化政務服務體驗。',
  },
  {
    no: '03',
    name: '電信服務',
    latin: 'TELECOM',
    points: ['網路故障預測維運', '告警單智慧派發', '資費查詢即時回應', '帳單智能解析'],
    bodyFull:
      '網路故障預測實現主動維運，告警單智慧派發精準調度；資費查詢與帳單智能解析，快速回應客戶諮詢，提升服務滿意度。',
  },
  {
    no: '04',
    name: '製造供應鏈',
    latin: 'MANUFACTURING',
    points: ['設備維修 SOP 問答', '合約文件自動審查', '客訴品質根因分析', '供應鏈協同優化'],
    bodyFull:
      '設備維修 SOP 問答賦能一線快速排除障礙；合約文件自動審查規避合規風險；客訴品質分析深挖根源，優化生產與服務流程，全面提升供應鏈協同效率與產品品質。',
  },
  {
    no: '05',
    name: '醫療健康',
    latin: 'HEALTHCARE',
    points: ['醫療術語精準辨識', '智能預約掛號', '健康管理個人化諮詢', '全流程智慧醫療'],
    bodyFull:
      '醫療專業術語精準辨識保障資訊正確；智能預約掛號優化就診流程；健康管理諮詢提供個人化建議，建構全流程智慧醫療服務體系，提升就醫效率與患者體驗。',
  },
] as const;

/* ---------- 第 5 段：四大價值 ---------- */
export const valueSection = {
  kicker: 'LONG-TERM VALUE',
  title: '一次投資、長期增值',
  subtitle: '驅動企業轉型',
} as const;

export const values = [
  {
    no: '01',
    title: '釋放營運產能',
    body: 'AI 自動產出話後小結，大幅縮短人工作業時間，\n讓專員專注於高價值服務。',
    bodyFull:
      'AI 自動產出話後小結，大幅縮短人工作業時間，讓專員專注於高價值服務，顯著提升團隊服務效能與客戶滿意度。',
  },
  {
    no: '02',
    title: '跨越整合難關',
    body: '採用單一主機架構設計，大幅降低跨系統\n對接的複雜度與導入風險。',
    bodyFull:
      '摒棄老舊系統包袱，採用單一主機架構設計，大幅降低跨系統對接的複雜度與導入風險，實現業務系統的無縫融合與高效協同。',
  },
  {
    no: '03',
    title: '確保合規零風險',
    body: '內建防幻覺機制與精細化權限控管，\n敏感資料 100% 本地端處理。',
    bodyFull:
      '內建防幻覺機制與精細化權限控管體系，敏感資料實現 100% 本地端處理，從源頭保障資料安全與業務合規底線。',
  },
  {
    no: '04',
    title: '長期投資保護',
    body: '一次投入即獲得完整 AI 基礎建設，支援硬體\n平滑升級與多 Agent 智能應用擴充。',
    bodyFull:
      '一次性投入即可獲得完整 AI 基礎建設，支援硬體平滑升級與多 Agent 智能應用擴充，隨業務發展靈活配置，持續創造長期價值。',
  },
] as const;

/* ---------- 第 6 段：結尾 CTA ---------- */
export const cta = {
  statement: '企業 AI 轉型，',
  statementAccent: '從單機就緒開始。',
  brand: brand.name,
  product: brand.product,
  latin: brand.latin,
  action: '立即預約專屬情境演示',
} as const;
