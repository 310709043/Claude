import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {C} from './theme';
import {loadFonts} from './fonts';
import {Backdrop} from './components/Backdrop';
import {S1Logo} from './scenes/S1Logo';
import {S2Title} from './scenes/S2Title';
import {S3Core} from './scenes/S3Core';
import {S4NowFuture} from './scenes/S4NowFuture';
import {S5Roadmap} from './scenes/S5Roadmap';
import {S6Platform} from './scenes/S6Platform';
import {S7Hybrid} from './scenes/S7Hybrid';
import {S8Ai} from './scenes/S8Ai';
import {S9Outro} from './scenes/S9Outro';

loadFonts();

/** Scenes overlap by OVERLAP frames so each cut is a cross-dissolve. */
const OVERLAP = 14;

const SCENES: {id: string; dur: number; el: React.FC}[] = [
  {id: 'logo', dur: 108, el: S1Logo},
  {id: 'title', dur: 168, el: S2Title},
  {id: 'core', dur: 264, el: S3Core},
  {id: 'nowfuture', dur: 246, el: S4NowFuture},
  {id: 'roadmap', dur: 396, el: S5Roadmap},
  {id: 'platform', dur: 486, el: S6Platform},
  {id: 'hybrid', dur: 282, el: S7Hybrid},
  {id: 'ai', dur: 264, el: S8Ai},
  {id: 'outro', dur: 186, el: S9Outro},
];

export const STARTS = SCENES.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].dur - OVERLAP);
  return acc;
}, []);

export const TOTAL =
  STARTS[SCENES.length - 1] + SCENES[SCENES.length - 1].dur;

/** A hairline progress rule so the film reads as a structured presentation. */
const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / TOTAL);
  const fade = interpolate(
    frame,
    [70, 100, TOTAL - 190, TOTAL - 160],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 4,
        background: `${C.ink}0C`,
        opacity: fade,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${p * 100}%`,
          background: `linear-gradient(90deg, ${C.orange}, ${C.magenta} 55%, ${C.indigo})`,
        }}
      />
    </div>
  );
};

export const TaipbxIntro: React.FC = () => (
  <AbsoluteFill style={{background: C.canvas, fontKerning: 'normal'}}>
    <Backdrop />
    {SCENES.map((s, i) => {
      const El = s.el;
      return (
        <Sequence key={s.id} from={STARTS[i]} durationInFrames={s.dur} layout="none">
          <El />
        </Sequence>
      );
    })}
    <Progress />
  </AbsoluteFill>
);
