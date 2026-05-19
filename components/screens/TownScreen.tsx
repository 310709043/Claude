'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PixelSprite } from '@/components/pixel/PixelSprite';
import { AnimatedSprite } from '@/components/pixel/AnimatedSprite';
import { StarField } from '@/components/pixel/StarField';
import { ShootingStars } from '@/components/pixel/ShootingStars';
import { RainOverlay } from '@/components/pixel/RainOverlay';
import { Snow, Clouds, LightningFlash, Fog } from '@/components/town/Weather';
import { LogoImage, LogoMark } from '@/components/ui/LogoImage';
import { LangSwitcher } from '@/components/ui/LangSwitcher';
import { TCoinBadge } from '@/components/ui/TCoinBadge';
import { CornerDeco } from '@/components/ui/CornerDeco';
import { useTheme } from '@/components/ThemeProvider';
import { tFor } from '@/lib/i18n';
import { runRaf } from '@/lib/raf';
import {
  AVATARS,
  WALKERS,
  CAT_WALK,
  TREE,
  BENCH,
  LAMP,
  MOON,
  MOON_PAL,
  SUN,
  SUN_PAL,
  TROPHY,
  TROPHY_PAL,
  buildCar,
} from '@/lib/sprites';
import { BUILDINGS } from '@/lib/buildings';
import type { Profile } from '@/app/page';

interface Props {
  profile: Profile;
  onLogout: () => void;
  onOpenSolo: () => void;
  onOpenBuddy: () => void;
}

type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night' | 'midnight';
type Weather = 'sunny' | 'cloudy' | 'rain' | 'snow' | 'storm';

const TIMES: TimeOfDay[] = ['dawn', 'day', 'dusk', 'night', 'midnight'];
const TIME_LABEL_KEY: Record<TimeOfDay, string> = {
  dawn: 'timeDawn',
  day: 'timeDay',
  dusk: 'timeDusk',
  night: 'timeNight',
  midnight: 'timeMidnight',
};
const TIME_BG: Record<TimeOfDay, { top: string; mid: string; low: string }> = {
  dawn: { top: '#3a2552', mid: '#6e3a6e', low: '#d97a8a' },
  day: { top: '#1e4a8a', mid: '#3a7ab8', low: '#9ec5e8' },
  dusk: { top: '#2a0d1f', mid: '#b94a6e', low: '#f0825a' },
  night: { top: '#07041a', mid: '#1a0d3d', low: '#2a1854' },
  midnight: { top: '#020208', mid: '#0a0820', low: '#15093a' },
};

const WEATHER_LABEL_KEY: Record<Weather, string> = {
  sunny: 'weatherSunny',
  cloudy: 'weatherCloudy',
  rain: 'weatherRain',
  snow: 'weatherSnow',
  storm: 'weatherStorm',
};

const CARS = [buildCar('#ec4899'), buildCar('#22d3ee'), buildCar('#fbbf24')];

