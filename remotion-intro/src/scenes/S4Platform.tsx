import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, FONT} from '../theme';
import {rise, pop} from '../anim';
import {Scene, Stage, Kicker} from '../components/Layout';
import {CornerBrand} from '../components/Brand';

type Part = 'shield' | 'vm' | 'containers' | 'gpu' | 'rag' | 'expand';

const CAPS: {n: string; title: string; body: string; accent: string; part: Part}[] = [
  {n: '01', title: '100% 地端安全合規', body: '核心資料與運算完全留在企業內部，符合最高等級資安與個資保護標準。', accent: C.orange, part: 'shield'},
  {n: '02', title: 'VME 物理隔離機制', body: '多台獨立虛擬機，話務、語音處理與 AI 工作節點完全隔離，互不干擾。', accent: C.magenta, part: 'vm'},
  {n: '03', title: '微服務開箱極速整合', body: '全系統 Docker 容器化部署，將 1–2 年的建置週期大幅壓縮，開箱即用。', accent: C.indigo, part: 'containers'},
  {n: '04', title: 'GPU 算力分流', body: 'NVIDIA 旗艦級運算晶片，語音處理與 AI 推論獨立平行，對話零延遲。', accent: C.teal, part: 'gpu'},
  {n: '05', title: '精準 RAG 檢索生成', body: '內建企業專屬知識庫檢索增強，有效抑制 AI 幻覺，輸出貼合業務的應答。', accent: C.sky, part: 'rag'},
  {n: '06', title: '彈性擴充無縫接軌', body: '主機支援擴充至 4 張高階 GPU，算力升級或席次擴容都能快速無縫接軌。', accent: C.amber, part: 'expand'},
];

const STEP = 46;
const START = 34;

/**
 * The appliance itself, drawn as a front-panel schematic. Each capability
 * lights the part of the chassis it lives in, so the six cards read as one
 * machine rather than six bullet points.
 */
const Chassis: React.FC<{lit: Record<Part, number>; frame: number}> = ({lit, frame}) => {
  const glow = (p: number, color: string) => (p > 0.01 ? `drop-shadow(0 0 ${10 * p}px ${color})` : 'none');
  const pulse = 0.5 + 0.5 * Math.sin(frame / 9);
  return (
    <svg viewBox="0 0 680 360" width="100%" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EEF1F7" />
        </linearGradient>
        <linearGradient id="bezel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2A2F3A" />
          <stop offset="1" stopColor="#3A414F" />
        </linearGradient>
      </defs>

      {/* shadow + body */}
      <ellipse cx="340" cy="342" rx="300" ry="16" fill={C.ink} opacity="0.12" />
      <rect x="20" y="40" width="640" height="280" rx="22" fill="url(#body)" stroke={C.line} strokeWidth="2" />
      <rect x="20" y="40" width="640" height="40" rx="22" fill="url(#bezel)" />
      <rect x="20" y="62" width="640" height="18" fill="url(#bezel)" />
      <text x="48" y="67" fontFamily={FONT.latin} fontWeight="800" fontSize="15" letterSpacing="3" fill="#FFFFFF">
        TAIPBX CALL CENTER
      </text>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={600 + i * 20} cy="60" r="4.5" fill={i === 0 ? C.teal : i === 1 ? C.amber : C.orange} opacity={0.6 + 0.4 * pulse} />
      ))}

      {/* shield — on-prem */}
      <g style={{filter: glow(lit.shield, C.orange)}} opacity={0.35 + 0.65 * lit.shield}>
        <path d="M70 108 L104 96 L138 108 V140 C138 164 118 178 104 184 C90 178 70 164 70 140 Z" fill={`${C.orange}22`} stroke={C.orange} strokeWidth="2.5" />
        <path d="M90 140 L100 150 L118 128" stroke={C.orange} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="104" y="212" textAnchor="middle" fontFamily={FONT.sans} fontWeight="700" fontSize="13" fill={C.inkMid}>100% 地端</text>
      </g>

      {/* VM lanes — VME isolation */}
      <g opacity={0.35 + 0.65 * lit.vm} style={{filter: glow(lit.vm, C.magenta)}}>
        {['話務', '語音處理', 'AI 節點'].map((l, i) => (
          <g key={l}>
            <rect x="170" y={100 + i * 40} width="160" height="30" rx="7" fill={`${C.magenta}14`} stroke={C.magenta} strokeWidth="2" />
            <rect x="178" y={108 + i * 40} width="6" height="14" rx="2" fill={C.magenta} />
            <text x="194" y={120 + i * 40} fontFamily={FONT.sans} fontWeight="700" fontSize="13" fill={C.ink}>{`VM ${i + 1} · ${l}`}</text>
          </g>
        ))}
        <text x="250" y="240" textAnchor="middle" fontFamily={FONT.sans} fontWeight="700" fontSize="13" fill={C.inkMid}>VME 物理隔離</text>
      </g>

      {/* containers — microservices */}
      <g opacity={0.35 + 0.65 * lit.containers} style={{filter: glow(lit.containers, C.indigo)}}>
        {Array.from({length: 12}).map((_, i) => {
          const cx = 360 + (i % 4) * 30;
          const cy = 100 + Math.floor(i / 4) * 30;
          const on = interpolate(lit.containers, [i / 12, (i + 1) / 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return <rect key={i} x={cx} y={cy} width="24" height="24" rx="5" fill={`${C.indigo}${on > 0.5 ? '33' : '12'}`} stroke={C.indigo} strokeWidth="1.8" />;
        })}
        <text x="416" y="212" textAnchor="middle" fontFamily={FONT.sans} fontWeight="700" fontSize="13" fill={C.inkMid}>Docker 微服務</text>
      </g>

      {/* GPU bays */}
      {[0, 1, 2, 3].map((i) => {
        const base = i < 2 ? lit.gpu : lit.expand;
        const color = i < 2 ? C.teal : C.amber;
        return (
          <g key={i} opacity={0.3 + 0.7 * base} style={{filter: glow(base, color)}}>
            <rect x={508 + i * 34} y="98" width="26" height="120" rx="6" fill={`${color}18`} stroke={color} strokeWidth="2" />
            {[0, 1, 2, 3, 4].map((k) => (
              <rect key={k} x={514 + i * 34} y={108 + k * 20} width="14" height="10" rx="2" fill={color} opacity={base > 0.5 ? 0.55 + 0.45 * pulse : 0.25} />
            ))}
            {i >= 2 && lit.expand < 0.5 ? (
              <text x={521 + i * 34} y="164" textAnchor="middle" fontFamily={FONT.latin} fontWeight="800" fontSize="18" fill={color}>+</text>
            ) : null}
          </g>
        );
      })}
      <text x="572" y="240" textAnchor="middle" fontFamily={FONT.sans} fontWeight="700" fontSize="13" fill={C.inkMid} opacity={0.4 + 0.6 * Math.max(lit.gpu, lit.expand)}>
        GPU ×4
      </text>

      {/* RAG — knowledge tile */}
      <g opacity={0.35 + 0.65 * lit.rag} style={{filter: glow(lit.rag, C.sky)}}>
        <rect x="170" y="258" width="470" height="40" rx="10" fill={`${C.sky}12`} stroke={C.sky} strokeWidth="2" />
        <path d="M190 268 h18 v20 h-18 z M212 268 h18 v20 h-18 z" fill="none" stroke={C.sky} strokeWidth="2" />
        <text x="244" y="284" fontFamily={FONT.sans} fontWeight="700" fontSize="14" fill={C.ink}>企業知識庫 · RAG 檢索增強</text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={470 + i * 26} y="270" width="16" height="16" rx="3" fill={C.sky} opacity={lit.rag > (i + 1) / 7 ? 0.7 : 0.15} />
        ))}
      </g>
    </svg>
  );
};

