/**
 * MyClaw AI — Design System
 * Premium / Enterprise / AI-first / Cinematic
 */

export const COLORS = {
  // Brand
  orange: '#FF6B1A',
  orangeSoft: '#FF8A3D',
  orangeDeep: '#E85400',
  orangeGlow: 'rgba(255, 107, 26, 0.55)',

  // Neutrals
  black: '#050507',
  bg: '#0A0A10',
  bgElevated: '#101018',
  darkGray: '#16161F',
  midGray: '#2A2A36',
  border: 'rgba(255, 255, 255, 0.09)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',

  // Text
  white: '#FFFFFF',
  textPrimary: 'rgba(255, 255, 255, 0.95)',
  textSecondary: 'rgba(255, 255, 255, 0.62)',
  textTertiary: 'rgba(255, 255, 255, 0.38)',

  // Tech accent (sparingly)
  blue: '#3B9EFF',
  blueGlow: 'rgba(59, 158, 255, 0.4)',
  cyan: '#4DD8E6',

  // Semantic
  green: '#34D399',
  red: '#F87171',
  amber: '#FBBF24',
} as const;

export const FONT_FAMILY =
  "'Noto Sans TC', 'Noto Sans CJK TC', 'PingFang TC', 'Microsoft JhengHei', 'Inter', -apple-system, 'Segoe UI', sans-serif";

export const FONT_MONO =
  "'SF Mono', 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace";

/** Glassmorphism panel base style */
export const glass = (opacity = 0.06): React.CSSProperties => ({
  backgroundColor: `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: `1px solid ${COLORS.border}`,
  boxShadow:
    '0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
});

/** Video-wide timing map (30 fps) */
export const FPS = 30;
export const SCENES = {
  opening: {from: 0, duration: 14 * FPS}, // 0–14s   多產業情境
  call: {from: 14 * FPS, duration: 18 * FPS}, // 14–32s  TAIPBX + MyVoca
  analysis: {from: 32 * FPS, duration: 14 * FPS}, // 32–46s  AI 分析
  offer: {from: 46 * FPS, duration: 14 * FPS}, // 46–60s  Next Best Offer
  lead: {from: 60 * FPS, duration: 13 * FPS}, // 60–73s  建立 Lead
  dashboard: {from: 73 * FPS, duration: 9 * FPS}, // 73–82s  主管 Dashboard
  ending: {from: 82 * FPS, duration: 8 * FPS}, // 82–90s  Ending
} as const;

export const TOTAL_DURATION = 90 * FPS; // 2700 frames
