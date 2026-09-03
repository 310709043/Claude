/**
 * Regenerates src/fontData.ts from the woff2 files in public/fonts.
 *
 * The film embeds its typefaces as data URIs rather than fetching them at
 * render time: Remotion drives several browser tabs at once and replaces
 * setTimeout with timeline-driven timers, so a single stalled font request
 * has no way to time out and takes the whole render down with it.
 *
 *   node scripts/embed-fonts.mjs
 */
import {readFileSync, writeFileSync, readdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'public/fonts');

const FACES = [
  ['Noto Sans TC', 400, 'NotoSansTC-Regular.woff2'],
  ['Noto Sans TC', 500, 'NotoSansTC-Medium.woff2'],
  ['Noto Sans TC', 700, 'NotoSansTC-Bold.woff2'],
  ['Noto Sans TC', 900, 'NotoSansTC-Black.woff2'],
  ['Inter', 400, 'Inter-Regular.woff2'],
  ['Inter', 600, 'Inter-SemiBold.woff2'],
  ['Inter', 700, 'Inter-Bold.woff2'],
  ['Inter', 800, 'Inter-ExtraBold.woff2'],
];

const present = new Set(readdirSync(dir));
const missing = FACES.filter(([, , f]) => !present.has(f));
if (missing.length) {
  throw new Error(`Missing font files: ${missing.map((m) => m[2]).join(', ')}`);
}

const rules = FACES.map(([family, weight, file]) => {
  const b64 = readFileSync(join(dir, file)).toString('base64');
  return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
}).join('\n');

writeFileSync(
  join(root, 'src/fontData.ts'),
  `// GENERATED FILE — do not edit by hand.\n` +
    `// Run \`node scripts/embed-fonts.mjs\` after changing public/fonts.\n` +
    `// Subset to the glyphs this film actually uses; see README.\n` +
    `export const FONT_FACE_CSS = ${JSON.stringify(rules)};\n`,
);

console.log(`Embedded ${FACES.length} faces (${(rules.length / 1024) | 0} KB of CSS)`);
