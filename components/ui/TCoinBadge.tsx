'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { CoinIcon } from './CoinIcon';

interface Props {
  amount?: number;
  delta?: number;
  label?: string;
}

/** Animated count-up when amount changes. */
export function TCoinBadge({ amount = 247, delta = 0, label = 'T-COIN' }: Props) {
  const mv = useMotionValue(amount);
  const display = useTransform(mv, (v) => Math.round(v).toLocaleString());
  const prev = useRef(amount);
  useEffect(() => {
    const controls = animate(mv, amount, {
      duration: 0.7,
      ease: 'easeOut',
    });
    prev.current = amount;
    return () => controls.stop();
  }, [amount, mv]);

  const [showDelta, setShowDelta] = useState(false);
  useEffect(() => {
    if (delta > 0) {
      setShowDelta(true);
      const id = window.setTimeout(() => setShowDelta(false), 1400);
      return () => window.clearTimeout(id);
    }
  }, [delta]);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 10px',
        background: 'linear-gradient(180deg, rgba(252,211,77,0.15), rgba(252,211,77,0.05))',
        border: '1px solid var(--accent-4)',
        boxShadow: '0 0 8px rgba(252,211,77,0.3), inset 0 0 8px rgba(252,211,77,0.1)',
        fontFamily: 'var(--font-silkscreen), monospace',
        letterSpacing: '0.1em',
        position: 'relative',
      }}
    >
      <CoinIcon scale={2} />
      <motion.span
        style={{
          fontSize: 13,
          color: 'var(--accent-4)',
          fontWeight: 700,
          textShadow: '0 0 6px var(--accent-4)',
        }}
      >
        {display}
      </motion.span>
      <span style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.2em' }}>{label}</span>
      {showDelta && (
        <motion.span
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: -22 }}
          transition={{ duration: 1.2, times: [0, 0.15, 0.7, 1] }}
          style={{
            position: 'absolute',
            right: 8,
            top: 0,
            fontSize: 10,
            color: '#6ee7b7',
            textShadow: '0 0 6px #6ee7b7',
            pointerEvents: 'none',
          }}
        >
          +{delta}
        </motion.span>
      )}
    </div>
  );
}
