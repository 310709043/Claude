'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import { SceneType } from '@/lib/types';
import { useFocusStore } from '@/lib/store';

interface Star { x: number; y: number; vx: number; vy: number; trail: {x:number;y:number}[]; opacity: number; life: number; }
interface Firefly { x: number; y: number; vx: number; vy: number; phase: number; opacity: number; }

interface ShootingStarsProps {
  scene: SceneType;
}

export function ShootingStars({ scene }: ShootingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const firefliesRef = useRef<Firefly[]>([]);
  const frameRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const { focusMinutesSession, isRunning } = useFocusStore();

  const nightScenes: SceneType[] = ['night', 'dawn', 'dusk'];
  const isNight = nightScenes.includes(scene);

  // Reward frequency multiplier based on focus time
  const rewardMultiplier = focusMinutesSession >= 60 ? 4 : focusMinutesSession >= 30 ? 2 : 1;

  const spawnStar = useCallback((canvas: HTMLCanvasElement) => {
    const star: Star = {
      x: Math.random() * canvas.width * 0.7,
      y: Math.random() * canvas.height * 0.4,
      vx: 4 + Math.random() * 6,
      vy: 3 + Math.random() * 4,
      trail: [],
      opacity: 1,
      life: 1,
    };
    starsRef.current.push(star);
    if (starsRef.current.length > 8) starsRef.current.shift();
  }, []);

  const spawnFirefly = useCallback((canvas: HTMLCanvasElement) => {
    const fly: Firefly = {
      x: Math.random() * canvas.width,
      y: canvas.height * 0.3 + Math.random() * canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.8 + Math.random() * 0.2,
    };
    firefliesRef.current.push(fly);
    if (firefliesRef.current.length > 30 * rewardMultiplier) firefliesRef.current.shift();
  }, [rewardMultiplier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Seed static stars
    const staticStars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.6,
      r: Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.7,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.02;

      const starOpacity = scene === 'night' ? 1 : scene === 'dawn' ? 0.4 : scene === 'dusk' ? 0.2 : 0;

      // Static stars
      if (starOpacity > 0) {
        staticStars.forEach(s => {
          const tw = Math.sin(t + s.twinkle) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${s.opacity * tw * starOpacity})`;
          ctx.fill();
        });
      }

      // Spawn shooting stars
      const spawnInterval = Math.max(2000, 6000 / rewardMultiplier);
      if (isNight && timestamp - lastSpawnRef.current > spawnInterval && starOpacity > 0) {
        spawnStar(canvas);
        lastSpawnRef.current = timestamp;
      }

      // Shooting stars
      starsRef.current = starsRef.current.filter(star => star.life > 0);
      starsRef.current.forEach(star => {
        star.trail.push({ x: star.x, y: star.y });
        if (star.trail.length > 20) star.trail.shift();
        star.x += star.vx;
        star.y += star.vy;
        star.life -= 0.02;

        // Draw trail
        star.trail.forEach((pt, i) => {
          const alpha = (i / star.trail.length) * star.life * starOpacity;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 220, ${alpha})`;
          ctx.fill();
        });

        // Draw star head
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.life * starOpacity})`;
        ctx.shadowColor = 'rgba(255,255,220,0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Fireflies (reward for 60+ min focus)
      if (isRunning && focusMinutesSession >= 30 && (scene === 'night' || scene === 'dusk' || scene === 'dawn')) {
        if (firefliesRef.current.length < 15 * rewardMultiplier && Math.random() < 0.05) {
          spawnFirefly(canvas);
        }

        firefliesRef.current.forEach(fly => {
          fly.x += fly.vx + Math.sin(t + fly.phase) * 0.3;
          fly.y += fly.vy + Math.cos(t * 0.7 + fly.phase) * 0.3;
          fly.phase += 0.02;

          // Wrap around
          if (fly.x < 0) fly.x = canvas.width;
          if (fly.x > canvas.width) fly.x = 0;
          if (fly.y < canvas.height * 0.2) fly.y = canvas.height * 0.7;
          if (fly.y > canvas.height * 0.8) fly.y = canvas.height * 0.3;

          const pulse = (Math.sin(t * 2 + fly.phase) + 1) / 2;
          const r = 2 + pulse;
          ctx.beginPath();
          ctx.arc(fly.x, fly.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 255, 150, ${fly.opacity * pulse})`;
          ctx.shadowColor = `rgba(180, 255, 150, 0.8)`;
          ctx.shadowBlur = 8 + pulse * 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } else if (!isRunning || focusMinutesSession < 30) {
        firefliesRef.current = [];
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [scene, isNight, spawnStar, spawnFirefly, isRunning, focusMinutesSession, rewardMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}
