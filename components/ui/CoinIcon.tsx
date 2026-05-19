'use client';

import React from 'react';
import { PixelSprite } from '@/components/pixel/PixelSprite';

const COIN = `
.OOOO.
OYYYYO
OYTYYO
OYTTYO
OYTYYO
OYYYYO
.OOOO.
`;

export function CoinIcon({ scale = 3 }: { scale?: number }) {
  return (
    <PixelSprite
      sprite={COIN}
      palette={{ O: '#92400e', Y: '#fbbf24', T: '#fcd34d' }}
      scale={scale}
      glow="rgba(252,211,77,0.5)"
    />
  );
}
