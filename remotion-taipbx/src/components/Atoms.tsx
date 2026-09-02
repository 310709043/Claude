import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ease, enter, exit, springAt, springs} from '../anim';
import {FONT_LATIN, FONT_TC} from '../fonts';
import {palette, tracking, type} from '../theme';

/* ---------- 巨型序號 01 / 02 —— 版面的節奏錨點 ---------- */
export const Numeral: React.FC<{
  value: string;
  delay?: number;
  outAt?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({value, delay = 0, outAt, size = type.numeral, style}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, delay, 46, ease.outExpo);
  const o = outAt === undefined ? 1 : exit(frame, outAt, 18);

  return (
    <div
      style={{
        fontFamily: FONT_LATIN,
        fontSize: size,
        fontWeight: 900,
        letterSpacing: tracking.numeral,
        lineHeight: 0.82,
        // 空心描邊字：只在畫面上留下輪廓，不與主標題爭焦點
        color: 'transparent',
        WebkitTextStroke: `1.6px ${palette.primary}`,
        opacity: p * o * 0.5,
        transform: `translateY(${(1 - p) * 26}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        filter: `drop-shadow(0 0 24px ${palette.glowSoft})`,
        ...style,
      }}
    >
      {value}
    </div>
  );
};

/* ---------- 玻璃面板 ---------- */
export const Panel: React.FC<{
  children: React.ReactNode;
  delay?: number;
  outAt?: number;
  accent?: string;
  style?: React.CSSProperties;
  /** 左側是否有品牌色光條 */
  bar?: boolean;
}> = ({children, delay = 0, outAt, accent = palette.primary, style, bar = true}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, delay, 42, ease.outExpo);
  const o = outAt === undefined ? 1 : exit(frame, outAt, 20);

  return (
    <div
      style={{
        position: 'relative',
        padding: '34px 40px',
        borderRadius: 4,
        background: `linear-gradient(145deg, rgba(36,34,32,0.78) 0%, rgba(20,18,16,0.55) 100%)`,
        border: `1px solid ${palette.edgeSoft}`,
        boxShadow: `0 28px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)`,
        backdropFilter: 'blur(14px)',
        opacity: p * o,
        transform: `translateY(${(1 - p) * 30}px)`,
        clipPath: `inset(0% ${(1 - p) * 100}% 0% 0%)`,
        ...style,
      }}
    >
      {bar && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: `linear-gradient(to bottom, ${accent}, rgba(255,97,0,0.06))`,
            boxShadow: `0 0 16px ${palette.glow}`,
            transformOrigin: 'top',
            transform: `scaleY(${enter(frame, delay + 6, 40, ease.outExpo)})`,
          }}
        />
      )}
      {children}
    </div>
  );
};

/* ---------- 段落標題組（英文小標 + 中文大標 + 光線） ---------- */
export const SectionTitle: React.FC<{
  kicker: string;
  title: string;
  subtitle?: string;
  delay?: number;
  outAt?: number;
  align?: 'left' | 'center';
  style?: React.CSSProperties;
}> = ({kicker, title, subtitle, delay = 0, outAt, align = 'center', style}) => {
  const frame = useCurrentFrame();
  const kp = enter(frame, delay, 40, ease.outQuint);
  const ko = outAt === undefined ? 1 : exit(frame, outAt, 18);
  const lp = enter(frame, delay + 10, 50, ease.outExpo);

  return (
    <div
      style={{
        textAlign: align,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: FONT_LATIN,
          fontSize: type.kicker,
          fontWeight: 600,
          letterSpacing: `${interpolate(kp, [0, 1], [0.9, 0.42])}em`,
          color: palette.primary,
          opacity: kp * ko,
          transform: `translateY(${(1 - kp) * 12}px)`,
          marginBottom: 22,
        }}
      >
        {kicker}
      </div>

      <TitleLines text={title} delay={delay + 8} outAt={outAt} />

      {subtitle && (
        <div
          style={{
            fontFamily: FONT_TC,
            fontSize: type.subtitle,
            fontWeight: 400,
            color: palette.textMid,
            letterSpacing: tracking.body,
            marginTop: 18,
            opacity: enter(frame, delay + 26, 40, ease.outQuint) * ko,
            transform: `translateY(${(1 - enter(frame, delay + 26, 40)) * 14}px)`,
          }}
        >
          {subtitle}
        </div>
      )}

      <div
        style={{
          marginTop: 30,
          width: 168,
          height: 2,
          transformOrigin: align === 'center' ? 'center' : 'left',
          transform: `scaleX(${lp})`,
          opacity: ko,
          background: `linear-gradient(90deg, rgba(255,97,0,0) 0%, ${palette.primary} 50%, rgba(255,97,0,0) 100%)`,
          boxShadow: `0 0 14px ${palette.glow}`,
        }}
      />
    </div>
  );
};

/** 大標：逐字遮罩揭示 + 極輕微的字距收攏 */
const TitleLines: React.FC<{text: string; delay: number; outAt?: number}> = ({
  text,
  delay,
  outAt,
}) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text);

  return (
    <div
      style={{
        fontFamily: FONT_TC,
        fontSize: type.display,
        fontWeight: 900,
        lineHeight: 1.14,
        color: palette.textHi,
        letterSpacing: tracking.display,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'inherit',
      }}
    >
      {chars.map((c, i) => {
        const d = delay + i * 2.4;
        const p = enter(frame, d, 40, ease.outExpo);
        const o = outAt === undefined ? 1 : exit(frame, outAt + i * 1.2, 16);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              opacity: p * o,
              transform: `translateY(${(1 - p) * 30}px)`,
              filter: p < 0.98 ? `blur(${(1 - p) * 9}px)` : undefined,
              textShadow: `0 0 46px rgba(255,97,0,${0.22 * p})`,
            }}
          >
            {c === ' ' ? ' ' : c}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- 品牌標誌鎖定組 ---------- */
export const BrandMark: React.FC<{
  name: string;
  product?: string;
  latin?: string;
  delay?: number;
  size?: number;
  align?: 'left' | 'center';
}> = ({name, product, latin, delay = 0, size = type.hero, align = 'center'}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, delay, 54, ease.outExpo);
  const glow = enter(frame, delay + 14, 60, ease.outQuint);
  // 字距由極寬收攏至設計值 —— 品牌名進場最經典的一手
  const ls = interpolate(p, [0, 1], [0.36, -0.03]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      <div
        style={{
          fontFamily: FONT_LATIN,
          fontSize: size,
          fontWeight: 900,
          letterSpacing: `${ls}em`,
          color: palette.textHi,
          opacity: p,
          lineHeight: 1,
          textShadow: `0 0 ${40 * glow}px rgba(255,97,0,${0.5 * glow}), 0 0 ${
            110 * glow
          }px rgba(255,97,0,${0.26 * glow})`,
          filter: p < 0.99 ? `blur(${(1 - p) * 14}px)` : undefined,
        }}
      >
        {name}
      </div>

      {product && (
        <div
          style={{
            fontFamily: FONT_TC,
            fontSize: size * 0.42,
            fontWeight: 700,
            color: palette.primary,
            letterSpacing: '0.06em',
            marginTop: size * 0.13,
            opacity: enter(frame, delay + 22, 44, ease.outQuint),
            transform: `translateY(${(1 - enter(frame, delay + 22, 44)) * 18}px)`,
            textShadow: `0 0 30px ${palette.glow}`,
          }}
        >
          {product}
        </div>
      )}

      {latin && (
        <div
          style={{
            fontFamily: FONT_LATIN,
            fontSize: size * 0.13,
            fontWeight: 500,
            color: palette.textLow,
            letterSpacing: '0.52em',
            marginTop: size * 0.14,
            opacity: enter(frame, delay + 34, 44, ease.outQuint) * 0.9,
          }}
        >
          {latin}
        </div>
      )}
    </div>
  );
};

/* ---------- 光暈徽章：用於「一體機」等關鍵詞的強調 ---------- */
export const GlowBadge: React.FC<{
  label: string;
  delay?: number;
  outAt?: number;
  color?: string;
  fps: number;
}> = ({label, delay = 0, outAt, color = palette.primary, fps}) => {
  const frame = useCurrentFrame();
  const s = springAt(frame, fps, delay, springs.pop);
  const o = outAt === undefined ? 1 : exit(frame, outAt, 16);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 20px',
        borderRadius: 2,
        border: `1px solid ${color}`,
        background: `linear-gradient(135deg, rgba(255,97,0,0.18), rgba(255,97,0,0.04))`,
        color: palette.ember,
        fontFamily: FONT_TC,
        fontSize: type.caption,
        fontWeight: 700,
        letterSpacing: '0.12em',
        opacity: Math.min(1, s) * o,
        transform: `scale(${interpolate(Math.min(s, 1.2), [0, 1], [0.82, 1])})`,
        boxShadow: `0 0 26px ${palette.glowSoft}, inset 0 0 18px rgba(255,97,0,0.10)`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      {label}
    </span>
  );
};
