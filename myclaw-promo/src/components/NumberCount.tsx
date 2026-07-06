import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';
import {EASE_OUT, ease, progress} from '../easings';

type NumberCountProps = {
  to: number;
  from?: number;
  startAt?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
};

/** Animated count-up number with eased ramp. */
export const NumberCount: React.FC<NumberCountProps> = ({
  to,
  from = 0,
  startAt = 0,
  duration = 40,
  decimals = 0,
  prefix = '',
  suffix = '',
  fontSize = 44,
  color = COLORS.textPrimary,
  fontWeight = 800,
}) => {
  const frame = useCurrentFrame();
  const value = ease(frame, [startAt, startAt + duration], [from, to], EASE_OUT);
  const opacity = progress(frame, startAt, startAt + 10);
  return (
    <span
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        color,
        opacity,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: -0.5,
      }}
    >
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/** Animated horizontal progress / score bar with glow tip. */
export const ProgressBar: React.FC<{
  value: number; // 0–100
  startAt?: number;
  duration?: number;
  width?: number;
  height?: number;
  color?: string;
  track?: string;
}> = ({
  value,
  startAt = 0,
  duration = 36,
  width = 240,
  height = 8,
  color = COLORS.orange,
  track = 'rgba(255,255,255,0.08)',
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [startAt, startAt + duration], [0, value / 100], EASE_OUT);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: height,
        backgroundColor: track,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: `${p * 100}%`,
          height: '100%',
          borderRadius: height,
          background: `linear-gradient(90deg, ${color}AA, ${color})`,
          boxShadow: `0 0 12px ${color}88`,
        }}
      />
    </div>
  );
};
