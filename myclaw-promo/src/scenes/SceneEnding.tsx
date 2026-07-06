import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {DataFlow} from '../components/DataFlow';
import {SceneFade} from '../components/CameraRig';
import {LobsterAssistant} from '../components/LobsterAssistant';
import {FloatingLogo, MyClawLogo, TaiwanMobileLogo} from '../components/BrandLogos';
import {EASE_OUT, progress} from '../easings';

const rand = (seed: number): number => {
  const x = Math.sin(seed * 73.3 + 17.1) * 33421.5453;
  return x - Math.floor(x);
};

/** Enterprise AI network: nodes + links blooming out behind the mascot. */
const NetworkBloom: React.FC<{startAt: number}> = ({startAt}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2 - 30;

  const nodes = useMemo(
    () =>
      new Array(26).fill(0).map((_, i) => {
        const angle = (i / 26) * Math.PI * 2 + rand(i) * 0.5;
        const dist = 260 + rand(i + 50) * 420;
        return {
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist * 0.55,
          r: 3 + rand(i + 100) * 5,
          delay: rand(i + 150) * 40,
          isOrange: rand(i + 200) > 0.4,
        };
      }),
    [cx, cy]
  );

  return (
    <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
      {nodes.map((n, i) => {
        const p = progress(frame, startAt + n.delay, startAt + n.delay + 26, EASE_OUT);
        const x = cx + (n.x - cx) * p;
        const y = cy + (n.y - cy) * p;
        const color = n.isOrange ? COLORS.orange : COLORS.blue;
        const twinkle = 0.55 + 0.45 * Math.sin(frame * 0.09 + i * 2.1);
        return (
          <g key={i} opacity={p}>
            <line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={color}
              strokeWidth={0.8}
              opacity={0.22 * twinkle}
            />
            <circle
              cx={x}
              cy={y}
              r={n.r * p}
              fill={color}
              opacity={0.75 * twinkle}
              style={{filter: `drop-shadow(0 0 6px ${color})`}}
            />
          </g>
        );
      })}
      {/* Inter-node arcs */}
      {nodes.slice(0, 12).map((n, i) => {
        const m = nodes[(i + 5) % nodes.length];
        const p = progress(frame, startAt + 30 + i * 3, startAt + 56 + i * 3);
        return (
          <line
            key={`l${i}`}
            x1={n.x}
            y1={n.y}
            x2={m.x}
            y2={m.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={0.7}
            opacity={p * 0.6}
          />
        );
      })}
    </svg>
  );
};

/** Ending 82–90s:資料流匯聚 → 品牌 Logo + 標語,停留收尾。 */
export const SceneEnding: React.FC = () => {
  const frame = useCurrentFrame();

  const convergeP = progress(frame, 0, 46);
  const logosP = progress(frame, 66, 84);
  const tagP = progress(frame, 84, 104);
  const tag2P = progress(frame, 96, 114);
  const subP = progress(frame, 112, 130);

  return (
    <SceneFade fadeIn={12} fadeOut={0}>
      <ParticleBackground count={50} energy={0.65} seed={9} grid={false} />
      {/* Data streams converging into the center */}
      <DataFlow
        streams={14}
        mode="converge"
        convergeProgress={convergeP}
        opacity={1 - tagP * 0.55}
        seed={21}
      />
      <NetworkBloom startAt={34} />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            transform: 'translateY(-26px)',
          }}
        >
          {/* Lobster at the center of the network */}
          <FloatingLogo amplitude={7} period={140}>
            <LobsterAssistant size={280} enterAt={26} mode="presenting" />
          </FloatingLogo>

          {/* Brand logos */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 34,
              marginTop: 8,
              opacity: logosP,
              transform: `translateY(${(1 - logosP) * 20}px)`,
            }}
          >
            <TaiwanMobileLogo size={46} withWordmark />
            <div
              style={{
                width: 1.5,
                height: 46,
                backgroundColor: COLORS.borderStrong,
              }}
            />
            <MyClawLogo size={46} />
          </div>

          {/* Tagline */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              textAlign: 'center',
              marginTop: 22,
            }}
          >
            <div style={{fontSize: 58, fontWeight: 800, lineHeight: 1.25, letterSpacing: 1}}>
              <span
                style={{
                  color: COLORS.white,
                  opacity: tagP,
                  display: 'inline-block',
                  transform: `translateY(${(1 - tagP) * 24}px)`,
                }}
              >
                Every Conversation.
              </span>{' '}
              <span
                style={{
                  color: COLORS.orange,
                  opacity: tag2P,
                  display: 'inline-block',
                  transform: `translateY(${(1 - tag2P) * 24}px)`,
                  textShadow: `0 0 60px ${COLORS.orangeGlow}`,
                }}
              >
                Every Opportunity.
              </span>
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: COLORS.textSecondary,
                letterSpacing: 2,
                marginTop: 18,
                opacity: subP,
                transform: `translateY(${(1 - subP) * 14}px)`,
              }}
            >
              MyClaw AI — 讓每一次客戶互動,都成為下一個成交機會。
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
