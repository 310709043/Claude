'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PixelSprite } from '@/components/pixel/PixelSprite';
import { AnimatedSprite } from '@/components/pixel/AnimatedSprite';
import { StarField } from '@/components/pixel/StarField';
import { ShootingStars } from '@/components/pixel/ShootingStars';
import { RainOverlay } from '@/components/pixel/RainOverlay';
import { LogoImage } from '@/components/ui/LogoImage';
import { LangSwitcher } from '@/components/ui/LangSwitcher';
import { CornerDeco, STAR_TINY } from '@/components/ui/CornerDeco';
import { useTheme } from '@/components/ThemeProvider';
import { tFor } from '@/lib/i18n';
import { runRaf } from '@/lib/raf';
import {
  AVATARS,
  WALKERS,
  CAT_WALK,
  MOON,
  MOON_PAL,
  COFFEE,
  COFFEE_PAL,
  NOTE,
  NOTE_PAL,
  drawSkyline,
  type SkylinePalette,
} from '@/lib/sprites';

interface LoginProps {
  onLogin: (p: { email?: string; provider?: string }) => void;
}

function shade(hex: string, k: number) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return `#${[r, g, b]
    .map((x) => Math.floor(x * k).toString(16).padStart(2, '0'))
    .join('')}`;
}

export function LoginScreen({ onLogin }: LoginProps) {
  const { direction, lang, setLang } = useTheme();
  const t = tFor(lang);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1280, h: 800 });
  const skyRef = useRef<HTMLCanvasElement>(null);
  const farSkyRef = useRef<HTMLCanvasElement>(null);
  const farthestRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    const palettes: Record<string, SkylinePalette> = {
      neon: { body: '#0b0524', edge: '#241355', windows: ['#fcd34d', '#67e8f9', '#f0abfc', '#6ee7b7'] },
      dusk: { body: '#1a0f1f', edge: '#3a1a2e', windows: ['#ffd166', '#ff8c5a', '#ff6b9d', '#ffb86b'] },
      rain: { body: '#050d2a', edge: '#1a2a5a', windows: ['#00f5d4', '#ff006e', '#ffbe0b', '#8338ec'] },
    };
    const p = palettes[direction] || palettes.neon;
    if (skyRef.current) drawSkyline(skyRef.current, { width: size.w, height: 230, seed: 7, palette: p });
    if (farSkyRef.current)
      drawSkyline(farSkyRef.current, {
        width: size.w,
        height: 150,
        seed: 22,
        layer: 'bg',
        palette: { ...p, body: shade(p.body, 0.7) },
      });
    if (farthestRef.current)
      drawSkyline(farthestRef.current, {
        width: size.w,
        height: 110,
        seed: 41,
        layer: 'bg',
        palette: { ...p, body: shade(p.body, 0.55) },
      });
  }, [size.w, direction]);

  const featured = useMemo(() => AVATARS.slice(0, 7), []);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 65%, var(--sky-low) 100%)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <StarField width={size.w} height={size.h} density={0.0008} />
      </div>
      <ShootingStars width={size.w} height={size.h} />
      {direction === 'rain' && <RainOverlay width={size.w} height={size.h} color="var(--accent)" />}

      <div
        style={{
          position: 'absolute',
          top: 80,
          right: 100,
          opacity: 0.9,
          animation: 'float-moon 8s ease-in-out infinite',
        }}
      >
        <PixelSprite sprite={MOON} palette={MOON_PAL} scale={5} glow="rgba(252,211,77,0.5)" />
      </div>

      <canvas
        ref={farthestRef}
        style={{
          position: 'absolute',
          left: 0,
          bottom: 280,
          width: size.w,
          height: 110,
          imageRendering: 'pixelated',
          opacity: 0.4,
        }}
      />
      <canvas
        ref={farSkyRef}
        style={{
          position: 'absolute',
          left: 0,
          bottom: 200,
          width: size.w,
          height: 150,
          imageRendering: 'pixelated',
          opacity: 0.55,
        }}
      />
      <canvas
        ref={skyRef}
        style={{
          position: 'absolute',
          left: 0,
          bottom: 80,
          width: size.w,
          height: 230,
          imageRendering: 'pixelated',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 80,
          background: 'linear-gradient(180deg, var(--bg-1), var(--bg-0))',
          borderTop: '1px solid var(--panel-stroke)',
        }}
      />

      <LoginCitizens />
      <FloatingPixels />

      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          right: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            fontFamily: 'var(--font-silkscreen), monospace',
            fontSize: 10,
            color: 'var(--ink-mute)',
            letterSpacing: '0.15em',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>
            <BlinkDot color="var(--accent)" /> LBT
          </span>
          <span>v1.4.0</span>
          <span>·</span>
          <span style={{ color: '#6ee7b7' }}>
            {t('citizens')} <NumberRoll target={2847} />
          </span>
        </div>
        <LangSwitcher lang={lang} onChange={setLang} />
      </div>

      <div
        style={{
          position: 'relative',
          minHeight: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 420px 1fr',
          alignItems: 'center',
          justifyItems: 'center',
          gap: 24,
          padding: '60px 24px 24px',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            gridColumn: 1,
          }}
        >
          <motion.div
            layoutId="lbt-logo"
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ animation: 'logo-bob 3.5s ease-in-out infinite' }}
          >
            <LogoImage size={140} />
          </motion.div>
          <Tagline t={t} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              marginTop: 6,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-silkscreen), monospace',
                fontSize: 9,
                color: 'var(--ink-dim)',
                letterSpacing: '0.3em',
              }}
            >
              {t('onlineCount', 2847)}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {featured.slice(0, 6).map((a, i) => (
                <div
                  key={a.id ?? i}
                  style={{
                    animation: 'float-y 2.2s ease-in-out infinite',
                    animationDelay: `${i * 0.16}s`,
                  }}
                >
                  <PixelSprite
                    sprite={a.sprite}
                    palette={a.palette}
                    scale={1.8}
                    glow="rgba(167,139,250,0.4)"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ gridColumn: 2 }}
        >
          {mode === 'signin' ? (
            <SignInForm
              t={t}
              onSubmit={(p) => onLogin(p)}
              onSignup={() => setMode('signup')}
            />
          ) : (
            <SignUpForm
              t={t}
              onSubmit={(p) => onLogin(p)}
              onSignin={() => setMode('signin')}
            />
          )}
        </motion.div>

        <div
          style={{
            gridColumn: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            maxWidth: 280,
          }}
        >
          <LoreCard lang={lang} />
        </div>
      </div>
    </motion.div>
  );
}

