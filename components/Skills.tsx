import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { skills } from '@/lib/data';

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container-page">
        <SectionHeader
          eyebrow="02 — Skills"
          title="專業技能"
          subtitle="商業 × 產品 × AI — 跨領域工具箱，協助我快速從問題識別到解決方案落地。"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.05}>
              <div className="card p-6 h-full hover:border-accent/40 transition-all hover:-translate-y-0.5">
                <div className="font-mono text-xs text-accent2 mb-3">
                  0{i + 1}
                </div>
                <h3 className="text-lg font-semibold mb-4">{g.group}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-md border border-border bg-bg/40 px-2.5 py-1 text-xs text-ink/80"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
