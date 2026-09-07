/**
 * Narration script and subtitle cues — the single source of truth for the
 * burned-in caption layers and every exported sidecar.
 *
 * Both languages hang off one set of timings, because the picture is the same
 * in both: a cue that moves must move for both, and keeping two files in step
 * by hand is how subtitle tracks drift apart.
 *
 * Timings are frames at 30fps, hand-placed against the scene windows in
 * Video.tsx so no cue straddles a cut. Run `node scripts/make-subtitles.mjs`
 * after editing — it re-exports the sidecars and checks the pace of each
 * language against its own speaking rate.
 *
 * The English is not a literal translation. Mandarin carries more meaning per
 * second than English does, so a word-for-word rendering overruns the window
 * it was given; each line is rewritten to make the same point in the time
 * available.
 */
export type Cue = {
  /** Inclusive start frame. */
  from: number;
  /** Exclusive end frame. */
  to: number;
  /** Which scene it belongs to — used by the pacing check, not by rendering. */
  scene: string;
  zh: string;
  en: string;
};

export type Locale = 'zh' | 'en';

export const CAPTIONS: Cue[] = [
  // 2 · title 94–280
  {from: 105, to: 276, scene: 'title',
   zh: 'TAIPBX Call Center，企業級 AI 客服平台，開箱即用。',
   en: 'TAIPBX Call Center — an enterprise AI contact center platform, ready out of the box.'},

  // 3 · barriers 266–602
  {from: 288, to: 384, scene: 'barriers',
   zh: '企業導入 AI，通常卡在三個地方。',
   en: 'Enterprise AI projects usually stall in three places.'},
  {from: 390, to: 486, scene: 'barriers',
   zh: '雲地落差、架構兩難、整合困境。',
   en: 'Cloud gaps, architecture trade-offs, integration bottlenecks.'},
  {from: 492, to: 594, scene: 'barriers',
   zh: '地端部署、容器化微服務、開箱即用。',
   en: 'On-premise deployment. Containerized microservices. Ready to run.'},

  // 4 · platform 588–1020
  {from: 606, to: 702, scene: 'platform',
   zh: '六大核心技術，撐起整座平台。',
   en: 'Six core technologies hold up the whole platform.'},
  {from: 708, to: 810, scene: 'platform',
   zh: '資料百分之百留在地端，物理隔離。',
   en: 'All data stays on-premise, physically isolated.'},
  {from: 816, to: 912, scene: 'platform',
   zh: '容器化部署，GPU 算力獨立分流。',
   en: 'Containerized deployment, with dedicated GPU compute.'},
  {from: 918, to: 1014, scene: 'platform',
   zh: 'RAG 精準檢索，算力彈性擴充。',
   en: 'Precise RAG retrieval. Compute scales on demand.'},

  // 5 · industries 1006–1342
  {from: 1023, to: 1119, scene: 'industries',
   zh: '同一套平台，橫跨五大產業。',
   en: 'One platform, across five major industries.'},
  {from: 1125, to: 1230, scene: 'industries',
   zh: '金融壽險、政府公部門、電信服務、',
   en: 'Finance and insurance, government, telecom,'},
  {from: 1236, to: 1335, scene: 'industries',
   zh: '製造供應鏈與醫療健康。',
   en: 'manufacturing supply chains, and healthcare.'},

  // 6 · agent 1328–1760, beat switches to after-call at 1540
  {from: 1347, to: 1434, scene: 'agent',
   zh: '通話中，AI 與專員並肩。',
   en: 'AI works alongside the agent, live.'},
  {from: 1440, to: 1536, scene: 'agent',
   zh: '逐字稿、話術建議、代碼自動勾選。',
   en: 'Live transcript, suggested phrasing, automatic service codes.'},
  {from: 1551, to: 1650, scene: 'agent',
   zh: '通話一結束，摘要自動產生。',
   en: 'The call ends, and the summary writes itself.'},
  {from: 1656, to: 1752, scene: 'agent',
   zh: '完整質檢報告，免人工抽聽。',
   en: 'A full QA report, with no manual sampling.'},

  // 7 · nocode 1746–2106
  {from: 1767, to: 1860, scene: 'nocode',
   zh: '建立專屬 AI 助理，不用寫程式。',
   en: 'Build your own AI assistant, without writing code.'},
  {from: 1866, to: 1962, scene: 'nocode',
   zh: '貼上網址，整站內容匯入知識庫。',
   en: 'Paste a URL; the whole site imports.'},
  {from: 1968, to: 2094, scene: 'nocode',
   zh: '上傳檔案、建立 FAQ，精準回覆不打折。',
   en: 'Upload files, build FAQs — answers stay precise where it matters.'},

  // 8 · value 2092–2398
  {from: 2112, to: 2199, scene: 'value',
   zh: '一次投資，長期增值。',
   en: 'Invest once; the value compounds.'},
  {from: 2205, to: 2304, scene: 'value',
   zh: '釋放營運產能、跨越整合難關、',
   en: 'Free up operational capacity. Clear the integration hurdle.'},
  {from: 2310, to: 2391, scene: 'value',
   zh: '確保合規零風險。',
   en: 'Keep compliance risk at zero.'},

  // 9 · outro 2384–2570
  {from: 2406, to: 2550, scene: 'outro',
   zh: '企業 AI 轉型，從 TAIPBX Call Center 開始。',
   en: 'Enterprise AI transformation starts with TAIPBX Call Center.'},
];
