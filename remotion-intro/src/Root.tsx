import React from 'react';
import {Composition} from 'remotion';
import {TaipbxIntro, TOTAL} from './Video';
import {FPS} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="TaipbxIntro"
      component={TaipbxIntro}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1920}
      height={1080}
    />
    {/* Same film with the narration burned in, for players that cannot
        carry a sidecar .srt. */}
    <Composition
      id="TaipbxIntroSubtitled"
      component={TaipbxIntro}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{captions: true}}
    />
  </>
);
