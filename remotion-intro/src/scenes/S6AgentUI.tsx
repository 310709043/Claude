import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, FONT} from '../theme';
import {rise, pop, EASE_OUT} from '../anim';
import {Scene, Stage, Kicker} from '../components/Layout';
import {CornerBrand} from '../components/Brand';
import {Screen} from '../components/Screen';
import {Callout} from '../components/Callout';

/** Beat A — during the call. Park points chosen against the screen's empty regions. */
const LIVE: Callout[] = [
  {at: [0.905, 0.160], to: [0.560, 0.115], label: '對話即時逐字稿，確認對話內容', delay: 22},
  {at: [0.100, 0.275], to: [0.340, 0.400], label: '服務過程自動勾選服務代碼', delay: 40},
  {at: [0.700, 0.525], to: [0.560, 0.535], label: '服務過程即時質檢', delay: 58},
  {at: [0.905, 0.745], to: [0.500, 0.780], label: 'AI 話術建議（AI Copilot）', delay: 76},
];

const BEAT_B = 212;

const BULLETS_A = ['對話即時逐字稿，確認對話內容', 'AI 話術建議，提供客服即時回覆建議', '自動勾選服務代碼，節省話後作業', '即時質檢，無需等待對話結束'];
const BULLETS_B = ['通話結束產生摘要，加速人工紀錄', '完整服務質檢報告，免人工抽聽'];

export const S6AgentUI: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const screenP = pop(frame, fps, 8, 210, 80);
  const b = rise(frame, BEAT_B, 20);
  const card1 = pop(frame, fps, BEAT_B + 6, 200, 90);
  const card2 = pop(frame, fps, BEAT_B + 30, 200, 90);
  const push = interpolate(frame, [0, 432], [1, 1.03], {extrapolateRight: 'clamp', easing: EASE_OUT});

  return (
    <Scene>
      <Stage style={{paddingTop: 80, paddingBottom: 112}}>
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <div>
            <Kicker delay={2}>示意介面</Kicker>
            <h2 style={{margin: '16px 0 0', fontFamily: FONT.sans, fontWeight: 900, fontSize: 56, color: C.ink, opacity: rise(frame, 6, 24)}}>
              多 AI Agent 值機介面
            </h2>
          </div>
          {/* beat indicator */}
          <div style={{display: 'flex', gap: 10, paddingBottom: 14, opacity: rise(frame, 14, 20)}}>
            {['通話中', '通話結束'].map((t, i) => {
              const on = i === 0 ? 1 - b : b;
              return (
                <span key={t} style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', padding: '8px 16px', borderRadius: 999, color: on > 0.5 ? C.paper : C.inkSoft, background: on > 0.5 ? C.orange : `${C.ink}08`, border: `1px solid ${on > 0.5 ? C.orange : C.line}`}}>
                  {t}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{display: 'flex', gap: 46, alignItems: 'center', flex: 1, marginTop: 26}}>
          <div style={{width: 420, flexShrink: 0, position: 'relative', height: 420}}>
            {[BULLETS_A, BULLETS_B].map((list, k) => {
              const vis = k === 0 ? 1 - b : b;
              if (vis <= 0.01) return null;
              return (
                <div key={k} style={{position: 'absolute', inset: 0, opacity: vis, transform: `translateY(${(1 - vis) * (k === 0 ? -16 : 16)}px)`}}>
                  <div style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 21, letterSpacing: '0.2em', color: C.orange}}>{k === 0 ? 'IN CALL' : 'AFTER CALL'}</div>
                  <h3 style={{margin: '18px 0 0', fontFamily: FONT.sans, fontWeight: 800, fontSize: 36, lineHeight: 1.3, color: C.ink}}>
                    {k === 0 ? '通話中，AI 與專員並肩' : '通話結束，紀錄自動完成'}
                  </h3>
                  <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14}}>
                    {list.map((n, j) => {
                      const q = rise(frame, (k === 0 ? 18 : BEAT_B + 10) + j * 8, 20);
                      return (
                        <div key={n} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: q, transform: `translateX(${(1 - q) * -14}px)`}}>
                          <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill={`${C.orange}1F`} /><path d="M6 10.4 L8.8 13 L14 7.4" stroke={C.orange} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                          <span style={{fontFamily: FONT.sans, fontSize: 22, color: C.inkMid}}>{n}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', opacity: screenP, transform: `translateY(${(1 - screenP) * 30}px) scale(${push})`}}>
            <Screen
              shot="ai-agent"
              width={1180}
              label="TAIPBX Call Center ／ 多 AI Agent 值機"
              callouts={LIVE}
              calloutProgress={LIVE.map((c) => rise(frame, c.delay, 20) * (1 - b))}
              calloutAccent={C.orange}
            />
            {/* after-call: the summary and the full QA report rise over the screen */}
            <div style={{position: 'absolute', left: 40, bottom: -18, opacity: card1, transform: `translateY(${(1 - card1) * 60}px) rotate(-1.6deg)`}}>
              <Screen shot="ai-summary" width={620} label="AI 話後摘要 · 通話結束自動產生" />
            </div>
            <div style={{position: 'absolute', right: 28, top: 24, opacity: card2, transform: `translateY(${(1 - card2) * 60}px) rotate(1.4deg)`}}>
              <Screen shot="ai-qa-report" width={400} label="品質評核報告 · 免人工抽聽" />
            </div>
          </div>
        </div>
      </Stage>
      <CornerBrand />
    </Scene>
  );
};
