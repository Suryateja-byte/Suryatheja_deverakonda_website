import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';

import { ImageSlot } from '@components/ImageSlot';
import { useResumeContext } from '@components/providers/ResumeProvider';
import { Dialog, DialogContent, DialogTrigger } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader } from '@components/ui/card';
import { SectionHeading } from '@components/SectionHeading';
import { buildProjects, type ProjectCard } from '@lib/formatters';

function ProjectDialog({ project }: { project: ProjectCard }) {
  const hasLinks = Boolean(project.links.demo || project.links.code);
  const hasHighlights = project.highlights.length > 0;

  if (!hasHighlights && !hasLinks) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="mt-4 inline-flex items-center gap-2">
          View case study <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-5">
          <header className="space-y-2">
            <h3 className="text-2xl font-semibold text-foreground">{project.name}</h3>
            <p className="text-sm text-muted-foreground">{project.summary}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs uppercase tracking-[0.2em]">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>
          {hasHighlights ? (
            <div className="grid gap-3">
              {project.highlights.map((highlight, index) => (
                <div key={highlight} className="rounded-2xl border border-border/40 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                    {index + 1}
                  </span>
                  {highlight}
                </div>
              ))}
            </div>
          ) : null}
          {hasLinks ? (
            <footer className="flex flex-wrap gap-2">
              {project.links.demo ? (
                <Button asChild>
                  <a href={project.links.demo} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Live
                  </a>
                </Button>
              ) : null}
              {project.links.code ? (
                <Button variant="outline" asChild>
                  <a href={project.links.code} target="_blank" rel="noreferrer">
                    <Github className="mr-2 h-4 w-4" /> Code
                  </a>
                </Button>
              ) : null}
            </footer>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsSection() {
  const { data } = useResumeContext();
  const projects = useMemo(() => buildProjects(data ?? null), [data]);

  return (
    <section id="projects" data-section="projects" className="container py-24">
      <SectionHeading
        eyebrow="Case Studies"
        title="Selected shipping stories"
        description="Cross-discipline engagements—from ML pipelines to boutique product surfaces—that shipped measurable outcomes."
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const highlightPreview = project.highlights.length ? project.highlights.slice(0, 3) : [project.summary];

          return (
            <motion.div key={project.id} whileHover={{ y: -6 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}>
              <Card className="flex h-full flex-col border-border/50 bg-card/70">
                <CardHeader className="space-y-4 border-b border-border/40 bg-background/40 px-5 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-[0.3em]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col space-y-5 px-5 py-6">
                  <div className="grid grid-cols-[2fr_1fr] gap-3">
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                      <ImageSlot slotId={project.desktopSlot.id} alt={`${project.name} desktop`} className="rounded-2xl" />
                    </motion.div>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                      <ImageSlot slotId={project.mobileSlot.id} alt={`${project.name} mobile`} className="rounded-2xl" />
                    </motion.div>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {highlightPreview.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <ProjectDialog project={project} />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
