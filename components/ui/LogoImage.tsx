'use client';

import React, { CSSProperties } from 'react';

interface Props {
  size?: number;
  style?: CSSProperties;
  glow?: string;
}

/** Wide pixel-art wordmark logo (PNG asset). 712x284 native aspect (~2.5:1). */
export function LogoImage({ size = 56, style, glow = 'rgba(34,211,238,0.45)' }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="LowBatteryTown"
      style={{
        height: size,
        width: 'auto',
        imageRendering: 'pixelated',
        display: 'block',
        filter: `drop-shadow(0 0 ${Math.max(6, size / 8)}px ${glow})`,
        ...style,
      }}
    />
  );
}

/** Compact battery-only mark for tight spots */
export function LogoMark({ size = 28, style, glow = 'rgba(34,211,238,0.5)' }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="LBT"
      style={{
        height: size,
        width: 'auto',
        maxWidth: size * 2.6,
        imageRendering: 'pixelated',
        display: 'block',
        filter: `drop-shadow(0 0 ${Math.max(4, size / 8)}px ${glow})`,
        ...style,
      }}
    />
  );
}
