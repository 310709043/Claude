import { AbsoluteFill, Sequence } from "remotion";
import "./loadFonts";
import { Ambient } from "./components/Ambient";
import { CaptionBar, Caption } from "./components/CaptionBar";
import { TOKENS, INTRO_DURATION, SCENE_DURATION, OUTRO_DURATION } from "./design";

import { IntroScene } from "./scenes/IntroScene";
import { Scene1_FirstMessage } from "./scenes/Scene1_FirstMessage";
import { Scene2_ProfileClues } from "./scenes/Scene2_ProfileClues";
import { Scene3_OpenQuestions } from "./scenes/Scene3_OpenQuestions";
import { Scene4_Reciprocity } from "./scenes/Scene4_Reciprocity";
import { Scene5_Rhythm } from "./scenes/Scene5_Rhythm";
import { Scene6_MoveOffline } from "./scenes/Scene6_MoveOffline";
import { OutroScene } from "./scenes/OutroScene";

const T = {
  intro: 0,
  s1: INTRO_DURATION,
  s2: INTRO_DURATION + SCENE_DURATION,
  s3: INTRO_DURATION + SCENE_DURATION * 2,
  s4: INTRO_DURATION + SCENE_DURATION * 3,
  s5: INTRO_DURATION + SCENE_DURATION * 4,
  s6: INTRO_DURATION + SCENE_DURATION * 5,
  outro: INTRO_DURATION + SCENE_DURATION * 6,
};

export const TOTAL_FRAMES = T.outro + OUTRO_DURATION;

// Caption track (bilingual, frame-based)
const CAPTIONS: Caption[] = [
  // Intro
  { start: T.intro + 20, end: T.intro + 80, zh: "六個技巧，讓配對真的變成約會", en: "Six moves from match to date" },
  { start: T.intro + 80, end: T.intro + INTRO_DURATION, zh: "從你打的第一個字開始", en: "Starting with your first keystroke" },

  // Scene 1
  { start: T.s1 + 10, end: T.s1 + 70, zh: "「嗨」是空無一物的開場", en: "“Hi” says nothing" },
  { start: T.s1 + 70, end: T.s1 + 140, zh: "從對方檔案裡挑一個細節", en: "Pick a detail from their profile" },
  { start: T.s1 + 140, end: T.s1 + SCENE_DURATION, zh: "讓你的第一句話無法被忽略", en: "Make your first line unignorable" },

  // Scene 2
  { start: T.s2 + 10, end: T.s2 + 80, zh: "每張照片都是一個鉤子", en: "Every photo is a hook" },
  { start: T.s2 + 80, end: T.s2 + 150, zh: "Bio 裡的關鍵字都是話題", en: "Bio keywords are conversation starters" },
  { start: T.s2 + 150, end: T.s2 + SCENE_DURATION, zh: "你需要的素材，對方已經給了", en: "They already gave you the material" },

  // Scene 3
  { start: T.s3 + 10, end: T.s3 + 80, zh: "是非題只能換來「對」或「不對」", en: "Yes/no questions get yes/no answers" },
  { start: T.s3 + 80, end: T.s3 + 150, zh: "把問題改成需要描述的版本", en: "Rewrite questions to invite description" },
  { start: T.s3 + 150, end: T.s3 + SCENE_DURATION, zh: "對方一旦開始說故事，氣氛就活了", en: "Once they tell a story, the chat is alive" },

  // Scene 4
  { start: T.s4 + 10, end: T.s4 + 80, zh: "聊天像打網球", en: "Chatting is like tennis" },
  { start: T.s4 + 80, end: T.s4 + 150, zh: "答完就把球輕輕打回去", en: "Answer, then send the ball back" },
  { start: T.s4 + 150, end: T.s4 + SCENE_DURATION, zh: "對話才不會死在你手上", en: "Don't let it die on your side" },

  // Scene 5
  { start: T.s5 + 10, end: T.s5 + 80, zh: "別搶答，也別讓對方等太久", en: "Don’t rush, don’t ghost" },
  { start: T.s5 + 80, end: T.s5 + 150, zh: "鏡像對方回覆的速度與字數", en: "Mirror their speed and length" },
  { start: T.s5 + 150, end: T.s5 + SCENE_DURATION, zh: "節奏對了，吸引力自然出現", en: "Right tempo, real chemistry" },

  // Scene 6
  { start: T.s6 + 10, end: T.s6 + 80, zh: "聊得再好，不見面就是零", en: "All chat, no meet — equals zero" },
  { start: T.s6 + 80, end: T.s6 + 150, zh: "話題還熱時，給一個具體邀請", en: "While the topic is hot, propose something concrete" },
  { start: T.s6 + 150, end: T.s6 + SCENE_DURATION, zh: "時間、地點、活動，三選一就好", en: "Pick one: time, place, activity" },

  // Outro
  { start: T.outro + 20, end: T.outro + 80, zh: "六個動作，從滑到約", en: "Six moves, swipe to date" },
  { start: T.outro + 80, end: T.outro + 140, zh: "技巧只是腳手架", en: "Technique is just scaffolding" },
  { start: T.outro + 140, end: T.outro + OUTRO_DURATION, zh: "真正吸引人的，是真誠地好奇", en: "Real attraction is real curiosity" },
];

const CHAPTER_STARTS = [T.s1, T.s2, T.s3, T.s4, T.s5, T.s6, T.outro];

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: TOKENS.bg }}>
      {/* Ambient layer */}
      <AbsoluteFill>
        <Ambient />
      </AbsoluteFill>

      {/* Scenes */}
      <Sequence from={T.intro} durationInFrames={INTRO_DURATION}>
        <AbsoluteFill>
          <IntroScene />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={T.s1} durationInFrames={SCENE_DURATION}>
        <AbsoluteFill>
          <Scene1_FirstMessage />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={T.s2} durationInFrames={SCENE_DURATION}>
        <AbsoluteFill>
          <Scene2_ProfileClues />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={T.s3} durationInFrames={SCENE_DURATION}>
        <AbsoluteFill>
          <Scene3_OpenQuestions />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={T.s4} durationInFrames={SCENE_DURATION}>
        <AbsoluteFill>
          <Scene4_Reciprocity />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={T.s5} durationInFrames={SCENE_DURATION}>
        <AbsoluteFill>
          <Scene5_Rhythm />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={T.s6} durationInFrames={SCENE_DURATION}>
        <AbsoluteFill>
          <Scene6_MoveOffline />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={T.outro} durationInFrames={OUTRO_DURATION}>
        <AbsoluteFill>
          <OutroScene />
        </AbsoluteFill>
      </Sequence>

      {/* Caption bar overlay */}
      <CaptionBar captions={CAPTIONS} totalFrames={TOTAL_FRAMES} chapterStarts={CHAPTER_STARTS} />
    </AbsoluteFill>
  );
};