export const S4Platform: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chassisP = pop(frame, fps, 10, 200, 80);

  const lit = CAPS.reduce((acc, c, i) => {
    acc[c.part] = rise(frame, START + i * STEP, 24);
    return acc;
  }, {} as Record<Part, number>);

  return (
    <Scene>
      <Stage style={{paddingBottom: 116}}>
        <Kicker delay={2}>核心技術</Kicker>
        <h2 style={{margin: '16px 0 0', fontFamily: FONT.sans, fontWeight: 900, fontSize: 60, color: C.ink, opacity: rise(frame, 6, 24)}}>
          六大核心技術能力，驅動架構與智能升級
        </h2>

        <div style={{display: 'flex', gap: 50, marginTop: 38, flex: 1, alignItems: 'center'}}>
          <div style={{width: 880, opacity: chassisP, transform: `translateY(${(1 - chassisP) * 30}px) scale(${0.96 + chassisP * 0.04})`}}>
            <Chassis lit={lit} frame={frame} />
          </div>

          <div style={{flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
            {CAPS.map((c, i) => {
              const p = rise(frame, START + i * STEP, 22);
              const active = lit[c.part];
              return (
                <div
                  key={c.n}
                  style={{
                    background: 'rgba(255,255,255,0.92)',
                    border: `1px solid ${active > 0.5 ? `${c.accent}66` : C.line}`,
                    borderRadius: 18,
                    padding: '18px 20px',
                    boxShadow: active > 0.5 ? `0 18px 40px -20px ${c.accent}66` : `0 12px 30px -20px ${C.ink}22`,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 22}px)`,
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <span style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 18, color: c.accent}}>{c.n}</span>
                    <span style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 21, color: C.ink}}>{c.title}</span>
                  </div>
                  <div style={{marginTop: 8, fontFamily: FONT.sans, fontSize: 17, lineHeight: 1.62, color: C.inkSoft}}>{c.body}</div>
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
