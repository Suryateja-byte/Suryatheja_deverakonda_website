import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { Reveal } from '@components/animations/Reveal';
import { ImageSlot } from '@components/ImageSlot';
import { useResumeContext } from '@components/providers/ResumeProvider';
import { Card, CardContent, CardHeader } from '@components/ui/card';
import { SectionHeading } from '@components/SectionHeading';
import { buildSkillGroups, type SkillGroup } from '@lib/formatters';

const MAX_VISIBLE = 8;

function splitColumns<T>(items: T[], columns: number): T[][] {
  return Array.from({ length: columns }, (_, columnIndex) => items.filter((_, itemIndex) => itemIndex % columns === columnIndex));
}

function SkillMeter({ name, level, iconSlotId }: { name: string; level: number; iconSlotId?: string }) {
  const reduceMotion = useReducedMotion();
  const normalizedLevel = Math.min(100, Math.max(0, level));
  const scaleTarget = normalizedLevel / 100;

  return (
    <div className="flex items-center gap-4">
      {iconSlotId ? (
        <ImageSlot slotId={iconSlotId} alt={`${name} icon`} className="h-11 w-11 rounded-xl bg-muted/40 p-1" />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/40 text-xs font-semibold text-muted-foreground">
          {name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between text-sm font-medium text-foreground">
          <span>{name}</span>
          <span className="text-xs text-muted-foreground">{normalizedLevel}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted/60">
          <motion.div
            className="h-full w-full rounded-full bg-gradient-to-r from-accent via-sky-400 to-emerald-400 shadow-[0_0_18px_rgba(56,189,248,0.35)]"
            style={{
              transformOrigin: 'left center',
              transform: reduceMotion ? `scaleX(${scaleTarget})` : undefined,
            }}
            initial={reduceMotion ? undefined : { scaleX: 0, opacity: 0.6 }}
            animate={reduceMotion ? undefined : { scaleX: scaleTarget <= 0 ? 0 : scaleTarget, opacity: 1 }}
            transition={reduceMotion ? undefined : { duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

function SkillGroupCard({ group }: { group: SkillGroup }) {
  const visible = group.skills.slice(0, MAX_VISIBLE);
  const overflow = group.skills.length - visible.length;
  const columns = visible.length > 4 ? 2 : 1;
  const columnData = splitColumns(visible, columns);

  return (
    <Card className="border-border/50 bg-card/70 shadow-[0_25px_55px_-40px_rgba(15,23,42,0.55)] transition duration-300 ease-out hover:-translate-y-1 hover:border-border/70 hover:shadow-[0_32px_65px_-40px_rgba(15,23,42,0.65)]">
      <CardHeader className="border-b border-border/40 bg-background/30 px-6 py-5 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        {group.title}
      </CardHeader>
      <CardContent className="px-6 py-6">
        <div className={columns > 1 ? 'grid gap-5 sm:grid-cols-2' : 'space-y-5'}>
          {columnData.map((column, columnIndex) => (
            <div key={`${group.title}-col-${columnIndex}`} className="space-y-5">
              {column.map((skill) => (
                <SkillMeter key={skill.name} name={skill.name} level={skill.level} iconSlotId={skill.iconSlotId} />
              ))}
            </div>
          ))}
        </div>
        {overflow > 0 ? (
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">+{overflow} more showcased in resume</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function SkillsSection() {
  const { data } = useResumeContext();
  const skillGroups = useMemo(() => buildSkillGroups(data ?? null), [data]);

  return (
    <section id="skills" data-section="skills" className="py-24">
      <SectionHeading
        eyebrow="Skills & Tooling"
        title="Stack coverage & comfort levels"
        description="Toolkits I reach for—blending boutique product craft with production-grade ML and cloud delivery. Comfort levels blend usage frequency, production depth, and enthusiasm for the craft."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {skillGroups.map((group, index) => (
          <Reveal key={group.title} delay={0.08 * index} y={28}>
            <SkillGroupCard group={group} />
          </Reveal>
        ))}
        {!skillGroups.length ? (
          <Reveal y={20}>
            <Card className="border-dashed border-border/50 bg-muted/20 py-12 text-center text-sm text-muted-foreground">
              Drop a skills array into resume.json to auto-populate this section.
            </Card>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
