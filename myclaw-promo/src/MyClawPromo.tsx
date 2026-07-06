import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {COLORS, SCENES} from './theme';
import {Scene1Opening} from './scenes/Scene1Opening';
import {Scene2Call} from './scenes/Scene2Call';
import {Scene3Analysis} from './scenes/Scene3Analysis';
import {Scene4Offer} from './scenes/Scene4Offer';
import {Scene5Lead} from './scenes/Scene5Lead';
import {Scene6Dashboard} from './scenes/Scene6Dashboard';
import {SceneEnding} from './scenes/SceneEnding';

/**
 * MyClaw AI — 90 秒企業產品宣傳影片
 *
 *  0–14s  第一幕 多產業客戶情境快切 → Every Conversation Starts Here.
 * 14–32s  第二幕 TAIPBX 接聽 + MyVoca 即時逐字稿 + AI 需求辨識
 * 32–46s  第三幕 MyClaw AI 分析 → Customer Profile
 * 46–60s  第四幕 Next Best Offer 智能推薦
 * 60–73s  第五幕 建立 Lead → 自動派工 → CRM Sync
 * 73–82s  第六幕 主管 BI Dashboard
 * 82–90s  Ending 資料流匯聚 → 品牌收尾
 */
export const MyClawPromo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COLORS.black}}>
    <Sequence from={SCENES.opening.from} durationInFrames={SCENES.opening.duration} name="1 · Opening">
      <Scene1Opening />
    </Sequence>
    <Sequence from={SCENES.call.from} durationInFrames={SCENES.call.duration} name="2 · TAIPBX + MyVoca">
      <Scene2Call />
    </Sequence>
    <Sequence from={SCENES.analysis.from} durationInFrames={SCENES.analysis.duration} name="3 · AI Analysis">
      <Scene3Analysis />
    </Sequence>
    <Sequence from={SCENES.offer.from} durationInFrames={SCENES.offer.duration} name="4 · Next Best Offer">
      <Scene4Offer />
    </Sequence>
    <Sequence from={SCENES.lead.from} durationInFrames={SCENES.lead.duration} name="5 · Lead Creation">
      <Scene5Lead />
    </Sequence>
    <Sequence from={SCENES.dashboard.from} durationInFrames={SCENES.dashboard.duration} name="6 · Manager Dashboard">
      <Scene6Dashboard />
    </Sequence>
    <Sequence from={SCENES.ending.from} durationInFrames={SCENES.ending.duration} name="7 · Ending">
      <SceneEnding />
    </Sequence>
  </AbsoluteFill>
);
