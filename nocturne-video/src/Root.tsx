import React from "react";
import { Composition } from "remotion";
import { NocturneVideo } from "./Video";
import { TOTAL } from "./timeline";
import { FPS, W, H } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Nocturne"
      component={NocturneVideo}
      durationInFrames={TOTAL}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
