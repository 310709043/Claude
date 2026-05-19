'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LogoImage } from '@/components/ui/LogoImage';
import { LangSwitcher } from '@/components/ui/LangSwitcher';
import { useTheme } from '@/components/ThemeProvider';

interface Props {
  title: string;
  subtitle?: string;
  onPrimary?: () => void;
  primaryLabel?: string;
  onBack?: () => void;
  backLabel?: string;
}

/** Temporary placeholder used while individual screens are being ported. */
export function PlaceholderScreen({
  title,
  subtitle,
  onPrimary,
  primaryLabel,
  onBack,
  backLabel,
}: Props) {
  const { lang, setLang } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: 24,
        background:
          'radial-gradient(ellipse at top, var(--sky-mid) 0%, var(--bg-0) 70%)',
      }}
    >
      <motion.div layoutId="lbt-logo" transition={{ duration: 0.6, ease: 'easeInOut' }}>
        <LogoImage size={88} />
      </motion.div>
      <h1
        className="silkscreen"
        style={{
          fontSize: 22,
          color: 'var(--ink)',
          textShadow: 'var(--neon-glow)',
          letterSpacing: '0.08em',
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: 'var(--ink-mute)', fontSize: 13, letterSpacing: '0.1em' }}>{subtitle}</p>
      )}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {onBack && (
          <button className="pixel-btn" onClick={onBack}>
            ◀ {backLabel ?? 'BACK'}
          </button>
        )}
        {onPrimary && (
          <button className="pixel-btn primary" onClick={onPrimary}>
            {primaryLabel ?? 'NEXT'} ▶
          </button>
        )}
      </div>
      <div style={{ position: 'fixed', top: 16, right: 16 }}>
        <LangSwitcher lang={lang} onChange={setLang} compact />
      </div>
    </motion.div>
  );
}
