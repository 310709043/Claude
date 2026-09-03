import React from 'react';
import {AbsoluteFill} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';

import {Backdrop} from './components/Backdrop';
import {Hud} from './components/ui';
import {S01Title} from './scenes/S01Title';
import {S02Heritage} from './scenes/S02Heritage';
import {S03Solutions} from './scenes/S03Solutions';
import {S04NowNext} from './scenes/S04NowNext';
import {S05Stages} from './scenes/S05Stages';
import {S06Architecture} from './scenes/S06Architecture';
import {S07Hybrid} from './scenes/S07Hybrid';
import {S08AiApps} from './scenes/S08AiApps';
import {S09Closing} from './scenes/S09Closing';

export const TRANSITION = 20;

export const SCENES = [
  {id: 'title', label: 'ROADMAP 2026', duration: 190, Component: S01Title},
  {id: 'heritage', label: 'SINCE 2002', duration: 250, Component: S02Heritage},
  {id: 'solutions', label: '三大核心解決方案', duration: 340, Component: S03Solutions},
  {id: 'nownext', label: '現況與未來方向', duration: 340, Component: S04NowNext},
  {id: 'stages', label: '四階段推進藍圖', duration: 500, Component: S05Stages},
  {id: 'architecture', label: 'AICC 系統架構', duration: 430, Component: S06Architecture},
  {id: 'hybrid', label: '雲地混合架構', duration: 370, Component: S07Hybrid},
  {id: 'aiapps', label: 'AI 應用擴充', duration: 370, Component: S08AiApps},
  {id: 'closing', label: 'AICC', duration: 300, Component: S09Closing},
] as const;

/** Total length once the cross-fades have eaten their overlap. */
export const TOTAL_FRAMES =
  SCENES.reduce((sum, s) => sum + s.duration, 0) - TRANSITION * (SCENES.length - 1);

/** Absolute start frame of each scene on the finished timeline. */
export const CHAPTERS = SCENES.map((scene, i) => ({
  label: scene.label,
  at: SCENES.slice(0, i).reduce((sum, s) => sum + s.duration - TRANSITION, 0),
}));

export const Video: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <TransitionSeries>
      {SCENES.map((scene, i) => (
        <React.Fragment key={scene.id}>
          {i > 0 ? (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({durationInFrames: TRANSITION})}
            />
          ) : null}
          <TransitionSeries.Sequence durationInFrames={scene.duration}>
            <scene.Component />
          </TransitionSeries.Sequence>
        </React.Fragment>
      ))}
    </TransitionSeries>
    <Hud chapters={CHAPTERS} />
  </AbsoluteFill>
);
