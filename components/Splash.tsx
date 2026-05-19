'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoImage } from './ui/LogoImage';

export function Splash({ minDurationMs = 1100 }: { minDurationMs?: number }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setShow(false), minDurationMs);
    return () => window.clearTimeout(id);
  }, [minDurationMs]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-0)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
          }}
        >
          <motion.div layoutId="lbt-logo" transition={{ duration: 0.6, ease: 'easeInOut' }}>
            <LogoImage size={120} glow="rgba(34,211,238,0.5)" />
          </motion.div>
          <div
            className="silkscreen"
            style={{ color: 'var(--ink-mute)', marginTop: 12, letterSpacing: '0.2em', fontSize: 12 }}
          >
            CHARGING UP THE TOWN…
          </div>
          <div
            style={{
              marginTop: 30,
              width: 180,
              height: 8,
              border: '1px solid var(--panel-stroke)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'block',
                height: '100%',
                width: 0,
                background: 'var(--accent)',
                animation: 'load 0.8s steps(20) forwards',
                boxShadow: 'var(--neon-glow)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
