/**
 * 內衣尺碼計算。
 *
 * 下胸圍決定底圍，上胸圍與下胸圍的差值決定罩杯：每 2.5 公分（約 1 吋）跳一級。
 */

const CUPS_TW = ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const CUPS_UK = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G', 'GG', 'H'];
const CUPS_US = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H', 'I', 'J', 'K'];

export type SizeResult = {
  /** 台灣 / 日本 / 歐規（三者標示相同），例如 70C */
  label: string;
  /** 英規，例如 32C */
  uk: string;
  /** 美規，例如 32C */
  us: string;
  /** 罩杯差（公分） */
  diffCm: number;
};

function cup(table: string[], i: number) {
  if (i <= 0) return table[0];
  if (i >= table.length) return `${table[table.length - 1]}+`;
  return table[i];
}

/** 底圍：下胸圍取最接近 5 的倍數 */
export function band(underbust: number) {
  return Math.min(120, Math.max(60, Math.round(underbust / 5) * 5));
}

export function calculate(underbust: number, bust: number): SizeResult {
  const diffCm = bust - underbust;
  const i = Math.round((diffCm - 7.5) / 2.5);
  const metric = band(underbust);
  // 品牌尺碼表慣例：公制 70 = 英吋 32，每 5 公分對應 2 吋
  const inches = (metric - 60) / 5 * 2 + 28;

  return {
    label: `${metric}${cup(CUPS_TW, i)}`,
    uk: `${inches}${cup(CUPS_UK, i)}`,
    us: `${inches}${cup(CUPS_US, i)}`,
    diffCm,
  };
}
