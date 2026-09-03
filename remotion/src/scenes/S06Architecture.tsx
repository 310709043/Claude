import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {color, font} from '../theme';
import {Kicker, Scene, SplitHeading} from '../components/ui';

const VB = {w: 1500, h: 620};

type BoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  accent?: string;
  progress: number;
  strong?: boolean;
};

const Box: React.FC<BoxProps> = ({x, y, w, h, title, sub, accent = color.hair, progress, strong}) => {
  const cx = x + w / 2;
  const s = 0.94 + progress * 0.06;
  return (
    <g
      opacity={progress}
      transform={`translate(${cx} ${y + h / 2}) scale(${s}) translate(${-cx} ${-(y + h / 2)})`}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        fill={strong ? 'rgba(246,242,237,0.075)' : 'rgba(246,242,237,0.04)'}
        stroke={strong ? `${accent}aa` : color.hair}
        strokeWidth={strong ? 1.6 : 1.2}
      />
      <rect x={x} y={y} width={3} height={h} rx={2} fill={accent} opacity={strong ? 1 : 0.75} />
      <text
        x={cx}
        y={sub ? y + h / 2 - 6 : y + h / 2 + 9}
        textAnchor="middle"
        fill={color.cream}
        fontFamily={font.body}
        fontSize={25}
        fontWeight={700}
      >
        {title}
      </text>
      {sub ? (
        <text
          x={cx}
          y={y + h / 2 + 26}
          textAnchor="middle"
          fill={color.muted}
          fontFamily={font.body}
          fontSize={18}
          fontWeight={500}
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
};

const Edge: React.FC<{
  d: string;
  progress: number;
  accent?: string;
  flow?: number;
  dashed?: boolean;
}> = ({d, progress, accent = color.terracotta, flow = 0, dashed}) => (
  <g>
    <path
      d={d}
      fill="none"
      stroke={color.hair}
      strokeWidth={1.6}
      pathLength={1}
      strokeDasharray={dashed ? '0.012 0.014' : 1}
      strokeDashoffset={dashed ? 0 : 1 - progress}
      opacity={dashed ? progress * 0.8 : 1}
    />
    {progress > 0.98 ? (
      <path
        d={d}
        fill="none"
        stroke={accent}
        strokeWidth={2.4}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="0.045 0.115"
        strokeDashoffset={-flow}
        opacity={0.95}
      />
    ) : null}
  </g>
);

const Label: React.FC<{
  x: number;
  y: number;
  text: string;
  progress: number;
  anchor?: 'start' | 'middle' | 'end';
}> = ({x, y, text, progress, anchor = 'middle'}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fill={color.dim}
    fontFamily={font.display}
    fontSize={17}
    fontWeight={600}
    letterSpacing="0.1em"
    opacity={progress}
  >
    {text}
  </text>
);

const AGENTS = [
  {t: '據點 1　現場客服', s: '真人專員 Agent'},
  {t: '據點 2　現場客服', s: '真人專員 Agent'},
  {t: '據點 3　現場客服', s: '真人專員 Agent'},
  {t: '手機值機　行動值機', s: '真人專員 Agent'},
];

export const S06Architecture: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sp = (delay: number, duration = 24) =>
    spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.7, stiffness: 110}, durationInFrames: duration});

  const draw = (from: number, to: number) =>
    interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const flow = (frame * 0.0055) % 1;
  const k = sp(0, 20);

  const agentY = (i: number) => 120 + i * 126;

  return (
    <Scene>
      <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18}}>
        <div>
          <Kicker progress={k} accent={color.sky}>
            SYSTEM ARCHITECTURE
          </Kicker>
          <h2
            style={{
              margin: '20px 0 0',
              fontFamily: font.display,
              fontSize: 58,
              fontWeight: 800,
              color: color.cream,
            }}
          >
            <SplitHeading text="AICC 系統架構" delay={8} stagger={1.6} distance={26} />
          </h2>
        </div>
        <div
          style={{
            textAlign: 'right',
            color: color.muted,
            fontSize: 21,
            lineHeight: 1.7,
            opacity: sp(150, 26),
          }}
        >
          開放介接・不限品牌
          <br />
          <span style={{color: color.dim, fontSize: 19}}>
            MRCPv2 ／ WebSocket 皆可支援，免加購 Adapter
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        style={{width: '100%', height: 'auto', overflow: 'visible'}}
      >
        {/* ---- edges ---- */}
        <Edge d="M 180 350 L 272 350" progress={draw(26, 40)} accent={color.terracotta} flow={flow} />
        <Edge d="M 452 350 L 548 350" progress={draw(38, 54)} accent={color.terracotta} flow={flow} />
        <Edge d="M 745 176 L 745 100" progress={draw(96, 114)} accent={color.sky} flow={flow} />
        <Edge
          d="M 900 176 L 900 140 L 1075 140 L 1075 100"
          progress={draw(106, 128)}
          accent={color.jade}
          flow={flow}
        />
        {AGENTS.map((_, i) => (
          <Edge
            key={i}
            d={`M 998 350 C 1050 350, 1064 ${agentY(i) + 50}, 1120 ${agentY(i) + 50}`}
            progress={draw(132 + i * 9, 150 + i * 9)}
            accent={color.orange}
            flow={flow}
          />
        ))}

        {/* ---- telephony ---- */}
        <Box x={0} y={300} w={180} h={100} title="電話進線" sub="PSTN ／ E1" accent={color.terracotta} progress={sp(16)} />
        <Box x={272} y={300} w={180} h={100} title="SBC" sub="Session Border Ctrl." accent={color.terracotta} progress={sp(26)} />
        <Label x={226} y={282} text="E1 中繼線路" progress={draw(40, 58)} />
        <Label x={500} y={282} text="SIP" progress={draw(52, 68)} />

        {/* ---- AICC core ---- */}
        <g opacity={sp(46)}>
          <rect
            x={548}
            y={176}
            width={450}
            height={350}
            rx={22}
            fill="rgba(245,112,0,0.055)"
            stroke={`${color.orange}77`}
            strokeWidth={1.8}
          />
          <text x={773} y={230} textAnchor="middle" fill={color.cream} fontFamily={font.display} fontSize={32} fontWeight={800}>
            AICC
          </text>
          <text x={773} y={262} textAnchor="middle" fill={color.amber} fontFamily={font.body} fontSize={20} fontWeight={600}>
            智能語音客服平台
          </text>
        </g>
        <Box x={574} y={294} w={190} h={78} title="IVR" sub="語音互動" accent={color.amber} progress={sp(62)} strong />
        <Box x={782} y={294} w={190} h={78} title="BOT Gateway" sub="訊息閘道" accent={color.amber} progress={sp(70)} strong />
        <Box x={574} y={390} w={398} h={78} title="ACD 排隊・智能轉接・自動外撥" accent={color.amber} progress={sp(78)} strong />

        {/* ---- AI services ---- */}
        <Box x={600} y={0} w={290} h={100} title="ASR ／ TTS" sub="語音辨識・語音合成" accent={color.sky} progress={sp(92)} strong />
        <Box x={930} y={0} w={290} h={100} title="LLM" sub="語意理解・生成" accent={color.jade} progress={sp(102)} strong />
        <Label x={732} y={148} text="MRCPv2 ／ WebSocket" progress={draw(114, 132)} anchor="end" />
        <Label x={988} y={126} text="API ／ 文字" progress={draw(126, 144)} />

        {/* ---- agents ---- */}
        {AGENTS.map((a, i) => (
          <Box
            key={a.t}
            x={1120}
            y={agentY(i)}
            w={330}
            h={100}
            title={a.t}
            sub={a.s}
            accent={color.orange}
            progress={sp(140 + i * 9)}
          />
        ))}
      </svg>
    </Scene>
  );
};
