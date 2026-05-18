import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { projects } from '@/lib/data';
import { Trophy } from 'lucide-react';

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container-page">
        <SectionHeader
          eyebrow="04 — Projects & Awards"
          title="競賽與專案"
          subtitle="從 0 到 1 的提案、原型與落地經驗 — 由跨領域團隊驅動的創新實踐。"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <article className="card p-6 h-full flex flex-col hover:border-accent/40 transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-2 text-accent2 text-xs font-mono">
                      <Trophy size={14} /> {p.year}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold">{p.title}</h3>
                    <div className="text-sm text-muted mt-1">{p.subtitle}</div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-ink/85 leading-relaxed">
                  {p.description}
                </p>

                <div className="mt-4 text-xs text-muted">
                  <span className="font-semibold text-ink/80">擔任角色：</span>
                  <ul className="mt-1 list-disc list-inside space-y-0.5">
                    {p.role.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
