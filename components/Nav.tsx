'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLang, ui } from '@/lib/i18n';

export default function Nav() {
  const { lang, toggle, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#about', label: t(ui.nav.about) },
    { href: '#skills', label: t(ui.nav.skills) },
    { href: '#experience', label: t(ui.nav.experience) },
    { href: '#projects', label: t(ui.nav.projects) },
    { href: '#education', label: t(ui.nav.education) },
    { href: '#contact', label: t(ui.nav.contact) },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled
          ? 'backdrop-blur-md bg-bg/70 border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="#top" className="font-mono text-sm tracking-tight shrink-0">
          <span className="text-gradient font-bold">EricTang9708</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle lang={lang} onToggle={toggle} />
          <a
            href="#contact"
            className="hidden md:inline-flex btn-primary text-xs"
          >
            {t(ui.nav.cta)}
          </a>

          <button
            aria-label="menu"
            className="md:hidden text-ink"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d={open ? 'M6 6l12 12M6 18L18 6' : 'M4 7h16M4 12h16M4 17h16'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-md">
          <div className="container-page py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-muted hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function LangToggle({
  lang,
  onToggle,
}: {
  lang: 'zh' | 'en';
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle language"
      className="relative h-8 w-16 rounded-full border border-border bg-panel/60 backdrop-blur-sm text-xs font-mono transition-colors hover:border-accent/50"
    >
      <span
        className={`absolute top-1 h-6 w-7 rounded-full bg-gradient-to-r from-accent to-accent2 transition-transform duration-300 ${
          lang === 'en' ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
      <span
        className={`absolute inset-y-0 left-2 grid place-items-center w-6 transition-colors ${
          lang === 'zh' ? 'text-bg font-bold' : 'text-muted'
        }`}
      >
        中
      </span>
      <span
        className={`absolute inset-y-0 right-2 grid place-items-center w-6 transition-colors ${
          lang === 'en' ? 'text-bg font-bold' : 'text-muted'
        }`}
      >
        EN
      </span>
    </button>
  );
}
