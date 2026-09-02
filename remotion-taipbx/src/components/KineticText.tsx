import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ease, enter, exit, motionBlur} from '../anim';
import {FONT_TC} from '../fonts';
import {palette} from '../theme';

type Common = {
  style?: React.CSSProperties;
  className?: string;
};

/* ============================================================
 *  1. SplitText — 逐字進場
 *  中文以「字」為單位、英文以「詞」為單位切分，
 *  每個單位帶著位移 + 模糊 + 透明度依序安定。
 * ============================================================ */
export const SplitText: React.FC<
  Common & {
    text: string;
    /** 起始影格 */
    delay?: number;
    /** 每個字的間隔影格 */
    stagger?: number;
    /** 單字動畫長度 */
    duration?: number;
    /** 進場方向 */
    from?: 'below' | 'above' | 'scale';
    /** 退場起始影格（不給則不退場） */
    outAt?: number;
    outDuration?: number;
  }
> = ({
  text,
  delay = 0,
  stagger = 2.2,
  duration = 34,
  from = 'below',
  outAt,
  outDuration = 18,
  style,
}) => {
  const frame = useCurrentFrame();
  const chars = useMemo(() => Array.from(text), [text]);

  return (
    <span style={{display: 'inline-block', ...style}}>
      {chars.map((ch, i) => {
        if (ch === '\n') return <br key={`br-${i}`} />;
        const d = delay + i * stagger;
        const p = enter(frame, d, duration, ease.outExpo);
        const o = outAt === undefined ? 1 : exit(frame, outAt + i * (stagger * 0.4), outDuration);

        const ty = from === 'below' ? (1 - p) * 34 : from === 'above' ? (p - 1) * 34 : 0;
        const sc = from === 'scale' ? interpolate(p, [0, 1], [1.28, 1]) : 1;
        const blur = motionBlur(p, 10);

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: ch === ' ' ? 'pre' : undefined,
              opacity: p * o,
              transform: `translateY(${ty}px) scale(${sc})`,
              filter: blur > 0.15 ? `blur(${blur}px)` : undefined,
              willChange: 'transform, opacity, filter',
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

/* ============================================================
 *  2. MaskReveal — 遮罩揭示
 *  文字從一道看不見的邊界後方被「擦」出來，
 *  比淡入高級得多，是精品廣告最常用的文字入場。
 * ============================================================ */
export const MaskReveal: React.FC<
  Common & {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    /** 同時讓內容輕微上移，增加重量感 */
    lift?: number;
    outAt?: number;
    outDuration?: number;
  }
> = ({
  children,
  delay = 0,
  duration = 38,
  direction = 'up',
  lift = 20,
  outAt,
  outDuration = 20,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, delay, duration, ease.outExpo);
  const o = outAt === undefined ? 1 : exit(frame, outAt, outDuration);
  const hidden = (1 - p) * 100;

  const clip =
    direction === 'up'
      ? `inset(${hidden}% 0% 0% 0%)`
      : direction === 'down'
      ? `inset(0% 0% ${hidden}% 0%)`
      : direction === 'left'
      ? `inset(0% ${hidden}% 0% 0%)`
      : `inset(0% 0% 0% ${hidden}%)`;

  const ty = direction === 'up' ? (1 - p) * lift : direction === 'down' ? -(1 - p) * lift : 0;

  return (
    <span
      style={{
        display: 'inline-block',
        clipPath: clip,
        transform: `translateY(${ty}px)`,
        opacity: o,
        willChange: 'clip-path, transform',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/* ============================================================
 *  3. LineSweep — 文字底下掃過一道品牌色光線
 * ============================================================ */
export const LineSweep: React.FC<{
  delay?: number;
  duration?: number;
  width?: number | string;
  height?: number;
  color?: string;
  outAt?: number;
}> = ({delay = 0, duration = 44, width = '100%', height = 2, color = palette.primary, outAt}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, delay, duration, ease.outExpo);
  const o = outAt === undefined ? 1 : exit(frame, outAt, 16);

  return (
    <div
      style={{
        width,
        height,
        opacity: o,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'left center',
          transform: `scaleX(${p})`,
          background: `linear-gradient(90deg, ${color} 0%, ${palette.primaryLight} 55%, rgba(255,178,122,0) 100%)`,
          boxShadow: `0 0 12px ${palette.glow}, 0 0 34px ${palette.glowSoft}`,
        }}
      />
    </div>
  );
};

/* ============================================================
 *  4. Kicker — 寬字距英文小標
 *  高級廣告的標配：中文大標之上一行極寬字距的英文，
 *  瞬間拉開版面的呼吸感與國際感。
 * ============================================================ */
export const Kicker: React.FC<
  Common & {text: string; delay?: number; outAt?: number; color?: string}
> = ({text, delay = 0, outAt, color = palette.primary, style}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, delay, 40, ease.outQuint);
  const o = outAt === undefined ? 1 : exit(frame, outAt, 18);
  // 字距由寬收窄地安定下來
  const ls = interpolate(p, [0, 1], [0.72, 0.42]);

  return (
    <div
      style={{
        opacity: p * o,
        letterSpacing: `${ls}em`,
        color,
        transform: `translateY(${(1 - p) * 10}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/* ============================================================
 *  5. Paragraph — 中文正文的整段揭示
 *  逐字對長段落太吵；改以行為單位做遮罩揭示。
 * ============================================================ */
export const Paragraph: React.FC<
  Common & {
    text: string;
    delay?: number;
    lineStagger?: number;
    outAt?: number;
  }
> = ({text, delay = 0, lineStagger = 6, outAt, style}) => {
  const lines = useMemo(() => text.split('\n'), [text]);

  return (
    <div style={{fontFamily: FONT_TC, ...style}}>
      {lines.map((line, i) => (
        <div key={i} style={{overflow: 'hidden'}}>
          <MaskReveal
            delay={delay + i * lineStagger}
            duration={40}
            lift={14}
            outAt={outAt === undefined ? undefined : outAt + i * 3}
          >
            {line}
          </MaskReveal>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
 *  6. CountUp — 數字滾動
 * ============================================================ */
export const CountUp: React.FC<
  Common & {
    to: number;
    delay?: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
  }
> = ({to, delay = 0, duration = 52, suffix = '', prefix = '', decimals = 0, style}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, delay, duration, ease.outExpo);
  const v = (to * p).toFixed(decimals);
  return (
    <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {prefix}
      {v}
      {suffix}
    </span>
  );
};