export function TownScreen({ profile, onLogout, onOpenSolo, onOpenBuddy }: Props) {
  const { lang, setLang, autoTime } = useTheme();
  const t = tFor(lang);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1280, h: 800 });
  const [timeIdx, setTimeIdx] = useState(3);
  const [weatherIdx, setWeatherIdx] = useState(0);
  const [coin, setCoin] = useState(247);

  const time: TimeOfDay = TIMES[timeIdx];
  const weather: Weather = (['sunny', 'cloudy', 'rain', 'snow', 'storm'] as Weather[])[weatherIdx];

  useEffect(() => {
    const update = () => {
      if (wrapRef.current) {
        setSize({ w: wrapRef.current.clientWidth, h: wrapRef.current.clientHeight });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Auto-cycle time of day (one cycle ~= 80s in autoTime mode)
  useEffect(() => {
    if (!autoTime) return;
    const id = window.setInterval(() => setTimeIdx((i) => (i + 1) % TIMES.length), 16000);
    return () => window.clearInterval(id);
  }, [autoTime]);

  const isNight = time === 'night' || time === 'midnight' || time === 'dusk';

  const bg = TIME_BG[time];

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${bg.top} 0%, ${bg.mid} 55%, ${bg.low} 100%)`,
        transition: 'background 0.6s ease',
      }}
    >
      {/* Sky */}
      {isNight && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <StarField width={size.w} height={size.h} density={0.0007} />
        </div>
      )}
      {time === 'night' && <ShootingStars width={size.w} height={size.h} />}
      {weather === 'rain' && <RainOverlay width={size.w} height={size.h} color="var(--accent-3)" />}
      {weather === 'snow' && <Snow width={size.w} height={size.h} />}
      {weather === 'storm' && (
        <>
          <RainOverlay width={size.w} height={size.h} color="#9ec5e8" density={2} />
          <LightningFlash />
        </>
      )}
      {weather === 'cloudy' && <Clouds width={size.w} height={size.h} />}
      {time === 'dusk' && <Fog />}

      {/* Sun / Moon */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          right: 120,
          opacity: 0.92,
          animation: 'float-moon 8s ease-in-out infinite',
        }}
      >
        {time === 'day' || time === 'dawn' ? (
          <PixelSprite sprite={SUN} palette={SUN_PAL} scale={5} glow="rgba(252,211,77,0.6)" />
        ) : (
          <PixelSprite sprite={MOON} palette={MOON_PAL} scale={5} glow="rgba(252,211,77,0.5)" />
        )}
      </div>

      {/* Top HUD */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div layoutId="lbt-logo" transition={{ duration: 0.6, ease: 'easeInOut' }}>
            <LogoMark size={32} />
          </motion.div>
          <TownStat icon="◉" label={t(TIME_LABEL_KEY[time]) as string} value="" />
          <TownStat icon="✦" label={t(WEATHER_LABEL_KEY[weather]) as string} value="" />
          <TownStat icon="🍅" label={t('citizens') as string} value="2,847" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <TCoinBadge amount={coin} label={t('tcoin') as string} />
          <LangSwitcher lang={lang} onChange={setLang} compact />
          <button onClick={onLogout} className="pixel-btn" style={{ padding: '6px 10px', fontSize: 10 }}>
            {t('logout')}
          </button>
        </div>
      </div>

      {/* Buildings skyline */}
      <BuildingRow width={size.w} />

      {/* Ground walkers + props */}
      <GroundLayer width={size.w} />

      {/* Sky leaderboard */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="pixel-panel"
        style={{
          position: 'absolute',
          top: 92,
          right: 24,
          padding: 14,
          width: 240,
          zIndex: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <CornerDeco color="var(--accent-3)" />
        <div
          style={{
            fontFamily: 'var(--font-silkscreen), monospace',
            fontSize: 10,
            color: 'var(--accent-3)',
            letterSpacing: '0.25em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <PixelSprite sprite={TROPHY} palette={TROPHY_PAL} scale={1.6} />
          {t('todayRank')}
        </div>
        {Leaderboard.map((row, i) => (
          <div
            key={row.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-silkscreen), monospace',
              fontSize: 11,
              color: 'var(--ink-mute)',
            }}
          >
            <span style={{ color: i === 0 ? 'var(--accent-4)' : 'var(--ink-dim)', width: 18 }}>
              #{i + 1}
            </span>
            <PixelSprite
              sprite={AVATARS[(i * 3) % AVATARS.length].sprite}
              palette={AVATARS[(i * 3) % AVATARS.length].palette}
              scale={1.4}
            />
            <span style={{ flex: 1 }}>{row.name}</span>
            <span style={{ color: 'var(--accent)' }}>{row.mins}m</span>
          </div>
        ))}
      </motion.div>

      {/* Center CTA dock */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 40,
          display: 'flex',
          gap: 16,
          zIndex: 10,
        }}
      >
        <MagneticCTA onClick={onOpenSolo} accent="var(--accent)">
          <PixelSprite
            sprite={`
.RRRR.
RWRWWR
RWWWWR
RWWWWR
RWWWWR
.RRRR.
`}
            palette={{ R: '#dc2626', W: '#fca5a5' }}
            scale={3}
            glow="rgba(220,38,38,0.5)"
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
              minWidth: 140,
            }}
          >
            <span style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.2em' }}>
              SOLO ROOM
            </span>
            <span style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 700 }}>
              {t('soloFocus')}
            </span>
          </div>
        </MagneticCTA>
        <MagneticCTA onClick={onOpenBuddy} accent="var(--accent-2)">
          <PixelSprite
            sprite={`
.BB.BB.
BBBBBBB
BBBBBBB
.BBBBB.
..BBB..
...B...
`}
            palette={{ B: '#ec4899' }}
            scale={3}
            glow="rgba(236,72,153,0.55)"
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
              minWidth: 140,
            }}
          >
            <span style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.2em' }}>
              BUDDY ROOM
            </span>
            <span style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 700 }}>
              {t('findBuddy')}
            </span>
          </div>
        </MagneticCTA>
      </motion.div>

      {/* Bottom-left status pill */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          bottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 12px',
          background: 'rgba(7,4,26,0.75)',
          border: '1px solid var(--panel-stroke)',
          fontFamily: 'var(--font-silkscreen), monospace',
          fontSize: 11,
          color: 'var(--ink-mute)',
          letterSpacing: '0.12em',
          zIndex: 12,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            background: 'var(--accent-3)',
            boxShadow: '0 0 6px var(--accent-3)',
            animation: 'blink-soft 2.4s infinite',
          }}
        />
        <span>HELLO,</span>
        <span style={{ color: 'var(--ink)' }}>{profile.name || 'CITIZEN'}</span>
        <span>· LV.{profile.level}</span>
      </div>

      {/* Dev shortcut: cycle time + weather */}
      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          display: 'flex',
          gap: 6,
          zIndex: 12,
        }}
      >
        <button
          className="pixel-btn"
          onClick={() => setTimeIdx((i) => (i + 1) % TIMES.length)}
          style={{ padding: '6px 10px', fontSize: 10 }}
        >
          ☀ {t(TIME_LABEL_KEY[time])}
        </button>
        <button
          className="pixel-btn"
          onClick={() => setWeatherIdx((i) => (i + 1) % 5)}
          style={{ padding: '6px 10px', fontSize: 10 }}
        >
          ✧ {t(WEATHER_LABEL_KEY[weather])}
        </button>
        <button
          className="pixel-btn"
          onClick={() => setCoin((c) => c + 25)}
          style={{ padding: '6px 10px', fontSize: 10 }}
        >
          +25 T
        </button>
      </div>
    </motion.div>
  );
}

const Leaderboard = [
  { id: 1, name: 'Hina', mins: 312 },
  { id: 2, name: 'Yuki', mins: 287 },
  { id: 3, name: 'Mio', mins: 245 },
  { id: 4, name: 'Ren', mins: 220 },
  { id: 5, name: 'Aki', mins: 199 },
];

function TownStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        background: 'rgba(7,4,26,0.55)',
        border: '1px solid var(--panel-stroke)',
        fontFamily: 'var(--font-silkscreen), monospace',
        fontSize: 10,
        letterSpacing: '0.12em',
        color: 'var(--ink-mute)',
      }}
    >
      <span style={{ color: 'var(--accent-3)' }}>{icon}</span>
      <span>{label}</span>
      {value && <span style={{ color: 'var(--ink)' }}>{value}</span>}
    </div>
  );
}

function BuildingRow({ width }: { width: number }) {
  // Tile buildings across width
  const tiles = useMemo(() => {
    const list: { idx: number; left: number; scale: number }[] = [];
    let x = 0;
    let i = 0;
    while (x < width + 80) {
      const b = BUILDINGS[i % BUILDINGS.length];
      const scale = 2.8 + ((i % 3) - 1) * 0.4;
      list.push({ idx: i % BUILDINGS.length, left: x, scale });
      x += b.width * scale + 6;
      i++;
    }
    return list;
  }, [width]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 110,
        height: 220,
        display: 'flex',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    >
      {tiles.map((t, i) => {
        const b = BUILDINGS[t.idx];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: t.left,
              bottom: 0,
              animation: `float-y 6s ease-in-out infinite`,
              animationDelay: `${(i % 5) * 0.3}s`,
              filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.45))',
            }}
          >
            <PixelSprite sprite={b.sprite} palette={b.palette} scale={t.scale} />
          </div>
        );
      })}
    </div>
  );
}

function GroundLayer({ width }: { width: number }) {
  const [pos, setPos] = useState({
    walker1: 5,
    walker2: 30,
    walker3: 60,
    walker4: 88,
    cat: 22,
    car: 0,
  });
  useEffect(() => {
    return runRaf(() => {
      setPos((p) => ({
        walker1: (p.walker1 + 0.045) % 110,
        walker2: (p.walker2 + 0.06) % 110,
        walker3: (p.walker3 + 0.035) % 110,
        walker4: (p.walker4 + 0.05) % 110,
        cat: (p.cat + 0.08) % 110,
        car: (p.car + 0.18) % 120,
      }));
    });
  }, []);
  return (
    <>
      {/* Ground stripe */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 110,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.0), rgba(7,4,26,0.65) 30%, rgba(7,4,26,0.85))',
          borderTop: '1px solid var(--panel-stroke)',
          zIndex: 5,
        }}
      />
      {/* Props */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 60, zIndex: 6 }}>
        <div style={{ position: 'absolute', left: '12%', bottom: 0 }}>
          <PixelSprite sprite={TREE.sprite} palette={TREE.palette} scale={2.2} />
        </div>
        <div style={{ position: 'absolute', left: '46%', bottom: 0 }}>
          <PixelSprite sprite={BENCH.sprite} palette={BENCH.palette} scale={2.2} />
        </div>
        <div style={{ position: 'absolute', left: '78%', bottom: 0 }}>
          <PixelSprite sprite={LAMP.sprite} palette={LAMP.palette} scale={2.2} />
        </div>
      </div>
      {/* Walkers */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 30,
          height: 60,
          zIndex: 7,
          pointerEvents: 'none',
        }}
      >
        {[
          { pos: pos.walker1, walker: WALKERS[0], dir: 1 },
          { pos: pos.walker2, walker: WALKERS[2], dir: 1 },
          { pos: pos.walker3, walker: WALKERS[4], dir: -1 },
          { pos: pos.walker4, walker: WALKERS[6], dir: 1 },
        ].map((w, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${w.pos}%`,
              bottom: 0,
              transform: w.dir < 0 ? 'scaleX(-1)' : 'none',
            }}
          >
            <AnimatedSprite frames={w.walker.frames} palette={w.walker.palette} scale={2.2} fps={3} />
          </div>
        ))}
        <div style={{ position: 'absolute', left: `${pos.cat}%`, bottom: 6 }}>
          <AnimatedSprite frames={CAT_WALK.frames} palette={CAT_WALK.palette} scale={2} fps={3} />
        </div>
        <div style={{ position: 'absolute', left: `${pos.car - 20}%`, bottom: 24 }}>
          <AnimatedSprite frames={CARS[0].frames} palette={CARS[0].palette} scale={2.2} fps={3} />
        </div>
      </div>
    </>
  );
}

function MagneticCTA({
  onClick,
  children,
  accent,
}: {
  onClick: () => void;
  children: React.ReactNode;
  accent: string;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return (
    <motion.button
      onClick={onClick}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.15;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.15;
        setOffset({ x: dx, y: dy });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 14 }}
      whileTap={{ scale: 0.96 }}
      style={{
        background: 'rgba(7,4,26,0.85)',
        border: `2px solid ${accent}`,
        boxShadow: `0 0 0 1px var(--bg-0), 0 0 18px ${accent}66, 0 12px 32px rgba(0,0,0,0.6)`,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
        color: 'var(--ink)',
        fontFamily: 'var(--font-silkscreen), monospace',
      }}
    >
      {children}
    </motion.button>
  );
}
