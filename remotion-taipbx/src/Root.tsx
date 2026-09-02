import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 4K 母帶 — 43 吋螢幕投放用 */}
      <Composition
        id="TAIPBX-Film"
        component={Film}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 1080p 校稿版 — 快速預覽／內部審片用（版面完全相同） */}
      <Composition
        id="TAIPBX-Film-1080p"
        component={Film}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
