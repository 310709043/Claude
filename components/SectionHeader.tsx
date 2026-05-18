import Reveal from './Reveal';

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal>
      <div className="mb-12">
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-accent2 mb-3">
          {eyebrow}
        </div>
        <h2 className="h-section">{title}</h2>
        {subtitle && (
          <p className="mt-3 text-muted max-w-2xl">{subtitle}</p>
        )}
      </div>
    </Reveal>
  );
}
