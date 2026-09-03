/**
 * Regenerates src/fontData.ts from the woff2 files in public/fonts.
 *
 * The film carries its typefaces as base64 in the bundle rather than fetching
 * them at render time. Remotion drives several browser tabs at once and
 * replaces setTimeout with timeline-driven timers, so anything that can stall
 * — a request, or a CSS @font-face the engine only fetches lazily when the
 * glyph is first painted — has no way to time out, and takes the render down
 * with it. Decoding a buffer we already hold cannot stall.
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

const entries = FACES.map(([family, weight, file]) => ({
  family,
  weight,
  data: readFileSync(join(dir, file)).toString('base64'),
}));

const body = entries
  .map(
    (e) =>
      `  {family: ${JSON.stringify(e.family)}, weight: ${e.weight}, data: ${JSON.stringify(e.data)}},`,
  )
  .join('\n');

writeFileSync(
  join(root, 'src/fontData.ts'),
  `// GENERATED FILE — do not edit by hand.\n` +
    `// Run \`node scripts/embed-fonts.mjs\` after changing public/fonts.\n` +
    `// woff2, subset to the glyphs this film actually uses; see README.\n` +
    `export type EmbeddedFace = {family: string; weight: number; data: string};\n\n` +
    `export const EMBEDDED_FACES: EmbeddedFace[] = [\n${body}\n];\n`,
);

const kb = entries.reduce((n, e) => n + e.data.length, 0) / 1024;
console.log(`Embedded ${entries.length} faces (${kb | 0} KB base64)`);
