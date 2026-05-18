'use client';

import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { about } from '@/lib/data';
import { useLang, ui } from '@/lib/i18n';

export default function About() {
  const { t } = useLang();
  return (
    <section id="about" className="section">
      <div className="container-page">
        <SectionHeader
          eyebrow={ui.about.eyebrow}
          title={ui.about.title}
          subtitle={ui.about.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">
          <Reveal>
            <div className="space-y-5 text-ink/90 leading-relaxed">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{t(p)}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {about.highlights.map((h, i) => (
                <div
                  key={i}
                  className="card p-5 hover:border-accent/40 transition-colors"
                >
                  <div className="text-3xl font-bold text-gradient">
                    {h.value}
                  </div>
                  <div className="mt-1 text-sm text-muted">{t(h.label)}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
