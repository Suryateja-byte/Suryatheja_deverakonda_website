import { Reveal } from '@components/animations/Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  alignment?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, alignment = 'left' }: SectionHeadingProps) {
  const alignmentClass = alignment === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl';

  return (
    <Reveal className={alignmentClass} y={24}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p> : null}
    </Reveal>
  );
}
