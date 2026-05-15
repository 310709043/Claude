import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { ChatScene } from "./scenes/ChatScene";
import { OutroScene } from "./scenes/OutroScene";

// Timing (30fps)
const INTRO_START = 0;
const INTRO_DURATION = 75; // 2.5s

const SCENE1_START = INTRO_START + INTRO_DURATION;
const SCENE1_DURATION = 150; // 5s

const SCENE2_START = SCENE1_START + SCENE1_DURATION;
const SCENE2_DURATION = 150;

const SCENE3_START = SCENE2_START + SCENE2_DURATION;
const SCENE3_DURATION = 150;

const SCENE4_START = SCENE3_START + SCENE3_DURATION;
const SCENE4_DURATION = 150;

const SCENE5_START = SCENE4_START + SCENE4_DURATION;
const SCENE5_DURATION = 150;

const OUTRO_START = SCENE5_START + SCENE5_DURATION;
const OUTRO_DURATION = 120; // 4s

export const TOTAL_FRAMES = OUTRO_START + OUTRO_DURATION; // ~30s

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#F0F2F8" }}>
      {/* 場景 0：開場 */}
      <Sequence from={INTRO_START} durationInFrames={INTRO_DURATION}>
        <AbsoluteFill>
          <IntroScene />
        </AbsoluteFill>
      </Sequence>

      {/* 場景 1：溫暖的開場白 */}
      <Sequence from={SCENE1_START} durationInFrames={SCENE1_DURATION}>
        <AbsoluteFill>
          <ChatScene
            sceneNumber={1}
            sceneTitle="用溫暖的開場白破冰"
            accentColor="#FF6B6B"
            icon="👋"
            messages={[
              { text: "嗨！最近怎麼樣？", isSender: true, appearAt: 15 },
              { text: "還不錯，謝謝你關心！", isSender: false, appearAt: 35 },
              { text: "週末有沒有去哪裡玩？", isSender: true, appearAt: 55 },
              { text: "有啊，去爬山了，超棒的！你呢？", isSender: false, appearAt: 75 },
            ]}
            tipTitle="破冰開場白技巧"
            tipDescription={"避免只說「嗨」！用一個\n具體問題讓對話馬上有話題。"}
            tipAppearAt={90}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 場景 2：問開放性問題 */}
      <Sequence from={SCENE2_START} durationInFrames={SCENE2_DURATION}>
        <AbsoluteFill>
          <ChatScene
            sceneNumber={2}
            sceneTitle="問開放性問題"
            accentColor="#4F8EF7"
            icon="❓"
            messages={[
              { text: "你最喜歡哪種音樂類型？", isSender: true, appearAt: 15 },
              { text: "我很喜歡爵士樂和獨立音樂！", isSender: false, appearAt: 35 },
              { text: "哇，是什麼讓你愛上爵士樂的？", isSender: true, appearAt: 55 },
              { text: "小時候爸爸常播，就這樣愛上了 🎷", isSender: false, appearAt: 75 },
            ]}
            tipTitle="開放性問題 vs 封閉性問題"
            tipDescription={"❌「你喜歡音樂嗎？」→ 只有是/否\n✅「你最喜歡哪種音樂？」→ 引發故事"}
            tipAppearAt={90}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 場景 3：積極傾聽 */}
      <Sequence from={SCENE3_START} durationInFrames={SCENE3_DURATION}>
        <AbsoluteFill>
          <ChatScene
            sceneNumber={3}
            sceneTitle="積極傾聽與回應"
            accentColor="#9C27B0"
            icon="👂"
            messages={[
              { text: "最近工作壓力好大⋯", isSender: false, appearAt: 15 },
              { text: "聽起來很辛苦，發生什麼事了嗎？", isSender: true, appearAt: 35 },
              { text: "專案快截止了，一直加班", isSender: false, appearAt: 55 },
              { text: "這樣真的很累，你有好好休息嗎？", isSender: true, appearAt: 75 },
            ]}
            tipTitle="積極傾聽 3 步驟"
            tipDescription={"1️⃣ 確認對方的感受\n2️⃣ 問更多細節\n3️⃣ 表達關心與理解"}
            tipAppearAt={90}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 場景 4：分享自己 */}
      <Sequence from={SCENE4_START} durationInFrames={SCENE4_DURATION}>
        <AbsoluteFill>
          <ChatScene
            sceneNumber={4}
            sceneTitle="適時分享自己"
            accentColor="#FF9800"
            icon="💡"
            messages={[
              { text: "你有沒有什麼興趣愛好？", isSender: false, appearAt: 15 },
              { text: "我很喜歡攝影！去年學的", isSender: true, appearAt: 35 },
              { text: "哇，拍什麼主題呢？", isSender: false, appearAt: 55 },
              { text: "主要拍街頭和人像，你有興趣嗎？", isSender: true, appearAt: 75 },
            ]}
            tipTitle="雙向分享原則"
            tipDescription={"聊天是雙向的！分享自己的\n經歷，讓對方也更了解你，\n創造共鳴感。"}
            tipAppearAt={90}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 場景 5：輕鬆幽默 */}
      <Sequence from={SCENE5_START} durationInFrames={SCENE5_DURATION}>
        <AbsoluteFill>
          <ChatScene
            sceneNumber={5}
            sceneTitle="保持輕鬆幽默"
            accentColor="#4CAF50"
            icon="😄"
            messages={[
              { text: "你昨天吃什麼？", isSender: false, appearAt: 15 },
              { text: "我吃了一個後悔藥，叫做「外送炸雞」哈哈", isSender: true, appearAt: 35 },
              { text: "哈哈哈！說說這個後悔藥的副作用？", isSender: false, appearAt: 55 },
              { text: "副作用是錢包變薄、心情變好 😂", isSender: true, appearAt: 75 },
            ]}
            tipTitle="幽默感小技巧"
            tipDescription={"用自嘲和誇張製造笑點，\n讓氣氛輕鬆。注意：幽默\n要自然，不用強迫搞笑！"}
            tipAppearAt={90}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 場景 6：結語 */}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DURATION}>
        <AbsoluteFill>
          <OutroScene />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
