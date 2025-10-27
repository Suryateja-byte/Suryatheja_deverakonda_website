import { useMemo } from 'react';

import { ImageSlot } from '@components/ImageSlot';
import { useResumeContext } from '@components/providers/ResumeProvider';
import { Card } from '@components/ui/card';
import { SectionHeading } from '@components/SectionHeading';
import { buildEducationTimeline, buildExperienceTimeline, type TimelineEntry } from '@lib/formatters';
import { cn } from '@lib/utils';

function TimelineItem({ entry, alignRight }: { entry: TimelineEntry; alignRight?: boolean }) {
  return (
    <div className={cn('relative flex gap-4 rounded-3xl border border-border/40 bg-card/60 p-6 shadow-sm', alignRight && 'md:flex-row-reverse')}>
      <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted/60">
        {entry.logoSlot ? (
          <ImageSlot slotId={entry.logoSlot.id} alt={`${entry.title} logo`} className="h-12 w-12" />
        ) : (
          <span className="text-sm font-semibold text-muted-foreground">{entry.title.substring(0, 2)}</span>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex flex-col gap-1 text-sm text-muted-foreground/80">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60">{entry.range}</span>
          <h3 className="text-base font-semibold text-foreground">{entry.title}</h3>
          {entry.subtitle ? <p className="text-sm text-muted-foreground">{entry.subtitle}</p> : null}
          {entry.location ? <p className="text-xs text-muted-foreground/80">{entry.location}</p> : null}
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const { data } = useResumeContext();
  const experienceTimeline = useMemo(() => buildExperienceTimeline(data ?? null), [data]);
  const educationTimeline = useMemo(() => buildEducationTimeline(data ?? null), [data]);

  return (
    <section id="experience" data-section="experience" className="container py-24">
      <SectionHeading
        eyebrow="Experience"
        title="Operating from R&D to production"
        description="Leading squads that merge ML rigor with product intuition. Each engagement stays measurable, observable, and shippable."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)]">
        <div className="space-y-6">
          {experienceTimeline.map((entry) => (
            <TimelineItem key={`${entry.title}-${entry.range}`} entry={entry} />
          ))}
          {!experienceTimeline.length ? (
            <Card className="border-dashed border-border/50 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
              Add experience entries to resume.json to populate the timeline.
            </Card>
          ) : null}
        </div>
        <div className="space-y-6" id="education" data-section="education">
          <SectionHeading
            eyebrow="Education"
            title="Foundations"
            description="Academic pillars that started the craft."
            alignment="center"
          />
          <div className="space-y-4">
            {educationTimeline.map((entry) => (
              <TimelineItem key={`${entry.title}-${entry.range}`} entry={entry} alignRight />
            ))}
            {!educationTimeline.length ? (
              <Card className="border-dashed border-border/50 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                Add education entries to resume.json to surface here.
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
