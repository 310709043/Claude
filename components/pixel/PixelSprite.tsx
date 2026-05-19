'use client';

import React, { CSSProperties, useMemo } from 'react';
import { spriteSize, spriteToDataURL, Palette } from '@/lib/pixel-engine';

interface Props {
  sprite: string;
  palette: Palette;
  scale?: number;
  style?: CSSProperties;
  className?: string;
  flip?: boolean;
  glow?: string | null;
}

export function PixelSprite({
  sprite,
  palette,
  scale = 4,
  style,
  className,
  flip,
  glow,
}: Props) {
  const { w, h } = useMemo(() => spriteSize(sprite), [sprite]);
  const url = useMemo(() => spriteToDataURL(sprite, palette), [sprite, palette]);
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        width: w * scale,
        height: h * scale,
        backgroundImage: url ? `url(${url})` : undefined,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        imageRendering: 'pixelated',
        transform: flip ? 'scaleX(-1)' : undefined,
        filter: glow ? `drop-shadow(0 0 ${scale}px ${glow})` : undefined,
        ...style,
      }}
    />
  );
}
