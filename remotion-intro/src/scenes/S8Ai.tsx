import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {rise, pop} from '../anim';
import {Scene, Stage, Kicker} from '../components/Layout';
import {CornerBrand} from '../components/Brand';

const APPS = [
  ['RAG 知識問答', '以企業知識庫作答，可回溯來源', C.orange],
  ['語音機器人', '24／7 自助，分流簡單諮詢', C.magenta],
  ['AI 動態核身', '動態問答多因子驗證', C.indigo],
  ['服務代碼勾選', '依對話自動標記，免人工判讀', C.teal],
  ['話術推薦', '即時推送 SOP 話術', C.sky],
  ['話後摘要', '自動生成通話重點', C.amber],
  ['智能質檢', '全量品質與合規自動審查', C.orange],
  ['情緒洞察', '即時偵測情緒，主管端預警', C.magenta],
];

const PROMISES = [
  '全開放 · 不綁定',
  '引擎持續演進',
  '雲地混合部署',
  'AI 中控統一治理',
];

const OPEN = [
  ['自由更換 AI 大模型', 'GPT／Claude／地端 LLM 互換，換模型只動設定，不重做整合。'],
  ['語音辨識／TTS 可替換', 'STT／TTS 引擎開放替換，適配不同語言與場景。'],
  ['已完成整合', 'ASR 語音辨識、MyAgent（RAG 知識庫）等服務已串接。'],
];

export const S8Ai: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <Scene>
      <Stage style={{paddingBottom: 118}}>
        <Kicker delay={2}>AI 能力</Kicker>
        <h2
          style={{
            margin: '16px 0 0',
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: 58,
            color: C.ink,
            opacity: rise(frame, 6, 24),
          }}
        >
          Bot Gateway 全開放 · 不綁定
        </h2>

        <div style={{display: 'flex', gap: 46, marginTop: 44, flex: 1}}>
          {/* left: openness + a real model-picker screen */}
          <div style={{width: 760, display: 'flex', flexDirection: 'column'}}>
            {OPEN.map(([h, b], i) => {
              const p = rise(frame, 14 + i * 8, 22);
              return (
                <div
                  key={h}
                  style={{
                    display: 'flex',
                    gap: 18,
                    padding: '20px 0',
                    borderBottom: i < OPEN.length - 1 ? `1px solid ${C.lineSoft}` : 'none',
                    opacity: p,
                    transform: `translateX(${(1 - p) * -18}px)`,
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 26 26" style={{flexShrink: 0, marginTop: 4}}>
                    <circle cx="13" cy="13" r="12" fill={`${C.teal}18`} />
                    <path
                      d="M8 13.4 L11.5 17 L18 9.6"
                      stroke={C.teal}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  <div>
                    <div style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 27, color: C.ink}}>{h}</div>
                    <div
                      style={{
                        marginTop: 8,
                        fontFamily: FONT.sans,
                        fontSize: 21,
                        lineHeight: 1.7,
                        color: C.inkSoft,
                      }}
                    >
                      {b}
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={{marginTop: 'auto', paddingTop: 30}}>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
                {PROMISES.map((t, i) => {
                  const q = rise(frame, 40 + i * 5, 20);
                  return (
                    <span
                      key={t}
                      style={{
                        fontFamily: FONT.sans,
                        fontSize: 19,
                        fontWeight: 500,
                        color: C.inkMid,
                        padding: '10px 16px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.8)',
                        border: `1px solid ${C.line}`,
                        opacity: q,
                        transform: `translateY(${(1 - q) * 10}px)`,
                      }}
                    >
                      {t}
                    </span>
                  );
                })}
              </div>
              <div
                style={{
                  marginTop: 34,
                  marginBottom: 30,
                  fontFamily: FONT.sans,
                  fontWeight: 800,
                  fontSize: 32,
                  color: C.orangeDeep,
                  opacity: rise(frame, 58, 24),
                }}
              >
                換模型，只是換一個設定。
              </div>
            </div>
          </div>

          {/* right: AI application grid */}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <div
              style={{
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: '0.14em',
                color: C.inkSoft,
                marginBottom: 20,
                opacity: rise(frame, 20, 20),
              }}
            >
              AI 應用擴充（選配）
            </div>
            <div
              style={{
                display: 'grid',
                gridAutoRows: '1fr',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                flex: 1,
              }}
            >
              {APPS.map(([t, d, c], i) => {
                const p = pop(frame, fps, 24 + i * 4, 210, 100);
                return (
                  <div
                    key={t}
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      border: `1px solid ${C.line}`,
                      borderRadius: 18,
                      padding: '22px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      opacity: p,
                      transform: `scale(${0.94 + p * 0.06})`,
                      boxShadow: `0 16px 38px -22px ${C.ink}22`,
                    }}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: 11}}>
                      <span style={{width: 9, height: 9, borderRadius: 3, background: c as string}} />
                      <span style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 24, color: C.ink}}>{t}</span>
                    </div>
                    <div style={{marginTop: 9, fontFamily: FONT.sans, fontSize: 19, lineHeight: 1.6, color: C.inkSoft}}>
                      {d}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Stage>
      <CornerBrand />
    </Scene>
  );
};
