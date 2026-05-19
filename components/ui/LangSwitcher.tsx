'use client';

import React from 'react';
import { LANGS, LANG_LABEL } from '@/lib/i18n';
import type { Lang } from '@/components/ThemeProvider';

interface Props {
  lang: Lang;
  onChange: (l: Lang) => void;
  compact?: boolean;
}

export function LangSwitcher({ lang, onChange, compact = false }: Props) {
  return (
    <div
      style={{
        display: 'inline-flex',
        border: '1px solid var(--panel-stroke)',
        background: 'rgba(7,4,26,0.7)',
        fontFamily: 'var(--font-silkscreen), monospace',
        fontSize: compact ? 9 : 10,
      }}
    >
      {LANGS.map((l, i) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          style={{
            padding: compact ? '4px 8px' : '5px 10px',
            border: 'none',
            borderRight: i < LANGS.length - 1 ? '1px solid var(--panel-stroke)' : 'none',
            background: lang === l ? 'var(--accent)' : 'transparent',
            color: lang === l ? '#0a0524' : 'var(--ink-mute)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.1em',
            fontWeight: lang === l ? 700 : 400,
            transition: 'all 0.12s steps(2)',
          }}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
