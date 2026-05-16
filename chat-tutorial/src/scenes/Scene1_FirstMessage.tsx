import { Bubble } from "../components/Bubble";
import { Phone } from "../components/Phone";
import { SceneFrame, Highlight } from "../components/SceneFrame";

export const Scene1_FirstMessage: React.FC = () => {
  return (
    <SceneFrame
      subtitle="01 · The Opener"
      title={
        <>
          別只說 <Highlight color="coral">「嗨」</Highlight>
        </>
      }
      note="一句空泛的「嗨」是配對殺手。用一個對方檔案裡的具體細節，讓你的第一句話無法被忽略。"
    >
      <Phone matchName="Yuki · 27" matchSubtitle="2 分鐘前在線" matchInitial="Y" tilt={-12}>
        <Bubble text="嗨" side="right" appearAt={30} time="14:02" strikethrough />
        <Bubble text="在嗎" side="right" appearAt={50} time="14:05" strikethrough />
        <Bubble
          text="你檔案裡那張京都的照片是去年拍的嗎？嵐山我也很喜歡！"
          side="right"
          appearAt={85}
          time="14:08"
          highlight
        />
        <Bubble text="哇對！你也去過？竹林那邊我超愛 ✨" side="left" appearAt={130} time="14:12" />
      </Phone>
    </SceneFrame>
  );
};
