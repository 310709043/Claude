import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {rise} from '../anim';
import {Scene, Stage, Kicker, SceneTitle} from '../components/Layout';
import {CornerBrand} from '../components/Brand';

const ROWS = [
  {label: '聯絡管道', now: ['電話'], next: ['電話', 'Webcall', 'Chat', 'Social Media'], accent: C.orange},
  {label: 'IVR 互動', now: ['IVR Flow'], next: ['語音導航', '語音機器人', '文字機器人', 'MCP 整合'], accent: C.magenta},
  {label: '專人服務', now: ['Skill-Based Routing', 'Group Routing'], next: ['AI 路由', '提前警示', '即時警示'], accent: C.indigo},
  {label: '報表 ／ 看板', now: ['報表平台'], next: ['AI 報表產出', '智能質檢', '即時質檢'], accent: C.teal},
];

const Chip: React.FC<{
  children: React.ReactNode;
  tone: 'now' | 'next';
  accent: string;
  p: number;
}> = ({children, tone, accent, p}) => (
  <span
    style={{
      fontFamily: FONT.sans,
      fontSize: 21,
      fontWeight: tone === 'next' ? 600 : 400,
      color: tone === 'next' ? C.ink : C.inkSoft,
      padding: '10px 18px',
      borderRadius: 10,
      whiteSpace: 'nowrap',
      background: tone === 'next' ? `${accent}12` : 'rgba(255,255,255,0.7)',
      border: `1px solid ${tone === 'next' ? `${accent}44` : C.line}`,
      opacity: p,
      transform: `translateY(${(1 - p) * 12}px)`,
    }}
  >
    {children}
  </span>
);

export const S4NowFuture: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Scene>
      <Stage>
        <Kicker delay={2}>轉型方向</Kicker>
        <SceneTitle title="客服中心　現況與未來" delay={6} />

        <div style={{marginTop: 52, flex: 1, display: 'flex', flexDirection: 'column'}}>
          {/* column captions */}
          <div style={{display: 'flex', alignItems: 'center', paddingBottom: 18}}>
            <div style={{width: 220}} />
            <div style={{width: 430, opacity: rise(frame, 16, 20)}}>
              <span style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.18em', color: C.inkSoft}}>
                現在
              </span>
            </div>
            <div style={{width: 120}} />
            <div style={{flex: 1, opacity: rise(frame, 22, 20)}}>
              <span style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.18em', color: C.orangeDeep}}>
                未來
              </span>
            </div>
          </div>

          {ROWS.map((row, i) => {
            const base = 26 + i * 13;
            const rowP = rise(frame, base, 22);
            const arrowP = rise(frame, base + 8, 22);
            return (
              <div
                key={row.label}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '18px 0',
                  borderTop: `1px solid ${C.line}`,
                  opacity: rowP,
                }}
              >
                <div style={{width: 220, display: 'flex', alignItems: 'center', gap: 14}}>
                  <span style={{width: 4, height: 30, borderRadius: 2, background: row.accent, transform: `scaleY(${rowP})`}} />
                  <span style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 26, color: C.ink}}>{row.label}</span>
                </div>

                <div style={{width: 430, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                  {row.now.map((n) => (
                    <Chip key={n} tone="now" accent={row.accent} p={rowP}>
                      {n}
                    </Chip>
                  ))}
                </div>

                <div style={{width: 120, display: 'flex', justifyContent: 'center'}}>
                  <svg width="66" height="20" viewBox="0 0 66 20" fill="none">
                    <path
                      d="M2 10 H52"
                      stroke={row.accent}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="50"
                      strokeDashoffset={(1 - arrowP) * 50}
                      opacity={0.75}
                    />
                    <path
                      d="M46 4 L57 10 L46 16"
                      stroke={row.accent}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity={arrowP * 0.9}
                    />
                  </svg>
                </div>

                <div style={{flex: 1, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                  {row.next.map((n, j) => (
                    <Chip key={n} tone="next" accent={row.accent} p={rise(frame, base + 12 + j * 4, 20)}>
                      {n}
                    </Chip>
                  ))}
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
