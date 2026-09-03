/**
 * Design tokens for the AICC intro video.
 *
 * The palette is lifted from the source deck: Taiwan Mobile enterprise orange
 * on the cover, warm cream / terracotta / gold in the body slides.
 */

export const color = {
  ink: '#0C0A09',
  bg: '#15110E',
  bgSoft: '#1D1815',
  panel: 'rgba(246, 242, 237, 0.045)',
  panelStrong: 'rgba(246, 242, 237, 0.075)',
  hair: 'rgba(246, 242, 237, 0.12)',
  hairSoft: 'rgba(246, 242, 237, 0.07)',

  cream: '#F6F2ED',
  sand: '#E5DCD2',
  muted: '#A2968B',
  dim: '#776C63',

  orange: '#F57000',
  amber: '#FFA51F',
  terracotta: '#B5654A',
  gold: '#C39A4E',
  sky: '#63A6E0',
  jade: '#5FB6A0',
} as const;

export const accents = [color.orange, color.terracotta, color.gold] as const;

export const font = {
  /** Latin glyphs use Sora, CJK falls through to Noto Sans TC. */
  display: "'Sora', 'Noto Sans TC', system-ui, sans-serif",
  body: "'Noto Sans TC', 'Sora', system-ui, sans-serif",
} as const;

/** Type scale, tuned for a 1920×1080 canvas. */
export const type = {
  kicker: {fontSize: 25, letterSpacing: '0.34em', fontWeight: 600},
  h1: {fontSize: 112, lineHeight: 1.1, fontWeight: 900, letterSpacing: '0.01em'},
  h2: {fontSize: 72, lineHeight: 1.16, fontWeight: 800, letterSpacing: '0.02em'},
  h3: {fontSize: 40, lineHeight: 1.3, fontWeight: 700},
  h4: {fontSize: 31, lineHeight: 1.35, fontWeight: 700},
  body: {fontSize: 26, lineHeight: 1.72, fontWeight: 400},
  small: {fontSize: 22, lineHeight: 1.6, fontWeight: 500},
  micro: {fontSize: 18, lineHeight: 1.5, fontWeight: 600, letterSpacing: '0.12em'},
} as const;

export const layout = {
  width: 1920,
  height: 1080,
  fps: 30,
  padX: 132,
  padY: 96,
} as const;
