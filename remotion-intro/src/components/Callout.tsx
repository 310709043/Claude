import React from 'react';
import {C, FONT} from '../theme';

export type Callout = {
  /** Point of interest in 0–1 coordinates of the screenshot. */
  at: [number, number];
  /** Where the label parks, same coordinates. Chosen to land on empty UI. */
  to: [number, number];
  label: string;
  /** Frames after the panel opens before this one draws itself. */
  delay: number;
};

/** A label to the left of its anchor hangs its right edge on the park point. */
const isWest = (c: Callout) => c.to[0] < c.at[0];

/**
 * The deck marks up its product shots with arrows into the UI; the film does
 * the same thing, drawn live: a ring lands on the control being described, a
 * leader draws out of it, and the label arrives last.
 *
 * `p` is the 0–1 reveal supplied by the scene, so all timing stays in one
 * place and this stays a pure drawing.
 */
export const CalloutLayer: React.FC<{
  callouts: Callout[];
  progress: number[];
  accent: string;
  /** Pixel size of the screenshot area these coordinates map onto. */
  width: number;
  height: number;
}> = ({callouts, progress, accent, width, height}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{position: 'absolute', left: 0, top: 0}}
    >
      {callouts.map((c, i) => {
        const p = progress[i] ?? 0;
        if (p <= 0.001) return null;
        const ax = c.at[0] * width;
        const ay = c.at[1] * height;
        const bx = c.to[0] * width;
        const by = c.to[1] * height;
        const len = Math.hypot(bx - ax, by - ay);
        // ring → leader → label, each taking a third of the reveal
        const ring = Math.min(1, p / 0.34);
        const draw = Math.max(0, Math.min(1, (p - 0.28) / 0.42));
        return (
          <g key={c.label}>
            <circle
              cx={ax}
              cy={ay}
              r={9 + (1 - ring) * 26}
              fill="none"
              stroke={accent}
              strokeWidth={2}
              opacity={(1 - ring) * 0.55}
            />
            <circle cx={ax} cy={ay} r={11} fill={C.paper} opacity={0.92 * ring} />
            <circle
              cx={ax}
              cy={ay}
              r={8.5}
              fill="none"
              stroke={accent}
              strokeWidth={3}
              opacity={ring}
            />
            <circle cx={ax} cy={ay} r={3} fill={accent} opacity={ring} />
            <line
              x1={ax}
              y1={ay}
              x2={bx}
              y2={by}
              stroke={accent}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeDasharray={len}
              strokeDashoffset={(1 - draw) * len}
              opacity={0.85}
            />
          </g>
        );
      })}
    </svg>

    {callouts.map((c, i) => {
      const p = progress[i] ?? 0;
      const label = Math.max(0, Math.min(1, (p - 0.6) / 0.4));
      if (label <= 0.001) return null;
      const west = isWest(c);
      return (
        <div
          key={c.label}
          style={{
            position: 'absolute',
            left: `${c.to[0] * 100}%`,
            top: `${c.to[1] * 100}%`,
            transform: `translate(${west ? '-100%' : '0'}, -50%) translateX(${
              (west ? 1 : -1) * (1 - label) * 10
            }px)`,
            opacity: label,
            whiteSpace: 'nowrap',
            fontFamily: FONT.sans,
            fontSize: 17,
            fontWeight: 600,
            color: C.ink,
            background: 'rgba(255,255,255,0.95)',
            border: `1.5px solid ${accent}`,
            borderRadius: 9,
            padding: '7px 13px',
            boxShadow: `0 8px 22px -8px ${C.ink}44`,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 7,
              height: 7,
              borderRadius: 2,
              background: accent,
              marginRight: 9,
              verticalAlign: 'middle',
            }}
          />
          {c.label}
        </div>
      );
    })}
  </div>
);
