import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {APP, COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {CameraRig, SceneFade} from '../components/CameraRig';
import {SceneTitle} from '../components/AppWindow';
import {
  AppCard,
  AppHeader,
  AppTabBar,
  PhoneFrame,
} from '../components/PhoneFrame';
import {GlassCard} from '../components/GlassCard';
import {LobsterAssistant} from '../components/LobsterAssistant';
import {NumberCount, ProgressBar} from '../components/NumberCount';
import {progress} from '../easings';

const CARDS_AT = 70;
const DETAIL_AT = 200;

type Offer = {
  rank: number;
  product: string;
  tagline: string;
  match: number;
  win: number;
  best?: boolean;
  at: number;
};

const OFFERS: Offer[] = [
  {
    rank: 1,
    product: '企業 AI 智能中台',
    tagline: '地端部署 · API 整合',
    match: 95,
    win: 78,
    best: true,
    at: CARDS_AT,
  },
  {rank: 2, product: '智慧客服機器人', tagline: '雲端 · 快速上線', match: 74, win: 52, at: CARDS_AT + 34},
  {rank: 3, product: '智能語音分析', tagline: 'MyVoca 加值模組', match: 68, win: 45, at: CARDS_AT + 58},
];

/** In-app recommendation card. */
const OfferRow: React.FC<{o: Offer}> = ({o}) => {
  const frame = useCurrentFrame();
  return (
    <AppCard
      enterAt={o.at}
      padding={14}
      style={
        o.best
          ? {
              border: `1.5px solid ${APP.orange}`,
              boxShadow: `0 12px 32px rgba(245,130,31,0.22)`,
            }
          : undefined
      }
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13.5,
            fontWeight: 800,
            color: o.best ? '#FFF' : APP.orangeDeep,
            background: o.best
              ? `linear-gradient(135deg, ${APP.orange}, ${APP.orangeDeep})`
              : APP.orangeTint,
          }}
        >
          #{o.rank}
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 14.5, fontWeight: 800, color: APP.text}}>{o.product}</div>
          <div style={{fontSize: 10.5, color: APP.textSub, marginTop: 1}}>{o.tagline}</div>
        </div>
        {o.best ? (
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: 1,
              color: APP.orangeDeep,
              backgroundColor: APP.orangeTint,
              border: `1px solid ${APP.orange}55`,
              padding: '3px 8px',
              borderRadius: 999,
              opacity: progress(frame, o.at + 14, o.at + 26),
            }}
          >
            BEST MATCH
          </div>
        ) : null}
      </div>
      {o.best ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10}}>
          {['符合地端部署與資安要求', 'CRM / 知識庫標準 API 整合', '支援 POC 快速驗證'].map((r, i) => {
            const p = progress(frame, o.at + 22 + i * 8, o.at + 32 + i * 8);
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  fontSize: 11,
                  color: APP.textSub,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 10}px)`,
                }}
              >
                <span style={{color: APP.orange, fontSize: 9}}>◆</span>
                {r}
              </div>
            );
          })}
        </div>
      ) : null}
      <div style={{display: 'flex', gap: 18, marginTop: 11}}>
        <div style={{flex: 1}}>
          <div style={{fontSize: 9.5, color: APP.textFaint, marginBottom: 3}}>需求匹配度</div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
            <NumberCount
              to={o.match}
              startAt={o.at + 8}
              duration={30}
              suffix="%"
              fontSize={17}
              color={o.best ? APP.orangeDeep : APP.text}
            />
          </div>
          <ProgressBar
            value={o.match}
            startAt={o.at + 8}
            width={110}
            height={4}
            color={o.best ? APP.orange : APP.blue}
            track="#EEEFF4"
          />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 9.5, color: APP.textFaint, marginBottom: 3}}>成交機率</div>
          <NumberCount to={o.win} startAt={o.at + 14} duration={30} suffix="%" fontSize={17} color={APP.text} />
          <ProgressBar value={o.win} startAt={o.at + 14} width={110} height={4} color={APP.green} track="#EEEFF4" />
        </div>
      </div>
    </AppCard>
  );
};

/** MyClaw app — Next Best Offer screen. */
const OfferScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaP = progress(frame, DETAIL_AT + 60, DETAIL_AT + 76);
  return (
    <AbsoluteFill style={{backgroundColor: APP.bg, fontFamily: FONT_FAMILY}}>
      <AppHeader title="MyClaw" subtitle="智能推薦 · NEXT BEST OFFER" />
      <div style={{padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 10}}>
        {/* AI banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 13px',
            borderRadius: 13,
            background: `linear-gradient(90deg, ${APP.orangeTint}, #FFF8F1)`,
            border: `1px solid ${APP.orange}30`,
            opacity: progress(frame, CARDS_AT - 18, CARDS_AT - 6),
          }}
        >
          <span style={{fontSize: 14}}>🦞</span>
          <span style={{fontSize: 11.5, fontWeight: 700, color: APP.orangeDeep}}>
            根據客戶輪廓,為你推薦 3 個最適方案
          </span>
        </div>
        {OFFERS.map((o) => (
          <OfferRow key={o.rank} o={o} />
        ))}
        {/* CTA */}
        <div
          style={{
            marginTop: 2,
            height: 46,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${APP.orange}, ${APP.orangeDeep})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 14.5,
            fontWeight: 800,
            color: '#FFF',
            boxShadow: '0 10px 26px rgba(245,130,31,0.4)',
            opacity: ctaP,
            transform: `translateY(${(1 - ctaP) * 14}px)`,
          }}
        >
          採用推薦方案,建立商機 →
        </div>
      </div>
      <AppTabBar active={3} />
    </AbsoluteFill>
  );
};

