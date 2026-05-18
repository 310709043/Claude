import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { about } from '@/lib/data';

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container-page">
        <SectionHeader
          eyebrow="01 — About"
          title="關於我"
          subtitle="從營運分析師到產品經理，我相信用數據說故事，並以使用者價值為核心驅動商業決策。"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">
          <Reveal>
            <div className="space-y-5 text-ink/90 leading-relaxed">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {about.highlights.map((h) => (
                <div
                  key={h.label}
                  className="card p-5 hover:border-accent/40 transition-colors"
                >
                  <div className="text-3xl font-bold text-gradient">
                    {h.value}
                  </div>
                  <div className="mt-1 text-sm text-muted">{h.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
