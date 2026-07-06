import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';
import {EASE_OUT, ease, progress} from '../easings';

/* ───────────────────────── Bar chart ───────────────────────── */

export const BarChart: React.FC<{
  data: {label: string; value: number}[];
  width?: number;
  height?: number;
  startAt?: number;
  color?: string;
  highlightIndex?: number;
}> = ({data, width = 360, height = 180, startAt = 0, color = COLORS.orange, highlightIndex}) => {
  const frame = useCurrentFrame();
  const max = Math.max(...data.map((d) => d.value));
  const barW = (width / data.length) * 0.55;
  const gap = width / data.length;

  return (
    <div style={{width, height, position: 'relative', fontFamily: FONT_FAMILY}}>
      {data.map((d, i) => {
        const p = ease(
          frame,
          [startAt + i * 5, startAt + i * 5 + 32],
          [0, d.value / max],
          EASE_OUT
        );
        const isHi = i === highlightIndex;
        const barH = p * (height - 34);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: gap * i + (gap - barW) / 2,
              bottom: 22,
              width: barW,
              height: barH,
              borderRadius: 6,
              background: isHi
                ? `linear-gradient(180deg, ${COLORS.orangeSoft}, ${COLORS.orangeDeep})`
                : `linear-gradient(180deg, ${color}66, ${color}22)`,
              border: isHi ? 'none' : `1px solid ${color}33`,
              boxShadow: isHi ? `0 0 20px ${COLORS.orangeGlow}` : undefined,
            }}
          />
        );
      })}
      {data.map((d, i) => (
        <div
          key={`l${i}`}
          style={{
            position: 'absolute',
            left: gap * i,
            bottom: 0,
            width: gap,
            textAlign: 'center',
            fontSize: 12,
            color: COLORS.textTertiary,
            opacity: progress(frame, startAt + 8, startAt + 22),
          }}
        >
          {d.label}
        </div>
      ))}
    </div>
  );
};

/* ───────────────────────── Line chart ───────────────────────── */

export const LineChart: React.FC<{
  points: number[];
  width?: number;
  height?: number;
  startAt?: number;
  duration?: number;
  color?: string;
  fill?: boolean;
}> = ({points, width = 360, height = 140, startAt = 0, duration = 46, color = COLORS.orange, fill = true}) => {
  const frame = useCurrentFrame();
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);

  const coords = points.map((v, i) => ({
    x: i * stepX,
    y: height - ((v - min) / range) * (height * 0.82) - height * 0.09,
  }));

  const path = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  const totalLen = width * 1.6; // approximation for dash animation
  const drawn = ease(frame, [startAt, startAt + duration], [0, 1], EASE_OUT);
  const dotIndex = Math.min(
    coords.length - 1,
    Math.floor(drawn * (coords.length - 1))
  );

  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      {fill ? (
        <path d={areaPath} fill={`${color}18`} opacity={drawn} />
      ) : null}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={totalLen}
        strokeDashoffset={totalLen * (1 - drawn)}
        style={{filter: `drop-shadow(0 0 6px ${color}88)`}}
      />
      {drawn > 0.02 ? (
        <circle
          cx={coords[dotIndex].x}
          cy={coords[dotIndex].y}
          r={5}
          fill={COLORS.white}
          stroke={color}
          strokeWidth={3}
        />
      ) : null}
    </svg>
  );
};

/* ───────────────────────── Donut / gauge ───────────────────────── */

export const DonutChart: React.FC<{
  value: number; // 0–100
  size?: number;
  startAt?: number;
  duration?: number;
  color?: string;
  label?: string;
  thickness?: number;
  textColor?: string;
  subColor?: string;
  track?: string;
}> = ({
  value,
  size = 130,
  startAt = 0,
  duration = 42,
  color = COLORS.orange,
  label,
  thickness = 11,
  textColor = COLORS.textPrimary,
  subColor = COLORS.textTertiary,
  track = 'rgba(255,255,255,0.08)',
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [startAt, startAt + duration], [0, value / 100], EASE_OUT);
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        fontFamily: FONT_FAMILY,
      }}
    >
      <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - p)}
          style={{filter: `drop-shadow(0 0 8px ${color}66)`}}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: size * 0.24,
            fontWeight: 800,
            color: textColor,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.round(p * 100)}
          <span style={{fontSize: size * 0.13, color: subColor}}>%</span>
        </div>
        {label ? (
          <div style={{fontSize: size * 0.095, color: subColor, marginTop: 2}}>
            {label}
          </div>
        ) : null}
      </div>
    </div>
  );
};
