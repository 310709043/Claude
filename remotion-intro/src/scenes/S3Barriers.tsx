import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {rise, pop} from '../anim';
import {Scene, Stage, Kicker, SceneTitle} from '../components/Layout';
import {CornerBrand} from '../components/Brand';

const ITEMS = [
  {
    n: '01',
    title: '雲地落差 · 資安合規',
    accent: C.orange,
    pain: '企業對雲端 AI 充滿期待，但落地成本高昂，且有個資外洩疑慮，投入與實際效益難以對齊。',
    fix: '100% 地端本地化，核心資料與運算完全留在企業內部，符合金融、政府等機構的最高資安標準。',
  },
  {
    n: '02',
    title: '架構兩難 · 靈活穩定',
    accent: C.magenta,
    pain: '營運系統要求極高穩定性，AI 導入卻需要快速迭代測試；傳統架構下兩者相互拉扯。',
    fix: '容器化微服務、獨立模組化設計，創新功能快速上線，不影響現有客服營運的穩定性。',
  },
  {
    n: '03',
    title: '整合困境 · 快速上線',
    accent: C.indigo,
    pain: '舊有 IVR／CTI 難以支撐 AI 的即時資料流，系統整合動輒需要 1–2 年才能落地。',
    fix: '開箱即用，內建完整話務與 AI 應用，無需複雜的舊系統改造，省去漫長整合期。',
  },
];

/** The pain card sits first; the appliance's answer slides up over it. */
const FLIP = 84;

export const S3Barriers: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const foot = rise(frame, 250, 26);

  return (
    <Scene>
      <Stage>
        <Kicker delay={2}>導入關卡</Kicker>
        <SceneTitle title="化解企業 AI 導入的三大關卡" delay={6} />

        <div style={{display: 'flex', gap: 30, marginTop: 44, flex: 1, alignItems: 'stretch'}}>
          {ITEMS.map((it, i) => {
            const p = pop(frame, fps, 28 + i * 10, 200, 90);
            const flip = rise(frame, FLIP + i * 14, 26);
            return (
              <div
                key={it.n}
                style={{
                  flex: 1,
                  position: 'relative',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 54}px)`,
                }}
              >
                <div style={{display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18}}>
                  <span style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 44, color: it.accent}}>{it.n}</span>
                  <span style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 30, color: C.ink}}>{it.title}</span>
                </div>

                {/* pain */}
                <div
                  style={{
                    background: `${C.ink}08`,
                    border: `1px dashed ${C.ink}22`,
                    borderRadius: 22,
                    padding: '26px 28px 30px',
                    opacity: 1 - flip * 0.55,
                    transform: `scale(${1 - flip * 0.03}) translateY(${flip * -6}px)`,
                  }}
                >
                  <div style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 18, letterSpacing: '0.18em', color: C.inkSoft, marginBottom: 12}}>
                    現況痛點
                  </div>
                  <div style={{fontFamily: FONT.sans, fontSize: 21, lineHeight: 1.75, color: C.inkMid}}>{it.pain}</div>
                </div>

                {/* the appliance's answer */}
                <div
                  style={{
                    marginTop: 18,
                    background: 'rgba(255,255,255,0.94)',
                    border: `1px solid ${C.line}`,
                    borderTop: `5px solid ${it.accent}`,
                    borderRadius: 22,
                    padding: '26px 28px 30px',
                    boxShadow: `0 26px 60px -26px ${C.ink}30`,
                    opacity: flip,
                    transform: `translateY(${(1 - flip) * 40}px)`,
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12}}>
                    <span style={{width: 10, height: 10, borderRadius: 3, background: it.accent}} />
                    <span style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 18, letterSpacing: '0.18em', color: it.accent}}>
                      一體機解法
                    </span>
                  </div>
                  <div style={{fontFamily: FONT.sans, fontWeight: 500, fontSize: 22, lineHeight: 1.75, color: C.ink}}>{it.fix}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 34,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontWeight: 700,
            fontSize: 28,
            color: C.orangeDeep,
            letterSpacing: '0.04em',
            opacity: foot,
            transform: `translateY(${(1 - foot) * 12}px)`,
          }}
        >
          打破技術壁壘，讓企業 AI 從規劃走向落地不再遙不可及
        </div>
      </Stage>
      <CornerBrand />
    </Scene>
  );
};
