'use client';
import React, { useMemo } from 'react';
import { SceneType } from '@/lib/types';

interface BuildingDef {
  width: number;
  height: number;
  color: string;
  roofType: 'flat' | 'antenna' | 'tank' | 'dome';
  windowCols: number;
  windowRows: number;
  windowLitPattern: boolean[];
  hasSignage?: boolean;
  signText?: string;
}

interface BuildingsLayerProps {
  layer: 'far' | 'mid' | 'near';
  scene: SceneType;
}

const FAR_BUILDINGS: BuildingDef[] = [
  { width: 40, height: 80,  color: 'var(--scene-building-far)', roofType: 'flat',    windowCols: 2, windowRows: 4, windowLitPattern: [true,false,true,false,false,true,false,false] },
  { width: 28, height: 60,  color: 'var(--scene-building-far)', roofType: 'antenna', windowCols: 2, windowRows: 3, windowLitPattern: [false,true,true,false,true,false] },
  { width: 50, height: 100, color: 'var(--scene-building-far)', roofType: 'tank',    windowCols: 3, windowRows: 5, windowLitPattern: [true,false,true,false,true,true,false,false,true,false,true,false,true,false,false] },
  { width: 36, height: 72,  color: 'var(--scene-building-far)', roofType: 'flat',    windowCols: 2, windowRows: 4, windowLitPattern: [false,false,true,false,true,true,false,true] },
  { width: 24, height: 48,  color: 'var(--scene-building-far)', roofType: 'antenna', windowCols: 2, windowRows: 3, windowLitPattern: [true,false,false,true,false,false] },
  { width: 44, height: 88,  color: 'var(--scene-building-far)', roofType: 'dome',    windowCols: 3, windowRows: 4, windowLitPattern: [true,false,true,false,true,false,false,true,true,false,false,true] },
  { width: 32, height: 64,  color: 'var(--scene-building-far)', roofType: 'tank',    windowCols: 2, windowRows: 4, windowLitPattern: [true,true,false,false,true,false,true,false] },
  { width: 56, height: 112, color: 'var(--scene-building-far)', roofType: 'antenna', windowCols: 4, windowRows: 5, windowLitPattern: Array(20).fill(null).map((_,i) => i%3===0) },
];

const MID_BUILDINGS: BuildingDef[] = [
  { width: 64, height: 140, color: 'var(--scene-building-mid)', roofType: 'antenna', windowCols: 4, windowRows: 6, windowLitPattern: Array(24).fill(null).map((_,i) => i%2===0), hasSignage: true, signText: 'CAFE' },
  { width: 48, height: 100, color: 'var(--scene-building-mid)', roofType: 'tank',    windowCols: 3, windowRows: 5, windowLitPattern: Array(15).fill(null).map((_,i) => i%3!==1) },
  { width: 80, height: 160, color: 'var(--scene-building-mid)', roofType: 'dome',    windowCols: 5, windowRows: 7, windowLitPattern: Array(35).fill(null).map((_,i) => Math.random()>0.4), hasSignage: true, signText: 'HOTEL' },
  { width: 56, height: 120, color: 'var(--scene-building-mid)', roofType: 'flat',    windowCols: 4, windowRows: 6, windowLitPattern: Array(24).fill(null).map((_,i) => i%3===0) },
  { width: 40, height: 88,  color: 'var(--scene-building-mid)', roofType: 'antenna', windowCols: 3, windowRows: 4, windowLitPattern: Array(12).fill(null).map((_,i) => i%2===1) },
  { width: 72, height: 150, color: 'var(--scene-building-mid)', roofType: 'tank',    windowCols: 5, windowRows: 6, windowLitPattern: Array(30).fill(null).map((_,i) => i%4!==3), hasSignage: true, signText: 'CODE' },
];

const NEAR_BUILDINGS: BuildingDef[] = [
  { width: 96,  height: 200, color: 'var(--scene-building-near)', roofType: 'dome',    windowCols: 6, windowRows: 8,  windowLitPattern: Array(48).fill(null).map((_,i) => i%3!==0), hasSignage: true, signText: 'FOCUS TOWER' },
  { width: 72,  height: 160, color: 'var(--scene-building-near)', roofType: 'antenna', windowCols: 5, windowRows: 7,  windowLitPattern: Array(35).fill(null).map((_,i) => i%2===0) },
  { width: 112, height: 240, color: 'var(--scene-building-near)', roofType: 'tank',    windowCols: 7, windowRows: 9,  windowLitPattern: Array(63).fill(null).map((_,i) => i%4!==2), hasSignage: true, signText: 'LOFI HQ' },
  { width: 80,  height: 180, color: 'var(--scene-building-near)', roofType: 'flat',    windowCols: 6, windowRows: 8,  windowLitPattern: Array(48).fill(null).map((_,i) => i%3===1) },
  { width: 64,  height: 140, color: 'var(--scene-building-near)', roofType: 'dome',    windowCols: 4, windowRows: 6,  windowLitPattern: Array(24).fill(null).map((_,i) => i%2===0) },
  { width: 88,  height: 200, color: 'var(--scene-building-near)', roofType: 'antenna', windowCols: 6, windowRows: 8,  windowLitPattern: Array(48).fill(null).map((_,i) => i%3!==1) },
];

