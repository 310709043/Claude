'use client';

import React, { useEffect, useRef } from 'react';
import { runRaf } from '@/lib/raf';

interface Props {
  width: number;
  height: number;
}

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

export function ShootingStars({ width, height }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const stars: Star[] = [];
    let last = 0;
    const spawn = () =>
      stars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        vx: 2 + Math.random() * 2,
        vy: 0.6 + Math.random() * 0.4,
        life: 0,
        max: 40 + Math.random() * 20,
      });
    return runRaf((t) => {
      ctx.clearRect(0, 0, width, height);
      if (t - last > 2500 + Math.random() * 4000) {
        spawn();
        last = t;
      }
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        if (s.life > s.max) {
          stars.splice(i, 1);
          continue;
        }
        for (let k = 0; k < 8; k++) {
          const a = 1 - k / 8;
          ctx.globalAlpha = a * (1 - s.life / s.max);
          ctx.fillStyle = '#fff';
          ctx.fillRect(s.x - k * s.vx, s.y - k * s.vy, 1, 1);
        }
      }
      ctx.globalAlpha = 1;
    });
  }, [width, height]);
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
      }}
    />
  );
}
