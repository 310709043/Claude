'use client';

import React, { CSSProperties, useEffect, useState } from 'react';
import { PixelSprite } from './PixelSprite';
import type { Palette } from '@/lib/pixel-engine';

interface Props {
  frames: string[];
  palette: Palette;
  scale?: number;
  fps?: number;
  style?: CSSProperties;
  flip?: boolean;
  glow?: string | null;
}

export function AnimatedSprite({ frames, palette, scale = 4, fps = 4, style, flip, glow }: Props) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (frames.length <= 1) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % frames.length), 1000 / fps);
    return () => window.clearInterval(id);
  }, [frames.length, fps]);
  return (
    <PixelSprite
      sprite={frames[idx]}
      palette={palette}
      scale={scale}
      style={style}
      flip={flip}
      glow={glow}
    />
  );
}
