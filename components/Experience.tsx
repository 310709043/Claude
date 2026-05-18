'use client';

import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { experiences } from '@/lib/data';
import { useLang, ui } from '@/lib/i18n';
import { Briefcase, MapPin, ExternalLink } from 'lucide-react';

export default function Experience() {
  const { t } = useLang();
  return (
    <section id="experience" className="section">
      <div className="container-page">
        <SectionHeader
          eyebrow={ui.experience.eyebrow}
          title={ui.experience.title}
          subtitle={ui.experience.subtitle}
        />

        <div className="relative">
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-border to-transparent" />

          <div className="space-y-8">
            {experiences.map((e, i) => {
              const companyName = t(e.company);
              const CompanyTag = e.url ? 'a' : 'span';
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <article className="relative pl-12 sm:pl-16">
                    <div className="absolute left-0 sm:left-2 top-2 grid place-items-center w-8 h-8 rounded-full bg-panel border border-border text-accent">
                      <Briefcase size={14} />
                    </div>

                    <div className="card p-6 hover:border-accent/40 transition-colors">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">{t(e.role)}</h3>
                          <div className="text-sm text-accent2 mt-1">
                            <CompanyTag
                              {...(e.url
                                ? {
                                    href: e.url,
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                    title: t(ui.experience.visit),
                                  }
                                : {})}
                              className={
                                e.url
                                  ? 'inline-flex items-center gap-1.5 hover:text-accent hover:underline underline-offset-4 transition-colors'
                                  : ''
                              }
                            >
                              {companyName}
                              {e.url && (
                                <ExternalLink size={12} className="opacity-70" />
                              )}
                            </CompanyTag>
                          </div>
                        </div>
                        <div className="text-xs text-muted font-mono">
                          {e.period}
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-muted inline-flex items-center gap-1.5">
                        <MapPin size={12} /> {t(e.location)}
                      </div>

                      <ul className="mt-4 space-y-2 text-sm text-ink/85 leading-relaxed">
                        {e.bullets.map((b, j) => (
                          <li key={j} className="flex gap-2">
                            <span className="text-accent mt-1.5 size-1.5 rounded-full bg-accent shrink-0" />
                            <span>{t(b)}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {e.tags.map((tg, k) => (
                          <span key={k} className="chip">
                            {t(tg)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
