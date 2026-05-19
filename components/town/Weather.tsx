'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PixelSprite } from '@/components/pixel/PixelSprite';
import { runRaf } from '@/lib/raf';

interface SizeProps { width: number; height: number }

export function Snow({ width, height, density = 1 }: SizeProps & { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const flakes: { x: number; y: number; v: number; d: number; big: boolean }[] = [];
    const n = Math.floor(((width * height) / 5000) * density);
    for (let i = 0; i < n; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        v: 0.4 + Math.random() * 0.6,
        d: Math.random() * Math.PI * 2,
        big: Math.random() < 0.15,
      });
    }
    return runRaf((t) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#f5f3ff';
      for (const f of flakes) {
        f.y += f.v;
        f.x += Math.sin((t + f.d * 1000) / 1200) * 0.4;
        if (f.y > height) {
          f.y = -2;
          f.x = Math.random() * width;
        }
        ctx.globalAlpha = 0.9;
        ctx.fillRect(Math.floor(f.x), Math.floor(f.y), 1, 1);
        if (f.big) ctx.fillRect(Math.floor(f.x) + 1, Math.floor(f.y), 1, 1);
      }
      ctx.globalAlpha = 1;
    });
  }, [width, height, density]);
  return (
    <canvas
      ref={ref}
      style={{ width, height, position: 'absolute', inset: 0, imageRendering: 'pixelated', pointerEvents: 'none' }}
    />
  );
}

export function Clouds({
  width,
  height,
  count = 4,
  color = 'rgba(245,243,255,0.7)',
}: SizeProps & { count?: number; color?: string }) {
  const cloudSprite = `
.....CCCC.....
....CCCCCCC...
..CCCCCCCCCCC.
.CCCCCCCCCCCCC
.CCCCCCCCCCCC.
`;
  const [positions, setPositions] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      x: (i / count) * width + Math.random() * 100,
      y: 40 + Math.random() * (height * 0.35),
      v: 0.15 + Math.random() * 0.2,
      scale: 2 + Math.floor(Math.random() * 3),
    })),
  );
  useEffect(() => {
    return runRaf(() => {
      setPositions((ps) =>
        ps.map((p) => {
          let x = p.x + p.v;
          if (x > width + 100) x = -150;
          return { ...p, x };
        }),
      );
    });
  }, [width]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {positions.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, opacity: 0.55 }}>
          <PixelSprite sprite={cloudSprite} palette={{ C: color }} scale={p.scale} />
        </div>
      ))}
    </div>
  );
}

export function LightningFlash() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let stop = false;
    const loop = async () => {
      while (!stop) {
        await new Promise((r) => setTimeout(r, 6000 + Math.random() * 8000));
        if (stop) return;
        setOn(true);
        await new Promise((r) => setTimeout(r, 80));
        setOn(false);
        await new Promise((r) => setTimeout(r, 120));
        if (Math.random() < 0.6) {
          setOn(true);
          await new Promise((r) => setTimeout(r, 60));
          setOn(false);
        }
      }
    };
    void loop();
    return () => {
      stop = true;
    };
  }, []);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: on ? 'rgba(245,243,255,0.4)' : 'transparent',
        pointerEvents: 'none',
        transition: 'background 80ms',
        zIndex: 2,
      }}
    />
  );
}

export function Fog() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg, rgba(167,139,250,0.05) 0%, rgba(167,139,250,0.15) 50%, rgba(7,4,26,0.4) 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
}
