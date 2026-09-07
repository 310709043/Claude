import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {C} from './theme';
import {loadFonts} from './fonts';
import {Backdrop} from './components/Backdrop';
import {Captions} from './components/Captions';
import {Locale} from './captions';
import {S1Logo} from './scenes/S1Logo';
import {S2Title} from './scenes/S2Title';
import {S3Barriers} from './scenes/S3Barriers';
import {S4Platform} from './scenes/S4Platform';
import {S5Industries} from './scenes/S5Industries';
import {S6AgentUI} from './scenes/S6AgentUI';
import {S7NoCode} from './scenes/S7NoCode';
import {S8Value} from './scenes/S8Value';
import {S9Outro} from './scenes/S9Outro';

loadFonts();

/** Scenes overlap by OVERLAP frames so each cut is a cross-dissolve. */
const OVERLAP = 14;

const SCENES: {id: string; dur: number; el: React.FC}[] = [
  {id: 'logo', dur: 108, el: S1Logo},
  {id: 'title', dur: 186, el: S2Title},
  {id: 'barriers', dur: 336, el: S3Barriers},
  {id: 'platform', dur: 432, el: S4Platform},
  {id: 'industries', dur: 336, el: S5Industries},
  {id: 'agent', dur: 432, el: S6AgentUI},
  {id: 'nocode', dur: 360, el: S7NoCode},
  {id: 'value', dur: 306, el: S8Value},
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

export const TaipbxIntro: React.FC<{captions?: boolean; locale?: Locale}> = ({
  captions = false,
  locale = 'zh',
}) => (
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
    {captions ? <Captions locale={locale} /> : null}
    <Progress />
  </AbsoluteFill>
);
