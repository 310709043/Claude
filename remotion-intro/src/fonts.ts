import {continueRender, delayRender} from 'remotion';
import {FONT_FACE_CSS} from './fontData';

/**
 * Typefaces are embedded as data URIs (see scripts/embed-fonts.mjs) and
 * injected as plain CSS, so a render never waits on the network — or on a
 * timer, which Remotion drives from the timeline rather than the clock.
 *
 * `document.fonts.ready` still settles asynchronously, so one delayRender
 * handle keeps the first frame from being captured mid-swap.
 */
let started = false;

export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;

  const style = document.createElement('style');
  style.setAttribute('data-taipbx-fonts', '');
  style.textContent = FONT_FACE_CSS;
  document.head.appendChild(style);

  const handle = delayRender('Loading TAIPBX intro typefaces');
  Promise.all([
    document.fonts.load('900 100px "Noto Sans TC"'),
    document.fonts.load('700 100px "Noto Sans TC"'),
    document.fonts.load('500 100px "Noto Sans TC"'),
    document.fonts.load('400 100px "Noto Sans TC"'),
    document.fonts.load('800 100px "Inter"'),
    document.fonts.load('700 100px "Inter"'),
    document.fonts.load('600 100px "Inter"'),
    document.fonts.load('400 100px "Inter"'),
  ])
    .catch((err) => {
      // Never hard-fail a render on a typeface; fall back to the stack.
      // eslint-disable-next-line no-console
      console.warn('Font load failed, falling back to the system stack', err);
    })
    .then(() => continueRender(handle));
};
