// Render offline: gstatic.com is unreachable in this environment, so we rely on
// fonts installed in the system fontconfig. Latin glyphs come from Liberation
// Sans (clean Arial-metric face); CJK falls through to WenQuanYi Zen Hei
// (文泉驛正黑), a Traditional-Chinese Hei face shipped on the machine.
export const FONT =
  '"Liberation Sans", "WenQuanYi Zen Hei", "Noto Sans CJK TC", sans-serif';
export const MONO =
  '"Liberation Mono", "WenQuanYi Zen Hei", ui-monospace, monospace';
