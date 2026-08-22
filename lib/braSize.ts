/**
 * 內衣尺寸計算核心邏輯（純函式，無副作用，可單獨測試）
 *
 * 名詞：
 *   underbust 下胸圍：乳房下緣、肋骨最貼合處一圈（皮尺拉緊）
 *   bust      上胸圍：乳頭最高點一圈（皮尺自然貼合、不壓迫）
 *   leanBust  俯身上胸圍：身體前傾 90° 時的上胸圍（軟組織自然垂下，較能反映真實杯容量）
 */

export const CM_PER_IN = 2.54;

export type Unit = 'cm' | 'in';

export type Measurements = {
  /** 下胸圍（公分） */
  underbust: number;
  /** 上胸圍（公分，站姿） */
  bust: number;
  /** 俯身 90° 上胸圍（公分，選填） */
  leanBust?: number | null;
};

export type SizeResult = {
  /** 台灣 / 日本（2.5cm 級距） */
  tw: { band: number; cup: string; label: string };
  /** 歐規（2cm 級距，德/北歐常見） */
  eu: { band: number; cup: string; label: string };
  /** 法規 = 歐規 + 15 */
  fr: { band: number; cup: string; label: string };
  /** 英規（吋，對照多數品牌尺碼表） */
  uk: { band: number; cup: string; label: string };
  /** 美規（吋，對照多數品牌尺碼表） */
  us: { band: number; cup: string; label: string };
  /** 英美「實測法」：底圍直接取實際下胸圍吋數，歐美專業內衣店常用 */
  modern: { band: number; cup: string; label: string };
  /** 實際採用的上胸圍（若有俯身值則取平均） */
  effectiveBust: number;
  /** 罩杯差（公分） */
  diffCm: number;
  /** 罩杯差（吋） */
  diffIn: number;
  /** 姊妹尺碼（台灣制），杯容量相近、底圍不同；罩杯已在 AA 以下時為 null */
  sisters: { tighter: string; looser: string } | null;
  /** 提醒與注意事項 */
  notes: string[];
};

/** 台/日：AA 起跳，每 2.5cm 一個罩杯 */
const TW_CUPS = ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
/** 歐規：字母與台/日制相同（品牌尺碼表慣例：EU 75B = JP 75B = FR 90B） */
const EU_CUPS = ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
/** 英規：每 1 吋一個罩杯，含 DD / FF / GG / HH 等雙字母 */
const UK_CUPS = [
  'AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G', 'GG', 'H', 'HH', 'J', 'JJ', 'K',
];
/** 美規：每 1 吋一個罩杯，DD / DDD 之後接 G */
const US_CUPS = [
  'AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function cupAt(table: string[], index: number) {
  if (index <= 0) return table[0];
  if (index >= table.length) return `${table[table.length - 1]}+`;
  return table[index];
}

export function cmToIn(cm: number) {
  return cm / CM_PER_IN;
}

export function inToCm(inch: number) {
  return inch * CM_PER_IN;
}

/** 台/日/歐 底圍：下胸圍四捨五入到最接近的 5 的倍數 */
export function metricBand(underbustCm: number) {
  return clamp(Math.round(underbustCm / 5) * 5, 60, 120);
}

/** 英/美 底圍：下胸圍（吋）取最接近的偶數 */
export function imperialBand(underbustCm: number) {
  const inches = cmToIn(underbustCm);
  return clamp(Math.round(inches / 2) * 2, 24, 54);
}

/**
 * 品牌尺碼表慣用的英吋底圍：公制底圍直接對照（60→28、65→30、70→32 …），
 * 等同於「下胸圍吋數 + 4」的傳統加吋法，目前多數品牌尺碼表仍採用。
 */
export function chartBand(underbustCm: number) {
  return (metricBand(underbustCm) - 60) / 5 * 2 + 28;
}

/** 台/日 罩杯索引：AA = 7.5cm，之後每 2.5cm 一杯 */
export function twCupIndex(diffCm: number) {
  return Math.round((diffCm - 7.5) / 2.5);
}

/**
 * 歐規 罩杯索引。
 *
 * 註：EN 13402 這類規範是以 2 公分為級距（AA = 10–12cm、A = 12–14cm…），
 * 但實務上歐洲品牌的尺碼表與台/日制的字母是對齊的（EU 75B = JP 75B），
 * 因此這裡採用品牌尺碼表的慣例，直接沿用同一個級數；
 * 少數品牌可能因為採用規範定義而差一個罩杯，試穿時多帶一個尺碼即可。
 */
export function euCupIndex(diffCm: number) {
  return twCupIndex(diffCm);
}

/** 英/美 罩杯索引：上胸圍(吋) − 底圍(吋)，1 吋 = A */
export function imperialCupIndex(bustCm: number, bandIn: number) {
  return Math.round(cmToIn(bustCm) - bandIn);
}

export type ValidationIssue = { field: 'underbust' | 'bust' | 'leanBust' | 'form'; message: string };

