'use client';
import React, { useMemo } from 'react';
import { OnlineUser } from '@/lib/types';
import { useSocialStore, useUserStore, useFocusStore } from '@/lib/store';

const CAR_COLORS = ['#6c5ce7','#fd79a8','#00b894','#0984e3','#e17055','#fdcb6e','#a29bfe','#55efc4','#fab1a0','#74b9ff'];

interface PixelCarProps {
  color: string;
  lane: number;
  speed: number;
  delay: number;
  label?: string;
  isFocusing?: boolean;
  isSelf?: boolean;
  skin?: string;
}

function PixelCar({ color, lane, speed, delay, label, isFocusing, isSelf, skin }: PixelCarProps) {
  const laneOffset = lane === 0 ? 4 : lane === 1 ? 22 : 38;

  return (
    <div
      className="absolute"
      style={{
        bottom: laneOffset,
        left: 0,
        animation: `carScroll ${speed}s linear ${delay}s infinite`,
        willChange: 'transform',
      }}
    >
      {/* Car label (username) */}
      {label && (
        <div
          className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-white"
          style={{ fontFamily: '"Press Start 2P"', fontSize: 4, textShadow: '0 0 4px rgba(0,0,0,0.8)', opacity: 0.9 }}
        >
          {label}
        </div>
      )}

      {/* Car body — pixel art using box-shadow technique */}
      <div style={{ position: 'relative', width: 24, height: 12, imageRendering: 'pixelated' }}>
        {/* Main body */}
        <div style={{
          position: 'absolute', top: 4, left: 2, width: 20, height: 6,
          background: color,
          boxShadow: isFocusing ? `0 0 8px ${color}, 0 0 16px ${color}40` : 'none',
        }} />
        {/* Cabin */}
        <div style={{ position: 'absolute', top: 1, left: 6, width: 12, height: 4, background: color, opacity: 0.8 }} />
        {/* Windows */}
        <div style={{ position: 'absolute', top: 2, left: 7, width: 4, height: 2, background: 'rgba(200,240,255,0.7)' }} />
        <div style={{ position: 'absolute', top: 2, left: 13, width: 4, height: 2, background: 'rgba(200,240,255,0.7)' }} />
        {/* Wheels */}
        <div style={{ position: 'absolute', top: 9, left: 3, width: 4, height: 4, background: '#2d3436', borderRadius: 0 }} />
        <div style={{ position: 'absolute', top: 9, left: 17, width: 4, height: 4, background: '#2d3436', borderRadius: 0 }} />
        {/* Wheel centers */}
        <div style={{ position: 'absolute', top: 10, left: 4, width: 2, height: 2, background: '#636e72' }} />
        <div style={{ position: 'absolute', top: 10, left: 18, width: 2, height: 2, background: '#636e72' }} />
        {/* Headlights */}
        <div style={{ position: 'absolute', top: 5, left: 0, width: 2, height: 2, background: '#ffeaa7', boxShadow: '0 0 4px #ffeaa7' }} />
        {/* Taillight */}
        <div style={{ position: 'absolute', top: 5, right: 0, width: 2, height: 2, background: '#d63031' }} />
        {/* Self indicator crown */}
        {isSelf && (
          <div style={{ position: 'absolute', top: -4, left: 9, width: 6, height: 3, background: '#fdcb6e', clipPath: 'polygon(0% 100%, 33% 0%, 50% 50%, 67% 0%, 100% 100%)' }} />
        )}
      </div>
    </div>
  );
}

function Streetlight({ x }: { x: number }) {
  return (
    <div className="absolute bottom-0 breathing" style={{ left: x, width: 4, height: 60 }}>
      <div style={{ width: 4, height: 50, background: '#636e72', position: 'absolute', bottom: 0 }} />
      <div style={{ width: 16, height: 4, background: '#636e72', position: 'absolute', top: 0, left: -12 }} />
      <div style={{
        width: 8, height: 8, background: '#ffeaa7',
        boxShadow: '0 0 12px 4px rgba(255,238,167,0.6), 0 0 24px 8px rgba(255,238,167,0.3)',
        position: 'absolute', top: -2, left: -14,
      }} className="animate-breathing" />
    </div>
  );
}

export function Road() {
  const { onlineUsers } = useSocialStore();
  const { profile } = useUserStore();
  const { isRunning } = useFocusStore();

  const allCars = useMemo(() => {
    const cars = onlineUsers.map((u, i) => ({
      color: u.car_color || CAR_COLORS[i % CAR_COLORS.length],
      lane: i % 3 as 0 | 1 | 2,
      speed: 8 + (i % 5) * 2,
      delay: -(i * 2.5),
      label: u.display_name || u.username,
      isFocusing: u.is_focusing,
      isSelf: false,
      skin: u.car_skin,
    }));

    // Add self car
    if (profile) {
      cars.push({
        color: profile.car_color || '#6c5ce7',
        lane: (onlineUsers.length % 3) as 0 | 1 | 2,
        speed: 10,
        delay: -1,
        label: profile.display_name || profile.username,
        isFocusing: isRunning,
        isSelf: true,
        skin: profile.car_skin,
      });
    }

    return cars;
  }, [onlineUsers, profile, isRunning]);

  return (
    <div className="absolute bottom-10 left-0 right-0" style={{ height: 70 }}>
      {/* Road surface */}
      <div className="absolute inset-0" style={{ background: '#2d3436', borderTop: '2px solid #485460', borderBottom: '2px solid #1e272e' }}>
        {/* Lane dividers */}
        <div className="absolute left-0 right-0" style={{ top: '30%', height: 2, background: 'repeating-linear-gradient(90deg, #fdcb6e 0, #fdcb6e 20px, transparent 20px, transparent 40px)', opacity: 0.6 }} />
        <div className="absolute left-0 right-0" style={{ top: '63%', height: 2, background: 'repeating-linear-gradient(90deg, #fdcb6e 0, #fdcb6e 20px, transparent 20px, transparent 40px)', opacity: 0.6 }} />

        {/* Cars */}
        {allCars.map((car, i) => (
          <PixelCar key={i} {...car} />
        ))}
      </div>

      {/* Streetlights */}
      {Array.from({ length: 10 }, (_, i) => (
        <Streetlight key={i} x={i * 200} />
      ))}

      {/* Sidewalk */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 10, background: '#636e72', borderTop: '2px solid #b2bec3' }} />
    </div>
  );
}
