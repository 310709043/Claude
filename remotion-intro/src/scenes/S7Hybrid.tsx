import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {rise} from '../anim';
import {Scene, Stage, Kicker} from '../components/Layout';
import {CornerBrand} from '../components/Brand';

const ON_PREM = [
  ['TAIPBX Call Center 話務平台', 'IVR / ACD 排隊 · 智能轉接 · 自動外撥'],
  ['即時語音 ASR · TTS', '地端語音辨識與合成'],
  ['錄音 · 維運監控', '錄音檔留地端 · 法遵留存'],
  ['企業內部系統', 'AD · CRM · 核心交易 DB · API'],
];

const CLOUD = [
  ['Chat 服務主平台', '對話路由 · 會話管理 · 多渠道整合'],
  ['TAIPBX 客服值機平台', 'Agent Desktop 值機畫面'],
  ['AI 平台', 'LLM · RAG · AI Agent · 向量知識庫'],
  ['BOT / API Gateway', '統一 LLM 服務平台 · 模型可換'],
];

const Column: React.FC<{
  side: 'on' | 'cloud';
  rows: string[][];
  delay: number;
}> = ({side, rows, delay}) => {
  const frame = useCurrentFrame();
  const p = rise(frame, delay, 24);
  const accent = side === 'on' ? C.indigo : C.orange;
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 28,
        border: `1.5px ${side === 'on' ? 'solid' : 'dashed'} ${accent}55`,
        background:
          side === 'on'
            ? `linear-gradient(180deg, ${C.paper}EE, ${C.canvas}CC)`
            : `linear-gradient(180deg, ${C.paper}EE, ${C.canvasWarm}CC)`,
        padding: '30px 30px 34px',
        display: 'flex',
        flexDirection: 'column',
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        boxShadow: `0 26px 60px -30px ${C.ink}26`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24}}>
        <span style={{width: 12, height: 12, borderRadius: 3, background: accent}} />
        <span style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 30, color: C.ink}}>
          {side === 'on' ? '地端 On-Premise' : '雲端 Cloud'}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: FONT.sans,
            fontSize: 18,
            fontWeight: 600,
            color: accent,
            background: `${accent}14`,
            border: `1px solid ${accent}33`,
            borderRadius: 999,
            padding: '6px 14px',
          }}
        >
          {side === 'on' ? '通訊 · 錄音 · 核心資料不出地' : 'AI 彈性擴充'}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        {rows.map(([h, b], i) => {
          const q = rise(frame, delay + 10 + i * 6, 20);
          return (
            <div
              key={h}
              style={{
                background: 'rgba(255,255,255,0.86)',
                border: `1px solid ${C.line}`,
                borderLeft: `4px solid ${accent}`,
                borderRadius: 14,
                padding: '16px 20px',
                opacity: q,
                transform: `translateX(${(1 - q) * (side === 'on' ? -18 : 18)}px)`,
              }}
            >
              <div style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 23, color: C.ink}}>{h}</div>
              <div style={{marginTop: 6, fontFamily: FONT.sans, fontSize: 19, color: C.inkSoft}}>{b}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const S7Hybrid: React.FC = () => {
  const frame = useCurrentFrame();
  const linkP = rise(frame, 60, 26);
  // Two packets travel the boundary: text up, reply back.
  const travel = ((frame - 66) % 46) / 46;
  const showPackets = frame > 66;

  return (
    <Scene>
      <Stage style={{paddingBottom: 118}}>
        <Kicker delay={2}>部署架構</Kicker>
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
          雲地混合架構
        </h2>
        <p
          style={{
            margin: '16px 0 0',
            fontFamily: FONT.sans,
            fontSize: 25,
            color: C.inkSoft,
            opacity: rise(frame, 12, 24),
          }}
        >
          通訊、錄音與核心資料留在地端；AI、Chat 與值機服務走雲端，個資遮罩後才上雲。
        </p>

        <div style={{display: 'flex', alignItems: 'stretch', gap: 26, marginTop: 46, flex: 1}}>
          <Column side="on" rows={ON_PREM} delay={22} />

          {/* the boundary */}
          <div
            style={{
              width: 210,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              opacity: linkP,
            }}
          >
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 19,
                letterSpacing: '0.16em',
                color: C.inkSoft,
                writingMode: 'horizontal-tb',
              }}
            >
              雲地邊界
            </span>

            <svg width="210" height="150" viewBox="0 0 210 150" fill="none">
              <path d="M8 46 H202" stroke={C.teal} strokeWidth="2.4" strokeDasharray="7 6" opacity="0.75" />
              <path d="M202 104 H8" stroke={C.indigo} strokeWidth="2.4" strokeDasharray="7 6" opacity="0.6" />
              <path d="M196 40 L204 46 L196 52" stroke={C.teal} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 98 L6 104 L14 110" stroke={C.indigo} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              {showPackets ? (
                <>
                  <circle cx={8 + travel * 194} cy="46" r="6" fill={C.teal} />
                  <circle cx={202 - travel * 194} cy="104" r="6" fill={C.indigo} />
                </>
              ) : null}
            </svg>

            <div style={{display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center'}}>
              <span
                style={{
                  fontFamily: FONT.sans,
                  fontSize: 18,
                  fontWeight: 600,
                  color: C.teal,
                  background: `${C.teal}14`,
                  border: `1px solid ${C.teal}33`,
                  borderRadius: 999,
                  padding: '7px 14px',
                }}
              >
                ① 遮罩後文字上雲
              </span>
              <span
                style={{
                  fontFamily: FONT.sans,
                  fontSize: 18,
                  fontWeight: 600,
                  color: C.indigo,
                  background: `${C.indigo}12`,
                  border: `1px solid ${C.indigo}33`,
                  borderRadius: 999,
                  padding: '7px 14px',
                }}
              >
                ② 文字回覆
              </span>
              <span
                style={{
                  marginTop: 4,
                  fontFamily: FONT.sans,
                  fontSize: 17,
                  color: C.inkSoft,
                }}
              >
                專線 / VPN 加密
              </span>
            </div>
          </div>

          <Column side="cloud" rows={CLOUD} delay={34} />
        </div>
      </Stage>
      <CornerBrand />
    </Scene>
  );
};
