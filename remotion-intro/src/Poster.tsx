import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT} from './theme';
import {loadFonts} from './fonts';
import {TwmLockup} from './components/Brand';

loadFonts();

/**
 * Publishing poster / thumbnail.
 *
 * Composed for legibility at 320px wide — the size a YouTube or LINE card
 * actually renders at — so it carries only the product name, one line of
 * positioning, and the deck's orange-slab hero. Everything the film says in
 * body copy is deliberately left out; at thumbnail scale it reads as noise.
 */
export const Poster: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(160deg, ${C.paper} 0%, ${C.canvasWarm} 42%, ${C.canvas} 100%)`,
      flexDirection: 'row',
      alignItems: 'center',
      padding: '0 0 0 88px',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: -240,
        top: -180,
        width: 900,
        height: 900,
        borderRadius: '50%',
        background: `radial-gradient(circle at 50% 50%, ${C.orange}22 0%, ${C.orange}00 68%)`,
      }}
    />

    <div style={{width: 700, flexShrink: 0, position: 'relative'}}>
      <TwmLockup height={54} />

      <h1
        style={{
          margin: '38px 0 0',
          fontFamily: FONT.latin,
          fontWeight: 800,
          fontSize: 118,
          lineHeight: 0.98,
          letterSpacing: '-0.035em',
          color: C.ink,
        }}
      >
        TAIPBX
        <br />
        <span
          style={{
            background: `linear-gradient(96deg, ${C.orange}, ${C.magenta} 62%, ${C.indigo})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Call Center
        </span>
      </h1>

      <div
        style={{
          marginTop: 30,
          fontFamily: FONT.sans,
          fontWeight: 700,
          fontSize: 40,
          color: C.ink,
          letterSpacing: '0.01em',
        }}
      >
        企業級 AI 客服平台
      </div>

      <div style={{display: 'flex', gap: 14, marginTop: 26}}>
        {['100% 地端', '開箱即用', 'AI 中控'].map((t) => (
          <span
            key={t}
            style={{
              fontFamily: FONT.sans,
              fontWeight: 600,
              fontSize: 24,
              color: C.orangeDeep,
              background: `${C.orange}14`,
              border: `1.5px solid ${C.orange}55`,
              borderRadius: 999,
              padding: '10px 22px',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>

    <div style={{flex: 1, height: '100%', position: 'relative', overflow: 'hidden'}}>
      <Img
        src={staticFile('photo/hero-open.jpg')}
        style={{
          width: '112%',
          height: '112%',
          objectFit: 'cover',
          objectPosition: '62% 50%',
          // Lift the plate before the multiply lands on it, or the orange
          // dries to mud over the building's dark side.
          filter: 'grayscale(1) contrast(1.02) brightness(1.42)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(112deg, ${C.orange}, ${C.orangeDeep})`,
          clipPath: 'polygon(0% 38%, 100% 0%, 100% 100%, 0% 100%)',
          opacity: 0.88,
          mixBlendMode: 'multiply',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(112deg, ${C.amber}, ${C.orange})`,
          clipPath: 'polygon(42% 0%, 100% 0%, 100% 40%)',
          opacity: 0.85,
        }}
      />
      {/* feather the seam back into the canvas so the panel doesn't look pasted */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, ${C.canvasWarm} 0%, transparent 16%)`,
        }}
      />
    </div>
  </AbsoluteFill>
);
