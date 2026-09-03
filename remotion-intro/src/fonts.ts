import {staticFile, continueRender, delayRender} from 'remotion';

/**
 * Fonts are bundled locally (subset to the glyphs this film uses) so a render
 * never depends on the network resolving Google Fonts.
 */
const FACES = [
  {family: 'Noto Sans TC', weight: 400, file: 'fonts/NotoSansTC-Regular.woff2'},
  {family: 'Noto Sans TC', weight: 500, file: 'fonts/NotoSansTC-Medium.woff2'},
  {family: 'Noto Sans TC', weight: 700, file: 'fonts/NotoSansTC-Bold.woff2'},
  {family: 'Noto Sans TC', weight: 900, file: 'fonts/NotoSansTC-Black.woff2'},
  {family: 'Inter', weight: 400, file: 'fonts/Inter-Regular.woff2'},
  {family: 'Inter', weight: 600, file: 'fonts/Inter-SemiBold.woff2'},
  {family: 'Inter', weight: 700, file: 'fonts/Inter-Bold.woff2'},
  {family: 'Inter', weight: 800, file: 'fonts/Inter-ExtraBold.woff2'},
];

/** Give up waiting well before Remotion's own frame timeout would fire. */
const LOAD_BUDGET_MS = 25_000;
const FETCH_TIMEOUT_MS = 8_000;

const fetchFace = async (file: string, attempt = 0): Promise<ArrayBuffer> => {
  const ctrl = new AbortController();
  const bail = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(staticFile(file), {signal: ctrl.signal});
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    return await res.arrayBuffer();
  } catch (err) {
    // A render spins up several browser tabs at once; one stalled request
    // should cost a retry, not the whole render.
    if (attempt < 2) return fetchFace(file, attempt + 1);
    throw err;
  } finally {
    clearTimeout(bail);
  }
};

let started = false;

export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;

  const handle = delayRender('Loading TAIPBX intro typefaces', {
    timeoutInMilliseconds: 60_000,
  });

  // The handle must be released on every path — a typeface that never
  // resolves must not be able to abort an otherwise healthy render.
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    continueRender(handle);
  };
  const budget = setTimeout(release, LOAD_BUDGET_MS);

  Promise.all(
    FACES.map(async ({family, weight, file}) => {
      const buf = await fetchFace(file);
      const face = new FontFace(family, buf, {
        weight: String(weight),
        style: 'normal',
        display: 'block',
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Font load failed, falling back to the system stack', err);
    })
    .finally(() => {
      clearTimeout(budget);
      release();
    });
};
