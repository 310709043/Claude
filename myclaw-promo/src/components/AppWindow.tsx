import React from 'react';
import {COLORS, FONT_FAMILY, glass} from '../theme';
import {GlassCard} from './GlassCard';
import {useCurrentFrame} from 'remotion';
import {progress} from '../easings';

/**
 * Enterprise app window chrome — glass title bar with traffic dots,
 * product badge slot, and status area. Wraps scene UIs so every
 * screen reads as real software.
 */
export const AppWindow: React.FC<{
  title: string;
  badge?: React.ReactNode;
  status?: React.ReactNode;
  enterAt?: number;
  width?: number | string;
  height?: number | string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({title, badge, status, enterAt = 0, width, height, children, style}) => (
  <GlassCard
    enterAt={enterAt}
    width={width}
    height={height}
    padding={0}
    radius={26}
    fromY={60}
    fromScale={0.94}
    style={{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: FONT_FAMILY,
      ...style,
    }}
  >
    {/* Title bar */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 24px',
        borderBottom: `1px solid ${COLORS.border}`,
        backgroundColor: 'rgba(255,255,255,0.03)',
        flexShrink: 0,
      }}
    >
      <div style={{display: 'flex', gap: 7}}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div
            key={c}
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              backgroundColor: c,
              opacity: 0.85,
            }}
          />
        ))}
      </div>
      <div
        style={{
          fontSize: 14.5,
          fontWeight: 700,
          color: COLORS.textSecondary,
          letterSpacing: 0.8,
        }}
      >
        {title}
      </div>
      {badge}
      <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12}}>
        {status}
      </div>
    </div>
    {/* Content */}
    <div style={{flex: 1, minHeight: 0, position: 'relative'}}>{children}</div>
  </GlassCard>
);

/** Live status pill (e.g. ● LIVE / ● RECORDING). */
export const StatusPill: React.FC<{
  label: string;
  color?: string;
  pulse?: boolean;
}> = ({label, color = COLORS.green, pulse = true}) => {
  const frame = useCurrentFrame();
  const p = pulse ? 0.55 + 0.45 * Math.sin(frame * 0.28) : 1;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 12px',
        borderRadius: 999,
        backgroundColor: `${color}14`,
        border: `1px solid ${color}44`,
        fontFamily: FONT_FAMILY,
        fontSize: 12.5,
        fontWeight: 700,
        letterSpacing: 1.2,
        color,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: color,
          opacity: p,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      {label}
    </div>
  );
};

/** Big cinematic scene heading with kicker line. */
export const SceneTitle: React.FC<{
  kicker?: string;
  title: string;
  enterAt?: number;
  align?: 'left' | 'center';
  size?: number;
}> = ({kicker, title, enterAt = 0, align = 'center', size = 54}) => {
  const frame = useCurrentFrame();
  const kickerP = progress(frame, enterAt, enterAt + 14);
  const titleP = progress(frame, enterAt + 6, enterAt + 24);
  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        textAlign: align,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        gap: 12,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontSize: size * 0.28,
            fontWeight: 700,
            letterSpacing: 5,
            color: COLORS.orange,
            opacity: kickerP,
            transform: `translateY(${(1 - kickerP) * 12}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 34,
              height: 2,
              backgroundColor: COLORS.orange,
              opacity: 0.8,
            }}
          />
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontSize: size,
          fontWeight: 800,
          color: COLORS.textPrimary,
          letterSpacing: 0.5,
          lineHeight: 1.2,
          opacity: titleP,
          transform: `translateY(${(1 - titleP) * 18}px)`,
        }}
      >
        {title}
      </div>
    </div>
  );
};
