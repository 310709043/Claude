import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {heritage} from '../content';
import {color, font, type} from '../theme';
import {rise} from '../lib/anim';
import {Kicker, Scene} from '../components/ui';

const Year: React.FC<{value: string; accent?: boolean; progress: number}> = ({
  value,
  accent,
  progress,
}) => (
  <div
    style={{
      fontFamily: font.display,
      fontSize: 168,
      fontWeight: 800,
      lineHeight: 1,
      letterSpacing: '0.01em',
      fontVariantNumeric: 'tabular-nums',
      color: accent ? 'transparent' : color.sand,
      background: accent
        ? `linear-gradient(120deg, ${color.amber}, ${color.orange} 70%)`
        : undefined,
      WebkitBackgroundClip: accent ? 'text' : undefined,
      backgroundClip: accent ? 'text' : undefined,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 30}px)`,
    }}
  >
    {value}
  </div>
);

export const S02Heritage: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const k = spring({frame: frame - 4, fps, config: {damping: 200}, durationInFrames: 20});
  const left = spring({frame: frame - 16, fps, config: {damping: 200}, durationInFrames: 26});
  const right = spring({frame: frame - 40, fps, config: {damping: 200}, durationInFrames: 26});
  const leftText = spring({frame: frame - 60, fps, config: {damping: 200}, durationInFrames: 26});
  const rightText = spring({frame: frame - 84, fps, config: {damping: 200}, durationInFrames: 26});
  const footer = spring({frame: frame - 120, fps, config: {damping: 200}, durationInFrames: 28});

  // The rail draws first, then the right-hand year counts up along with it.
  const rail = interpolate(frame, [30, 108], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const counted = Math.round(
    interpolate(rail, [0.15, 1], [heritage.from, heritage.to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  return (
    <Scene>
      <AbsoluteFill style={{justifyContent: 'center', padding: '0 132px'}}>
        <Kicker progress={k}>SINCE 2002 ／ TOWARD 2026</Kicker>

        <div
          style={{
            marginTop: 62,
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 56,
          }}
        >
          <div>
            <Year value={String(heritage.from)} progress={left} />
            <p
              style={{
                margin: '30px 0 0',
                maxWidth: 520,
                color: color.sand,
                ...type.h4,
                ...rise(leftText, 20),
              }}
            >
              {heritage.left}
            </p>
          </div>

          {/* Rail */}
          <div style={{width: 340, position: 'relative', height: 60}}>
            <div
              style={{
                position: 'absolute',
                top: 29,
                left: 0,
                height: 2,
                width: '100%',
                background: color.hairSoft,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 29,
                left: 0,
                height: 2,
                width: `${rail * 100}%`,
                background: `linear-gradient(90deg, ${color.terracotta}, ${color.orange})`,
                boxShadow: `0 0 24px ${color.orange}66`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 22,
                left: `calc(${rail * 100}% - 8px)`,
                width: 16,
                height: 16,
                borderRadius: 999,
                background: color.amber,
                boxShadow: `0 0 30px ${color.orange}`,
                opacity: rail > 0 && rail < 1 ? 1 : rail === 1 ? 1 : 0,
              }}
            />
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <div
                key={p}
                style={{
                  position: 'absolute',
                  top: 40,
                  left: `${p * 100}%`,
                  width: 1,
                  height: 10,
                  background: rail >= p ? color.terracotta : color.hairSoft,
                }}
              />
            ))}
          </div>

          <div>
            <Year value={String(counted)} accent progress={right} />
            <p
              style={{
                margin: '30px 0 0',
                maxWidth: 560,
                color: color.cream,
                ...type.h4,
                ...rise(rightText, 20),
              }}
            >
              {heritage.right}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 92,
            color: color.dim,
            fontFamily: font.display,
            ...type.micro,
            letterSpacing: '0.34em',
            ...rise(footer, 14),
          }}
        >
          {heritage.footer}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