// ---- Tagline typewriter ----
function Tagline({ t }: { t: ReturnType<typeof tFor> }) {
  const text = t('tagline') as string;
  const [shown, setShown] = useState('');
  const [phase, setPhase] = useState<'typing' | 'hold' | 'erasing'>('typing');
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setShown('');
    setPhase('typing');
  }, [text]);

  useEffect(() => {
    let id: number | undefined;
    if (phase === 'typing') {
      id = window.setInterval(() => {
        indexRef.current++;
        setShown(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) setPhase('hold');
      }, 60);
    } else if (phase === 'hold') {
      id = window.setTimeout(() => setPhase('erasing'), 2400) as unknown as number;
    } else {
      id = window.setInterval(() => {
        indexRef.current = Math.max(0, indexRef.current - 1);
        setShown(text.slice(0, indexRef.current));
        if (indexRef.current === 0) setPhase('typing');
      }, 30);
    }
    return () => {
      if (id !== undefined) {
        window.clearInterval(id);
        window.clearTimeout(id);
      }
    };
  }, [phase, text]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-silkscreen), monospace',
        fontSize: 12,
        color: 'var(--ink-mute)',
        letterSpacing: '0.3em',
        minHeight: 18,
      }}
    >
      <PixelSprite sprite={STAR_TINY} palette={{ Y: 'var(--accent-3)' }} scale={2} />
      <span style={{ textShadow: '0 0 6px rgba(0,0,0,0.6)' }}>{shown}</span>
      <span
        style={{
          display: 'inline-block',
          width: 6,
          height: 12,
          background: 'var(--accent-3)',
          boxShadow: 'var(--neon-glow-cyan)',
          animation: 'caret-blink 0.9s steps(2) infinite',
        }}
      />
    </div>
  );
}

function NumberRoll({ target }: { target: number }) {
  const [n, setN] = useState(Math.max(0, target - 80));
  useEffect(() => {
    let cur = n;
    const id = window.setInterval(() => {
      cur = Math.min(target, cur + Math.ceil((target - cur) / 8));
      setN(cur);
      if (cur >= target) window.clearInterval(id);
    }, 60);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return <span style={{ animation: 'count-up 0.3s' }}>{n.toLocaleString()}</span>;
}

function BlinkDot({ color = 'var(--accent)' }: { color?: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 6,
        height: 6,
        background: color,
        boxShadow: `0 0 6px ${color}`,
        animation: 'blink-soft 2.4s infinite',
        verticalAlign: 'middle',
        marginRight: 4,
      }}
    />
  );
}

