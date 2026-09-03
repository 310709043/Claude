import React from 'react';
import {Composition} from 'remotion';
import {TaipbxIntro, TOTAL} from './Video';
import {FPS} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="TaipbxIntro"
    component={TaipbxIntro}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
