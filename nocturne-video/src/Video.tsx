import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig, interpolate } from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Background } from "./components/Background";
import { SCENES, TRANSITION } from "./timeline";
import { C } from "./theme";

import { ColdOpen } from "./scenes/ColdOpen";
import { Positioning } from "./scenes/Positioning";
import { Tiers } from "./scenes/Tiers";
import { MapScene } from "./scenes/MapScene";
import { Interact } from "./scenes/Interact";
import { Verify } from "./scenes/Verify";
import { Photo } from "./scenes/Photo";
import { Safety } from "./scenes/Safety";
import { Privacy } from "./scenes/Privacy";
import { Premium } from "./scenes/Premium";
import { Memory } from "./scenes/Memory";
import { Outro } from "./scenes/Outro";

const SCENE_MAP: Record<string, React.FC> = {
  coldopen: ColdOpen,
  positioning: Positioning,
  tiers: Tiers,
  map: MapScene,
  interact: Interact,
  verify: Verify,
  photo: Photo,
  safety: Safety,
  privacy: Privacy,
  premium: Premium,
  memory: Memory,
  outro: Outro,
};

export const NocturneVideo: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background />
      <TransitionSeries>
        {SCENES.map((s, i) => {
          const Comp = SCENE_MAP[s.id];
          return (
            <React.Fragment key={s.id}>
              <TransitionSeries.Sequence durationInFrames={s.dur}>
                <Comp />
              </TransitionSeries.Sequence>
              {i < SCENES.length - 1 ? (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: TRANSITION })}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      <AmbientAudio durationInFrames={durationInFrames} fps={fps} />
    </AbsoluteFill>
  );
};

const AmbientAudio: React.FC<{ durationInFrames: number; fps: number }> = ({
  durationInFrames,
  fps,
}) => {
  return (
    <Audio
      src={staticFile("ambient.wav")}
      volume={(f) =>
        interpolate(
          f,
          [0, fps * 3, durationInFrames - fps * 4, durationInFrames],
          [0, 0.5, 0.5, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      }
    />
  );
};
