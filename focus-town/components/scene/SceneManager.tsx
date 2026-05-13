'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '@/lib/hooks/useScene';
import { useSceneStore } from '@/lib/store';
import { SceneType, SCENE_PALETTES } from '@/lib/types';
import { BuildingsLayer } from './Buildings';
import { Road } from './Road';
import { ShootingStars } from './ShootingStars';
import { WeatherEffects } from './WeatherEffects';

const SCENE_LABELS: Record<SceneType, string> = {
  dawn: '🌅 Dawn', day: '☀️ Day', dusk: '🌇 Dusk',
  night: '🌙 Night', rainy: '🌧 Rainy', stormy: '⛈ Storm',
};

function SkyGradient({ scene }: { scene: SceneType }) {
  const p = SCENE_PALETTES[scene];
  const gradients: Record<SceneType, string> = {
    dawn:   `linear-gradient(180deg, ${p.sky} 0%, ${p.sky2} 50%, ${p.horizon} 100%)`,
    day:    `linear-gradient(180deg, ${p.sky} 0%, ${p.sky2} 60%, ${p.horizon} 100%)`,
    dusk:   `linear-gradient(180deg, ${p.sky} 0%, ${p.sky2} 40%, ${p.horizon} 85%, #2d3436 100%)`,
    night:  `linear-gradient(180deg, ${p.sky} 0%, ${p.sky2} 60%, ${p.horizon} 100%)`,
    rainy:  `linear-gradient(180deg, ${p.sky} 0%, ${p.sky2} 50%, ${p.horizon} 100%)`,
    stormy: `linear-gradient(180deg, ${p.sky} 0%, ${p.sky2} 40%, ${p.horizon} 100%)`,
  };

  return (
    <motion.div
      key={scene}
      className="absolute inset-0"
      style={{ background: gradients[scene], zIndex: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, ease: 'easeInOut' }}
    />
  );
}

function Moon({ scene }: { scene: SceneType }) {
  if (scene !== 'night' && scene !== 'dawn') return null;
  return (
    <motion.div
      className="absolute"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      style={{ top: '8%', right: '15%', zIndex: 1 }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 0,
        background: scene === 'night' ? '#ffeaa7' : '#fdcb6e',
        boxShadow: `0 0 20px 8px rgba(255,238,167,0.4), 0 0 40px 16px rgba(255,238,167,0.2)`,
        imageRendering: 'pixelated',
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
      }} />
      {/* Moon craters */}
      <div style={{ position:'absolute', top:8, left:10, width:6, height:6, background:'rgba(0,0,0,0.15)' }} />
      <div style={{ position:'absolute', top:18, left:22, width:4, height:4, background:'rgba(0,0,0,0.1)' }} />
    </motion.div>
  );
}

function Sun({ scene }: { scene: SceneType }) {
  if (scene !== 'day' && scene !== 'dusk' && scene !== 'dawn') return null;
  const pos = scene === 'dawn' ? { top: '25%', left: '10%' } : scene === 'dusk' ? { top: '30%', right: '8%' } : { top: '10%', left: '20%' };
  const color = scene === 'dawn' ? '#ff6b9d' : scene === 'dusk' ? '#e17055' : '#ffeaa7';
  return (
    <motion.div
      className="absolute"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2 }}
      style={{ ...pos, zIndex: 1 }}
    >
      <div style={{
        width: 48, height: 48,
        background: color,
        boxShadow: `0 0 30px 12px ${color}60, 0 0 60px 24px ${color}30`,
        imageRendering: 'pixelated',
      }} />
    </motion.div>
  );
}

function Clouds({ scene }: { scene: SceneType }) {
  if (scene === 'night') return null;
  const opacity = scene === 'rainy' || scene === 'stormy' ? 0.7 : 0.5;
  const color = scene === 'rainy' || scene === 'stormy' ? '#636e72' : 'rgba(255,255,255,0.9)';

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${8 + i * 5}%`, opacity }}
          animate={{ x: ['0%', '-100%'] }}
          transition={{ duration: 60 + i * 20, repeat: Infinity, ease: 'linear', delay: -i * 15 }}
        >
          <div style={{ display: 'flex', gap: 4 }}>
            {[...Array(8)].map((_, j) => (
              <div key={j} style={{
                width: 40 + (j % 3) * 16,
                height: 20 + (j % 2) * 8,
                background: color,
                borderRadius: 0,
                imageRendering: 'pixelated',
                marginTop: j % 2 === 0 ? 4 : 0,
              }} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SceneSwitcher() {
  const { scene, setScene, autoScene, setAutoScene } = useSceneStore();
  const [open, setOpen] = useState(false);
  const scenes: SceneType[] = ['dawn','day','dusk','night','rainy','stormy'];

  return (
    <div className="absolute top-4 right-4 z-50">
      <button
        onClick={() => setOpen(v => !v)}
        className="pixel-btn text-xs"
        style={{ fontSize: 8 }}
      >
        {SCENE_LABELS[scene]}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-10 right-0 pixel-card p-2 min-w-max"
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#a29bfe' }}>AUTO</span>
              <button
                onClick={() => setAutoScene(!autoScene)}
                className={`w-8 h-4 relative ${autoScene ? 'bg-purple-600' : 'bg-gray-600'}`}
                style={{ border: '1px solid #6c5ce7' }}
              >
                <div className={`absolute top-0 w-4 h-4 bg-white transition-all ${autoScene ? 'left-4' : 'left-0'}`} />
              </button>
            </div>
            {scenes.map(s => (
              <button
                key={s}
                onClick={() => { setScene(s); setAutoScene(false); setOpen(false); }}
                className={`block w-full text-left px-2 py-1 text-xs hover:bg-purple-900 ${scene === s ? 'text-yellow-300' : 'text-gray-300'}`}
                style={{ fontFamily: '"Press Start 2P"', fontSize: 7 }}
              >
                {SCENE_LABELS[s]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SceneManagerProps {
  children: React.ReactNode;
}

export function SceneManager({ children }: SceneManagerProps) {
  const { scene } = useScene();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Sky gradient */}
      <AnimatePresence mode="wait">
        <SkyGradient key={scene} scene={scene} />
      </AnimatePresence>

      {/* Celestial bodies */}
      <AnimatePresence>
        <Moon key={`moon-${scene}`} scene={scene} />
        <Sun  key={`sun-${scene}`}  scene={scene} />
      </AnimatePresence>

      {/* Clouds */}
      <Clouds scene={scene} />

      {/* Star field + Shooting Stars + Fireflies */}
      <ShootingStars scene={scene} />

      {/* Parallax Building Layers */}
      <BuildingsLayer layer="far"  scene={scene} />
      <BuildingsLayer layer="mid"  scene={scene} />
      <BuildingsLayer layer="near" scene={scene} />

      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '18%', background: `linear-gradient(180deg, #1e272e 0%, #2d3436 100%)`, zIndex: 3 }}
      />

      {/* Road */}
      <div style={{ zIndex: 4, position: 'relative' }}>
        <Road />
      </div>

      {/* Weather Effects */}
      <WeatherEffects scene={scene} />

      {/* Ambient light overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--scene-ambient)', zIndex: 6 }}
      />

      {/* UI Layer */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        {children}
      </div>

      {/* Scene Switcher */}
      <SceneSwitcher />
    </div>
  );
}
