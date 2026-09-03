import {continueRender, delayRender} from 'remotion';
import {EMBEDDED_FACES} from './fontData';

/**
 * Typefaces ship inside the bundle as base64 woff2 (see
 * scripts/embed-fonts.mjs) and are handed to FontFace as an in-memory buffer.
 *
 * Nothing here can stall: there is no request to hang, and no CSS @font-face
 * for the engine to resolve lazily on first paint. That matters because a
 * render drives several browser tabs at once and Remotion replaces setTimeout
 * with timeline-driven timers — a stalled load would have no way to time out,
 * and would take the whole render down with it.
 */
const decode = (b64: string): ArrayBuffer => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
};

let started = false;

export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;

  // `retries` is the last-resort escape hatch: if a renderer tab ever wedges,
  // Remotion re-renders that frame in a fresh page rather than failing the job.
  const handle = delayRender('Loading TAIPBX intro typefaces', {
    timeoutInMilliseconds: 20_000,
    retries: 3,
  });

  Promise.all(
    EMBEDDED_FACES.map(async ({family, weight, data}) => {
      const face = new FontFace(family, decode(data), {
        weight: String(weight),
        style: 'normal',
        display: 'block',
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .catch((err) => {
      // Never hard-fail a render on a typeface; fall back to the stack.
      // eslint-disable-next-line no-console
      console.warn('Font load failed, falling back to the system stack', err);
    })
    .then(() => continueRender(handle));
};
