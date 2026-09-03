import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {cover} from '../content';
import {color, font, layout, type} from '../theme';
import {rise} from '../lib/anim';
import {Kicker, Rule, Scene, SplitHeading, WipeHeading} from '../components/ui';

export const S01Title: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const k = spring({frame, fps, config: {damping: 200}, durationInFrames: 22});
  const ruleP = spring({frame: frame - 58, fps, config: {damping: 200}, durationInFrames: 26});
  const latin = spring({frame: frame - 68, fps, config: {damping: 200}, durationInFrames: 24});
  const speakers = spring({frame: frame - 82, fps, config: {damping: 200}, durationInFrames: 24});

  // Very slow push-in keeps the opening from feeling like a static slide.
  const drift = interpolate(frame, [0, durationInFrames], [16, -14]);
  const scale = interpolate(frame, [0, durationInFrames], [1.012, 1]);

  return (
    <Scene fadeIn={1} fadeOut={16}>
      {/* Ghost wordmark */}
      <AbsoluteFill
        style={{
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          paddingRight: 142,
          paddingBottom: 118,
          opacity: interpolate(frame, [10, 60], [0, 0.05], {extrapolateRight: 'clamp'}),
        }}
      >
        <span
          style={{
            fontFamily: font.display,
            fontSize: 232,
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: color.cream,
            transform: `translateX(${interpolate(frame, [0, durationInFrames], [60, 0])}px)`,
          }}
        >
          AICC
        </span>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          padding: `0 ${layout.padX}px`,
          transform: `translateY(${drift}px) scale(${scale})`,
        }}
      >
        <Kicker progress={k}>{cover.kicker}</Kicker>

        <h1
          style={{
            margin: '40px 0 0',
            fontFamily: font.display,
            color: color.cream,
            textShadow: '0 24px 70px rgba(0,0,0,0.55)',
            ...type.h1,
          }}
        >
          <div>
            <SplitHeading text={cover.titleTop} delay={12} stagger={2.4} distance={46} />
          </div>
          <div>
            {/* The gradient lives on the span that actually holds the glyphs —
                background-clip: text does not reach through a transformed child. */}
            <WipeHeading
              text={cover.titleBottom}
              delay={30}
              duration={40}
              style={{
                backgroundImage: `linear-gradient(96deg, ${color.cream} 4%, ${color.amber} 46%, ${color.orange} 88%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            />
          </div>
        </h1>

        <div style={{width: 620, margin: '52px 0 30px'}}>
          <Rule
            progress={ruleP}
            accent={`linear-gradient(90deg, ${color.orange}, ${color.terracotta}00)`}
            height={2}
          />
        </div>

        <div
          style={{
            fontFamily: font.display,
            color: color.sand,
            letterSpacing: '0.2em',
            ...type.h4,
            ...rise(latin, 20),
          }}
        >
          {cover.latin}
        </div>

        <div
          style={{
            marginTop: 26,
            color: color.muted,
            ...type.small,
            ...rise(speakers, 16),
          }}
        >
          {cover.speakers}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
