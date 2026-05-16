import "./index.css";
import { Composition } from "remotion";
import { MyComposition, TOTAL_FRAMES } from "./Composition";
import { FPS } from "./design";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChatTutorial"
        component={MyComposition}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
