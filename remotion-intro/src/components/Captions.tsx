import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {CAPTIONS, Locale} from '../captions';

/**
 * Burned-in caption layer, set in the film's own typeface rather than a
 * player's default. Sits above the progress rule and clear of the corner
 * signature. Only rendered by the `TaipbxIntroSubtitled` composition — the
 * clean master stays free of text so the .srt can be used instead.
 */
export const Captions: React.FC<{locale?: Locale}> = ({locale = 'zh'}) => {
  const frame = useCurrentFrame();
  const cue = CAPTIONS.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;
  const text = cue[locale];

  // 6-frame fade at each end so cues never pop.
  const FADE = 6;
  const inP = Math.min(1, (frame - cue.from) / FADE);
  const outP = Math.min(1, (cue.to - frame) / FADE);
  const o = Math.min(inP, outP);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 44,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          // Keep the box clear of the corner signature (which ends near x=380).
          // English lines run long, so the cap makes them wrap to two lines
          // rather than reach across the mark.
          maxWidth: 1080,
          padding: '16px 32px',
          borderRadius: 14,
          background: 'rgba(255,255,255,0.95)',
          border: `1px solid ${C.line}`,
          boxShadow: `0 18px 44px -18px ${C.ink}3A`,
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: locale === 'en' ? 30 : 32,
          lineHeight: 1.45,
          letterSpacing: '0.01em',
          color: C.ink,
          textAlign: 'center',
          opacity: o,
          transform: `translateY(${(1 - o) * 8}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
