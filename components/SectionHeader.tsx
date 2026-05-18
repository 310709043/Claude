'use client';

import Reveal from './Reveal';
import { useLang, type Bi } from '@/lib/i18n';

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: Bi | string;
  title: Bi | string;
  subtitle?: Bi | string;
}) {
  const { t } = useLang();
  return (
    <Reveal>
      <div className="mb-12">
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-accent2 mb-3">
          {t(eyebrow)}
        </div>
        <h2 className="h-section">{t(title)}</h2>
        {subtitle && <p className="mt-3 text-muted max-w-2xl">{t(subtitle)}</p>}
      </div>
    </Reveal>
  );
}