/** 輸入檢查：回傳所有不合理之處，空陣列代表可以計算 */
export function validate(m: Partial<Measurements>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const { underbust, bust, leanBust } = m;

  if (underbust == null || Number.isNaN(underbust)) {
    issues.push({ field: 'underbust', message: '請輸入下胸圍' });
  } else if (underbust < 55 || underbust > 130) {
    issues.push({ field: 'underbust', message: '下胸圍請介於 55–130 公分之間' });
  }

  if (bust == null || Number.isNaN(bust)) {
    issues.push({ field: 'bust', message: '請輸入上胸圍' });
  } else if (bust < 60 || bust > 170) {
    issues.push({ field: 'bust', message: '上胸圍請介於 60–170 公分之間' });
  }

  if (leanBust != null && !Number.isNaN(leanBust) && (leanBust < 60 || leanBust > 180)) {
    issues.push({ field: 'leanBust', message: '俯身上胸圍請介於 60–180 公分之間' });
  }

  if (
    underbust != null && bust != null &&
    !Number.isNaN(underbust) && !Number.isNaN(bust) &&
    bust < underbust
  ) {
    issues.push({ field: 'form', message: '上胸圍不應小於下胸圍，請確認兩個數字有沒有寫反' });
  }

  return issues;
}

export function calculate(m: Measurements): SizeResult {
  const underbust = m.underbust;
  const lean = m.leanBust != null && !Number.isNaN(m.leanBust) ? m.leanBust : null;

  // 有俯身值時取「站姿 × 俯身」平均，較貼近真實杯容量
  const effectiveBust = lean ? (m.bust + lean) / 2 : m.bust;
  const diffCm = effectiveBust - underbust;
  const diffIn = cmToIn(diffCm);

  const mBand = metricBand(underbust);
  const iBand = imperialBand(underbust);

  const cBand = chartBand(underbust);
  const twIdx = twCupIndex(diffCm);

  const twCup = cupAt(TW_CUPS, twIdx);
  const euCup = cupAt(EU_CUPS, twIdx);
  // 台/日（2.5cm）與英/美（1 吋 ≈ 2.54cm）的罩杯級距幾乎相同，
  // 差別只在字母排列，因此依同一個級數對照，結果與品牌尺碼表一致。
  const ukCup = cupAt(UK_CUPS, twIdx);
  const usCup = cupAt(US_CUPS, twIdx);
  const modernCup = cupAt(UK_CUPS, imperialCupIndex(effectiveBust, iBand));

  // 姊妹尺碼：底圍 −5cm 罩杯升一級、底圍 +5cm 罩杯降一級（杯容量相近）
  const sisters =
    twIdx > 0
      ? {
          tighter: `${clamp(mBand - 5, 60, 120)}${cupAt(TW_CUPS, twIdx + 1)}`,
          looser: `${clamp(mBand + 5, 60, 120)}${cupAt(TW_CUPS, twIdx - 1)}`,
        }
      : null;

  const notes: string[] = [];
  if (diffCm < 7.5) {
    notes.push('罩杯差小於 7.5 公分，落在 AA 以下；可考慮小尺碼專門品牌，或有集中效果的款式。');
  }
  if (twIdx >= TW_CUPS.length - 2) {
    notes.push('罩杯偏大，一般開架尺碼可能不齊全，建議找有提供 G 罩杯以上的專門店試穿。');
  }
  if (Math.abs(underbust - mBand) >= 2.4) {
    notes.push(
      `下胸圍 ${underbust.toFixed(1)} 公分剛好落在 ${clamp(mBand - 5, 60, 120)} 與 ${mBand} 的中間，兩個底圍都建議試穿看看。`,
    );
  }
  if (lean && Math.abs(m.bust - lean) >= 4) {
    notes.push('站姿與俯身的上胸圍相差較大，代表胸型較柔軟；以俯身值為主的罩杯通常更合身。');
  }
  notes.push('尺碼只是起點，不同品牌、不同版型的落差可達一個罩杯，實際仍以試穿為準。');

  return {
    tw: { band: mBand, cup: twCup, label: `${mBand}${twCup}` },
    eu: { band: mBand, cup: euCup, label: `${mBand}${euCup}` },
    fr: { band: mBand + 15, cup: euCup, label: `${mBand + 15}${euCup}` },
    uk: { band: cBand, cup: ukCup, label: `${cBand}${ukCup}` },
    us: { band: cBand, cup: usCup, label: `${cBand}${usCup}` },
    modern: { band: iBand, cup: modernCup, label: `${iBand}${modernCup}` },
    effectiveBust,
    diffCm,
    diffIn,
    sisters,
    notes,
  };
}

/** 罩杯差 ↔ 罩杯字母對照（依品牌尺碼表慣用的字母對應） */
export const CUP_TABLE = TW_CUPS.slice(0, 11).map((cup, i) => ({
  /** 台 / 日 / 歐 共用的字母 */
  tw: cup,
  diffCm: 7.5 + i * 2.5,
  uk: cupAt(UK_CUPS, i),
  us: cupAt(US_CUPS, i),
}));

/** 公制 ↔ 英吋底圍對照（品牌尺碼表 vs 實測法） */
export const BAND_TABLE = [60, 65, 70, 75, 80, 85, 90, 95, 100].map((band) => ({
  metric: band,
  underbustRange: `${band - 2.5}–${band + 2.5}`,
  chartIn: (band - 60) / 5 * 2 + 28,
  modernIn: imperialBand(band),
}));
