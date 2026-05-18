'use client';

import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { education, certifications, languages } from '@/lib/data';
import { useLang, ui } from '@/lib/i18n';
import { GraduationCap, BadgeCheck, Languages, ExternalLink } from 'lucide-react';

export default function Education() {
  const { t } = useLang();
  return (
    <section id="education" className="section">
      <div className="container-page">
        <SectionHeader
          eyebrow={ui.education.eyebrow}
          title={ui.education.title}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-6">
          <Reveal>
            <div className="card p-6 h-full">
              <div className="flex items-center gap-2 text-accent2 text-sm font-mono mb-4">
                <GraduationCap size={16} /> {t(ui.education.education)}
              </div>
              <div className="space-y-5">
                {education.map((e, i) => (
                  <div key={i} className="border-l-2 border-accent/40 pl-4">
                    {e.url ? (
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold hover:text-accent hover:underline underline-offset-4"
                      >
                        {t(e.school)}
                        <ExternalLink size={12} className="opacity-70" />
                      </a>
                    ) : (
                      <div className="font-semibold">{t(e.school)}</div>
                    )}
                    <div className="mt-1 text-sm">{t(e.degree)}</div>
                    <div className="mt-2 text-xs text-muted font-mono">
                      {e.period}
                    </div>
                    <div className="mt-2 text-sm text-ink/85">
                      {t(e.detail)}
                    </div>
                    {e.thesis && (
                      <div className="mt-1 text-xs text-muted italic">
                        {t(e.thesis)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card p-6 h-full">
              <div className="flex items-center gap-2 text-accent2 text-sm font-mono mb-4">
                <BadgeCheck size={16} /> {t(ui.education.certs)}
              </div>
              <ul className="space-y-2 text-sm">
                {certifications.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent mt-1.5 size-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-ink/85">{t(c)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="card p-6 h-full">
              <div className="flex items-center gap-2 text-accent2 text-sm font-mono mb-4">
                <Languages size={16} /> {t(ui.education.langs)}
              </div>
              <ul className="space-y-3">
                {languages.map((l, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-ink/90">{t(l.name)}</span>
                    <span className="text-muted text-xs">{t(l.level)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