function LoginCitizens() {
  const cs = useMemo(
    () => [
      { walker: WALKERS[0], speed: 0.05, x: 5, dir: 1 },
      { walker: WALKERS[2], speed: 0.04, x: 28, dir: 1 },
      { walker: WALKERS[5], speed: 0.06, x: 56, dir: -1 },
      { walker: WALKERS[6], speed: 0.045, x: 78, dir: 1 },
      { walker: WALKERS[4], speed: 0.05, x: 92, dir: -1 },
    ],
    [],
  );
  const [pos, setPos] = useState(cs.map((c) => c.x));
  useEffect(() => {
    return runRaf(() => {
      setPos((ps) =>
        ps.map((p, i) => {
          let np = p + cs[i].speed * cs[i].dir;
          if (np > 105) np = -4;
          if (np < -6) np = 102;
          return np;
        }),
      );
    });
  }, [cs]);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 20,
        height: 50,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {cs.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${pos[i]}%`,
            bottom: 0,
            transform: c.dir < 0 ? 'scaleX(-1)' : 'none',
          }}
        >
          <AnimatedSprite frames={c.walker.frames} palette={c.walker.palette} scale={2.2} fps={3} />
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: '40%',
          bottom: 4,
          animation: 'drift-x 28s linear infinite',
        }}
      >
        <AnimatedSprite frames={CAT_WALK.frames} palette={CAT_WALK.palette} scale={2} fps={3} />
      </div>
    </div>
  );
}

function FloatingPixels() {
  const items = [
    { y: '18%', spr: COFFEE, pal: COFFEE_PAL, scale: 3, dur: 38, delay: 0 },
    {
      y: '24%',
      spr: NOTE,
      pal: NOTE_PAL,
      scale: 3,
      dur: 32,
      delay: 6,
      glow: 'var(--accent-3)',
      rev: true,
    },
    { y: '32%', spr: COFFEE, pal: COFFEE_PAL, scale: 2, dur: 42, delay: 12 },
    {
      y: '38%',
      spr: NOTE,
      pal: NOTE_PAL,
      scale: 2,
      dur: 35,
      delay: 18,
      glow: 'var(--accent-3)',
      rev: true,
    },
  ];
  return (
    <>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: it.y,
            left: 0,
            animation: `${it.rev ? 'drift-x-rev' : 'drift-x'} ${it.dur}s linear infinite`,
            animationDelay: `-${it.delay}s`,
            zIndex: 1,
            opacity: 0.85,
          }}
        >
          <PixelSprite sprite={it.spr} palette={it.pal} scale={it.scale} glow={it.glow} />
        </div>
      ))}
    </>
  );
}

// ============ Forms ============

type SubmitPayload = { email?: string; provider?: string };

function SignInForm({
  t,
  onSubmit,
  onSignup,
}: {
  t: ReturnType<typeof tFor>;
  onSubmit: (p: SubmitPayload) => void;
  onSignup: () => void;
}) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [remember, setRemember] = useState(true);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email: email || 'guest@lowbatterytown.app' });
      }}
      className="pixel-panel"
      style={{
        width: 380,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
      }}
    >
      <CornerDeco />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 11,
          color: 'var(--ink-mute)',
          fontFamily: 'var(--font-silkscreen), monospace',
          letterSpacing: '0.2em',
        }}
      >
        <BlinkDot color="var(--accent-3)" />
        <span>{(t('signInTitle') as string).toUpperCase()}</span>
      </div>

      <button
        type="button"
        onClick={() => onSubmit({ provider: 'google', email: 'simon@gmail.com' })}
        className="pixel-btn"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          background: '#fff',
          color: '#0a0524',
          borderColor: '#fff',
          fontWeight: 700,
        }}
      >
        <GoogleG />
        <span>{t('continueWithGoogle')}</span>
      </button>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => onSubmit({ provider: 'github' })}
          className="pixel-btn"
          style={{
            flex: 1,
            padding: '8px 8px',
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <GithubIcon /> GitHub
        </button>
        <button
          type="button"
          onClick={() => onSubmit({ provider: 'apple' })}
          className="pixel-btn"
          style={{
            flex: 1,
            padding: '8px 8px',
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
           Apple
        </button>
      </div>

      <Divider t={t} />

      <div>
        <Label>{(t('email') as string).toUpperCase()}</Label>
        <input
          className="pixel-input"
          placeholder="you@lowbatterytown.app"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label>{(t('password') as string).toUpperCase()}</Label>
        <input
          className="pixel-input"
          placeholder="••••••••"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 6,
            fontSize: 9,
            color: 'var(--ink-dim)',
            fontFamily: 'var(--font-silkscreen), monospace',
          }}
        >
          <label
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <PixelCheckbox checked={remember} onClick={() => setRemember(!remember)} />
            <span>{t('rememberMe')}</span>
          </label>
          <span style={{ cursor: 'pointer' }}>{t('forgot')}</span>
        </div>
      </div>

      <button
        type="submit"
        className="pixel-btn primary"
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 13,
        }}
      >
        <span>✦</span>
        <span>{t('enterTown')}</span>
      </button>

      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-silkscreen), monospace',
          fontSize: 10,
          color: 'var(--ink-dim)',
          marginTop: 4,
        }}
      >
        {t('newHere')}{' '}
        <span
          onClick={onSignup}
          style={{ color: 'var(--accent)', cursor: 'pointer', textShadow: 'var(--neon-glow)' }}
        >
          {t('createAcc')} →
        </span>
      </div>
    </form>
  );
}

function SignUpForm({
  t,
  onSubmit,
  onSignin,
}: {
  t: ReturnType<typeof tFor>;
  onSubmit: (p: SubmitPayload) => void;
  onSignin: () => void;
}) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [agree, setAgree] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!agree) return;
        onSubmit({ email: email || 'new@lowbatterytown.app' });
      }}
      className="pixel-panel"
      style={{
        width: 380,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
      }}
    >
      <CornerDeco color="var(--accent-2)" />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 11,
          color: 'var(--ink-mute)',
          fontFamily: 'var(--font-silkscreen), monospace',
          letterSpacing: '0.2em',
        }}
      >
        <BlinkDot color="var(--accent-2)" />
        <span>{(t('signupTitle') as string).toUpperCase()}</span>
      </div>

      <button
        type="button"
        onClick={() => onSubmit({ provider: 'google', email: 'simon@gmail.com' })}
        className="pixel-btn"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          background: '#fff',
          color: '#0a0524',
          borderColor: '#fff',
          fontWeight: 700,
        }}
      >
        <GoogleG />
        <span>{t('continueWithGoogle')}</span>
      </button>

      <Divider t={t} />

      <div>
        <Label>{(t('email') as string).toUpperCase()}</Label>
        <input
          className="pixel-input"
          placeholder="you@lowbatterytown.app"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <Label>{(t('password') as string).toUpperCase()}</Label>
          <input
            className="pixel-input"
            placeholder="••••••"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Label>{(t('confirmPw') as string).toUpperCase()}</Label>
          <input
            className="pixel-input"
            placeholder="••••••"
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />
        </div>
      </div>

      <label
        style={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: 8,
          cursor: 'pointer',
          fontSize: 10,
          color: 'var(--ink-mute)',
          fontFamily: 'var(--font-silkscreen), monospace',
          lineHeight: 1.6,
        }}
      >
        <PixelCheckbox checked={agree} onClick={() => setAgree(!agree)} />
        <span>{t('agreeToTos')}</span>
      </label>

      <button
        type="submit"
        disabled={!agree}
        className="pixel-btn primary"
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 13,
          opacity: agree ? 1 : 0.5,
          cursor: agree ? 'pointer' : 'not-allowed',
        }}
      >
        <span>✦</span>
        <span>{t('next')}</span>
      </button>

      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-silkscreen), monospace',
          fontSize: 10,
          color: 'var(--ink-dim)',
        }}
      >
        {t('haveAcc')}{' '}
        <span onClick={onSignin} style={{ color: 'var(--accent-3)', cursor: 'pointer' }}>
          {t('backToSignin')} →
        </span>
      </div>
    </form>
  );
}

function Divider({ t }: { t: ReturnType<typeof tFor> }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: 'var(--ink-dim)',
        fontFamily: 'var(--font-silkscreen), monospace',
        fontSize: 9,
      }}
    >
      <div style={{ flex: 1, height: 1, background: 'var(--panel-stroke)' }} />
      <span>{t('or')}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--panel-stroke)' }} />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-silkscreen), monospace',
        fontSize: 10,
        color: 'var(--ink-mute)',
        letterSpacing: '0.2em',
        marginBottom: 4,
      }}
    >
      {children}
    </div>
  );
}

function PixelCheckbox({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <span
      onClick={onClick}
      style={{
        width: 14,
        height: 14,
        border: '1px solid var(--panel-stroke-strong)',
        background: checked ? 'var(--accent)' : 'rgba(0,0,0,0.4)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {checked && (
        <span style={{ color: '#0a0524', fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>
      )}
    </span>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8a12 12 0 1 1 7.9-21l5.7-5.7C34 6 29.3 4 24 4a20 20 0 1 0 0 40c11 0 19.6-8 19.6-20 0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c2.7 0 5.4.9 7.4 2.5l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.6 2.4-7.2 2.4-5.2 0-9.6-3.4-11.2-8L6.2 33C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.1 4.1-3.8 5.5l6.2 5.2C42 36 44 30 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6 0 .8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.9 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  );
}

// ---- Lore / info card on the side ----
type LoreItem = { i: string; t: string; d: string };
const LORES: Record<string, LoreItem[]> = {
  zh: [
    { i: '🔋', t: '低電量小鎮', d: '一座永遠在充電的城市。在這裡，你不用滿電才能開始 — 只要願意亮起來一格。' },
    { i: '☕', t: '咖啡館 · 酒吧 · 自習室', d: '走進去就會聽到打字聲與翻書聲，找一個跟你一樣節奏的人。' },
    { i: '🍅', t: '一起的番茄', d: '兩個人按下開始才會計時。專注是慢慢被點亮的。' },
    { i: '✦', t: 'T 幣經濟', d: '完成任務 → 累積 T 幣 → 解鎖音樂、貓咪、小屋裝飾。' },
  ],
  en: [
    { i: '🔋', t: 'A town that charges up', d: "You don't need full battery to start. One bar of light is enough." },
    { i: '☕', t: 'Cafe · Bar · Study Hall', d: 'Step inside and hear other keyboards. Find someone on your rhythm.' },
    { i: '🍅', t: 'Shared pomodoros', d: 'The clock only starts when both of you press play.' },
    { i: '✦', t: 'T-coin economy', d: 'Finish things → earn T-coin → unlock music, cats, little homes.' },
  ],
  ko: [
    { i: '🔋', t: '저전력의 마을', d: '완충 안 해도 시작할 수 있어요. 한 칸의 빛이면 충분합니다.' },
    { i: '☕', t: '카페 · 바 · 자습실', d: '문을 열면 키보드 소리. 당신의 리듬을 가진 사람을 찾으세요.' },
    { i: '🍅', t: '함께 뽀모도로', d: '두 명 다 누를 때 시간이 흐릅니다.' },
    { i: '✦', t: 'T 코인 경제', d: '집중 → T 코인 → 음악, 고양이, 작은 집을 해제.' },
  ],
  ja: [
    { i: '🔋', t: '充電中の街', d: '満充電じゃなくていい。一目盛りの灯りで十分です。' },
    { i: '☕', t: 'カフェ · バー · 自習室', d: '入ればキーボードの音。あなたのリズムの人を探しましょう。' },
    { i: '🍅', t: '一緒のポモドーロ', d: '二人が押した時だけ時計が動く。' },
    { i: '✦', t: 'T コイン経済', d: '集中 → T コイン → 音楽 · 猫 · 小さな家。' },
  ],
};

function LoreCard({ lang }: { lang: string }) {
  const list = LORES[lang] || LORES.en;
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => (i + 1) % list.length), 5500);
    return () => window.clearInterval(id);
  }, [list.length]);
  const card = list[idx];
  return (
    <div
      className="pixel-panel"
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
        width: '100%',
        animation: 'panel-slide-in 0.5s ease-out both',
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
        <BlinkDot color="var(--accent-3)" /> ABOUT THE TOWN
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 28 }}>{card.i}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span
            style={{
              fontFamily: 'var(--font-silkscreen), var(--font-noto-tc), monospace',
              fontSize: 13,
              color: 'var(--ink)',
            }}
          >
            {card.t}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-vt323), var(--font-noto-tc), monospace',
              fontSize: 14,
              color: 'var(--ink-mute)',
              lineHeight: 1.5,
            }}
          >
            {card.d}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {list.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              background: i === idx ? 'var(--accent-3)' : 'var(--panel-stroke)',
              boxShadow: i === idx ? 'var(--neon-glow-cyan)' : 'none',
            }}
          />
        ))}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-silkscreen), monospace',
          fontSize: 8,
          color: 'var(--ink-dim)',
          letterSpacing: '0.2em',
          textAlign: 'center',
          marginTop: 4,
        }}
      >
        PRESS ENTER · KEEP THE LIGHT ON
      </div>
    </div>
  );
}
