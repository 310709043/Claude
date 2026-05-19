'use client';

import { useTheme } from './ThemeProvider';

export function ScanlineOverlay() {
  const { scanlines } = useTheme();
  if (!scanlines) return null;
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background:
          'repeating-linear-gradient(to bottom, rgba(255,255,255,0.015) 0 1px, transparent 1px 4px), radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
        mixBlendMode: 'overlay',
        opacity: 0.5,
        zIndex: 9998,
      }}
    />
  );
}
