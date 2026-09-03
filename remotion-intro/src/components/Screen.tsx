import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, FONT} from '../theme';
import {Callout, CalloutLayer} from './Callout';

/** Native aspect ratio of every product shot lifted from the deck. */
export const SHOTS = {
  'agent-status': {src: 'ui/agent-status.png', aspect: 2000 / 987},
  'customer-ivr': {src: 'ui/customer-ivr.png', aspect: 2000 / 1057},
  'chat-inbound': {src: 'ui/chat-inbound.png', aspect: 1913 / 862},
  'customer-journey': {src: 'ui/customer-journey.png', aspect: 2000 / 1057},
  'service-record': {src: 'ui/service-record.png', aspect: 2000 / 983},
  'outbound-config': {src: 'ui/outbound-config.png', aspect: 2000 / 1224},
  'outbound-preview': {src: 'ui/outbound-preview.png', aspect: 2000 / 986},
  'ai-copilot': {src: 'ui/ai-copilot.png', aspect: 2000 / 1004},
  'ai-quality': {src: 'ui/ai-quality.png', aspect: 2000 / 1079},
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
