import React from 'react';
import {COLORS, FONT_FAMILY} from '../theme';
import {GlassCard} from './GlassCard';
import {FieldRow} from './Tag';
import {NumberCount} from './NumberCount';
import {progress} from '../easings';
import {useCurrentFrame} from 'remotion';

type LeadCardProps = {
  company: string;
  industry: string;
  summary: string;
  score: number;
  owner: string;
  priority: string;
  aiSummary: string;
  enterAt?: number;
  width?: number;
};

/** CRM Lead record card assembled field-by-field. */
export const LeadCard: React.FC<LeadCardProps> = ({
  company,
  industry,
  summary,
  score,
  owner,
  priority,
  aiSummary,
  enterAt = 0,
  width = 560,
}) => {
  const frame = useCurrentFrame();
  const aiP = progress(frame, enterAt + 74, enterAt + 92);

  return (
    <GlassCard
      enterAt={enterAt}
      width={width}
      padding={30}
      radius={24}
      accent
      style={{fontFamily: FONT_FAMILY}}
    >
      {/* Title row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 22,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${COLORS.midGray}, ${COLORS.darkGray})`,
              border: `1px solid ${COLORS.borderStrong}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 800,
              color: COLORS.orange,
            }}
          >
            {company.slice(0, 1)}
          </div>
          <div>
            <div style={{fontSize: 22, fontWeight: 800, color: COLORS.textPrimary}}>
              {company}
            </div>
            <div style={{fontSize: 13, color: COLORS.textTertiary, marginTop: 2}}>
              新商機 · Lead #A-2481
            </div>
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: 11.5, color: COLORS.textTertiary, letterSpacing: 1}}>
            OPPORTUNITY SCORE
          </div>
          <NumberCount
            to={score}
            startAt={enterAt + 30}
            duration={40}
            fontSize={38}
            color={COLORS.orange}
          />
        </div>
      </div>

      {/* Fields */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 13}}>
        <FieldRow label="Company" value={company} enterAt={enterAt + 12} />
        <FieldRow label="Industry" value={industry} enterAt={enterAt + 20} />
        <FieldRow label="需求摘要" value={summary} enterAt={enterAt + 28} />
        <FieldRow
          label="Owner"
          value={
            <>
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: COLORS.blue,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORS.white,
                }}
              >
                {owner.slice(0, 1)}
              </span>
              {owner}
            </>
          }
          enterAt={enterAt + 36}
        />
        <FieldRow
          label="Priority"
          value={
            <span
              style={{
                color: COLORS.red,
                backgroundColor: 'rgba(248,113,113,0.12)',
                border: '1px solid rgba(248,113,113,0.4)',
                padding: '3px 12px',
                borderRadius: 999,
                fontSize: 13.5,
                fontWeight: 700,
              }}
            >
              {priority}
            </span>
          }
          enterAt={enterAt + 44}
        />
      </div>

      {/* AI Summary */}
      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 14,
          backgroundColor: 'rgba(255,107,26,0.07)',
          border: `1px solid ${COLORS.orange}33`,
          opacity: aiP,
          transform: `translateY(${(1 - aiP) * 12}px)`,
        }}
      >
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 800,
            letterSpacing: 1.5,
            color: COLORS.orange,
            marginBottom: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{fontSize: 13}}>✦</span> AI SUMMARY
        </div>
        <div style={{fontSize: 14.5, lineHeight: 1.6, color: COLORS.textSecondary}}>
          {aiSummary}
        </div>
      </div>
    </GlassCard>
  );
};
