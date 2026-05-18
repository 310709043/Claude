import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { education, certifications, languages } from '@/lib/data';
import { GraduationCap, BadgeCheck, Languages } from 'lucide-react';

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container-page">
        <SectionHeader
          eyebrow="05 — Education"
          title="學歷 · 證照 · 語言"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-6">
          <Reveal>
            <div className="card p-6 h-full">
              <div className="flex items-center gap-2 text-accent2 text-sm font-mono mb-4">
                <GraduationCap size={16} /> Education
              </div>
              <div className="space-y-5">
                {education.map((e) => (
                  <div key={e.school} className="border-l-2 border-accent/40 pl-4">
                    <div className="font-semibold">{e.school}</div>
                    <div className="text-xs text-muted">{e.schoolEn}</div>
                    <div className="mt-1 text-sm">{e.degree}</div>
                    <div className="text-xs text-muted">{e.degreeEn}</div>
                    <div className="mt-2 text-xs text-muted font-mono">
                      {e.period}
                    </div>
                    <div className="mt-2 text-sm text-ink/85">{e.detail}</div>
                    {e.thesis && (
                      <div className="mt-1 text-xs text-muted italic">
                        {e.thesis}
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
                <BadgeCheck size={16} /> Certifications
              </div>
              <ul className="space-y-2 text-sm">
                {certifications.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="text-accent mt-1.5 size-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-ink/85">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="card p-6 h-full">
              <div className="flex items-center gap-2 text-accent2 text-sm font-mono mb-4">
                <Languages size={16} /> Languages
              </div>
              <ul className="space-y-3">
                {languages.map((l) => (
                  <li key={l.name} className="flex justify-between text-sm">
                    <span className="text-ink/90">{l.name}</span>
                    <span className="text-muted text-xs">{l.level}</span>
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
