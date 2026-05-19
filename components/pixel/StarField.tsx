'use client';

import React, { useEffect, useRef } from 'react';
import { runRaf } from '@/lib/raf';

interface Props {
  width: number;
  height: number;
  density?: number;
  palette?: string[];
  twinkle?: boolean;
}

export function StarField({
  width,
  height,
  density = 0.0015,
  palette = ['#fff', '#cfd', '#dcf', '#ffd'],
  twinkle = true,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const n = Math.floor(width * height * density);
    const stars: { x: number; y: number; col: string; phase: number; big: boolean }[] = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        col: palette[Math.floor(Math.random() * palette.length)],
        phase: Math.random() * Math.PI * 2,
        big: Math.random() < 0.04,
      });
    }
    return runRaf((t) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const a = twinkle ? 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t / 700 + s.phase)) : 1;
        ctx.globalAlpha = a;
        ctx.fillStyle = s.col;
        if (s.big) {
          ctx.fillRect(s.x, s.y, 1, 1);
          ctx.fillRect(s.x - 1, s.y, 1, 1);
          ctx.fillRect(s.x + 1, s.y, 1, 1);
          ctx.fillRect(s.x, s.y - 1, 1, 1);
          ctx.fillRect(s.x, s.y + 1, 1, 1);
        } else {
          ctx.fillRect(s.x, s.y, 1, 1);
        }
      }
      ctx.globalAlpha = 1;
    });
  }, [width, height, density, palette, twinkle]);

  return <canvas ref={ref} style={{ width, height, imageRendering: 'pixelated', display: 'block' }} />;
}
