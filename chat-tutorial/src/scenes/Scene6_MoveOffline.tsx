import { Bubble } from "../components/Bubble";
import { Phone } from "../components/Phone";
import { SceneFrame, Highlight } from "../components/SceneFrame";

export const Scene6_MoveOffline: React.FC = () => {
  return (
    <SceneFrame
      subtitle="06 · Make the Ask"
      title={
        <>
          把對話<br /><Highlight color="coral">帶到現實</Highlight>
        </>
      }
      note="聊天的目的不是聊一輩子，而是見一面。在話題還熱的時候提出具體邀請 — 時間、地點、活動，三選一給對方。"
    >
      <Phone matchName="Yuki · 27" matchSubtitle="輸入中⋯" matchInitial="Y" tilt={-12}>
        <Bubble text="你剛說的那家手沖咖啡店，名字是？" side="right" appearAt={30} time="19:40" />
        <Bubble text="是赤峰街那家「鳴草」～超推！" side="left" appearAt={75} time="19:43" />
        <Bubble
          text="這週六下午我剛好在附近，要不要一起去喝杯試試？"
          side="right"
          appearAt={115}
          time="19:44"
          highlight
        />
        <Bubble text="好啊！下午三點如何？我先訂位 ☕" side="left" appearAt={165} time="19:46" />
      </Phone>
    </SceneFrame>
  );
};
