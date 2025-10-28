import { Reveal } from '@components/animations/Reveal';
import { CORE_PRINCIPLES } from '@config/principles';
import { useResumeContext } from '@components/providers/ResumeProvider';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader } from '@components/ui/card';
import { SectionHeading } from '@components/SectionHeading';

export function AboutSection() {
  const { data } = useResumeContext();
  const summary = data?.summary ?? '';
  const highlightedSkills = (data?.skills ?? []).slice(0, 12);

  return (
    <section id="about" data-section="about" className="py-24">
      <SectionHeading
        eyebrow="About"
        title="Premium execution, principled delivery"
        description="I lead engagements end-to-end: aligning the vision, designing premium interfaces, and pushing technical systems that stay resilient long after launch."
      />

      <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)]">
        <Reveal className="space-y-6 text-base leading-relaxed text-muted-foreground" y={26}>
          {summary ? (
            <p className="text-balance text-lg text-foreground">{summary}</p>
          ) : (
            <p className="text-balance text-lg text-foreground">
              I build expressive digital experiences, pairing high-end UX craft with battle-tested engineering patterns. Each engagement gets premium polish: clean architecture, meaningful performance budgets, and a narrative that resonates in the boardroom.
            </p>
          )}
          <p>
            Think of me as an end-to-end partner. I synthesize research, lead cross-functional squads, scope resilient systems, and surface the micro-interactions that make a product feel boutique. From MLOps pipelines to front-of-house storytelling, the output stays premium.
          </p>
          <div className="flex flex-wrap gap-2">
            {highlightedSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="rounded-full border-border/40 bg-card/60 px-3 py-1 text-[11px] uppercase tracking-[0.24em]">
                {skill}
              </Badge>
            ))}
            {!highlightedSkills.length ? (
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
                Plug more skills into resume.json to showcase here
              </Badge>
            ) : null}
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {CORE_PRINCIPLES.map((principle, index) => (
            <Reveal key={principle.title} delay={0.08 * index} y={24}>
              <Card className="border-border/50 bg-card/70 shadow-[0_25px_45px_-40px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:border-border/70 hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.65)]">
                <CardHeader className="flex items-center gap-3 border-b border-border/40 bg-background/40 px-6 py-4">
                  <principle.icon className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold text-foreground">{principle.title}</span>
                </CardHeader>
                <CardContent className="px-6 py-4 text-sm leading-relaxed text-muted-foreground">
                  {principle.description}
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
