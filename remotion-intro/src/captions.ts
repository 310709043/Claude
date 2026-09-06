/**
 * Narration script and subtitle cues — the single source of truth for both the
 * burned-in caption layer and the exported .srt / .vtt sidecars.
 *
 * Timings are in frames at 30fps and are hand-placed against the scene windows
 * in Video.tsx, so no cue straddles a cut. Run `node scripts/make-subtitles.mjs`
 * after editing: it re-exports the sidecars and checks the speaking pace.
 *
 * The narration deliberately does not read the screen aloud — the on-screen
 * callouts already name each control, so the voice carries the argument instead.
 */
export type Cue = {
  /** Inclusive start frame. */
  from: number;
  /** Exclusive end frame. */
  to: number;
  text: string;
  /** Which scene it belongs to — used by the pacing check, not by rendering. */
  scene: string;
};

export const CAPTIONS: Cue[] = [
  // 2 · title 94–280
  {from: 105, to: 276, scene: 'title', text: 'TAIPBX Call Center，企業級 AI 客服平台，開箱即用。'},

  // 3 · barriers 266–602
  {from: 288, to: 384, scene: 'barriers', text: '企業導入 AI，通常卡在三個地方。'},
  {from: 390, to: 486, scene: 'barriers', text: '雲地落差、架構兩難、整合困境。'},
  {from: 492, to: 594, scene: 'barriers', text: '地端部署、容器化微服務、開箱即用。'},

  // 4 · platform 588–1020
  {from: 606, to: 702, scene: 'platform', text: '六大核心技術，撐起整座平台。'},
  {from: 708, to: 810, scene: 'platform', text: '資料百分之百留在地端，物理隔離。'},
  {from: 816, to: 912, scene: 'platform', text: '容器化部署，GPU 算力獨立分流。'},
  {from: 918, to: 1014, scene: 'platform', text: 'RAG 精準檢索，算力彈性擴充。'},

  // 5 · industries 1006–1342
  {from: 1023, to: 1119, scene: 'industries', text: '同一套平台，橫跨五大產業。'},
  {from: 1125, to: 1230, scene: 'industries', text: '金融壽險、政府公部門、電信服務、'},
  {from: 1236, to: 1335, scene: 'industries', text: '製造供應鏈與醫療健康。'},

  // 6 · agent 1328–1760, beat switches to after-call at 1540
  {from: 1347, to: 1434, scene: 'agent', text: '通話中，AI 與專員並肩。'},
  {from: 1440, to: 1536, scene: 'agent', text: '逐字稿、話術建議、代碼自動勾選。'},
  {from: 1551, to: 1650, scene: 'agent', text: '通話一結束，摘要自動產生。'},
  {from: 1656, to: 1752, scene: 'agent', text: '完整質檢報告，免人工抽聽。'},

  // 7 · nocode 1746–2106
  {from: 1767, to: 1860, scene: 'nocode', text: '建立專屬 AI 助理，不用寫程式。'},
  {from: 1866, to: 1962, scene: 'nocode', text: '貼上網址，整站內容匯入知識庫。'},
  {from: 1968, to: 2094, scene: 'nocode', text: '上傳檔案、建立 FAQ，精準回覆不打折。'},

  // 8 · value 2092–2398
  {from: 2112, to: 2199, scene: 'value', text: '一次投資，長期增值。'},
  {from: 2205, to: 2304, scene: 'value', text: '釋放營運產能、跨越整合難關、'},
  {from: 2310, to: 2391, scene: 'value', text: '確保合規零風險。'},

  // 9 · outro 2384–2570
  {from: 2406, to: 2550, scene: 'outro', text: '企業 AI 轉型，從 TAIPBX Call Center 開始。'},
];
