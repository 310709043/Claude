import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {envelope, rise} from '../anim';

/**
 * Wraps a scene with its dissolve envelope plus a very slight push-in so the
 * frame is never completely static.
 */
export const Scene: React.FC<{
  children: React.ReactNode;
  inDur?: number;
  outDur?: number;
  push?: number;
}> = ({children, inDur = 16, outDur = 16, push = 0.018}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const o = envelope(frame, durationInFrames, inDur, outDur);
  const scale = 1 + (frame / durationInFrames) * push;
  return (
    <AbsoluteFill style={{opacity: o, transform: `scale(${scale})`}}>
      {children}
    </AbsoluteFill>
  );
};

/** Small orange eyebrow label above a section headline. */
export const Kicker: React.FC<{children: React.ReactNode; delay?: number}> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const p = rise(frame, delay, 18);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        opacity: p,
        transform: `translateX(${(1 - p) * -18}px)`,
      }}
    >
      <span
        style={{
          width: 34,
          height: 4,
          borderRadius: 2,
          background: C.orange,
          transformOrigin: 'left center',
          transform: `scaleX(${p})`,
        }}
      />
      <span
        style={{
          fontFamily: FONT.sans,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: '0.26em',
          color: C.orangeDeep,
        }}
      >
        {children}
      </span>
    </div>
  );
};

export const SceneTitle: React.FC<{
  title: React.ReactNode;
  sub?: React.ReactNode;
  delay?: number;
}> = ({title, sub, delay = 6}) => {
  const frame = useCurrentFrame();
  const p = rise(frame, delay, 24);
  const q = rise(frame, delay + 8, 24);
  return (
    <>
      <h2
        style={{
          margin: '18px 0 0',
          fontFamily: FONT.sans,
          fontWeight: 900,
          fontSize: 68,
          lineHeight: 1.14,
          letterSpacing: '-0.01em',
          color: C.ink,
          opacity: p,
          transform: `translateY(${(1 - p) * 26}px)`,
        }}
      >
        {title}
      </h2>
      {sub ? (
        <p
          style={{
            margin: '18px 0 0',
            fontFamily: FONT.sans,
            fontWeight: 400,
            fontSize: 27,
            lineHeight: 1.6,
            color: C.inkSoft,
            maxWidth: 1040,
            opacity: q,
            transform: `translateY(${(1 - q) * 18}px)`,
          }}
        >
          {sub}
        </p>
      ) : null}
    </>
  );
};

/** The standard content inset used by every full-frame scene. */
export const Stage: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
  children,
  style,
}) => (
  <AbsoluteFill
    style={{
      padding: '96px 112px 132px',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** A soft white card — the film's primary content surface. */
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
  lift?: number;
}> = ({children, style, accent, lift = 1}) => (
  <div
    style={{
      background: 'rgba(255,255,255,0.86)',
      borderRadius: 26,
      border: `1px solid ${C.line}`,
      backdropFilter: 'blur(14px)',
      boxShadow: `0 ${18 * lift}px ${52 * lift}px -${20 * lift}px ${C.ink}22, 0 2px 6px ${C.ink}0A`,
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}
  >
    {accent ? (
      <span
        style={{
          position: 'absolute',
          inset: '0 auto 0 0',
          width: 5,
          background: accent,
        }}
      />
    ) : null}
    {children}
  </div>
);
