import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {rise, pop} from '../anim';
import {Scene, Stage, Kicker, SceneTitle} from '../components/Layout';
import {CornerBrand} from '../components/Brand';

const ITEMS = [
  {
    accent: C.orange,
    n: '01',
    title: '全渠道智能交互平台',
    eta: '3～6 個月',
    body: '整合語音、Chat、WebCall、Video、Social Media 等全渠道，提供雲端、本地及混合雲部署，實現統一客戶視圖與無縫體驗。',
    tags: ['Voice', 'Chat', 'WebCall', 'Video', 'Social'],
  },
  {
    accent: C.magenta,
    n: '02',
    title: '智慧服務與銷售一體化工作台',
    eta: '1 年',
    body: '融合智能自助服務與專人座席，透過 AI 即時輔助、智能話術推薦，提升座席效率與銷售轉化，實現服務與業績雙贏。',
    tags: ['AI 輔助', '話術推薦', '服務＋銷售'],
  },
  {
    accent: C.indigo,
    n: '03',
    title: '企業級 AI 中控與整合服務',
    eta: '3～6 個月',
    body: '整合 NLP、ASR、TTS 等 AI 技術，支援大模型 RAG 與企業系統整合，驅動業務全面智能化轉型，構建自主可控的 AI 體系。',
    tags: ['NLP', 'ASR / TTS', 'RAG', 'MCP'],
  },
];

export const S3Core: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <Scene>
      <Stage>
        <Kicker delay={2}>核心方案</Kicker>
        <SceneTitle
          title="三大核心產品解決方案"
          sub="從渠道整合、座席工作台到 AI 中控，分階段落地、可單獨導入亦可組合建置。"
          delay={6}
        />

        <div style={{flex: 1, display: 'flex', alignItems: 'center', marginTop: 46}}>
          <div style={{display: 'flex', gap: 30, width: '100%', alignItems: 'stretch'}}>
          {ITEMS.map((it, i) => {
            const p = pop(frame, fps, 30 + i * 10, 200, 90);
            const q = rise(frame, 46 + i * 10, 26);
            return (
              <div
                key={it.n}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 28,
                  border: `1px solid ${C.line}`,
                  boxShadow: `0 26px 60px -26px ${C.ink}26`,
                  padding: '42px 38px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 54}px)`,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 6,
                    background: `linear-gradient(90deg, ${it.accent}, ${it.accent}33)`,
                    transformOrigin: 'left',
                    transform: `scaleX(${p})`,
                  }}
                />
                <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
                  <span
                    style={{
                      fontFamily: FONT.latin,
                      fontWeight: 800,
                      fontSize: 56,
                      lineHeight: 1,
                      color: it.accent,
                      opacity: 0.92,
                    }}
                  >
                    {it.n}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT.sans,
                      fontWeight: 700,
                      fontSize: 18,
                      color: it.accent,
                      background: `${it.accent}14`,
                      border: `1px solid ${it.accent}33`,
                      borderRadius: 999,
                      padding: '7px 16px',
                    }}
                  >
                    {it.eta}
                  </span>
                </div>

                <h3
                  style={{
                    margin: '24px 0 0',
                    fontFamily: FONT.sans,
                    fontWeight: 700,
                    fontSize: 34,
                    lineHeight: 1.32,
                    color: C.ink,
                  }}
                >
                  {it.title}
                </h3>

                <p
                  style={{
                    margin: '20px 0 0',
                    fontFamily: FONT.sans,
                    fontSize: 22,
                    lineHeight: 1.78,
                    color: C.inkSoft,
                    opacity: q,
                  }}
                >
                  {it.body}
                </p>

                <div style={{display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 'auto', paddingTop: 28}}>
                  {it.tags.map((t, j) => {
                    const r = rise(frame, 58 + i * 10 + j * 4, 18);
                    return (
                      <span
                        key={t}
                        style={{
                          fontFamily: FONT.sans,
                          fontSize: 18,
                          fontWeight: 500,
                          color: C.inkMid,
                          padding: '7px 14px',
                          borderRadius: 8,
                          background: C.canvas,
                          border: `1px solid ${C.lineSoft}`,
                          opacity: r,
                          transform: `translateY(${(1 - r) * 8}px)`,
                        }}
                      >
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </Stage>
      <CornerBrand />
    </Scene>
  );
};
