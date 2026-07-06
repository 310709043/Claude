import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';
import {ParticleBackground} from '../components/ParticleBackground';
import {CameraRig, SceneFade} from '../components/CameraRig';
import {SceneTitle} from '../components/AppWindow';
import {OpportunityCard} from '../components/OpportunityCard';
import {GlassCard} from '../components/GlassCard';
import {LobsterAssistant} from '../components/LobsterAssistant';
import {NumberCount} from '../components/NumberCount';
import {progress} from '../easings';

const CARDS_AT = 64;
const DETAIL_AT = 190;

/** Talk-track + follow-up detail strip under the offer cards. */
const DetailStrip: React.FC = () => {
  const frame = useCurrentFrame();
  const scriptText =
    '「針對貴公司資料安全需求,我們的企業方案支援全地端部署,並提供 CRM 與知識庫的標準 API 整合⋯」';
  const chars = Math.max(0, Math.floor((frame - DETAIL_AT - 16) / 0.85));

  return (
    <div style={{display: 'flex', gap: 24}}>
      {/* 推薦話術 */}
      <GlassCard enterAt={DETAIL_AT} width={640} padding={24} radius={20} accent>
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
          <span>💬</span> AI 推薦話術 · SUGGESTED TALK TRACK
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 17.5,
            lineHeight: 1.7,
            color: COLORS.textPrimary,
            minHeight: 90,
          }}
        >
          {scriptText.slice(0, chars)}
          {chars < scriptText.length && chars > 0 ? (
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

      {/* Follow-up + 商機分數 */}
      <GlassCard enterAt={DETAIL_AT + 14} width={430} padding={24} radius={20}>
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
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
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
                  fontSize: 16,
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
          <span style={{fontSize: 13, color: COLORS.textTertiary, letterSpacing: 1.5}}>
            商機分數 · OPPORTUNITY SCORE
          </span>
          <NumberCount to={87} startAt={DETAIL_AT + 62} duration={36} fontSize={34} color={COLORS.orange} />
        </div>
      </GlassCard>
    </div>
  );
};

/** 第四幕 46–60s:AI 推薦 Next Best Offer,卡片動畫逐步生成。 */
export const Scene4Offer: React.FC = () => {
  const frame = useCurrentFrame();
  const cmdP = progress(frame, 8, 22);

  return (
    <SceneFade fadeIn={12} fadeOut={16}>
      <ParticleBackground count={38} energy={0.58} seed={4} />
      <CameraRig from={{scale: 1.06, y: 16}} to={{scale: 1.0, y: -6}}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          {/* Header: command + title */}
          <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
            <div style={{transform: 'scale(0.9)'}}>
              <LobsterAssistant size={130} enterAt={0} mode="presenting" halo={false} />
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
                size={46}
                enterAt={16}
              />
            </div>
          </div>

          {/* Offer cards */}
          <div style={{display: 'flex', gap: 26, marginTop: 40, alignItems: 'flex-start'}}>
            <div style={{transform: 'translateY(24px)'}}>
              <OpportunityCard
                rank={2}
                product="智慧客服機器人"
                tagline="AI Chatbot · 雲端方案"
                matchScore={74}
                winRate={52}
                reasons={['快速上線', '客服量能擴充']}
                enterAt={CARDS_AT + 26}
                width={368}
              />
            </div>
            <OpportunityCard
              rank={1}
              product="企業 AI 智能中台"
              tagline="Enterprise AI Platform · 地端部署"
              matchScore={95}
              winRate={78}
              reasons={['符合地端部署與資安要求', 'CRM / 知識庫標準 API 整合', '支援 POC 快速驗證']}
              enterAt={CARDS_AT}
              width={420}
              highlighted
            />
            <div style={{transform: 'translateY(24px)'}}>
              <OpportunityCard
                rank={3}
                product="智能語音分析"
                tagline="MyVoca · 加值模組"
                matchScore={68}
                winRate={45}
                reasons={['通話洞察加值', '可與中台整合']}
                enterAt={CARDS_AT + 44}
                width={368}
              />
            </div>
          </div>

          {/* Detail strip */}
          <div style={{marginTop: 30}}>
            <DetailStrip />
          </div>
        </AbsoluteFill>
      </CameraRig>
    </SceneFade>
  );
};
