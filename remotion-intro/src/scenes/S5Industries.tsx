import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {rise, pop} from '../anim';
import {Scene, Stage, Kicker, SceneTitle} from '../components/Layout';
import {CornerBrand} from '../components/Brand';

const ROWS = [
  {n: '01', title: '金融壽險', icon: 'industry-finance.svg', accent: '#2563EB',
   body: '理專話術智能輔助、個資去識別化；智能品檢嚴控合規風險，理賠文件自動摘要大幅縮短理賠週期。'},
  {n: '02', title: '政府公部門', icon: 'industry-government.svg', accent: '#059669',
   body: '法規文件智能比對減少差錯，民眾申辦流程智能導航；SOP 知識庫即時問答，打造高效便捷的數位政務。'},
  {n: '03', title: '電信服務', icon: 'industry-telecom.svg', accent: '#D97706',
   body: '網路故障預測主動維運、告警單智慧派發；資費查詢與帳單智能解析，快速回應客戶諮詢。'},
  {n: '04', title: '製造供應鏈', icon: 'industry-manufacturing.svg', accent: '#7C3AED',
   body: '設備維修 SOP 問答賦能一線排障，合約文件自動審查；客訴品質分析深挖根源，優化生產與服務流程。'},
  {n: '05', title: '醫療健康', icon: 'industry-healthcare.svg', accent: '#E11D48',
   body: '醫療術語精準辨識、智能預約掛號優化就診流程；健康管理諮詢提供個人化建議，提升就醫效率與體驗。'},
];

export const S5Industries: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Scene>
      <Stage>
        <Kicker delay={2}>產業場景</Kicker>
        <SceneTitle title="橫跨五大產業的全場景 AI 賦能" delay={6} />
        <div style={{marginTop: 34, flex: 1, display: 'flex', flexDirection: 'column'}}>
          {ROWS.map((r, i) => {
            const p = rise(frame, 26 + i * 14, 22);
            const ic = pop(frame, fps, 30 + i * 14, 180, 120);
            return (
              <div
                key={r.n}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  padding: '14px 0',
                  borderTop: `1px solid ${C.line}`,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -22}px)`,
                }}
              >
                <div
                  style={{
                    width: 72, height: 72, borderRadius: 20, flexShrink: 0,
                    background: `${r.accent}14`, border: `1px solid ${r.accent}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: `scale(${ic})`,
                  }}
                >
                  <Img src={staticFile(`icons/${r.icon}`)} style={{width: 40, height: 40}} />
                </div>
                <div style={{width: 250, display: 'flex', alignItems: 'baseline', gap: 12}}>
                  <span style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 24, color: r.accent}}>{r.n}</span>
                  <span style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 32, color: C.ink}}>{r.title}</span>
                </div>
                <div style={{flex: 1, fontFamily: FONT.sans, fontSize: 23, lineHeight: 1.7, color: C.inkMid, opacity: rise(frame, 34 + i * 14, 22)}}>
                  {r.body}
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
