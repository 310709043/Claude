import { Bubble } from "../components/Bubble";
import { Phone } from "../components/Phone";
import { SceneFrame, Highlight } from "../components/SceneFrame";

export const Scene4_Reciprocity: React.FC = () => {
  return (
    <SceneFrame
      subtitle="04 · Give Before You Take"
      title={
        <>
          回答的時候<br />順便<Highlight color="coral">遞一顆球</Highlight>
        </>
      }
      note="像打網球。對方問什麼就答什麼，但答完別讓話題斷在你手上 — 順手把球打回去，對話才會延續。"
    >
      <Phone matchName="Theo · 29" matchSubtitle="剛剛在線" matchInitial="T" tilt={-10}>
        <Bubble text="你週末通常都在做什麼？" side="left" appearAt={30} time="20:18" />
        <Bubble
          text="最近在學陶藝，週六會去工作室拉坯～"
          side="right"
          appearAt={70}
          time="20:21"
        />
        <Bubble
          text="然後晚上會找小酒館喝一杯。你呢？有沒有什麼週末儀式？"
          side="right"
          appearAt={110}
          time="20:21"
          highlight
        />
        <Bubble text="哈哈我以為只有我會約自己 — 我都去看二輪電影 🎬" side="left" appearAt={155} time="20:24" />
      </Phone>
    </SceneFrame>
  );
};
