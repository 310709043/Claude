import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { experiences } from '@/lib/data';
import { Briefcase, MapPin } from 'lucide-react';

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container-page">
        <SectionHeader
          eyebrow="03 — Experience"
          title="工作經歷"
          subtitle="從跨國營運分析到產品專案管理，持續驗證並擴展商業價值。"
        />

        <div className="relative">
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-border to-transparent" />

          <div className="space-y-8">
            {experiences.map((e, i) => (
              <Reveal key={e.company + e.period} delay={i * 0.05}>
                <article className="relative pl-12 sm:pl-16">
                  <div className="absolute left-0 sm:left-2 top-2 grid place-items-center w-8 h-8 rounded-full bg-panel border border-border text-accent">
                    <Briefcase size={14} />
                  </div>

                  <div className="card p-6 hover:border-accent/40 transition-colors">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {e.role}
                          <span className="text-muted text-sm font-normal">
                            {' '}
                            · {e.roleEn}
                          </span>
                        </h3>
                        <div className="text-sm text-accent2 mt-1">
                          {e.company}{' '}
                          <span className="text-muted">({e.companyEn})</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted font-mono">
                        {e.period}
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-muted inline-flex items-center gap-1.5">
                      <MapPin size={12} /> {e.location}
                    </div>

                    <ul className="mt-4 space-y-2 text-sm text-ink/85 leading-relaxed">
                      {e.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-accent mt-1.5 size-1.5 rounded-full bg-accent shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {e.tags.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
