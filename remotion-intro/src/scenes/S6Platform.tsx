import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT} from '../theme';
import {rise, EASE_OUT} from '../anim';
import {Scene, Stage, Kicker} from '../components/Layout';
import {CornerBrand} from '../components/Brand';
import {Screen, ShotId} from '../components/Screen';
import {Callout} from '../components/Callout';

type Shot = {
  shot: ShotId;
  chrome: string;
  title: string;
  body: string;
  accent: string;
  notes: string[];
  /** Points on the shot the narration is actually talking about. */
  callouts: Callout[];
};

const SHOWCASE: Shot[] = [
  {
    shot: 'agent-status',
    chrome: 'TAIPBX Call Center ／ 值機監控',
    title: '全渠道服務統一操作介面',
    body: 'Voice、Chat、Email 與社群訊息收斂到同一張值機台，主管即時掌握 Agent 與小組狀態。',
    accent: C.orange,
    notes: ['Agent 值機狀態', '小組值機狀態', '通話與等待即時統計'],
    callouts: [
      {at: [0.875, 0.205], to: [0.735, 0.125], label: '全渠道統一檢視', delay: 20},
      {at: [0.310, 0.440], to: [0.440, 0.560], label: '值機狀態即時更新', delay: 36},
    ],
  },
  {
    shot: 'customer-ivr',
    chrome: 'TAIPBX Call Center ／ 進線受理',
    title: '客戶資料與 IVR 步驟即時顯示',
    body: '來電接起同時帶出客戶基本資料、IVR 走訪路徑與跨渠道來訪紀錄，專員一眼看懂客戶的問題。',
    accent: C.magenta,
    notes: ['客戶基本資料立即顯示', 'IVR 語音步驟即時顯示', '跨渠道來訪歷史'],
    callouts: [
      {at: [0.105, 0.300], to: [0.155, 0.660], label: '客戶基本資料', delay: 20},
      {at: [0.385, 0.200], to: [0.360, 0.560], label: 'IVR 語音步驟', delay: 36},
    ],
  },
  {
    shot: 'service-record',
    chrome: 'TAIPBX Call Center ／ 服務紀錄',
    title: '服務紀錄與話後註記',
    body: '專員在對談中即可編輯工單、勾選服務代碼並留下話後註記，供日後客戶行為分析與查詢。',
    accent: C.indigo,
    notes: ['對談中直接編輯工單', '服務代碼標記', '話後註記留存可查'],
    callouts: [
      {at: [0.115, 0.125], to: [0.310, 0.630], label: '服務代碼標記', delay: 20},
      {at: [0.150, 0.330], to: [0.310, 0.800], label: '話後註記留存', delay: 36},
    ],
  },
  {
    shot: 'ai-copilot',
    chrome: 'TAIPBX Call Center ／ 多 AI Agent 值機',
    title: 'AI Copilot 即時輔助專員',
    body: '對話即時逐字稿搭配 AI 話術建議，服務過程自動勾選服務代碼，大幅壓縮話後作業時間。',
    accent: C.sky,
    notes: ['即時逐字稿', 'AI 話術建議', '自動勾選服務代碼'],
    callouts: [
      {at: [0.905, 0.095], to: [0.700, 0.075], label: '對話即時逐字稿', delay: 18},
      {at: [0.120, 0.145], to: [0.380, 0.290], label: '自動勾選服務代碼', delay: 32},
      {at: [0.905, 0.830], to: [0.700, 0.760], label: 'AI 話術建議', delay: 46},
    ],
  },
  {
    shot: 'ai-quality',
    chrome: 'TAIPBX Call Center ／ 智能質檢',
    title: '即時質檢與話後摘要',
    body: '通話進行中同步檢驗服務規範，結束即產出完整質檢報告與摘要，免人工抽聽。',
    accent: C.teal,
    notes: ['即時質檢不必等結束', '自動產生通話摘要', '全量品質與合規審查'],
    callouts: [
      {at: [0.115, 0.325], to: [0.310, 0.325], label: '整體與各階段評分', delay: 20},
      {at: [0.800, 0.535], to: [0.640, 0.640], label: '通話中同步質檢', delay: 36},
    ],
  },
  {
    shot: 'outbound-config',
    chrome: 'TAIPBX Call Center ／ 自動外撥',
    title: '自動外撥專案設定',
    body: '督導可依名單設定撥號規則、重撥時段與傳統或 AI 流程，並即時查看撥號結果。',
    accent: C.amber,
    notes: ['撥打時段與速率控制', '重撥條件與緊急停止', '傳統／AI 流程切換'],
    callouts: [
      {at: [0.550, 0.405], to: [0.620, 0.855], label: '重撥條件與速率控制', delay: 20},
      {at: [0.300, 0.600], to: [0.205, 0.885], label: '傳統／AI 流程切換', delay: 36},
    ],
  },
];

