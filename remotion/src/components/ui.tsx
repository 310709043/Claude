import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {color, font, layout, type} from '../theme';
import {rise, useSceneFade} from '../lib/anim';

/** Scene shell: consistent padding plus the in/out fade used by every scene. */
export const Scene: React.FC<{
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
  style?: React.CSSProperties;
}> = ({children, fadeIn, fadeOut = 12, style}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const opacity = useSceneFade(fadeIn, fadeOut);

  // A small lift on the way out makes the cross-fade read as a hand-off rather
  // than a flat double exposure.
  const exit = interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${-exit * 20}px) scale(${1 - exit * 0.01})`,
        padding: `${layout.padY}px ${layout.padX}px`,
        fontFamily: font.body,
        color: color.cream,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Small all-caps label with a leading accent dash. */
export const Kicker: React.FC<{
  children: React.ReactNode;
  accent?: string;
  progress?: number;
}> = ({children, accent = color.orange, progress = 1}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      color: color.sand,
      fontFamily: font.display,
      opacity: progress,
      ...type.kicker,
    }}
  >
    <span
      style={{
        display: 'block',
        height: 3,
        width: 56 * progress,
        borderRadius: 2,
        background: accent,
        boxShadow: `0 0 22px ${accent}88`,
      }}
    />
    <span>{children}</span>
  </div>
);

/**
 * Heading that reveals character by character. Each glyph rises out of a soft
 * blur, which reads far better on CJK than a per-word slide.
 */
export const SplitHeading: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  distance?: number;
}> = ({text, delay = 0, stagger = 1.6, style, distance = 34}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <span style={{display: 'inline-block', ...style}}>
      {Array.from(text).map((char, i) => {
        const p = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: {damping: 200, mass: 0.6, stiffness: 110},
        });
        return (
          <span
            key={`${char}-${i}`}
            style={{
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : undefined,
              opacity: p,
              transform: `translateY(${(1 - p) * distance}px)`,
              filter: p > 0.99 ? 'none' : `blur(${(1 - p) * 8}px)`,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

/**
 * Whole-line heading revealed by a left-to-right wipe. Unlike SplitHeading it
 * keeps the text in a single box, so `background-clip: text` gradients survive.
 */
export const WipeHeading: React.FC<{
  text: string;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({text, delay = 0, duration = 28, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <span
      style={{
        display: 'inline-block',
        clipPath: `inset(-12% ${(1 - p) * 101}% -22% -2%)`,
        transform: `translateY(${(1 - p) * 16}px)`,
        ...style,
      }}
    >
      {text}
    </span>
  );
};

/** Hairline that wipes open from the left. */
export const Rule: React.FC<{progress: number; accent?: string; height?: number}> = ({
  progress,
  accent = color.hair,
  height = 1,
}) => (
  <div
    style={{
      height,
      width: '100%',
      transformOrigin: 'left center',
      transform: `scaleX(${progress})`,
      background: accent,
    }}
  />
);

export const Chip: React.FC<{
  children: React.ReactNode;
  accent?: string;
  progress?: number;
  muted?: boolean;
}> = ({children, accent = color.orange, progress = 1, muted}) => (
  <span
    style={{
      display: 'inline-block',
      padding: '11px 22px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
      border: `1px solid ${muted ? color.hair : `${accent}66`}`,
      background: muted ? 'rgba(246,242,237,0.04)' : `${accent}1f`,
      color: muted ? color.muted : color.cream,
      boxShadow: muted ? 'none' : `0 0 26px ${accent}1a`,
      ...type.small,
      ...rise(progress, 14),
    }}
  >
    {children}
  </span>
);

/** Frosted panel used by the card-based scenes. */
export const Panel: React.FC<{
  children: React.ReactNode;
  accent?: string;
  progress?: number;
  style?: React.CSSProperties;
}> = ({children, accent = color.orange, progress = 1, style}) => (
  <div
    style={{
      position: 'relative',
      borderRadius: 22,
      border: `1px solid ${color.hair}`,
      background: `linear-gradient(160deg, rgba(246,242,237,0.075) 0%, rgba(246,242,237,0.028) 55%, rgba(246,242,237,0.012) 100%)`,
      boxShadow: `0 32px 80px -40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)`,
      overflow: 'hidden',
      ...rise(progress, 46),
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        insetInlineStart: 0,
        top: 0,
        height: 3,
        width: '100%',
        transformOrigin: 'left center',
        transform: `scaleX(${progress})`,
        background: `linear-gradient(90deg, ${accent}, ${accent}00)`,
      }}
    />
    {children}
  </div>
);

/** Section title block shared by the interior scenes. */
export const SceneHead: React.FC<{
  kicker: string;
  title: string;
  sub?: string;
  accent?: string;
  delay?: number;
}> = ({kicker, title, sub, accent = color.orange, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 20});
  const s = spring({frame: frame - delay - 14, fps, config: {damping: 200}, durationInFrames: 22});

  return (
    <div style={{marginBottom: 54}}>
      <Kicker accent={accent} progress={k}>
        {kicker}
      </Kicker>
      <h2
        style={{
          margin: '22px 0 0',
          fontFamily: font.display,
          color: color.cream,
          ...type.h2,
        }}
      >
        <SplitHeading text={title} delay={delay + 6} stagger={1.5} />
      </h2>
      {sub ? (
        <p
          style={{
            margin: '18px 0 0',
            maxWidth: 1180,
            color: color.muted,
            ...type.body,
            ...rise(s, 18),
          }}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
};

/** Persistent chapter HUD along the bottom edge of the film. */
export const Hud: React.FC<{chapters: {at: number; label: string}[]}> = ({chapters}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const opacity = Math.min(
    interpolate(frame, [40, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(frame, [durationInFrames - 300, durationInFrames - 250], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  const current = chapters.reduce(
    (acc, c, i) => (frame >= c.at ? i : acc),
    0,
  );
  const progress = interpolate(frame, [0, durationInFrames], [0, 1]);

  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: layout.padX,
          right: layout.padX,
          bottom: 54,
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          fontFamily: font.display,
          color: color.dim,
          ...type.micro,
        }}
      >
        <span style={{color: color.sand}}>
          {String(current + 1).padStart(2, '0')}
        </span>
        <span style={{flex: '0 0 auto', color: color.muted, letterSpacing: '0.18em'}}>
          {chapters[current]?.label}
        </span>
        <span
          style={{
            flex: 1,
            height: 2,
            background: color.hairSoft,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              display: 'block',
              height: '100%',
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${color.terracotta}, ${color.orange})`,
            }}
          />
        </span>
        <span>AICC ROADMAP</span>
      </div>
    </AbsoluteFill>
  );
};
