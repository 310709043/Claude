import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, FONT} from '../theme';
import {rise, pop, EASE_OUT} from '../anim';
import {Scene} from '../components/Layout';
import {CornerBrand} from '../components/Brand';

const PILLARS = [
  ['100%', '地端部署'],
  ['一站', '整合'],
  ['AI', '快速導入'],
];

export const S2Title: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kick = rise(frame, 2, 20);
  const t1 = rise(frame, 10, 28);
  const t2 = rise(frame, 22, 28);
  const t3 = rise(frame, 36, 26);
  const photoP = pop(frame, fps, 14, 210, 70);
  // the deck's signature: an orange slab cutting across monochrome architecture
  const slab = interpolate(frame, [26, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const drift = interpolate(frame, [0, 186], [0, -26], {extrapolateRight: 'clamp'});

  return (
    <Scene inDur={16} outDur={18}>
      <AbsoluteFill style={{padding: '0 112px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <div style={{width: 880, flexShrink: 0}}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '9px 20px',
              borderRadius: 999,
              border: `1px solid ${C.orange}55`,
              background: `${C.orange}12`,
              opacity: kick,
              transform: `translateY(${(1 - kick) * 16}px)`,
            }}
          >
            <span style={{width: 8, height: 8, borderRadius: '50%', background: C.orange}} />
            <span style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 20, letterSpacing: '0.2em', color: C.orangeDeep}}>
              台灣大哥大企業服務
            </span>
          </div>

          <h1
            style={{
              margin: '32px 0 0',
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 78,
              lineHeight: 1.12,
              letterSpacing: '-0.01em',
              color: C.ink,
              opacity: t1,
              transform: `translateY(${(1 - t1) * 34}px)`,
            }}
          >
            <span style={{fontFamily: FONT.latin, fontWeight: 800, letterSpacing: '-0.03em'}}>TAIPBX</span>
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

          <div style={{display: 'flex', gap: 14, marginTop: 30, alignItems: 'center'}}>
            {PILLARS.map(([big, small], i) => {
              const q = rise(frame, 24 + i * 6, 22);
              return (
                <React.Fragment key={small}>
                  {i > 0 ? (
                    <span style={{fontFamily: FONT.latin, fontSize: 26, color: C.line, opacity: q}}>×</span>
                  ) : null}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'baseline',
                      gap: 8,
                      opacity: q,
                      transform: `translateY(${(1 - q) * 12}px)`,
                    }}
                  >
                    <span style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 34, color: C.orangeDeep}}>{big}</span>
                    <span style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 26, color: C.ink}}>{small}</span>
                  </span>
                </React.Fragment>
              );
            })}
          </div>

          <p
            style={{
              margin: '26px 0 0',
              fontFamily: FONT.sans,
              fontSize: 25,
              lineHeight: 1.7,
              color: C.inkSoft,
              maxWidth: 760,
              opacity: t2,
              transform: `translateY(${(1 - t2) * 18}px)`,
            }}
          >
            一台主機，開箱即用。無需上雲、無需複雜系統整合，
            <br />
            單一平台即可實現強大的 AI 應用，為企業構建安全可控、高效靈活的智能服務。
          </p>

          <div style={{marginTop: 30, display: 'flex', gap: 12, opacity: t3}}>
            {['開箱即用', '資料不出企業', '容器化微服務', 'GPU 算力內建'].map((p, i) => {
              const q = rise(frame, 40 + i * 5, 20);
              return (
                <span
                  key={p}
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 500,
                    fontSize: 20,
                    color: C.inkMid,
                    padding: '9px 18px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.82)',
                    border: `1px solid ${C.line}`,
                    opacity: q,
                    transform: `translateY(${(1 - q) * 12}px)`,
                  }}
                >
                  {p}
                </span>
              );
            })}
          </div>
        </div>

        {/* right: the deck's hero — monochrome architecture under an orange slab */}
        <div style={{flex: 1, height: 720, position: 'relative', opacity: photoP}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 30,
              overflow: 'hidden',
              boxShadow: `0 50px 110px -40px ${C.ink}55`,
              transform: `translateY(${(1 - photoP) * 50 + drift * 0.3}px) scale(${0.96 + photoP * 0.04})`,
            }}
          >
            <Img
              src={staticFile('photo/hero-open.jpg')}
              style={{
                width: '118%',
                height: '118%',
                objectFit: 'cover',
                objectPosition: '62% 50%',
                filter: 'grayscale(1) contrast(1.05)',
                transform: `translate(${drift * 0.6}px, ${drift * 0.4}px)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(112deg, ${C.orange} 0%, ${C.orangeDeep} 100%)`,
                clipPath: `polygon(0% ${100 - slab * 62}%, ${slab * 100}% ${100 - slab * 100}%, 100% ${100 - slab * 34}%, 100% 100%, 0% 100%)`,
                opacity: 0.92,
                mixBlendMode: 'multiply',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(112deg, ${C.amber} 0%, ${C.orange} 100%)`,
                clipPath: `polygon(${100 - slab * 58}% 0%, 100% 0%, 100% ${slab * 40}%)`,
                opacity: 0.88 * slab,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 44,
                bottom: 44,
                color: C.paper,
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: '0.18em',
                opacity: slab,
              }}
            >
              開箱即用・資料不出企業
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <CornerBrand opacity={interpolate(frame, [40, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT})} />
    </Scene>
  );
};