function BuildingWindow({ lit, scene, delay }: { lit: boolean; scene: SceneType; delay: number }) {
  const nightLit = scene === 'night' || scene === 'rainy' || scene === 'stormy' || scene === 'dawn';
  const showLit = lit && nightLit;
  return (
    <div
      className={`w-2 h-2 ${showLit ? 'window-blink' : ''}`}
      style={{
        background: showLit ? 'var(--scene-window-lit)' : 'var(--scene-window-dark)',
        boxShadow: showLit ? '0 0 4px var(--scene-window-lit)' : 'none',
        animationDelay: `${delay}s`,
        imageRendering: 'pixelated',
      }}
    />
  );
}

function PixelBuilding({ def, scene }: { def: BuildingDef; scene: SceneType }) {
  const nightLit = scene === 'night' || scene === 'rainy' || scene === 'stormy' || scene === 'dawn';

  return (
    <div className="flex-shrink-0 relative" style={{ width: def.width, marginRight: 4 }}>
      {/* Roof element */}
      {def.roofType === 'antenna' && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: -def.height - 20, width: 2, height: 20, background: 'var(--scene-building-far)' }}>
          <div style={{ width: 6, height: 6, background: nightLit ? '#ff6b6b' : 'gray', borderRadius: 0, margin: '-3px -2px', boxShadow: nightLit ? '0 0 8px #ff6b6b' : 'none' }} className={nightLit ? 'window-blink' : ''} />
        </div>
      )}
      {def.roofType === 'tank' && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: -def.height - 16, width: 20, height: 16, background: 'var(--scene-building-far)', border: '2px solid var(--scene-building-mid)' }} />
      )}
      {def.roofType === 'dome' && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: -def.height - 12, width: def.width * 0.4, height: 12, background: 'var(--scene-building-mid)', borderRadius: '50% 50% 0 0' }} />
      )}

      {/* Building body */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: def.height, background: def.color, borderTop: '2px solid var(--scene-building-mid)', imageRendering: 'pixelated' }}
      >
        {/* Windows grid */}
        <div
          className="absolute inset-0 grid gap-1 p-2"
          style={{ gridTemplateColumns: `repeat(${def.windowCols}, 1fr)`, gridTemplateRows: `repeat(${def.windowRows}, 1fr)`, alignContent: 'start' }}
        >
          {def.windowLitPattern.slice(0, def.windowCols * def.windowRows).map((lit, i) => (
            <BuildingWindow key={i} lit={lit} scene={scene} delay={i * 0.3} />
          ))}
        </div>

        {/* Signage */}
        {def.hasSignage && nightLit && (
          <div
            className="absolute bottom-4 left-0 right-0 text-center"
            style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#ff6b9d', textShadow: '0 0 8px #ff6b9d', letterSpacing: 1 }}
          >
            {def.signText}
          </div>
        )}
      </div>
    </div>
  );
}

export function BuildingsLayer({ layer, scene }: BuildingsLayerProps) {
  const buildings = layer === 'far' ? FAR_BUILDINGS : layer === 'mid' ? MID_BUILDINGS : NEAR_BUILDINGS;
  const speed = layer === 'far' ? 'animate-parallax-slow' : layer === 'mid' ? 'animate-parallax-mid' : 'animate-parallax-fast';
  const bottom = layer === 'far' ? '35%' : layer === 'mid' ? '28%' : '22%';
  const scale = layer === 'far' ? 0.5 : layer === 'mid' ? 0.75 : 1;

  // Duplicate for seamless loop
  const allBuildings = [...buildings, ...buildings];

  return (
    <div className="absolute left-0 right-0 overflow-hidden" style={{ bottom, height: 300, pointerEvents: 'none' }}>
      <div className={`flex items-end ${speed}`} style={{ transform: `scale(${scale})`, transformOrigin: 'bottom left', width: '200%' }}>
        {allBuildings.map((b, i) => (
          <PixelBuilding key={i} def={b} scene={scene} />
        ))}
      </div>
    </div>
  );
}
