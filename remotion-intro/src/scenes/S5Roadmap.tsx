import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT} from '../theme';
import {rise, EASE_OUT} from '../anim';
import {Scene, Stage, Kicker} from '../components/Layout';
import {CornerBrand} from '../components/Brand';

const STAGES = [
  {
    n: '第一階',
    title: '多渠道互動進線',
    lead: '把客戶的每一種聯絡方式，收斂成同一條服務線。',
    accent: C.orange,
    points: [
      ['電話', '穩固的語音進線基礎建設'],
      ['Webcall', '網頁端即時語音通話整合'],
      ['Chat', '官方網站與 APP 內建文字客服'],
      ['Social Media', '主流社群媒體訊息接入統管'],
    ],
  },
  {
    n: '第二階',
    title: 'IVR 與智能機器人互動',
    lead: '讓機器人先接住高頻、標準化的客戶需求。',
    accent: C.magenta,
    points: [
      ['IVR Flow', '客製化、彈性化的按鍵選單設計'],
      ['語音導航', '結合 NLU 意圖識別，縮短等待'],
      ['語音／文字機器人', '擬真對答與自動業務辦理'],
      ['MCP 整合', '整合企業內部交易及服務'],
    ],
  },
  {
    n: '第三階',
    title: '專人服務與智能路由分發',
    lead: '把對的客戶交給對的人，並提前預警服務風險。',
    accent: C.indigo,
    points: [
      ['Skill-Based Routing', '依專員技能與熟練度派話'],
      ['Multimedia Dashboard', '專人端多媒體整合介面'],
      ['AI 路由', '依客戶畫像與歷史情緒最佳配對'],
      ['提前／即時警示', '客訴風險、敏感詞即時告警'],
    ],
  },
  {
    n: '第四階',
    title: '數據決策與智能質檢',
    lead: '服務品質不再靠抽聽，營運決策不再等報表。',
    accent: C.teal,
    points: [
      ['報表平台', '各渠道數據整合，自助查詢匯出'],
      ['AI 報表產出', 'AI 自動分析趨勢並生成營運報表'],
      ['即時質檢', '通話中同步檢驗服務規範'],
      ['話術指引', '對談中提供即時話術建議'],
    ],
  },
];

/** Each stage owns a slice of the scene; the timeline dot walks along with it. */
const SLICE = 88;
const LEAD = 34;

export const S5Roadmap: React.FC = () => {
  const frame = useCurrentFrame();

  // Smooth 0..3 position for the travelling marker.
  const pos = interpolate(
    frame,
    STAGES.map((_, i) => LEAD + i * SLICE),
    STAGES.map((_, i) => i),
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT},
  );

  const railP = rise(frame, 16, 34);

  return (
    <Scene>
      <Stage>
        <Kicker delay={2}>導入藍圖</Kicker>
        <h2
          style={{
            margin: '18px 0 0',
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: 64,
            color: C.ink,
            opacity: rise(frame, 6, 24),
          }}
        >
          四階段智能客服演進
        </h2>

        {/* rail */}
        <div style={{position: 'relative', margin: '66px 56px 0', height: 74}}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 30,
              height: 3,
              borderRadius: 2,
              background: C.line,
              transformOrigin: 'left',
              transform: `scaleX(${railP})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 30,
              height: 3,
              borderRadius: 2,
              width: `${(pos / (STAGES.length - 1)) * 100}%`,
              background: `linear-gradient(90deg, ${C.orange}, ${C.magenta}, ${C.indigo}, ${C.teal})`,
            }}
          />
          {STAGES.map((s, i) => {
            const at = i / (STAGES.length - 1);
            const on = pos >= i - 0.02;
            const grow = interpolate(pos, [i - 0.6, i], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={s.n}
                style={{
                  position: 'absolute',
                  left: `${at * 100}%`,
                  top: 0,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: railP,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 700,
                    fontSize: 20,
                    letterSpacing: '0.14em',
                    color: on ? s.accent : C.inkSoft,
                    marginBottom: 10,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.n}
                </span>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: C.paper,
                    border: `3px solid ${on ? s.accent : C.line}`,
                    boxShadow: on ? `0 0 0 ${6 * grow}px ${s.accent}22` : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* the active stage panel */}
        <div style={{position: 'relative', flex: 1, marginTop: 40}}>
          {STAGES.map((s, i) => {
            const start = LEAD + i * SLICE;
            const inP = rise(frame, start, 20);
            const outP = i < STAGES.length - 1 ? rise(frame, start + SLICE - 12, 14) : 0;
            const vis = inP * (1 - outP);
            if (vis <= 0.001) return null;
            return (
              <div
                key={s.n}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingBottom: 24,
                  opacity: vis,
                  transform: `translateY(${(1 - inP) * 32 - outP * 22}px)`,
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12}}>
                  <span style={{width: 6, height: 46, borderRadius: 3, background: s.accent}} />
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: FONT.sans,
                      fontWeight: 800,
                      fontSize: 46,
                      color: C.ink,
                    }}
                  >
                    {s.title}
                  </h3>
                </div>
                <p
                  style={{
                    margin: '0 0 34px 26px',
                    fontFamily: FONT.sans,
                    fontSize: 25,
                    color: C.inkSoft,
                    opacity: rise(frame, start + 6, 22),
                  }}
                >
                  {s.lead}
                </p>

                <div style={{display: 'flex', gap: 22}}>
                  {s.points.map(([head, body], j) => {
                    const q = rise(frame, start + 10 + j * 6, 20);
                    return (
                      <div
                        key={head}
                        style={{
                          flex: 1,
                          background: 'rgba(255,255,255,0.9)',
                          border: `1px solid ${C.line}`,
                          borderRadius: 22,
                          padding: '36px 30px 40px',
                          minHeight: 244,
                          boxShadow: `0 20px 46px -24px ${C.ink}22`,
                          opacity: q,
                          transform: `translateY(${(1 - q) * 26}px)`,
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            width: 32,
                            height: 4,
                            borderRadius: 2,
                            background: s.accent,
                            marginBottom: 20,
                          }}
                        />
                        <div
                          style={{
                            fontFamily: FONT.sans,
                            fontWeight: 700,
                            fontSize: 29,
                            color: C.ink,
                            lineHeight: 1.35,
                          }}
                        >
                          {head}
                        </div>
                        <div
                          style={{
                            marginTop: 16,
                            fontFamily: FONT.sans,
                            fontSize: 22,
                            lineHeight: 1.72,
                            color: C.inkSoft,
                          }}
                        >
                          {body}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Stage>
      <CornerBrand />
    </Scene>
  );
};
