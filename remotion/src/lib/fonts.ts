import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * Self-hosted, subsetted webfonts (see scripts/build-fonts.py).
 * `loadFont` registers a delayRender() handle per face, so the renderer waits
 * for every weight before capturing frame 0.
 */
const faces = [
  {family: 'Noto Sans TC', weight: '400', file: 'fonts/NotoSansTC-400.woff2'},
  {family: 'Noto Sans TC', weight: '500', file: 'fonts/NotoSansTC-500.woff2'},
  {family: 'Noto Sans TC', weight: '700', file: 'fonts/NotoSansTC-700.woff2'},
  {family: 'Noto Sans TC', weight: '900', file: 'fonts/NotoSansTC-900.woff2'},
  {family: 'Sora', weight: '400', file: 'fonts/Sora-400.woff2'},
  {family: 'Sora', weight: '600', file: 'fonts/Sora-600.woff2'},
  {family: 'Sora', weight: '800', file: 'fonts/Sora-800.woff2'},
];

let started = false;

export const loadFonts = () => {
  if (started) {
    return;
  }
  started = true;
  for (const face of faces) {
    void loadFont({
      family: face.family,
      url: staticFile(face.file),
      weight: face.weight,
      style: 'normal',
      display: 'block',
    });
  }
};
