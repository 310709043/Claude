import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, FONT} from '../theme';

export const TwmMark: React.FC<{size: number; style?: React.CSSProperties}> = ({
  size,
  style,
}) => (
  <Img
    src={staticFile('brand/twm-mark.png')}
    style={{width: size, height: size, objectFit: 'contain', ...style}}
  />
);

/** Full 台灣大哥大 企業服務 lockup, dark for light surfaces. */
export const TwmLockup: React.FC<{
  height: number;
  tone?: 'dark' | 'white';
  gap?: number;
  style?: React.CSSProperties;
}> = ({height, tone = 'dark', gap = height * 0.34, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap, ...style}}>
    <TwmMark size={height} />
    <Img
      src={staticFile(
        tone === 'dark'
          ? 'brand/twm-wordmark-dark.png'
          : 'brand/twm-wordmark-white.png',
      )}
      style={{height: height * 0.86, objectFit: 'contain'}}
    />
  </div>
);

/** Persistent corner signature carried across every scene. */
export const CornerBrand: React.FC<{opacity?: number}> = ({opacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: 84,
      bottom: 62,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      opacity: opacity * 0.9,
    }}
  >
    <TwmMark size={34} />
    <div
      style={{
        width: 1,
        height: 26,
        background: C.line,
      }}
    />
    <span
      style={{
        fontFamily: FONT.latin,
        fontWeight: 700,
        fontSize: 17,
        letterSpacing: '0.14em',
        color: C.inkSoft,
      }}
    >
      TAIPBX CALL CENTER
    </span>
  </div>
);
