/**
 * Pixel sprite engine — ASCII art → canvas → cached data URL.
 *
 * Sprites are multi-line strings where each character is one pixel.
 * "." or " " = transparent.  Any other char is a palette key.
 */

export type Palette = Record<string, string | undefined>;

const cache = new Map<string, string>();

export function spriteSize(sprite: string) {
  const lines = sprite.replace(/^\n+/, '').replace(/\n+$/, '').split('\n');
  return { w: Math.max(...lines.map((l) => l.length)), h: lines.length };
}

export function spriteToCanvas(sprite: string, palette: Palette): HTMLCanvasElement {
  const lines = sprite.replace(/^\n+/, '').replace(/\n+$/, '').split('\n');
  const h = lines.length;
  const w = Math.max(...lines.map((l) => l.length));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  for (let y = 0; y < h; y++) {
    const row = lines[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const col = palette[ch];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

export function spriteToDataURL(sprite: string, palette: Palette): string {
  const key = sprite + '|' + JSON.stringify(palette);
  const hit = cache.get(key);
  if (hit) return hit;
  if (typeof document === 'undefined') return '';
  const url = spriteToCanvas(sprite, palette).toDataURL();
  cache.set(key, url);
  return url;
}
