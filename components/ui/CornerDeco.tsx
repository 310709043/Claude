'use client';

import React from 'react';

export function CornerDeco({ color = 'var(--accent)' as string }) {
  const base: React.CSSProperties = { position: 'absolute', width: 12, height: 12 };
  return (
    <>
      <span style={{ ...base, top: -1, left: -1, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <span style={{ ...base, top: -1, right: -1, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      <span style={{ ...base, bottom: -1, left: -1, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <span style={{ ...base, bottom: -1, right: -1, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
    </>
  );
}

export const STAR_TINY = `
.Y.
YYY
.Y.
`;
