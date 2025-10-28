import { useMemo } from 'react';

import { Reveal } from '@components/animations/Reveal';
import { useResumeContext } from '@components/providers/ResumeProvider';
import { Card } from '@components/ui/card';
import { SectionHeading } from '@components/SectionHeading';
import { buildEducationTimeline, buildExperienceTimeline, type TimelineEntry } from '@lib/formatters';
import { cn } from '@lib/utils';

function TimelineItem({ entry, variant = 'primary' }: { entry: TimelineEntry; variant?: 'primary' | 'compact' }) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-border/40 bg-card/70 p-6 shadow-[0_28px_65px_-45px_rgba(15,23,42,0.55)] transition duration-300 ease-out hover:-translate-y-1 hover:border-border/70 hover:shadow-[0_34px_70px_-45px_rgba(15,23,42,0.65)]',
        isCompact && 'bg-card/60 p-5'
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/12 via-transparent to-transparent" />
      </div>
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-accent via-accent/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute left-0 top-6 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-accent/90 shadow-[0_0_0_8px_rgba(59,130,246,0.18)] transition duration-300 group-hover:shadow-[0_0_0_12px_rgba(59,130,246,0.28)]"
      />
      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-muted-foreground/70">
          <span>{entry.range}</span>
          {entry.location ? <span className="text-[0.7rem] tracking-[0.2em] text-muted-foreground/60">{entry.location}</span> : null}
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{entry.title}</h3>
          {entry.subtitle ? <p className="text-sm text-muted-foreground/85">{entry.subtitle}</p> : null}
        </div>
        {entry.highlights.length ? (
          <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-accent/80" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const { data } = useResumeContext();
  const experienceTimeline = useMemo(() => buildExperienceTimeline(data ?? null), [data]);
  const educationTimeline = useMemo(() => buildEducationTimeline(data ?? null), [data]);

  return (
    <section id="experience" data-section="experience" className="py-24">
      <SectionHeading
        eyebrow="Experience"
        title="Operating from R&D to production"
        description="Leading squads that merge ML rigor with product intuition. Each engagement stays measurable, observable, and shippable."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)]">
        <div className="space-y-7">
          {experienceTimeline.map((entry, index) => (
            <Reveal key={`${entry.title}-${entry.range}`} delay={0.08 * index} y={26}>
              <TimelineItem entry={entry} />
            </Reveal>
          ))}
          {!experienceTimeline.length ? (
            <Reveal y={20}>
              <Card className="border-dashed border-border/50 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
                Add experience entries to resume.json to populate the timeline.
              </Card>
            </Reveal>
          ) : null}
        </div>
        <div className="space-y-6" id="education" data-section="education">
          <SectionHeading
            eyebrow="Education"
            title="Foundations"
            description="Academic pillars that started the craft."
            alignment="center"
          />
          <div className="space-y-5">
            {educationTimeline.map((entry, index) => (
              <Reveal key={`${entry.title}-${entry.range}`} delay={0.08 * index} y={24}>
                <TimelineItem entry={entry} variant="compact" />
              </Reveal>
            ))}
            {!educationTimeline.length ? (
              <Reveal y={20}>
                <Card className="border-dashed border-border/50 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                  Add education entries to resume.json to surface here.
                </Card>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
