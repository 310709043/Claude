import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, FONT} from '../theme';
import {rise, pop} from '../anim';
import {Scene} from '../components/Layout';
import {TwmLockup} from '../components/Brand';

const POINTS = ['100% 地端部署', '一站整合', 'AI 快速導入', '長期增值'];

export const S9Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoP = pop(frame, fps, 4, 200, 88);
  const nameP = rise(frame, 18, 26);
  const lineP = rise(frame, 30, 26);
  const teamP = rise(frame, 56, 26);
  const photo = interpolate(frame, [0, 60], [0, 0.16], {extrapolateRight: 'clamp'});

  return (
    <Scene inDur={20} outDur={26} push={0.012}>
      {/* the deck's closing hero, held far back so the light canvas stays */}
      <AbsoluteFill style={{opacity: photo}}>
        <Img src={staticFile('photo/hero-close.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)'}} />
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${C.canvas}00, ${C.canvas} 70%)`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{opacity: logoP, transform: `translateY(${(1 - logoP) * 24}px)`}}>
          <TwmLockup height={92} />
        </div>
        <h2 style={{margin: '54px 0 0', fontFamily: FONT.sans, fontWeight: 900, fontSize: 72, letterSpacing: '-0.01em', color: C.ink, opacity: nameP, transform: `translateY(${(1 - nameP) * 22}px)`}}>
          <span style={{fontFamily: FONT.latin, fontWeight: 800, letterSpacing: '-0.03em'}}>TAIPBX</span>{' '}
          <span style={{fontFamily: FONT.latin, fontWeight: 800, letterSpacing: '-0.03em', background: `linear-gradient(96deg, ${C.orange}, ${C.magenta} 60%, ${C.indigo})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>Call Center</span>
        </h2>
        <div style={{marginTop: 32, display: 'flex', gap: 16, alignItems: 'center'}}>
          {POINTS.map((p, i) => {
            const q = rise(frame, 36 + i * 6, 22);
            return (
              <React.Fragment key={p}>
                {i > 0 ? <span style={{width: 5, height: 5, borderRadius: '50%', background: C.line, opacity: q}} /> : null}
                <span style={{fontFamily: FONT.sans, fontWeight: 500, fontSize: 25, color: C.inkSoft, opacity: q, transform: `translateY(${(1 - q) * 10}px)`}}>{p}</span>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{marginTop: 56, width: lineP * 520, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${C.orange}, ${C.magenta}, ${C.indigo})`}} />
        <div style={{marginTop: 34, fontFamily: FONT.sans, fontWeight: 500, fontSize: 27, letterSpacing: '0.2em', color: C.inkMid, opacity: teamP, transform: `translateY(${(1 - teamP) * 12}px)`, paddingLeft: '0.2em'}}>
          企業 AI 轉型，從 TAIPBX Call Center 開始
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
