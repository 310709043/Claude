import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {closing} from '../content';
import {accents, color, font, type} from '../theme';
import {rise} from '../lib/anim';
import {Kicker, Scene} from '../components/ui';

const PILLARS_OUT = 104;

export const S09Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const k = spring({frame, fps, config: {damping: 200}, durationInFrames: 20});
  const pillarsOut = interpolate(frame, [PILLARS_OUT, PILLARS_OUT + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lockup = spring({
    frame: frame - 118,
    fps,
    config: {damping: 200, mass: 0.9, stiffness: 90},
  });
  const sub = spring({frame: frame - 138, fps, config: {damping: 200}, durationInFrames: 26});
  const tagline = spring({frame: frame - 158, fps, config: {damping: 200}, durationInFrames: 28});
  const sign = spring({frame: frame - 184, fps, config: {damping: 200}, durationInFrames: 28});

  return (
    <Scene fadeOut={26}>
      {/* Phase 1 — the three platform pillars */}
      <AbsoluteFill
        style={{
          padding: '0 132px',
          justifyContent: 'center',
          opacity: 1 - pillarsOut,
          transform: `translateY(${-pillarsOut * 46}px)`,
        }}
      >
        <Kicker progress={k}>PLATFORM PILLARS</Kicker>
        <div
          style={{
            marginTop: 52,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 34,
          }}
        >
          {closing.pillars.map((p, i) => {
            const pr = spring({
              frame: frame - 16 - i * 11,
              fps,
              config: {damping: 200, mass: 0.8, stiffness: 110},
            });
            const accent = accents[i];
            return (
              <div
                key={p.n}
                style={{
                  padding: '34px 32px 36px',
                  borderRadius: 18,
                  border: `1px solid ${color.hair}`,
                  background: 'linear-gradient(155deg, rgba(246,242,237,0.07), rgba(246,242,237,0.018))',
                  ...rise(pr, 34),
                }}
              >
                <div
                  style={{
                    fontFamily: font.display,
                    color: accent,
                    ...type.h4,
                    fontSize: 30,
                    letterSpacing: '0.04em',
                  }}
                >
                  {p.n}
                </div>
                <div style={{marginTop: 10, color: color.cream, ...type.h4, fontWeight: 700, fontSize: 25}}>
                  {p.t}
                </div>
                <div style={{marginTop: 18, color: color.muted, ...type.small, fontSize: 21}}>
                  {p.d}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Phase 2 — closing lockup */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: lockup,
        }}
      >
        <div
          style={{
            fontFamily: font.display,
            fontSize: 210,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '0.06em',
            background: `linear-gradient(112deg, ${color.cream} 8%, ${color.amber} 52%, ${color.orange} 92%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            transform: `scale(${0.94 + lockup * 0.06})`,
          }}
        >
          {closing.lockupTop}
        </div>

        <div
          style={{
            marginTop: 14,
            color: color.sand,
            letterSpacing: '0.36em',
            ...type.h3,
            fontSize: 34,
            ...rise(sub, 16),
          }}
        >
          {closing.lockupBottom}
        </div>

        <div
          style={{
            marginTop: 46,
            width: 460,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${color.hair}, transparent)`,
            opacity: tagline,
          }}
        />

        <div
          style={{
            marginTop: 40,
            color: color.cream,
            ...type.h3,
            fontSize: 38,
            ...rise(tagline, 20),
          }}
        >
          {closing.tagline}
        </div>

        <div
          style={{
            marginTop: 34,
            color: color.dim,
            fontFamily: font.display,
            ...type.micro,
            letterSpacing: '0.3em',
            ...rise(sign, 14),
          }}
        >
          {closing.signature}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
