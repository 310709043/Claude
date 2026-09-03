/**
 * Visual language for the TAIPBX Call Center intro film.
 * Light, warm canvas — deliberately never black — anchored on the
 * Taiwan Mobile (台灣大哥大) brand orange with accents pulled from the
 * facets of the corporate mark.
 */
export const C = {
  ink: '#12151C',
  inkMid: '#3A424F',
  inkSoft: '#6B7484',
  line: '#E3E7EF',
  lineSoft: '#EEF1F7',
  paper: '#FFFFFF',
  canvas: '#F4F6FA',
  canvasWarm: '#FBF7F3',

  orange: '#FF7300',
  orangeDeep: '#E85D00',
  amber: '#FFB020',
  magenta: '#E2318C',
  indigo: '#4B3BE8',
  teal: '#00A88B',
  sky: '#1E8FE0',
} as const;

export const FONT = {
  sans: '"Noto Sans TC","Inter","PingFang TC","Microsoft JhengHei",sans-serif',
  latin: '"Inter","Noto Sans TC",sans-serif',
} as const;

/** Accent ramp used for ordered items (stages, cards, chips). */
export const RAMP = [C.orange, C.magenta, C.indigo, C.teal, C.amber, C.sky];

export const FPS = 30;
