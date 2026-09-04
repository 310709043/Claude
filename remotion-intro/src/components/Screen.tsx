import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, FONT} from '../theme';
import {Callout, CalloutLayer} from './Callout';

/** Native aspect ratio of every product shot lifted from the deck. */
export const SHOTS = {
  'ai-agent': {src: 'ui/ai-agent.png', aspect: 2000 / 1036},
  'ai-summary': {src: 'ui/ai-summary.png', aspect: 1944 / 650},
  'ai-qa-live': {src: 'ui/ai-qa-live.png', aspect: 1076 / 898},
  'ai-qa-report': {src: 'ui/ai-qa-report.png', aspect: 1066 / 1026},
  'nocode-urls': {src: 'ui/nocode-urls.png', aspect: 1916 / 990},
  'nocode-url-add': {src: 'ui/nocode-url-add.png', aspect: 1915 / 989},
  'kb-files': {src: 'ui/kb-files.png', aspect: 2000 / 1305},
  'kb-faq': {src: 'ui/kb-faq.png', aspect: 2000 / 1281},
} as const;

export type ShotId = keyof typeof SHOTS;

/**
 * A product screenshot presented inside light application chrome, so the real
 * platform UI reads as a product shot rather than a pasted image.
 *
 * `zoom` + `focus` push into a detail of the screen while keeping the frame
 * itself fixed — the frame always matches the shot's native aspect ratio so
 * nothing is cropped away unless we ask for it.
 */
export const Screen: React.FC<{
  shot: ShotId;
  width: number;
  zoom?: number;
  /** Point of interest in 0–1 image coordinates that the zoom holds on. */
  focus?: [number, number];
  label?: string;
  tilt?: number;
  style?: React.CSSProperties;
  /** Annotations drawn onto the shot, with their reveal already computed. */
  callouts?: Callout[];
  calloutProgress?: number[];
  calloutAccent?: string;
}> = ({
  shot,
  width,
  zoom = 1,
  focus = [0.5, 0.5],
  label,
  tilt = 0,
  style,
  callouts,
  calloutProgress,
  calloutAccent = C.orange,
}) => {
  const {src, aspect} = SHOTS[shot];
  const height = width / aspect;
  const [fx, fy] = focus;

  return (
    <div
      style={{
        width,
        borderRadius: 18,
        overflow: 'hidden',
        background: C.paper,
        border: `1px solid ${C.line}`,
        boxShadow: `0 44px 96px -36px ${C.ink}42, 0 4px 14px ${C.ink}14`,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          height: 34,
          background: `linear-gradient(180deg, ${C.paper}, ${C.canvas})`,
          borderBottom: `1px solid ${C.lineSoft}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 14px',
        }}
      >
        {[C.orange, C.amber, C.teal].map((c) => (
          <span
            key={c}
            style={{width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.72}}
          />
        ))}
        {label ? (
          <span
            style={{
              marginLeft: 12,
              fontFamily: FONT.sans,
              fontSize: 14,
              fontWeight: 500,
              color: C.inkSoft,
              letterSpacing: '0.04em',
            }}
          >
            {label}
          </span>
        ) : null}
      </div>
      <div style={{width, height, overflow: 'hidden', position: 'relative'}}>
        <Img
          src={staticFile(src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `${fx * 100}% ${fy * 100}%`,
            transform: `scale(${zoom})`,
            transformOrigin: `${fx * 100}% ${fy * 100}%`,
            display: 'block',
          }}
        />
        {callouts ? (
          <CalloutLayer
            callouts={callouts}
            progress={calloutProgress ?? []}
            accent={calloutAccent}
            width={width}
            height={height}
          />
        ) : null}
      </div>
    </div>
  );
};
