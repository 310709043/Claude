import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {rise, pop} from '../anim';
import {Scene, Stage, Kicker, SceneTitle} from '../components/Layout';
import {CornerBrand} from '../components/Brand';

const PILLARS = [
  {n: '01', title: '釋放營運產能', accent: C.orange, body: 'AI 自動產出話後小結，大幅縮短人工作業時間，讓專員專注於高價值服務，提升團隊效能與客戶滿意度。'},
  {n: '02', title: '跨越整合難關', accent: C.magenta, body: '摒棄老舊系統包袱，單一主機架構設計，大幅降低跨系統對接的複雜度與導入風險，實現無縫融合。'},
  {n: '03', title: '確保合規零風險', accent: C.indigo, body: '內建防幻覺機制與精細化權限控管，敏感資料 100% 本地端處理，從源頭保障資料安全與合規底線。'},
  {n: '04', title: '長期投資保護', accent: C.teal, body: '一次性投入即獲得完整 AI 基礎建設，支援硬體平滑升級與多 Agent 應用擴充，隨業務發展靈活配置。'},
];

export const S8Value: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const close = rise(frame, 176, 28);
  return (
    <Scene>
      <Stage>
        <Kicker delay={2}>投資價值</Kicker>
        <SceneTitle title="一次投資，長期增值，驅動企業轉型" delay={6} />

        <div style={{flex: 1, display: 'flex', alignItems: 'center', marginTop: 30}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, width: '100%'}}>
            {PILLARS.map((p, i) => {
              const q = pop(frame, fps, 30 + i * 12, 200, 90);
              const r = rise(frame, 44 + i * 12, 24);
              return (
                <div
                  key={p.n}
                  style={{
                    display: 'flex', gap: 22, alignItems: 'flex-start',
                    background: 'rgba(255,255,255,0.92)', border: `1px solid ${C.line}`, borderRadius: 24,
                    padding: '28px 30px', boxShadow: `0 24px 56px -28px ${C.ink}2A`,
                    opacity: q, transform: `translateY(${(1 - q) * 40}px)`,
                  }}
                >
                  <div style={{width: 64, height: 64, borderRadius: 18, flexShrink: 0, background: `${p.accent}14`, border: `1px solid ${p.accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 24, color: p.accent}}>{p.n}</span>
                  </div>
                  <div>
                    <div style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 30, color: C.ink}}>{p.title}</div>
                    <div style={{marginTop: 10, fontFamily: FONT.sans, fontSize: 21, lineHeight: 1.72, color: C.inkSoft, opacity: r}}>{p.body}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{textAlign: 'center', marginTop: 24, opacity: close, transform: `translateY(${(1 - close) * 14}px)`}}>
          <span style={{display: 'inline-block', width: close * 60, height: 2, background: C.orange, verticalAlign: 'middle', marginRight: 22}} />
          <span style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, color: C.ink, letterSpacing: '0.08em', verticalAlign: 'middle'}}>
            企業 AI 轉型，從 <span style={{color: C.orangeDeep, fontFamily: FONT.latin}}>TAIPBX Call Center</span> 開始
          </span>
          <span style={{display: 'inline-block', width: close * 60, height: 2, background: C.orange, verticalAlign: 'middle', marginLeft: 22}} />
        </div>
      </Stage>
      <CornerBrand />
    </Scene>
  );
};
