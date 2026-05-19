'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelSprite } from '@/components/pixel/PixelSprite';
import { LogoMark } from '@/components/ui/LogoImage';
import { LangSwitcher } from '@/components/ui/LangSwitcher';
import { CornerDeco } from '@/components/ui/CornerDeco';
import { useTheme } from '@/components/ThemeProvider';
import { tFor } from '@/lib/i18n';
import {
  AVATARS,
  TOMATO_SPRITE,
  TOMATO_PAL,
  COFFEE,
  COFFEE_PAL,
  NOTE,
  NOTE_PAL,
} from '@/lib/sprites';
import type { Profile } from '@/app/page';

interface Props {
  profile: Profile;
  onExit: () => void;
}

type Mode = 'idle' | 'focus' | 'break' | 'done';

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

export function SoloFocusScreen({ profile, onExit }: Props) {
  const { lang, setLang } = useTheme();
  const t = tFor(lang);
  const [mode, setMode] = useState<Mode>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [tasks, setTasks] = useState<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: '完成註冊頁面動畫', done: true },
    { id: 2, text: '寫今天的 25 分鐘專注', done: false },
    { id: 3, text: '回信 3 封', done: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [coinPop, setCoinPop] = useState<{ id: number; amount: number }[]>([]);
  const popId = useRef(0);

  const total = mode === 'break' ? BREAK_SECONDS : FOCUS_SECONDS;
  const remaining = Math.max(0, total - elapsed);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const progress = Math.min(1, elapsed / total);

  useEffect(() => {
    if (mode !== 'focus' && mode !== 'break') return;
    const id = window.setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        if (next >= total) {
          if (mode === 'focus') {
            setMode('done');
            const earned = 25;
            const pid = ++popId.current;
            setCoinPop((cp) => [...cp, { id: pid, amount: earned }]);
            window.setTimeout(() => setCoinPop((cp) => cp.filter((x) => x.id !== pid)), 1800);
          } else {
            setMode('idle');
          }
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [mode, total]);

  const reset = () => {
    setMode('idle');
    setElapsed(0);
  };

  const avatar = AVATARS.find((a) => a.id === profile.avatarId) || AVATARS[0];

  const tomatoFrame = useMemo(() => {
    // Animate via opacity layers — the sprite stays the same but scale grows
    return progress;
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse at 50% 40%, var(--sky-mid) 0%, var(--bg-1) 60%, var(--bg-0) 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient drifting items */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: 0,
          animation: 'drift-x 32s linear infinite',
          opacity: 0.4,
          zIndex: 1,
        }}
      >
        <PixelSprite sprite={COFFEE} palette={COFFEE_PAL} scale={2} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: 0,
          animation: 'drift-x-rev 28s linear infinite',
          opacity: 0.4,
          zIndex: 1,
        }}
      >
        <PixelSprite sprite={NOTE} palette={NOTE_PAL} scale={2} glow="var(--accent-3)" />
      </div>

      {/* Steam puffs */}
      <Steam />

      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onExit} className="pixel-btn" style={{ padding: '6px 12px', fontSize: 10 }}>
            ◀ {t('back')}
          </button>
          <LogoMark size={28} />
          <span
            style={{
              fontFamily: 'var(--font-silkscreen), monospace',
              fontSize: 11,
              letterSpacing: '0.2em',
              color: 'var(--ink-mute)',
            }}
          >
            {t('soloRoom')}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: 'var(--font-silkscreen), monospace',
              fontSize: 10,
              color: 'var(--accent-3)',
              letterSpacing: '0.2em',
            }}
          >
            ♪ {t('musicTip')}
          </span>
          <LangSwitcher lang={lang} onChange={setLang} compact />
        </div>
      </div>

      {/* Center timer */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          zIndex: 5,
        }}
      >
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          {/* Growing tomato — scale tween via progress */}
          <motion.div
            animate={{ scale: 0.4 + tomatoFrame * 0.6 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 6px 18px rgba(220,38,38,0.4))',
            }}
          >
            <PixelSprite sprite={TOMATO_SPRITE} palette={TOMATO_PAL} scale={8} />
          </motion.div>
          {/* Ring */}
          <svg
            viewBox="0 0 100 100"
            style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
          >
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(220,38,38,0.18)" strokeWidth="3" />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--accent-2)"
              strokeWidth="3"
              strokeDasharray={2 * Math.PI * 46}
              animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - progress) }}
              transition={{ duration: 0.6, ease: 'linear' }}
              style={{ filter: 'drop-shadow(0 0 6px var(--accent-2))' }}
            />
          </svg>
        </div>

        <div
          className="ps2p"
          style={{
            fontSize: 48,
            color: 'var(--ink)',
            letterSpacing: '0.05em',
            textShadow: 'var(--neon-glow)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-silkscreen), monospace',
            fontSize: 11,
            color: mode === 'focus' ? 'var(--accent-2)' : 'var(--ink-mute)',
            letterSpacing: '0.3em',
          }}
        >
          {mode === 'focus'
            ? t('focusingNow')
            : mode === 'break'
              ? 'BREAK'
              : mode === 'done'
                ? '✦ DONE'
                : 'READY'}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {mode === 'idle' || mode === 'done' ? (
            <button
              onClick={() => {
                setElapsed(0);
                setMode('focus');
              }}
              className="pixel-btn primary"
              style={{ padding: '12px 28px', fontSize: 13 }}
            >
              ▶ {t('start')}
            </button>
          ) : (
            <button
              onClick={() => setMode('idle')}
              className="pixel-btn"
              style={{ padding: '12px 22px', fontSize: 12 }}
            >
              ❚❚ {t('pause')}
            </button>
          )}
          <button onClick={reset} className="pixel-btn" style={{ padding: '12px 22px', fontSize: 12 }}>
            ⟲ {t('reset')}
          </button>
        </div>
      </div>

      {/* Tasks panel */}
      <div
        className="pixel-panel"
        style={{
          position: 'absolute',
          left: 24,
          bottom: 24,
          width: 280,
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 8,
        }}
      >
        <CornerDeco />
        <div
          style={{
            fontFamily: 'var(--font-silkscreen), monospace',
            fontSize: 11,
            color: 'var(--accent)',
            letterSpacing: '0.2em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ✦ {t('tasks')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
          {tasks.map((task) => (
            <motion.label
              key={task.id}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: task.done ? 'var(--ink-dim)' : 'var(--ink)',
                textDecoration: task.done ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              <span
                onClick={() =>
                  setTasks((ts) =>
                    ts.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
                  )
                }
                style={{
                  width: 14,
                  height: 14,
                  border: '1px solid var(--panel-stroke-strong)',
                  background: task.done ? 'var(--accent)' : 'rgba(0,0,0,0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0a0524',
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {task.done && '✓'}
              </span>
              <span>{task.text}</span>
            </motion.label>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const txt = newTask.trim();
            if (!txt) return;
            setTasks((ts) => [...ts, { id: Date.now(), text: txt, done: false }]);
            setNewTask('');
          }}
          style={{ display: 'flex', gap: 6 }}
        >
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="pixel-input"
            placeholder={t('addTask') as string}
            style={{ flex: 1 }}
          />
          <button type="submit" className="pixel-btn" style={{ padding: '8px 10px' }}>
            +
          </button>
        </form>
      </div>

      {/* Profile chip */}
      <div
        style={{
          position: 'absolute',
          right: 24,
          bottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          background: 'rgba(7,4,26,0.75)',
          border: '1px solid var(--panel-stroke)',
          fontFamily: 'var(--font-silkscreen), monospace',
          fontSize: 11,
          color: 'var(--ink-mute)',
          letterSpacing: '0.12em',
          zIndex: 8,
        }}
      >
        <PixelSprite sprite={avatar.sprite} palette={avatar.palette} scale={1.6} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--ink)' }}>{profile.name || 'YOU'}</span>
          <span style={{ fontSize: 9, color: 'var(--ink-dim)' }}>LV.{profile.level}</span>
        </div>
      </div>

      {/* Coin pop overlay */}
      <AnimatePresence>
        {coinPop.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], y: -120, scale: [0.8, 1.2, 1.05, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '36%',
              transform: 'translateX(-50%)',
              color: '#fcd34d',
              textShadow: '0 0 12px #fcd34d',
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: 28,
              pointerEvents: 'none',
              zIndex: 30,
            }}
          >
            +{p.amount} T
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function Steam() {
  const puffs = useMemo(() => Array.from({ length: 6 }), []);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '36%',
        transform: 'translateX(-50%)',
        width: 80,
        height: 120,
        pointerEvents: 'none',
        zIndex: 4,
      }}
    >
      {puffs.map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${(i % 3) * 20}px`,
            top: 0,
            width: 6,
            height: 6,
            background: 'rgba(245,243,255,0.7)',
            borderRadius: 999,
            animation: `steam-${i % 6} 3.6s ease-in-out infinite`,
            animationDelay: `${(i * 0.4) % 2.4}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes steam-0 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 0.8; } 100% { opacity: 0; transform: translateY(-50px); } }
        @keyframes steam-1 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 0.7; } 100% { opacity: 0; transform: translateY(-60px); } }
        @keyframes steam-2 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 0.6; } 100% { opacity: 0; transform: translateY(-55px); } }
        @keyframes steam-3 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 0.8; } 100% { opacity: 0; transform: translateY(-65px); } }
        @keyframes steam-4 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 0.7; } 100% { opacity: 0; transform: translateY(-52px); } }
        @keyframes steam-5 { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 0.6; } 100% { opacity: 0; transform: translateY(-58px); } }
      `}</style>
    </div>
  );
}
