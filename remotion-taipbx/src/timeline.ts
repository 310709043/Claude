/**
 * ============================================================
 *  分鏡時間軸 — 全片節奏的單一來源
 * ------------------------------------------------------------
 *  ★ 要調整某段長度，只改 SCENE 的數字，總長會自動重算。
 *    TransitionSeries 的轉場為「重疊」計算：
 *    總長 = Σ場景長度 − Σ轉場長度
 * ============================================================
 */

export const FPS = 60;
export const WIDTH = 3840;
export const HEIGHT = 2160;

/** 設計座標 → 4K 的放大倍率（Chrome 會在縮放後重新柵格化，文字依然銳利） */
export const SCALE = WIDTH / 1920;

const s = (seconds: number) => Math.round(seconds * FPS);

/** 每段場景的長度（含將被轉場吃掉的重疊部分） */
export const SCENE = {
  hook: s(15.333),        //  920f  強烈開場
  barriers: s(32.167),    // 1930f  三大關卡
  capabilities: s(32.667),// 1960f  六大核心技術
  industries: s(23),      // 1380f  五大產業
  value: s(14.25),        //  855f  四大價值
  cta: s(5.083),          //  305f  結尾 CTA
} as const;

/** 場景之間的轉場長度（重疊） */
export const TRANSITION = {
  hookToBarriers: s(0.5),
  barriersToCapabilities: s(0.5),
  capabilitiesToIndustries: s(0.5),
  industriesToValue: s(0.5),
  valueToCta: s(0.5),
} as const;

const sceneTotal = Object.values(SCENE).reduce((a, b) => a + b, 0);
const transitionTotal = Object.values(TRANSITION).reduce((a, b) => a + b, 0);

/** 影片總長度（frames）— 由上方數字自動推導 */
export const TOTAL_FRAMES = sceneTotal - transitionTotal;

/* ---------------- 場景內部節拍 ---------------- */

/** 開場：提問 → 品牌浮現 → 三支柱 */
export const HOOK_BEATS = {
  teaseIn: s(0.35),
  teaseOut: s(4.0),
  titleIn: s(4.4),
  pillarsIn: s(8.6),
  leadIn: s(10.6),
} as const;

/** 三大關卡：標題卡 → 3 張卡 → 核心訴求 */
export const BARRIER_BEATS = {
  titleCard: s(4.0),
  card: s(8.0),          // 每張卡片長度
  closing: s(4.167),
} as const;

/** 六大技術：標題 → 6 項 → 收束 */
export const CAPABILITY_BEATS = {
  titleCard: s(3.5),
  item: s(4.25),
  outro: s(3.667),
} as const;

/** 五大產業：標題 → 5 項 → 收束 */
export const INDUSTRY_BEATS = {
  titleCard: s(3.0),
  item: s(3.5),
  outro: s(2.5),
} as const;

/** 四大價值：標題 → 2×2 網格漸次浮現 */
export const VALUE_BEATS = {
  titleCard: s(2.75),
  gridIn: s(0.5),
  itemStagger: s(1.9),
  hold: s(2.0),
} as const;

/** 便利函式：秒 → frames */
export const sec = s;
