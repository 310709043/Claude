'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Direction = 'neon' | 'dusk' | 'rain';
export type Lang = 'zh' | 'en' | 'ko' | 'ja';

interface ThemeCtx {
  direction: Direction;
  setDirection: (d: Direction) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  scanlines: boolean;
  setScanlines: (v: boolean) => void;
  autoTime: boolean;
  setAutoTime: (v: boolean) => void;
}

const STORAGE_KEY = 'lbt.theme';

const defaults: Omit<ThemeCtx, 'setDirection' | 'setLang' | 'setScanlines' | 'setAutoTime'> = {
  direction: 'neon',
  lang: 'zh',
  scanlines: true,
  autoTime: true,
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirectionState] = useState<Direction>(defaults.direction);
  const [lang, setLangState] = useState<Lang>(defaults.lang);
  const [scanlines, setScanlinesState] = useState(defaults.scanlines);
  const [autoTime, setAutoTimeState] = useState(defaults.autoTime);

  // Hydrate from localStorage on mount (avoid SSR mismatch by deferring)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Pick<ThemeCtx, 'direction' | 'lang' | 'scanlines' | 'autoTime'>>;
      if (parsed.direction) setDirectionState(parsed.direction);
      if (parsed.lang) setLangState(parsed.lang);
      if (typeof parsed.scanlines === 'boolean') setScanlinesState(parsed.scanlines);
      if (typeof parsed.autoTime === 'boolean') setAutoTimeState(parsed.autoTime);
    } catch {
      /* ignore */
    }
  }, []);

  // Apply data-direction on <html>
  useEffect(() => {
    document.documentElement.dataset.direction = direction;
  }, [direction]);

  // Persist
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ direction, lang, scanlines, autoTime }),
      );
    } catch {
      /* ignore */
    }
  }, [direction, lang, scanlines, autoTime]);

  const setDirection = useCallback((d: Direction) => setDirectionState(d), []);
  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const setScanlines = useCallback((v: boolean) => setScanlinesState(v), []);
  const setAutoTime = useCallback((v: boolean) => setAutoTimeState(v), []);

  const value = useMemo<ThemeCtx>(
    () => ({ direction, setDirection, lang, setLang, scanlines, setScanlines, autoTime, setAutoTime }),
    [direction, lang, scanlines, autoTime, setDirection, setLang, setScanlines, setAutoTime],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
