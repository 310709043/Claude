import React from 'react';
import {Composition} from 'remotion';
import {loadFonts} from './lib/fonts';
import {layout} from './theme';
import {TOTAL_FRAMES, Video} from './Video';

loadFonts();

export const RemotionRoot: React.FC = () => (
  <Composition
    id="AICCIntro"
    component={Video}
    durationInFrames={TOTAL_FRAMES}
    fps={layout.fps}
    width={layout.width}
    height={layout.height}
  />
);
