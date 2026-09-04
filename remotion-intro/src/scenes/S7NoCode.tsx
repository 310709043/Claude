import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT} from '../theme';
import {rise, EASE_OUT} from '../anim';
import {Scene, Stage, Kicker} from '../components/Layout';
import {CornerBrand} from '../components/Brand';
import {Screen, ShotId} from '../components/Screen';
import {Callout} from '../components/Callout';

type Shot = {shot: ShotId; chrome: string; title: string; body: string; accent: string; notes: string[]; callouts: Callout[]};

const SHOWCASE: Shot[] = [
  {
    shot: 'nocode-urls',
    chrome: 'TAIPBX AI 助理 ／ 外部網站匯入',
    title: '輸入外部網站 URL，整站匯入知識庫',
    body: '無縫整合外部網站資訊，勾選要納入的頁面即完成匯入，大幅減少人工作業時間。',
    accent: C.orange,
    notes: ['貼上網址即掃描整站頁面', '勾選頁面、一鍵匯入', '內容自動新增至知識庫'],
    callouts: [
      {at: [0.135, 0.545], to: [0.320, 0.860], label: '勾選要匯入的頁面', delay: 20},
      {at: [0.875, 0.875], to: [0.660, 0.955], label: '一鍵匯入知識庫', delay: 36},
    ],
  },
  {
    shot: 'kb-files',
    chrome: 'TAIPBX AI 助理 ／ 知識庫',
    title: '知識庫檔案上傳，多格式支援',
    body: '文件上傳後自動解析入庫，適用於敏感、需 100% 精準回覆的場景。',
    accent: C.indigo,
    notes: ['支援多種檔案格式上傳', '解析完成即可檢索', '網頁／內部／API／LINE 多渠道共用'],
    callouts: [
      {at: [0.905, 0.165], to: [0.620, 0.090], label: '上傳檔案', delay: 20},
      {at: [0.535, 0.310], to: [0.400, 0.950], label: '解析完成即可查詢', delay: 36},
    ],
  },
  {
    shot: 'kb-faq',
    chrome: 'TAIPBX AI 助理 ／ FAQ 常見問題',
    title: 'FAQ 問答建立，精準回覆',
    body: '以問答對定義標準答案，批量匯入或逐筆建立，no code 建置企業專屬 AI 助理。',
    accent: C.teal,
    notes: ['批量匯入 FAQ', '逐筆建立、即時生效', '敏感場景 100% 精準回覆'],
    callouts: [
      {at: [0.765, 0.128], to: [0.520, 0.128], label: '批量匯入 FAQ', delay: 20},
      {at: [0.310, 0.260], to: [0.620, 0.300], label: '問答對即時生效', delay: 36},
    ],
  },
];

const PER = 104;
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
  const outP = index < SHOWCASE.length - 1 ? rise(frame, start + PER - OUT_LEAD, OUT_DUR) : 0;
  const vis = inP * (1 - outP);
  if (vis <= 0.002) return null;
  const shift = (1 - inP) * 44 - outP * 44;
  const push = interpolate(local, [0, PER + OUT_DUR], [1, 1.035], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT});
  const lift = interpolate(local, [0, PER + OUT_DUR], [0, -16], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div style={{position: 'absolute', inset: 0, opacity: vis, transform: `translateX(${shift}px)`}}>
      <div style={{display: 'flex', gap: 56, alignItems: 'center', height: '100%'}}>
        <div style={{width: 490, flexShrink: 0}}>
          <span style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 21, letterSpacing: '0.2em', color: item.accent}}>
            {String(index + 1).padStart(2, '0')} ／ {String(SHOWCASE.length).padStart(2, '0')}
          </span>
          <h3 style={{margin: '20px 0 0', fontFamily: FONT.sans, fontWeight: 800, fontSize: 40, lineHeight: 1.3, color: C.ink}}>{item.title}</h3>
          <p style={{margin: '22px 0 0', fontFamily: FONT.sans, fontSize: 23, lineHeight: 1.8, color: C.inkSoft, opacity: rise(frame, start + 8, 22)}}>{item.body}</p>
          <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 14}}>
            {item.notes.map((n, j) => {
              const q = rise(frame, start + 14 + j * 6, 20);
              return (
                <div key={n} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: q, transform: `translateX(${(1 - q) * -14}px)`}}>
                  <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill={`${item.accent}1F`} /><path d="M6 10.4 L8.8 13 L14 7.4" stroke={item.accent} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                  <span style={{fontFamily: FONT.sans, fontSize: 22, color: C.inkMid}}>{n}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - inP) * 26 + lift}px) scale(${push})`}}>
          <Screen
            shot={item.shot}
            width={item.shot === 'nocode-urls' ? 1100 : 980}
            label={item.chrome}
            callouts={item.callouts}
            calloutProgress={item.callouts.map((c) => rise(frame, start + c.delay, 20))}
            calloutAccent={item.accent}
          />
        </div>
      </div>
    </div>
  );
};

export const S7NoCode: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <Stage style={{paddingTop: 80, paddingBottom: 112}}>
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <div>
            <Kicker delay={2}>AI 助理建置</Kicker>
            <h2 style={{margin: '16px 0 0', fontFamily: FONT.sans, fontWeight: 900, fontSize: 56, color: C.ink, opacity: rise(frame, 6, 24)}}>
              <span style={{fontFamily: FONT.latin, fontWeight: 800}}>no code</span> 建置企業專屬 AI 助理
            </h2>
          </div>
          <div style={{display: 'flex', gap: 8, paddingBottom: 14, opacity: rise(frame, 14, 20)}}>
            {SHOWCASE.map((s, i) => {
              const fill = Math.max(0, Math.min(1, (frame - startOf(i)) / PER));
              return (
                <span key={s.shot} style={{width: 52, height: 4, borderRadius: 2, background: C.line, overflow: 'hidden'}}>
                  <span style={{display: 'block', height: '100%', width: `${fill * 100}%`, background: s.accent}} />
                </span>
              );
            })}
          </div>
        </div>
        <div style={{position: 'relative', flex: 1, marginTop: 30}}>
          {SHOWCASE.map((item, i) => <Panel key={item.shot} item={item} index={i} />)}
        </div>
      </Stage>
      <CornerBrand />
    </Scene>
  );
};