/**
 * Frames each shot holds — long enough for its callouts to land on the UI and
 * still be read. The outgoing panel starts leaving just before the next one
 * arrives, so the handover keeps a beat of overlap without ever
 * double-exposing two headlines on top of each other.
 */
const PER = 102;
const LEAD = 16;
const IN_DUR = 14;
const OUT_LEAD = 6;
const OUT_DUR = 12;

const startOf = (i: number) => LEAD + i * PER;

const Panel: React.FC<{item: Shot; index: number}> = ({item, index}) => {
  const frame = useCurrentFrame();
  const start = startOf(index);
  const local = frame - start;

  const inP = rise(frame, start, IN_DUR);
  const outP =
    index < SHOWCASE.length - 1
      ? rise(frame, start + PER - OUT_LEAD, OUT_DUR)
      : 0;
  const vis = inP * (1 - outP);
  if (vis <= 0.002) return null;
  // Shots leave to the left and arrive from the right — the handover reads as
  // a move, not a dissolve.
  const shift = (1 - inP) * 44 - outP * 44;

  // A slow push on the whole framed screen, never on the pixels inside it,
  // so no part of the real UI is ever cropped away.
  const push = interpolate(local, [0, PER + OUT_DUR], [1, 1.035], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const lift = interpolate(local, [0, PER + OUT_DUR], [0, -16], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: vis,
        transform: `translateX(${shift}px)`,
      }}
    >
      <div style={{display: 'flex', gap: 56, alignItems: 'center', height: '100%'}}>
        <div style={{width: 490, flexShrink: 0}}>
          <span
            style={{
              fontFamily: FONT.latin,
              fontWeight: 800,
              fontSize: 21,
              letterSpacing: '0.2em',
              color: item.accent,
            }}
          >
            {String(index + 1).padStart(2, '0')} ／ {String(SHOWCASE.length).padStart(2, '0')}
          </span>
          <h3
            style={{
              margin: '20px 0 0',
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: 43,
              lineHeight: 1.28,
              color: C.ink,
              }}
          >
            {item.title}
          </h3>
          <p
            style={{
              margin: '22px 0 0',
              fontFamily: FONT.sans,
              fontSize: 23,
              lineHeight: 1.8,
              color: C.inkSoft,
              opacity: rise(frame, start + 8, 22),
            }}
          >
            {item.body}
          </p>
          <div style={{marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14}}>
            {item.notes.map((n, j) => {
              const q = rise(frame, start + 14 + j * 6, 20);
              return (
                <div
                  key={n}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    opacity: q,
                    transform: `translateX(${(1 - q) * -14}px)`,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="9" fill={`${item.accent}1F`} />
                    <path
                      d="M6 10.4 L8.8 13 L14 7.4"
                      stroke={item.accent}
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  <span style={{fontFamily: FONT.sans, fontSize: 22, color: C.inkMid}}>{n}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            transform: `translateY(${(1 - inP) * 26 + lift}px) scale(${push})`,
          }}
        >
          <Screen
            shot={item.shot}
            width={1100}
            label={item.chrome}
            callouts={item.callouts}
            calloutProgress={item.callouts.map((c) =>
              rise(frame, start + c.delay, 20),
            )}
            calloutAccent={item.accent}
          />
        </div>
      </div>
    </div>
  );
};

export const S6Platform: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <Stage style={{paddingTop: 80, paddingBottom: 112}}>
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <div>
            <Kicker delay={2}>平台介面</Kicker>
            <h2
              style={{
                margin: '16px 0 0',
                fontFamily: FONT.sans,
                fontWeight: 900,
                fontSize: 56,
                color: C.ink,
                opacity: rise(frame, 6, 24),
              }}
            >
              TAIPBX Call Center 值機與管理介面
            </h2>
          </div>
          <div style={{display: 'flex', gap: 8, paddingBottom: 14, opacity: rise(frame, 14, 20)}}>
            {SHOWCASE.map((s, i) => {
              const fill = Math.max(0, Math.min(1, (frame - startOf(i)) / PER));
              return (
                <span
                  key={s.shot}
                  style={{
                    width: 52,
                    height: 4,
                    borderRadius: 2,
                    background: C.line,
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      height: '100%',
                      width: `${fill * 100}%`,
                      background: s.accent,
                    }}
                  />
                </span>
              );
            })}
          </div>
        </div>

        <div style={{position: 'relative', flex: 1, marginTop: 30}}>
          {SHOWCASE.map((item, i) => (
            <Panel key={item.shot} item={item} index={i} />
          ))}
        </div>
      </Stage>
      <CornerBrand />
    </Scene>
  );
};
