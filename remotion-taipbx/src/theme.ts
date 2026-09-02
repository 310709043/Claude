/**
 * ============================================================
 *  TAIPBX 電影級宣傳片 — 色彩／字級／節奏 設計系統
 * ------------------------------------------------------------
 *  ★ 全片唯一的視覺真理來源。要換品牌色，只改這個檔案。
 * ============================================================
 */

/** 官方品牌色碼（來自品牌規範，請勿直接改動，需要調整請改下方 palette） */
export const BRAND = {
  primary: '#FF6100',
  primaryDark: '#CC4D00',
  primaryLight: '#FF8C3F',
  primaryPale: '#FFF0E6',

  textPrimary: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textHint: '#8A8A8A',
  border: '#D9D9D9',
  divider: '#E8E8E8',
  bgLight: '#F5F5F7',
  card: '#FFFFFF',

  success: '#41D189',
  warning: '#FDA430',
  error: '#F43939',
  info: '#3BB0F4',
} as const;

/**
 * 電影母版採「暗場」— 由品牌中性色 #1A1A1A 向下延伸出的暗調層次。
 * 目的：讓 #FF6100 成為畫面中唯一的光源色，取得最大對比與光暈層次。
 */
export const palette = {
  /* --- 底層／空間 --- */
  void: '#050403',        // 最深處，鏡頭外的黑
  deep: '#0A0908',        // 主背景
  base: '#141210',        // 場景地面／遠景
  surface: '#1A1A1A',     // 品牌中性文字色，於暗場中作為卡片底
  raise: '#242220',       // 抬升面（卡片、面板）
  edge: 'rgba(255, 97, 0, 0.22)',    // 品牌色描邊
  edgeSoft: 'rgba(255, 255, 255, 0.08)',
  grid: 'rgba(255, 140, 63, 0.10)',  // 網格線

  /* --- 品牌光源 --- */
  primary: BRAND.primary,
  primaryDark: BRAND.primaryDark,
  primaryLight: BRAND.primaryLight,
  primaryPale: BRAND.primaryPale,
  glow: 'rgba(255, 97, 0, 0.55)',
  glowSoft: 'rgba(255, 140, 63, 0.28)',
  ember: '#FFB27A',       // 高光末端（近白的橘）

  /* --- 文字（暗場反轉） --- */
  textHi: '#FBF7F4',      // 主標題
  textMid: 'rgba(251, 247, 244, 0.76)',
  textLow: 'rgba(251, 247, 244, 0.48)',
  textFaint: 'rgba(251, 247, 244, 0.26)',

  /* --- 語意色 --- */
  success: BRAND.success,
  warning: BRAND.warning,
  error: BRAND.error,
  info: BRAND.info,
  /** 「現況痛點」專用的冷色，與品牌暖橘形成敘事對立 */
  pain: '#5B6B7F',
  painGlow: 'rgba(91, 107, 127, 0.35)',
} as const;

/**
 * 淺色變體 — 若日後需要白底版本（配合官方 UI 規範），
 * 將 Film.tsx 的 <CinematicGrade> 關閉並改用此組即可。
 */
export const paletteLight = {
  void: BRAND.bgLight,
  deep: BRAND.bgLight,
  base: BRAND.card,
  surface: BRAND.card,
  raise: BRAND.card,
  edge: BRAND.border,
  edgeSoft: BRAND.divider,
  grid: 'rgba(255, 97, 0, 0.08)',
  primary: BRAND.primary,
  primaryDark: BRAND.primaryDark,
  primaryLight: BRAND.primaryLight,
  primaryPale: BRAND.primaryPale,
  glow: 'rgba(255, 97, 0, 0.30)',
  glowSoft: 'rgba(255, 140, 63, 0.16)',
  ember: BRAND.primaryDark,
  textHi: BRAND.textPrimary,
  textMid: BRAND.textSecondary,
  textLow: BRAND.textHint,
  textFaint: BRAND.border,
  success: BRAND.success,
  warning: BRAND.warning,
  error: BRAND.error,
  info: BRAND.info,
  pain: BRAND.textHint,
  painGlow: 'rgba(138, 138, 138, 0.25)',
} as const;

/**
 * 字級：以 1920×1080 設計座標定義，輸出時整體 scale 至 4K。
 * 43 吋螢幕可讀性基準：正文 ≥ 22px（設計座標）＝ 44px（4K 實際像素）。
 */
export const type = {
  hero: 132,       // 開場品牌名
  display: 84,     // 段落大標
  title: 52,       // 卡片標題
  subtitle: 34,    // 副標
  body: 25,        // 正文（43 吋最小可讀基準之上）
  caption: 19,     // 標籤／註記
  numeral: 168,    // 巨型序號 01 / 02
  kicker: 17,      // 全大寫小標
} as const;

export const tracking = {
  hero: '-0.03em',
  display: '-0.02em',
  title: '-0.01em',
  body: '0.01em',
  kicker: '0.42em',   // 寬字距的英文小標，高級感關鍵
  numeral: '-0.04em',
} as const;

export const leading = {
  tight: 1.08,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.72,   // 中文正文需要較鬆的行高
} as const;

/** 版面安全區（設計座標）。43 吋觀看距離下，留白即是質感。 */
export const layout = {
  designWidth: 1920,
  designHeight: 1080,
  marginX: 168,
  marginY: 116,
  columnGap: 48,
} as const;

/** 電影感後製強度，可整體微調 */
export const grade = {
  grainOpacity: 0.055,
  vignetteStrength: 0.82,
  bloomStrength: 0.42,
  chromaticAberration: 1.6,   // px @ 設計座標
  halationStrength: 0.35,
} as const;

export type Palette = typeof palette;
