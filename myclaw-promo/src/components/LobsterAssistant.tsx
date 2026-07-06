import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

type LobsterProps = {
  size?: number;
  /** Frame at which the lobster pops in. */
  enterAt?: number;
  /** 'idle' floats calmly; 'thinking' adds scanning eyes + claw taps; 'presenting' raises a claw. */
  mode?: 'idle' | 'thinking' | 'presenting';
  /** Show the glowing AI halo ring. */
  halo?: boolean;
};

/**
 * MyClaw 龍蝦 AI 助理 — premium vector mascot.
 * Cute but professional: soft gradients, glass visor, subtle motion.
 */
export const LobsterAssistant: React.FC<LobsterProps> = ({
  size = 260,
  enterAt = 0,
  mode = 'idle',
  halo = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - enterAt,
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.8},
  });

  const t = frame / fps;
  const bob = Math.sin(t * 1.6) * size * 0.02;
  const antennaWave = Math.sin(t * 2.2) * 6;
  const clawWave =
    mode === 'presenting'
      ? -18 + Math.sin(t * 2.4) * 4
      : Math.sin(t * 1.8) * 5;
  const clawWave2 = Math.sin(t * 1.8 + 1.3) * 5;
  // Blink every ~3.2s
  const blinkCycle = (frame % 96) / 96;
  const blink = blinkCycle > 0.94 ? 0.15 : 1;
  // Thinking: eyes scan left-right
  const eyeShift = mode === 'thinking' ? Math.sin(t * 3.0) * 3.5 : 0;
  const haloRot = (frame * 0.6) % 360;
  const haloPulse = 0.75 + 0.25 * Math.sin(t * 2.4);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        opacity: enter,
        transform: `scale(${0.7 + 0.3 * enter}) translateY(${bob}px)`,
      }}
    >
      {halo ? (
        <>
          {/* Rotating AI halo */}
          <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            style={{
              position: 'absolute',
              inset: 0,
              transform: `rotate(${haloRot}deg)`,
              opacity: haloPulse,
            }}
          >
            <circle
              cx={100}
              cy={100}
              r={92}
              fill="none"
              stroke={COLORS.orange}
              strokeWidth={1.6}
              strokeDasharray="40 22 8 22"
              opacity={0.6}
            />
            <circle cx={100} cy={8} r={3.5} fill={COLORS.orange} />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: '12%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${COLORS.orangeGlow} 0%, transparent 68%)`,
              opacity: 0.5 * haloPulse,
            }}
          />
        </>
      ) : null}

      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{position: 'absolute', inset: 0}}
      >
        <defs>
          <linearGradient id="lobBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF8A4D" />
            <stop offset="55%" stopColor="#FF6B1A" />
            <stop offset="100%" stopColor="#E04E00" />
          </linearGradient>
          <linearGradient id="lobClaw" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9A5F" />
            <stop offset="100%" stopColor="#E85400" />
          </linearGradient>
          <linearGradient id="lobBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD9BF" />
            <stop offset="100%" stopColor="#FFB380" />
          </linearGradient>
          <linearGradient id="visor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
          </linearGradient>
        </defs>

        {/* ── Antennae ── */}
        <g transform={`rotate(${antennaWave} 88 52)`}>
          <path
            d="M 88 54 C 80 34, 68 26, 58 20"
            fill="none"
            stroke="#E85400"
            strokeWidth={4.5}
            strokeLinecap="round"
          />
          <circle cx={58} cy={20} r={5} fill={COLORS.orangeSoft} />
          <circle cx={58} cy={20} r={8.5} fill="none" stroke={COLORS.orange} strokeWidth={1} opacity={0.5} />
        </g>
        <g transform={`rotate(${-antennaWave} 112 52)`}>
          <path
            d="M 112 54 C 120 34, 132 26, 142 20"
            fill="none"
            stroke="#E85400"
            strokeWidth={4.5}
            strokeLinecap="round"
          />
          <circle cx={142} cy={20} r={5} fill={COLORS.orangeSoft} />
          <circle cx={142} cy={20} r={8.5} fill="none" stroke={COLORS.orange} strokeWidth={1} opacity={0.5} />
        </g>

        {/* ── Left claw ── */}
        <g transform={`rotate(${clawWave} 55 118)`}>
          <path
            d="M 62 120 C 46 116, 34 112, 28 100"
            fill="none"
            stroke="url(#lobClaw)"
            strokeWidth={11}
            strokeLinecap="round"
          />
          {/* Pincer */}
          <path
            d="M 30 100 C 12 92, 8 76, 18 66 C 26 58, 38 60, 42 70 L 34 76 C 32 71, 26 70, 24 74 C 20 80, 24 88, 38 92 Z"
            fill="url(#lobClaw)"
          />
          <path
            d="M 32 98 C 26 104, 24 112, 30 118 C 36 123, 44 120, 46 112 L 38 108 C 37 112, 34 113, 32 110 Z"
            fill="url(#lobClaw)"
            opacity={0.92}
          />
        </g>

        {/* ── Right claw ── */}
        <g transform={`rotate(${-clawWave2} 145 118)`}>
          <path
            d="M 138 120 C 154 116, 166 112, 172 100"
            fill="none"
            stroke="url(#lobClaw)"
            strokeWidth={11}
            strokeLinecap="round"
          />
          <path
            d="M 170 100 C 188 92, 192 76, 182 66 C 174 58, 162 60, 158 70 L 166 76 C 168 71, 174 70, 176 74 C 180 80, 176 88, 162 92 Z"
            fill="url(#lobClaw)"
          />
          <path
            d="M 168 98 C 174 104, 176 112, 170 118 C 164 123, 156 120, 154 112 L 162 108 C 163 112, 166 113, 168 110 Z"
            fill="url(#lobClaw)"
            opacity={0.92}
          />
        </g>

        {/* ── Tail fan ── */}
        <g opacity={0.95}>
          <ellipse cx={100} cy={172} rx={26} ry={10} fill="#E04E00" />
          <ellipse cx={78} cy={170} rx={11} ry={7} fill="#E85400" transform="rotate(-24 78 170)" />
          <ellipse cx={122} cy={170} rx={11} ry={7} fill="#E85400" transform="rotate(24 122 170)" />
        </g>

        {/* ── Body ── */}
        <path
          d="M 100 58
             C 132 58, 146 84, 146 114
             C 146 148, 126 168, 100 168
             C 74 168, 54 148, 54 114
             C 54 84, 68 58, 100 58 Z"
          fill="url(#lobBody)"
        />
        {/* Segment lines */}
        <path d="M 60 128 C 78 136, 122 136, 140 128" fill="none" stroke="#C94400" strokeWidth={2} opacity={0.55} />
        <path d="M 62 144 C 80 152, 120 152, 138 144" fill="none" stroke="#C94400" strokeWidth={2} opacity={0.5} />
        {/* Belly plate */}
        <ellipse cx={100} cy={140} rx={30} ry={22} fill="url(#lobBelly)" opacity={0.9} />

        {/* ── Head / face ── */}
        <ellipse cx={100} cy={92} rx={40} ry={34} fill="url(#lobBody)" />
        {/* Glass visor highlight */}
        <ellipse cx={100} cy={84} rx={34} ry={24} fill="url(#visor)" />

        {/* Eyes */}
        <g transform={`translate(${eyeShift} 0)`}>
          <g transform={`scale(1 ${blink})`} transform-origin="84 92">
            <circle cx={84} cy={92} r={9} fill="#1A1108" />
            <circle cx={87} cy={89} r={3} fill="#FFFFFF" opacity={0.95} />
          </g>
          <g transform={`scale(1 ${blink})`} transform-origin="116 92">
            <circle cx={116} cy={92} r={9} fill="#1A1108" />
            <circle cx={119} cy={89} r={3} fill="#FFFFFF" opacity={0.95} />
          </g>
        </g>
        {/* Smile */}
        <path
          d="M 90 108 C 95 113, 105 113, 110 108"
          fill="none"
          stroke="#8A3000"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Blush */}
        <ellipse cx={72} cy={102} rx={6} ry={3.5} fill="#FFAB7A" opacity={0.75} />
        <ellipse cx={128} cy={102} rx={6} ry={3.5} fill="#FFAB7A" opacity={0.75} />

        {/* AI core gem on chest */}
        <g>
          <circle cx={100} cy={126} r={8} fill="#FFFFFF" opacity={0.95} />
          <circle
            cx={100}
            cy={126}
            r={8}
            fill="none"
            stroke={COLORS.blue}
            strokeWidth={2}
            opacity={0.5 + 0.5 * Math.sin(t * 3)}
          />
          <circle cx={100} cy={126} r={3.5} fill={COLORS.blue} opacity={0.9} />
        </g>
      </svg>

      {/* Thinking dots */}
      {mode === 'thinking' ? (
        <div
          style={{
            position: 'absolute',
            top: -size * 0.06,
            right: -size * 0.02,
            display: 'flex',
            gap: size * 0.03,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: size * 0.045,
                height: size * 0.045,
                borderRadius: '50%',
                backgroundColor: COLORS.orange,
                opacity: 0.3 + 0.7 * Math.abs(Math.sin(t * 3 - i * 0.6)),
                boxShadow: `0 0 12px ${COLORS.orangeGlow}`,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
