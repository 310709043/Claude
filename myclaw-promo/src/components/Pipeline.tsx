import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';
import {EASE_OUT, ease, progress} from '../easings';

export type PipelineStep = {
  label: string;
  sublabel?: string;
  icon: string;
};

/**
 * Horizontal workflow pipeline: nodes light up in sequence,
 * connected by animated flow lines with a travelling pulse.
 */
export const Pipeline: React.FC<{
  steps: PipelineStep[];
  startAt?: number;
  stepInterval?: number;
  width?: number;
  activeColor?: string;
}> = ({steps, startAt = 0, stepInterval = 22, width = 1100, activeColor = COLORS.orange}) => {
  const frame = useCurrentFrame();
  const nodeSize = 74;
  const gap = (width - nodeSize * steps.length) / (steps.length - 1);

  return (
    <div
      style={{
        width,
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative',
        fontFamily: FONT_FAMILY,
      }}
    >
      {steps.map((s, i) => {
        const at = startAt + i * stepInterval;
        const p = progress(frame, at, at + 14);
        const active = frame >= at;
        const isCurrent =
          frame >= at && frame < at + stepInterval + 6;
        const pulse = isCurrent ? 1 + 0.06 * Math.sin(frame * 0.35) : 1;

        // Connector line to next node
        const lineP =
          i < steps.length - 1
            ? ease(frame, [at + 8, at + stepInterval + 4], [0, 1], EASE_OUT)
            : 0;
        const pulsePos = ((frame - at) * 0.03) % 1;

        return (
          <React.Fragment key={i}>
            <div
              style={{
                width: nodeSize,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: nodeSize,
                  height: nodeSize,
                  borderRadius: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  opacity: Math.max(0.25, p),
                  transform: `scale(${(0.7 + 0.3 * p) * pulse})`,
                  background: active
                    ? `linear-gradient(135deg, ${activeColor}2E, ${activeColor}14)`
                    : 'rgba(255,255,255,0.04)',
                  border: active
                    ? `1.5px solid ${activeColor}AA`
                    : `1px solid ${COLORS.border}`,
                  boxShadow: isCurrent
                    ? `0 0 34px ${activeColor}55`
                    : active
                      ? `0 0 16px ${activeColor}22`
                      : undefined,
                }}
              >
                {s.icon}
              </div>
              <div style={{textAlign: 'center', opacity: p}}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: active ? COLORS.textPrimary : COLORS.textTertiary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                </div>
                {s.sublabel ? (
                  <div
                    style={{
                      fontSize: 11.5,
                      color: COLORS.textTertiary,
                      marginTop: 3,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.sublabel}
                  </div>
                ) : null}
              </div>
            </div>

            {i < steps.length - 1 ? (
              <div
                style={{
                  flexShrink: 0,
                  width: gap,
                  height: nodeSize,
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '84%',
                    marginLeft: '8%',
                    height: 2,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  <div
                    style={{
                      width: `${lineP * 100}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${activeColor}66, ${activeColor})`,
                      borderRadius: 2,
                      boxShadow: `0 0 8px ${activeColor}66`,
                    }}
                  />
                  {lineP >= 1 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${pulsePos * 100}%`,
                        top: -2.5,
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: COLORS.white,
                        boxShadow: `0 0 10px ${activeColor}`,
                      }}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
