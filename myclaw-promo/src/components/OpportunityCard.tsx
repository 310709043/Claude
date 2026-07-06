import React from 'react';
import {COLORS, FONT_FAMILY} from '../theme';
import {GlassCard} from './GlassCard';
import {NumberCount, ProgressBar} from './NumberCount';
import {progress} from '../easings';
import {useCurrentFrame} from 'remotion';

type OpportunityCardProps = {
  rank: number;
  product: string;
  tagline: string;
  matchScore: number;
  winRate: number;
  reasons: string[];
  enterAt?: number;
  width?: number;
  highlighted?: boolean;
};

/** Next-Best-Offer recommendation card with staged data reveal. */
export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  rank,
  product,
  tagline,
  matchScore,
  winRate,
  reasons,
  enterAt = 0,
  width = 400,
  highlighted = false,
}) => {
  const frame = useCurrentFrame();

  return (
    <GlassCard
      enterAt={enterAt}
      width={width}
      padding={26}
      radius={22}
      fromY={56}
      glow={highlighted}
      style={{
        fontFamily: FONT_FAMILY,
        border: highlighted
          ? `1.5px solid ${COLORS.orange}88`
          : `1px solid ${COLORS.border}`,
      }}
    >
      {/* Header */}
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6}}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
            fontWeight: 800,
            color: highlighted ? COLORS.white : COLORS.orange,
            background: highlighted
              ? `linear-gradient(135deg, ${COLORS.orangeSoft}, ${COLORS.orangeDeep})`
              : 'rgba(255,107,26,0.12)',
            border: highlighted ? 'none' : `1px solid ${COLORS.orange}44`,
            boxShadow: highlighted ? `0 6px 20px ${COLORS.orangeGlow}` : undefined,
          }}
        >
          #{rank}
        </div>
        <div>
          <div style={{fontSize: 21, fontWeight: 800, color: COLORS.textPrimary}}>
            {product}
          </div>
          <div style={{fontSize: 13, color: COLORS.textTertiary, marginTop: 1}}>
            {tagline}
          </div>
        </div>
        {highlighted ? (
          <div
            style={{
              marginLeft: 'auto',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1.5,
              color: COLORS.orange,
              border: `1px solid ${COLORS.orange}66`,
              backgroundColor: 'rgba(255,107,26,0.1)',
              padding: '4px 10px',
              borderRadius: 999,
              opacity: progress(frame, enterAt + 14, enterAt + 26),
            }}
          >
            BEST MATCH
          </div>
        ) : null}
      </div>

      {/* Metrics */}
      <div style={{display: 'flex', gap: 30, margin: '18px 0 14px'}}>
        <div>
          <div style={{fontSize: 12, color: COLORS.textTertiary, marginBottom: 4}}>
            需求匹配度
          </div>
          <NumberCount
            to={matchScore}
            startAt={enterAt + 10}
            duration={34}
            suffix="%"
            fontSize={30}
            color={highlighted ? COLORS.orange : COLORS.textPrimary}
          />
          <ProgressBar
            value={matchScore}
            startAt={enterAt + 10}
            width={130}
            height={5}
            color={highlighted ? COLORS.orange : COLORS.blue}
          />
        </div>
        <div>
          <div style={{fontSize: 12, color: COLORS.textTertiary, marginBottom: 4}}>
            預估成交機率
          </div>
          <NumberCount
            to={winRate}
            startAt={enterAt + 18}
            duration={34}
            suffix="%"
            fontSize={30}
            color={COLORS.textPrimary}
          />
          <ProgressBar
            value={winRate}
            startAt={enterAt + 18}
            width={130}
            height={5}
            color={COLORS.green}
          />
        </div>
      </div>

      {/* Reasons */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {reasons.map((r, i) => {
          const p = progress(frame, enterAt + 26 + i * 8, enterAt + 36 + i * 8);
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                fontSize: 14.5,
                color: COLORS.textSecondary,
                opacity: p,
                transform: `translateX(${(1 - p) * 14}px)`,
              }}
            >
              <span style={{color: COLORS.orange, fontSize: 13}}>◆</span>
              {r}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
