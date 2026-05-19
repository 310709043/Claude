'use client';

import React, { useEffect, useRef } from 'react';
import { runRaf } from '@/lib/raf';

interface Props {
  width: number;
  height: number;
  color?: string;
  density?: number;
}

export function RainOverlay({ width, height, color = '#00f5d4', density = 1 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const drops: { x: number; y: number; v: number; len: number }[] = [];
    const n = Math.floor((width / 8) * density);
    for (let i = 0; i < n; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        v: 6 + Math.random() * 6,
        len: 4 + Math.floor(Math.random() * 6),
      });
    }
    return runRaf(() => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      for (const d of drops) {
        d.y += d.v;
        d.x -= d.v * 0.3;
        if (d.y > height) {
          d.y = -d.len;
          d.x = Math.random() * width + width * 0.2;
        }
        for (let k = 0; k < d.len; k++) {
          ctx.globalAlpha = (1 - k / d.len) * 0.35;
          ctx.fillRect(d.x + k * 0.3, d.y - k, 1, 1);
        }
      }
      ctx.globalAlpha = 1;
    });
  }, [width, height, color, density]);
  return (
    <canvas
      ref={ref}
      style={{
        width,
        height,
        position: 'absolute',
        inset: 0,
        imageRendering: 'pixelated',
        pointerEvents: 'none',
        opacity: 0.7,
      }}
    />
  );
}
