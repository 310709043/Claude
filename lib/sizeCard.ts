/**
 * 尺碼卡：把量測結果畫成一張可以存下來的圖。
 * 純 Canvas 繪製，不依賴框架，網站與單頁版共用同一套版型。
 */

export type TemplateId = 'cream' | 'rouge' | 'ink';

export type CardData = {
  /** 尺碼，例如 70C */
  label: string;
  underbust: number;
  bust: number;
  diffCm: number;
  /** 顯示用日期，例如 2026-08-22 */
  date: string;
};

type Theme = {
  name: string;
  bg: string;
  ink: string;
  muted: string;
  accent: string;
  /** 大尺碼文字用主色還是墨色 */
  sizeColor: 'accent' | 'ink';
};

export const TEMPLATES: Record<TemplateId, Theme> = {
  cream: {
    name: '奶油紙',
    bg: '#f6f1e8',
    ink: '#2e2a24',
    muted: '#8b8271',
    accent: '#a8574b',
    sizeColor: 'ink',
  },
  rouge: {
    name: '胭脂印',
    bg: '#fdf0f2',
    ink: '#4a2530',
    muted: '#a37983',
    accent: '#c9385c',
    sizeColor: 'accent',
  },
  ink: {
    name: '墨夜',
    bg: '#14121a',
    ink: '#efe9e4',
    muted: '#8d8595',
    accent: '#d8b26a',
    sizeColor: 'ink',
  },
};

const W = 1080;
const H = 1350;
const PAD = 96;

const SERIF = '"Noto Serif TC", Georgia, serif';
const SANS = '"Noto Sans TC", system-ui, sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, monospace';

/** 字距沒有原生支援，手動一個字一個字畫 */
function trackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
) {
  let cursor = x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
}

function trackedWidth(ctx: CanvasRenderingContext2D, text: string, spacing: number) {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + spacing;
  return w - spacing;
}

/** 網點：只在胭脂印版型的右下出現，刻意避開頁尾文字 */
function halftone(ctx: CanvasRenderingContext2D, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.16;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const x = W - PAD - col * 26;
      const y = H - PAD - 150 - row * 26;
      const r = 7 - Math.max(row, col) * 0.6;
      if (r <= 0.5) continue;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

export function drawCard(canvas: HTMLCanvasElement, data: CardData, id: TemplateId) {
  const t = TEMPLATES[id];
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = t.bg;
  ctx.fillRect(0, 0, W, H);

  if (id === 'rouge') halftone(ctx, t.accent);

  if (id === 'ink') {
    ctx.strokeStyle = t.accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, W - 80, H - 80);
  }

  // 抬頭
  ctx.fillStyle = t.accent;
  ctx.font = `500 26px ${SANS}`;
  ctx.textBaseline = 'alphabetic';
  trackedText(ctx, '內衣尺碼', PAD, PAD + 30, 9);

  // 主角：尺碼
  ctx.fillStyle = t.sizeColor === 'accent' ? t.accent : t.ink;
  ctx.font = `700 260px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.fillText(data.label, W / 2, H / 2 + 20);
  ctx.textAlign = 'left';

  // 尺碼下方的細線
  const ruleY = H / 2 + 90;
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(PAD, ruleY);
  ctx.lineTo(W - PAD, ruleY);
  ctx.stroke();
  if (id === 'cream') {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD, ruleY + 10);
    ctx.lineTo(W - PAD, ruleY + 10);
    ctx.stroke();
  }

  // 量測數字
  const rows: [string, string][] = [
    ['下胸圍', `${data.underbust} 公分`],
    ['上胸圍', `${data.bust} 公分`],
    ['罩杯差', `${data.diffCm.toFixed(1)} 公分`],
  ];
  let y = ruleY + 88;
  for (const [k, v] of rows) {
    ctx.fillStyle = t.muted;
    ctx.font = `400 30px ${SANS}`;
    ctx.fillText(k, PAD, y);
    ctx.fillStyle = t.ink;
    ctx.font = `500 32px ${MONO}`;
    ctx.textAlign = 'right';
    ctx.fillText(v, W - PAD, y);
    ctx.textAlign = 'left';
    y += 58;
  }

  // 頁尾
  ctx.fillStyle = t.muted;
  ctx.font = `400 26px ${SERIF}`;
  ctx.fillText('量身紀錄', PAD, H - PAD);
  ctx.textAlign = 'right';
  ctx.font = `400 26px ${MONO}`;
  ctx.fillText(data.date, W - PAD, H - PAD);
  ctx.textAlign = 'left';
}

/** 等字體載入完成再畫，否則會退回系統字型 */
export async function readyForCard() {
  if (typeof document === 'undefined' || !document.fonts) return;
  await Promise.all([
    document.fonts.load(`700 260px ${MONO}`),
    document.fonts.load(`500 32px ${MONO}`),
    document.fonts.load(`400 30px ${SANS}`),
    document.fonts.load(`400 26px ${SERIF}`),
  ]).catch(() => undefined);
  await document.fonts.ready;
}
