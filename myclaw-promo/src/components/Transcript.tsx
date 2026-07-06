import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';
import {progress} from '../easings';

export type TranscriptLine = {
  speaker: string;
  speakerColor?: string;
  text: string;
  /** Substrings to highlight as detected keywords. */
  keywords?: string[];
  /** Frame (relative) at which this line starts streaming. */
  at: number;
};

type TranscriptProps = {
  lines: TranscriptLine[];
  width?: number;
  fontSize?: number;
  /** Frames per character while streaming. */
  charSpeed?: number;
  /** Frame at which keyword highlights sweep in (per line offset added). */
  highlightDelay?: number;
};

/** Renders text with streamed reveal + keyword highlight sweep. */
const StreamedText: React.FC<{
  text: string;
  keywords: string[];
  visibleChars: number;
  highlightP: number;
  fontSize: number;
}> = ({text, keywords, visibleChars, highlightP, fontSize}) => {
  // Split text into segments, marking keyword spans
  const segments: {text: string; isKeyword: boolean}[] = [];
  let rest = text;
  while (rest.length > 0) {
    let earliest = -1;
    let matched = '';
    for (const kw of keywords) {
      const idx = rest.indexOf(kw);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        matched = kw;
      }
    }
    if (earliest === -1) {
      segments.push({text: rest, isKeyword: false});
      break;
    }
    if (earliest > 0) segments.push({text: rest.slice(0, earliest), isKeyword: false});
    segments.push({text: matched, isKeyword: true});
    rest = rest.slice(earliest + matched.length);
  }

  let consumed = 0;
  return (
    <span>
      {segments.map((seg, i) => {
        const start = consumed;
        consumed += seg.text.length;
        const shown = Math.max(
          0,
          Math.min(seg.text.length, visibleChars - start)
        );
        const visible = seg.text.slice(0, shown);
        if (!visible) return null;
        if (seg.isKeyword) {
          return (
            <span
              key={i}
              style={{
                position: 'relative',
                color:
                  highlightP > 0 ? COLORS.orange : COLORS.textPrimary,
                fontWeight: highlightP > 0 ? 700 : 400,
                transition: 'none',
              }}
            >
              {/* Highlight sweep background */}
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: -2,
                  width: `${highlightP * 100}%`,
                  height: '100%',
                  backgroundColor: 'rgba(255,107,26,0.14)',
                  borderBottom: `2px solid ${COLORS.orange}`,
                  borderRadius: 3,
                }}
              />
              <span style={{position: 'relative'}}>{visible}</span>
            </span>
          );
        }
        return (
          <span key={i} style={{color: COLORS.textPrimary}}>
            {visible}
          </span>
        );
      })}
    </span>
  );
};

/** Real-time transcript panel (MyVoca) with streaming + keyword highlight. */
export const Transcript: React.FC<TranscriptProps> = ({
  lines,
  width = 560,
  fontSize = 21,
  charSpeed = 0.85,
  highlightDelay = 26,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        fontFamily: FONT_FAMILY,
      }}
    >
      {lines.map((line, i) => {
        const local = frame - line.at;
        if (local < 0) return null;
        const visibleChars = Math.floor(local / charSpeed);
        const entered = progress(frame, line.at, line.at + 10);
        const highlightP = progress(
          frame,
          line.at + highlightDelay,
          line.at + highlightDelay + 14
        );
        const streaming =
          visibleChars < line.text.length ? true : false;
        return (
          <div
            key={i}
            style={{
              opacity: entered,
              transform: `translateY(${(1 - entered) * 14}px)`,
              display: 'flex',
              gap: 14,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: fontSize * 2.4,
                height: fontSize * 2.4,
                borderRadius: '50%',
                backgroundColor: line.speakerColor ?? COLORS.midGray,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fontSize * 0.75,
                fontWeight: 700,
                color: COLORS.white,
              }}
            >
              {line.speaker}
            </div>
            <div style={{flex: 1}}>
              <div
                style={{
                  fontSize,
                  lineHeight: 1.65,
                  color: COLORS.textPrimary,
                }}
              >
                <StreamedText
                  text={line.text}
                  keywords={line.keywords ?? []}
                  visibleChars={visibleChars}
                  highlightP={highlightP}
                  fontSize={fontSize}
                />
                {streaming ? (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 3,
                      height: fontSize * 0.9,
                      marginLeft: 3,
                      backgroundColor: COLORS.orange,
                      verticalAlign: 'middle',
                      opacity: Math.sin(frame * 0.5) > 0 ? 1 : 0.2,
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
