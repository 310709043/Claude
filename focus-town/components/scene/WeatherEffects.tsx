'use client';
import React, { useEffect, useRef } from 'react';
import { SceneType } from '@/lib/types';

interface WeatherEffectsProps {
  scene: SceneType;
}

export function WeatherEffects({ scene }: WeatherEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  const isRainy  = scene === 'rainy';
  const isStormy = scene === 'stormy';
  const hasRain  = isRainy || isStormy;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    if (!hasRain) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const dropCount = isStormy ? 300 : 150;
    const drops = Array.from({ length: dropCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 8 + Math.random() * 12,
      length: 15 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.4,
    }));

    let lightningTimer = 0;
    let lightningFlash = false;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rain drops
      ctx.strokeStyle = `rgba(174, 214, 241, 0.6)`;
      ctx.lineWidth = 1;
      drops.forEach(drop => {
        drop.y += drop.speed;
        drop.x -= drop.speed * 0.15;
        if (drop.y > canvas.height) { drop.y = -drop.length; drop.x = Math.random() * canvas.width; }
        ctx.globalAlpha = drop.opacity;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * 0.1, drop.y + drop.length);
        ctx.stroke();
      });

      // Lightning for stormy
      if (isStormy) {
        lightningTimer++;
        if (lightningTimer > 180 && Math.random() < 0.02) {
          lightningFlash = true;
          lightningTimer = 0;
        }
        if (lightningFlash) {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          lightningFlash = false;
        }
      }

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [hasRain, isStormy]);

  if (!hasRain) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 5 }}
      />
      {/* Fog overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background: isStormy
            ? 'rgba(30,39,46,0.3)'
            : 'rgba(99,110,114,0.15)',
        }}
      />
    </>
  );
}
