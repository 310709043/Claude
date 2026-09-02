/**
 * ============================================================
 *  動態語彙 — 全片共用的緩動曲線與進場／退場計算
 * ------------------------------------------------------------
 *  電影感的關鍵在於「不是等速」：物件以高初速進場、
 *  在末端極緩地安定下來（easeOutExpo / Quint），
 *  而非 CSS 預設的 ease-in-out。
 * ============================================================
 */
import {Easing, interpolate, spring} from 'remotion';

export const ease = {
  /** 進場主曲線：衝入後極緩安定，最具高級感 */
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  /** 次要進場：柔和但仍有加速度 */
  outQuint: Easing.bezier(0.22, 1, 0.36, 1),
  /** 退場：緩慢起步後加速離開 */
  inQuint: Easing.bezier(0.64, 0, 0.78, 0),
  /** 攝影機運動：兩端都極慢，中段流暢 */
  inOutCine: Easing.bezier(0.65, 0, 0.35, 1),
  /** 微彈跳，僅用於重點強調 */
  outBack: Easing.bezier(0.34, 1.36, 0.64, 1),
  linear: Easing.linear,
} as const;

type Curve = (n: number) => number;

/**
 * 標準進場動畫進度（0 → 1）
 * @param frame 目前影格（相對於元件）
 * @param delay 延遲影格數
 * @param duration 動畫長度
 */
export const enter = (
  frame: number,
  delay: number,
  duration: number,
  easing: Curve = ease.outExpo
) =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/**
 * 退場動畫進度（1 → 0）
 * @param frame 目前影格
 * @param start 開始退場的影格
 * @param duration 退場長度
 */
export const exit = (
  frame: number,
  start: number,
  duration: number,
  easing: Curve = ease.inQuint
) =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/**
 * 進場 × 退場的合成可見度（0 → 1 → 0）。
 * 場景內每個元素都用它，確保沒有任何東西是「硬切」出現或消失的。
 */
export const life = (
  frame: number,
  opts: {
    in: number;
    inDur?: number;
    out: number;
    outDur?: number;
  }
) => {
  const i = enter(frame, opts.in, opts.inDur ?? 26);
  const o = exit(frame, opts.out, opts.outDur ?? 20);
  return i * o;
};

/** 依索引產生錯位延遲，讓群組元素像骨牌般依序進場 */
export const stagger = (index: number, step = 5, base = 0) => base + index * step;

/** 平滑無限漂移（用於背景光暈、粒子），以正弦波避免循環接縫 */
export const drift = (frame: number, period: number, amplitude: number, phase = 0) =>
  Math.sin((frame / period) * Math.PI * 2 + phase) * amplitude;

/** 常用彈簧設定 */
export const springs = {
  /** 沉穩、無過衝 — 用於大型物件 */
  heavy: {damping: 200, mass: 1.2, stiffness: 80},
  /** 標準 UI 進場 */
  soft: {damping: 200, mass: 0.7, stiffness: 110},
  /** 帶輕微過衝 — 用於數字與重點徽章 */
  pop: {damping: 14, mass: 0.6, stiffness: 140},
} as const;

export const springAt = (
  frame: number,
  fps: number,
  delay: number,
  config: {damping: number; mass: number; stiffness: number} = springs.soft
) => spring({frame: frame - delay, fps, config, durationInFrames: undefined});

/**
 * 動態模糊替代方案：以進場速度推導出的 blur 量。
 * 物件高速進場時帶模糊、安定時銳利 —— 這是「電影感」與
 *「PPT 動畫」最直觀的差別。
 */
export const motionBlur = (progress: number, max = 14) =>
  Math.max(0, (1 - progress) ** 2 * max);
