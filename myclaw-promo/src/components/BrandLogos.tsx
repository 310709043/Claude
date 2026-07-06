import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';

/**
 * Taiwan Mobile "彩球" mark — stylized multicolor sphere built from
 * orbital petals, rendered as clean vector so it embeds into UI chrome.
 */
export const TaiwanMobileLogo: React.FC<{size?: number; withWordmark?: boolean}> = ({
  size = 48,
  withWordmark = false,
}) => {
  const petals = [
    {rotate: 0, color: '#F5333F'},
    {rotate: 60, color: '#F97316'},
    {rotate: 120, color: '#FBBF24'},
    {rotate: 180, color: '#22C55E'},
    {rotate: 240, color: '#3B82F6'},
    {rotate: 300, color: '#8B5CF6'},
  ];
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: size * 0.3}}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <radialGradient id="tmGloss" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </radialGradient>
        </defs>
        <g transform="translate(50 50)">
          {petals.map((p, i) => (
            <g key={i} transform={`rotate(${p.rotate})`}>
              <ellipse
                cx={0}
                cy={-24}
                rx={17}
                ry={26}
                fill={p.color}
                opacity={0.92}
              />
            </g>
          ))}
          <circle r={47} fill="url(#tmGloss)" />
        </g>
      </svg>
      {withWordmark ? (
        <div style={{fontFamily: FONT_FAMILY}}>
          <div
            style={{
              fontSize: size * 0.42,
              fontWeight: 700,
              color: COLORS.textPrimary,
              letterSpacing: 2,
            }}
          >
            台灣大哥大
          </div>
          <div
            style={{
              fontSize: size * 0.2,
              fontWeight: 500,
              color: COLORS.textTertiary,
              letterSpacing: 3,
            }}
          >
            TAIWAN MOBILE
          </div>
        </div>
      ) : null}
    </div>
  );
};

/** MyClaw claw-mark: an abstract lobster claw forming a "C". */
export const MyClawMark: React.FC<{size?: number}> = ({size = 44}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="clawGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={COLORS.orangeSoft} />
        <stop offset="100%" stopColor={COLORS.orangeDeep} />
      </linearGradient>
    </defs>
    {/* Claw body — bold C with pincer notch */}
    <path
      d="M 78 30
         A 34 34 0 1 0 78 70
         L 64 61
         A 18 18 0 1 1 64 39
         Z"
      fill="url(#clawGrad)"
    />
    {/* Pincer tip */}
    <path d="M 78 30 L 92 22 L 84 40 Z" fill="url(#clawGrad)" />
    <path d="M 78 70 L 92 78 L 84 60 Z" fill="url(#clawGrad)" opacity={0.85} />
    {/* AI spark */}
    <circle cx={50} cy={50} r={6} fill={COLORS.white} opacity={0.95} />
  </svg>
);

export const MyClawLogo: React.FC<{size?: number; subtitle?: boolean}> = ({
  size = 44,
  subtitle = false,
}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.28}}>
    <MyClawMark size={size} />
    <div style={{fontFamily: FONT_FAMILY}}>
      <div
        style={{
          fontSize: size * 0.52,
          fontWeight: 800,
          color: COLORS.textPrimary,
          letterSpacing: 0.5,
          lineHeight: 1.05,
        }}
      >
        MyClaw{' '}
        <span style={{color: COLORS.orange, fontWeight: 800}}>AI</span>
      </div>
      {subtitle ? (
        <div
          style={{
            fontSize: size * 0.19,
            color: COLORS.textTertiary,
            letterSpacing: 2.5,
            marginTop: 2,
          }}
        >
          ENTERPRISE SALES INTELLIGENCE
        </div>
      ) : null}
    </div>
  </div>
);

/** Product wordmark badge used inside UI chrome (TAIPBX / MyVoca). */
export const ProductBadge: React.FC<{
  name: string;
  accent?: string;
  size?: number;
}> = ({name, accent = COLORS.orange, size = 15}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: `${size * 0.4}px ${size * 0.9}px`,
      borderRadius: 999,
      border: `1px solid ${COLORS.borderStrong}`,
      backgroundColor: 'rgba(255,255,255,0.05)',
      fontFamily: FONT_FAMILY,
    }}
  >
    <div
      style={{
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        backgroundColor: accent,
        boxShadow: `0 0 10px ${accent}`,
      }}
    />
    <span
      style={{
        fontSize: size,
        fontWeight: 700,
        letterSpacing: 1.5,
        color: COLORS.textPrimary,
      }}
    >
      {name}
    </span>
  </div>
);

/** Softly floating logo wrapper — gentle levitation loop. */
export const FloatingLogo: React.FC<{
  children: React.ReactNode;
  amplitude?: number;
  period?: number;
}> = ({children, amplitude = 8, period = 120}) => {
  const frame = useCurrentFrame();
  const y = Math.sin((frame / period) * Math.PI * 2) * amplitude;
  const r = Math.sin((frame / (period * 1.4)) * Math.PI * 2) * 1.2;
  return (
    <div style={{transform: `translateY(${y}px) rotate(${r}deg)`}}>
      {children}
    </div>
  );
};
