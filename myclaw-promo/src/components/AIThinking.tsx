import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY, FONT_MONO} from '../theme';
import {progress} from '../easings';

/** Pulsing neural-orb "AI is thinking" indicator with orbiting nodes. */
export const AIThinking: React.FC<{
  size?: number;
  label?: string;
  enterAt?: number;
}> = ({size = 120, label, enterAt = 0}) => {
  const frame = useCurrentFrame();
  const entered = progress(frame, enterAt, enterAt + 14);
  const t = frame / 30;
  const pulse = 0.85 + 0.15 * Math.sin(t * 3.2);

  const orbits = [
    {r: size * 0.36, speed: 1.0, phase: 0, dot: 4},
    {r: size * 0.44, speed: -0.7, phase: 2.1, dot: 3},
    {r: size * 0.5, speed: 0.5, phase: 4.2, dot: 3.5},
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        opacity: entered,
        transform: `scale(${0.85 + 0.15 * entered})`,
      }}
    >
      <div style={{width: size, height: size, position: 'relative'}}>
        {/* Core glow */}
        <div
          style={{
            position: 'absolute',
            inset: '28%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.orange} 0%, ${COLORS.orangeDeep} 60%, transparent 100%)`,
            transform: `scale(${pulse})`,
            boxShadow: `0 0 ${size * 0.4}px ${COLORS.orangeGlow}`,
          }}
        />
        {/* Inner white spark */}
        <div
          style={{
            position: 'absolute',
            inset: '42%',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.9)',
            transform: `scale(${pulse})`,
            filter: 'blur(1px)',
          }}
        />
        {/* Orbit rings + travelling nodes */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{position: 'absolute', inset: 0}}
        >
          {orbits.map((o, i) => {
            const angle = t * o.speed * 2 + o.phase;
            const cx = size / 2 + Math.cos(angle) * o.r;
            const cy = size / 2 + Math.sin(angle) * o.r * 0.55;
            return (
              <g key={i}>
                <ellipse
                  cx={size / 2}
                  cy={size / 2}
                  rx={o.r}
                  ry={o.r * 0.55}
                  fill="none"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth={1}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={o.dot}
                  fill={i === 1 ? COLORS.blue : COLORS.orange}
                  opacity={0.9}
                />
              </g>
            );
          })}
        </svg>
      </div>
      {label ? (
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: size * 0.13,
            fontWeight: 600,
            letterSpacing: 2,
            color: COLORS.textSecondary,
          }}
        >
          {label}
          <span style={{color: COLORS.orange}}>
            {'.'.repeat(1 + (Math.floor(frame / 12) % 3))}
          </span>
        </div>
      ) : null}
    </div>
  );
};

/** Terminal-style AI reasoning log lines that appear sequentially. */
export const AIProcessLog: React.FC<{
  steps: string[];
  startAt?: number;
  interval?: number;
  fontSize?: number;
  width?: number;
}> = ({steps, startAt = 0, interval = 16, fontSize = 15, width = 380}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width,
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        fontFamily: FONT_MONO,
      }}
    >
      {steps.map((s, i) => {
        const at = startAt + i * interval;
        const p = progress(frame, at, at + 10);
        const done = frame > at + interval * 0.9;
        if (p === 0) return null;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              opacity: p,
              transform: `translateX(${(1 - p) * -12}px)`,
              fontSize,
              color: done ? COLORS.textSecondary : COLORS.textPrimary,
            }}
          >
            <span
              style={{
                width: fontSize * 0.9,
                height: fontSize * 0.9,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fontSize * 0.62,
                backgroundColor: done
                  ? 'rgba(52,211,153,0.16)'
                  : 'rgba(255,107,26,0.16)',
                color: done ? COLORS.green : COLORS.orange,
                border: `1px solid ${done ? COLORS.green : COLORS.orange}55`,
              }}
            >
              {done ? '✓' : ''}
            </span>
            {s}
            {!done ? (
              <span
                style={{
                  color: COLORS.orange,
                  opacity: Math.sin(frame * 0.5) > 0 ? 1 : 0.2,
                }}
              >
                ▍
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