/** Floating stage detail: talk track. */
const TalkTrackCard: React.FC = () => {
  const frame = useCurrentFrame();
  const scriptText =
    '「針對貴公司資料安全需求,我們的企業方案支援全地端部署,並提供 CRM 與知識庫的標準 API 整合⋯」';
  const chars = Math.max(0, Math.floor((frame - DETAIL_AT - 14) / 0.85));
  return (
    <GlassCard enterAt={DETAIL_AT} width={440} padding={24} radius={20} accent>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 12.5,
          fontWeight: 800,
          letterSpacing: 2,
          color: COLORS.orange,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>💬</span> AI 推薦話術 · TALK TRACK
      </div>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 17,
          lineHeight: 1.75,
          color: COLORS.textPrimary,
          minHeight: 118,
        }}
      >
        {scriptText.slice(0, chars)}
        {chars > 0 && chars < scriptText.length ? (
          <span
            style={{
              display: 'inline-block',
              width: 3,
              height: 17,
              marginLeft: 2,
              backgroundColor: COLORS.orange,
              opacity: Math.sin(frame * 0.5) > 0 ? 1 : 0.2,
            }}
          />
        ) : null}
      </div>
    </GlassCard>
  );
};

/** Floating stage detail: follow-up + opportunity score. */
const FollowUpCard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <GlassCard enterAt={DETAIL_AT + 14} width={440} padding={24} radius={20}>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 12.5,
          fontWeight: 800,
          letterSpacing: 2,
          color: COLORS.textTertiary,
          marginBottom: 14,
        }}
      >
        FOLLOW-UP 建議
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 11}}>
        {[
          {icon: '📅', text: '48 小時內寄送 POC 提案', at: DETAIL_AT + 26},
          {icon: '🧩', text: '安排解決方案架構師 Demo', at: DETAIL_AT + 40},
          {icon: '📎', text: '附上金融業地端部署案例', at: DETAIL_AT + 54},
        ].map((f, i) => {
          const p = progress(frame, f.at, f.at + 12);
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                fontFamily: FONT_FAMILY,
                fontSize: 16.5,
                color: COLORS.textSecondary,
                opacity: p,
                transform: `translateX(${(1 - p) * 16}px)`,
              }}
            >
              <span>{f.icon}</span> {f.text}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 18,
          paddingTop: 16,
          borderTop: `1px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          fontFamily: FONT_FAMILY,
        }}
      >
        <span style={{fontSize: 12.5, color: COLORS.textTertiary, letterSpacing: 1.5}}>
          商機分數 · OPPORTUNITY SCORE
        </span>
        <NumberCount to={87} startAt={DETAIL_AT + 62} duration={36} fontSize={36} color={COLORS.orange} />
      </div>
    </GlassCard>
  );
};

/** 第四幕 46–60s:App 內 Next Best Offer,浮動卡片展開推薦細節。 */
export const Scene4Offer: React.FC = () => {
  const frame = useCurrentFrame();
  const cmdP = progress(frame, 8, 22);

  return (
    <SceneFade fadeIn={12} fadeOut={16}>
      <ParticleBackground count={40} energy={0.58} seed={4} />
      <CameraRig from={{scale: 1.06, y: 16}} to={{scale: 1.0, y: -4}}>
        <AbsoluteFill
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 64,
          }}
        >
          {/* Left column: command + title + talk track */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 30, width: 460}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <div style={{flexShrink: 0}}>
                <LobsterAssistant size={120} enterAt={0} mode="presenting" halo={false} />
              </div>
              <div>
                <div
                  style={{
                    opacity: cmdP,
                    transform: `translateY(${(1 - cmdP) * 12}px)`,
                    fontFamily: FONT_FAMILY,
                    fontSize: 19,
                    color: COLORS.textSecondary,
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                  }}
                >
                  <span>🎙️</span>「龍蝦,推薦最適合的方案。」
                </div>
                <SceneTitle
                  kicker="STEP 03 · RECOMMEND"
                  title="Next Best Offer"
                  align="left"
                  size={44}
                  enterAt={16}
                />
              </div>
            </div>
            <TalkTrackCard />
          </div>

          {/* Center: phone */}
          <PhoneFrame width={390} enterAt={26} tilt={0}>
            <OfferScreen />
          </PhoneFrame>

          {/* Right column: follow-up */}
          <div style={{width: 460}}>
            <FollowUpCard />
          </div>
        </AbsoluteFill>
      </CameraRig>
    </SceneFade>
  );
};
