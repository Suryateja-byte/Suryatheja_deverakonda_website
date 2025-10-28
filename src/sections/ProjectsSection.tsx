import { useCallback, useMemo, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';

import { useSmoothScroll } from '@components/layout/SmoothScrollProvider';
import { useDialogState } from '@components/providers/DialogStateProvider';
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
  const [open, setOpen] = useState(false);
  const smoothScroll = useSmoothScroll();
  const { setDialogOpen } = useDialogState();
  const reduceMotion = useReducedMotion();
  const resumeScrollAfterExit = useRef(false);
  const pendingClose = useRef(false);

  const handleDialogExitComplete = useCallback(() => {
    if (!resumeScrollAfterExit.current) {
      return;
    }

    if (!pendingClose.current) {
      resumeScrollAfterExit.current = false;
      return;
    }

    // Wait for the dialog exit animation to flush before re-enabling Lenis
    window.requestAnimationFrame(() => {
      setDialogOpen(false);
      window.requestAnimationFrame(() => {
        smoothScroll?.start();
      });
    });
    resumeScrollAfterExit.current = false;
    pendingClose.current = false;
  }, [setDialogOpen, smoothScroll]);

  if (!hasHighlights && !hasLinks) {
    return null;
  }

  const buttonVariants = {
    rest: { scale: 1, x: 0 },
    hover: {
      scale: 1.02,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 17
      }
    },
    tap: { scale: 0.98 }
  };

  const arrowVariants = {
    rest: { x: 0, y: 0, rotate: 0 },
    hover: {
      x: 2,
      y: -2,
      rotate: 5,
      transition: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 15
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) {
          pendingClose.current = false;
          setDialogOpen(true);
          resumeScrollAfterExit.current = false;
          smoothScroll?.stop();
        } else {
          pendingClose.current = true;
          if (reduceMotion) {
            smoothScroll?.start();
            pendingClose.current = false;
            setDialogOpen(false);
            return;
          }

          resumeScrollAfterExit.current = true;
        }
      }}
    >
      <DialogTrigger asChild>
        <motion.div
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          variants={reduceMotion ? undefined : buttonVariants}
        >
          <Button variant="ghost" size="sm" className="mt-4 inline-flex items-center gap-2">
            View case study
            <motion.div variants={reduceMotion ? undefined : arrowVariants}>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.div>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent
        open={open}
        onExitComplete={handleDialogExitComplete}
        className="max-h-[min(80vh,720px)] overflow-y-auto rounded-3xl border border-border/50 bg-card/95"
      >
        <motion.div
          className="space-y-5"
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? undefined : {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.08
          }}
        >
          <motion.header
            className="space-y-2"
            initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { delay: 0.1 }}
          >
            <h3 className="text-2xl font-semibold text-foreground">{project.name}</h3>
            <p className="text-sm text-muted-foreground">{project.summary}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <motion.div
                  key={tag}
                  initial={reduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
                  animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  transition={reduceMotion ? undefined : {
                    delay: 0.15 + idx * 0.05,
                    type: 'spring' as const,
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={reduceMotion ? undefined : {
                    scale: 1.08,
                    transition: { type: 'spring' as const, stiffness: 400, damping: 15 }
                  }}
                >
                  <Badge variant="outline" className="text-xs uppercase tracking-[0.2em]">
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.header>
          {hasHighlights ? (
            <div className="grid gap-3">
              {project.highlights.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  initial={reduceMotion ? undefined : { opacity: 0, x: -20 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={reduceMotion ? undefined : {
                    delay: 0.2 + index * 0.08,
                    type: 'spring' as const,
                    stiffness: 200,
                    damping: 20
                  }}
                  className="rounded-2xl border border-border/40 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                    {index + 1}
                  </span>
                  {highlight}
                </motion.div>
              ))}
            </div>
          ) : null}
          {hasLinks ? (
            <motion.footer
              className="flex flex-wrap gap-2"
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={reduceMotion ? undefined : { delay: 0.4 }}
            >
              {project.links.demo ? (
                <motion.div
                  whileHover={reduceMotion ? undefined : {
                    scale: 1.05,
                    transition: { type: 'spring' as const, stiffness: 400, damping: 15 }
                  }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Button asChild>
                    <a href={project.links.demo} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Live
                    </a>
                  </Button>
                </motion.div>
              ) : null}
              {project.links.code ? (
                <motion.div
                  whileHover={reduceMotion ? undefined : {
                    scale: 1.05,
                    transition: { type: 'spring' as const, stiffness: 400, damping: 15 }
                  }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Button variant="outline" asChild>
                    <a href={project.links.code} target="_blank" rel="noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Code
                    </a>
                  </Button>
                </motion.div>
              ) : null}
            </motion.footer>
          ) : null}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsSection() {
  const { data } = useResumeContext();
  const projects = useMemo(() => buildProjects(data ?? null), [data]);
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20,
        mass: 1
      }
    }
  };

  const imageVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 20
      }
    }
  };

  const badgeVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.06,
      transition: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 15
      }
    }
  };

  return (
    <section id="projects" data-section="projects" className="py-24">
      <SectionHeading
        eyebrow="Case Studies"
        title="Selected shipping stories"
        description="Cross-discipline engagements—from ML pipelines to boutique product surfaces—that shipped measurable outcomes."
      />

      <motion.div
        className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        variants={reduceMotion ? undefined : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: '0px 0px -10% 0px' }}
      >
        {projects.map((project, index) => {
          const highlightPreview = project.highlights.length ? project.highlights.slice(0, 3) : [project.summary];
          const priorityAsset = index < 2;

          return (
            <motion.div
              key={project.id}
              variants={reduceMotion ? undefined : cardVariants}
              whileHover={reduceMotion ? undefined : {
                y: -12,
                scale: 1.02,
                transition: {
                  type: 'spring' as const,
                  stiffness: 400,
                  damping: 25
                }
              }}
              onMouseMove={(event) => {
                const cardElement = event.currentTarget;
                const rect = cardElement.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                cardElement.style.setProperty('--mouse-x', `${x}px`);
                cardElement.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{ willChange: 'transform' }}
            >
              <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-card/70 shadow-[0_28px_55px_-40px_rgba(15,23,42,0.6)] transition-all duration-500 ease-out hover:border-border/90 hover:bg-card/90 hover:shadow-[0_40px_80px_-45px_rgba(15,23,42,0.85)]">
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                     style={{
                       background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.06), transparent 40%)',
                       willChange: 'opacity'
                     }}
                />
                <CardHeader className="relative z-10 space-y-4 border-b border-border/40 bg-background/40 px-6 py-6 backdrop-blur-sm transition-colors duration-500 group-hover:border-border/60 group-hover:bg-background/60">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <motion.h3
                        className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-accent"
                        initial={reduceMotion ? undefined : { opacity: 0, x: -10 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={reduceMotion ? undefined : { delay: index * 0.05 + 0.3 }}
                      >
                        {project.name}
                      </motion.h3>
                      <motion.p
                        className="mt-1 text-sm text-muted-foreground line-clamp-2 transition-colors duration-300 group-hover:text-muted-foreground/90"
                        initial={reduceMotion ? undefined : { opacity: 0, x: -10 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={reduceMotion ? undefined : { delay: index * 0.05 + 0.35 }}
                      >
                        {project.summary}
                      </motion.p>
                    </div>
                  </div>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={reduceMotion ? undefined : { opacity: 0 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1 }}
                    viewport={{ once: true }}
                    transition={reduceMotion ? undefined : { delay: index * 0.05 + 0.4 }}
                  >
                    {project.tags.map((tag, tagIndex) => (
                      <motion.div
                        key={tag}
                        initial="rest"
                        whileHover="hover"
                        variants={reduceMotion ? undefined : badgeVariants}
                        style={{ display: 'inline-block' }}
                        animate={reduceMotion ? undefined : {
                          opacity: [0, 1],
                          scale: [0.8, 1],
                          transition: {
                            delay: index * 0.05 + 0.45 + tagIndex * 0.03,
                            type: 'spring' as const,
                            stiffness: 300,
                            damping: 20
                          }
                        }}
                      >
                        <Badge variant="outline" className="cursor-default text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 group-hover:border-accent/30 group-hover:text-accent/90">
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10 flex flex-1 flex-col space-y-5 px-6 py-6">
                  <motion.div
                    className="grid gap-3 overflow-hidden rounded-2xl"
                    initial="rest"
                    whileHover="hover"
                  >
                    <motion.div
                      className="hidden sm:block"
                      variants={reduceMotion ? undefined : imageVariants}
                      style={{ willChange: 'transform' }}
                    >
                      <ImageSlot
                        slotId={project.desktopSlot.id}
                        alt={`${project.name} desktop`}
                        className="rounded-2xl transition-all duration-500 group-hover:brightness-105"
                        priority={priorityAsset}
                      />
                    </motion.div>
                    <motion.div
                      className="block sm:hidden"
                      variants={reduceMotion ? undefined : imageVariants}
                      style={{ willChange: 'transform' }}
                    >
                      <ImageSlot
                        slotId={project.mobileSlot.id}
                        alt={`${project.name} mobile`}
                        className="rounded-2xl transition-all duration-500 group-hover:brightness-105"
                        priority={priorityAsset}
                      />
                    </motion.div>
                  </motion.div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {highlightPreview.map((highlight, hlIndex) => (
                      <motion.li
                        key={highlight}
                        className="flex items-start gap-2"
                        initial={reduceMotion ? undefined : { opacity: 0, x: -10 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={reduceMotion ? undefined : {
                          delay: index * 0.05 + 0.5 + hlIndex * 0.05,
                          type: 'spring' as const,
                          stiffness: 200,
                          damping: 20
                        }}
                      >
                        <motion.span
                          className="mt-1 h-1.5 w-1.5 rounded-full bg-accent transition-colors duration-300"
                          animate={reduceMotion ? undefined : {
                            scale: [0, 1],
                            transition: {
                              delay: index * 0.05 + 0.55 + hlIndex * 0.05,
                              type: 'spring' as const,
                              stiffness: 400,
                              damping: 15
                            }
                          }}
                        />
                        <span className="transition-colors duration-300 group-hover:text-foreground/80">{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <ProjectDialog project={project} />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
